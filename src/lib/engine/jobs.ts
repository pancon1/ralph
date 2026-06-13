import { randomUUID } from "node:crypto";
import { mkdir, writeFile, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { downloadVideo, saveUpload } from "./download";
import { extractAudio, buildAss, cutVerticalClip } from "./ffmpeg";
import { transcribe } from "./transcribe";
import { findMoments } from "./moments";
import type { Job, JobStage, RenderedClip } from "./types";

// Job state is persisted to disk so it survives dev hot-reloads and is shared
// across route handlers. (A serverless deploy would swap this for a DB/queue.)
const JOBS_DIR = path.join(process.cwd(), ".bob-jobs");
// Clips live outside public/ — next start doesn't reliably serve files written
// to public/ after build, so they're served by the /clips/[id]/[file] route.
const CLIPS_DIR = path.join(process.cwd(), ".bob-clips");

const memory = new Map<string, Job>();

function jobFile(id: string): string {
  return path.join(JOBS_DIR, `${id}.json`);
}

async function save(job: Job): Promise<void> {
  memory.set(job.id, job);
  await mkdir(JOBS_DIR, { recursive: true });
  await writeFile(jobFile(job.id), JSON.stringify(job), "utf8");
}

export async function getJob(id: string): Promise<Job | undefined> {
  const cached = memory.get(id);
  if (cached) return cached;
  try {
    const raw = await readFile(jobFile(id), "utf8");
    return JSON.parse(raw) as Job;
  } catch {
    return undefined;
  }
}

export async function listJobs(): Promise<Job[]> {
  try {
    const files = await readdir(JOBS_DIR);
    const jobs = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => {
          try {
            return JSON.parse(
              await readFile(path.join(JOBS_DIR, f), "utf8")
            ) as Job;
          } catch {
            return null;
          }
        })
    );
    return jobs
      .filter((j): j is Job => j !== null)
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export type JobStats = {
  total: number;
  done: number;
  errors: number;
  active: number;
  totalClips: number;
  successRate: number; // 0-100
};

export async function getStats(): Promise<JobStats> {
  const jobs = await listJobs();
  const done = jobs.filter((j) => j.stage === "done").length;
  const errors = jobs.filter((j) => j.stage === "error").length;
  const active = jobs.filter(
    (j) => j.stage !== "done" && j.stage !== "error"
  ).length;
  const totalClips = jobs.reduce((n, j) => n + j.clips.length, 0);
  const finished = done + errors;
  return {
    total: jobs.length,
    done,
    errors,
    active,
    totalClips,
    successRate: finished ? Math.round((done / finished) * 100) : 100,
  };
}

function mmss(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

const STAGE_PROGRESS: Record<JobStage, number> = {
  queued: 2,
  downloading: 15,
  transcribing: 40,
  analyzing: 60,
  cutting: 80,
  done: 100,
  error: 100,
};

async function patch(id: string, p: Partial<Job>): Promise<void> {
  const current = memory.get(id) ?? (await getJob(id));
  if (!current) return;
  await save({ ...current, ...p });
}

async function setStage(id: string, stage: JobStage, message?: string) {
  await patch(id, { stage, progress: STAGE_PROGRESS[stage], message });
}

export async function createJob(source: string): Promise<Job> {
  const job: Job = {
    id: randomUUID(),
    stage: "queued",
    progress: 2,
    source,
    clips: [],
    createdAt: Date.now(),
  };
  await save(job);
  return job;
}

/** Kick off the full pipeline. Runs in the background; poll getJob() for status. */
export function startPipeline(id: string, input: { url?: string; file?: File }) {
  void runPipeline(id, input).catch(async (err) => {
    await patch(id, {
      stage: "error",
      progress: 100,
      error: err instanceof Error ? err.message : String(err),
    });
  });
}

async function runPipeline(id: string, input: { url?: string; file?: File }) {
  const workDir = path.join(os.tmpdir(), "bob-io", id);
  const outDir = path.join(CLIPS_DIR, id);
  await mkdir(outDir, { recursive: true });

  try {
    // 1. Source video
    await setStage(id, "downloading", "Récupération de la vidéo…");
    let videoPath: string;
    if (input.file) {
      videoPath = await saveUpload(input.file, workDir);
    } else if (input.url) {
      videoPath = await downloadVideo(input.url, workDir);
    } else {
      throw new Error("Aucune source fournie.");
    }

    // 2. Audio
    await setStage(id, "transcribing", "Transcription de l'audio…");
    const audioPath = await extractAudio(videoPath, workDir);

    // 3. Transcribe (Groq)
    const transcript = await transcribe(audioPath);
    if (!transcript.segments.length) {
      throw new Error("Transcription vide — la vidéo a-t-elle de l'audio parlé ?");
    }

    // 4. Find viral moments
    await setStage(id, "analyzing", "Bob repère les meilleurs moments…");
    const moments = await findMoments(transcript, 6);
    if (!moments.length) {
      throw new Error("Aucun moment fort détecté dans cette vidéo.");
    }

    // 5. Cut + reframe + subtitles
    await setStage(id, "cutting", "Découpe et habillage des clips…");
    const clips: RenderedClip[] = [];
    for (let i = 0; i < moments.length; i++) {
      const m = moments[i];
      const clipWords = transcript.words.filter(
        (w) => w.start >= m.start - 0.3 && w.end <= m.end + 0.3
      );

      let assPath: string | undefined;
      if (clipWords.length) {
        assPath = path.join(workDir, `clip-${i + 1}.ass`);
        await writeFile(assPath, buildAss(clipWords, m.start), "utf8");
      }

      const fileName = `clip-${i + 1}.mp4`;
      const outPath = path.join(outDir, fileName);
      try {
        await cutVerticalClip({ videoPath, start: m.start, end: m.end, outPath, assPath });
      } catch {
        // retry once without burned subtitles if libass/path fails
        await cutVerticalClip({ videoPath, start: m.start, end: m.end, outPath });
      }

      clips.push({
        ...m,
        id: `${id}-${i + 1}`,
        url: `/clips/${id}/${fileName}`,
        duration: mmss(m.end - m.start),
        startLabel: mmss(m.start),
      });

      await patch(id, {
        clips: [...clips],
        progress: 80 + Math.round(((i + 1) / moments.length) * 18),
      });
    }

    await patch(id, { stage: "done", progress: 100, clips, message: undefined });
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}
