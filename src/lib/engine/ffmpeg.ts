import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import ffmpegStatic from "ffmpeg-static";
import type { TranscriptWord } from "./types";

const FFMPEG = (ffmpegStatic as unknown as string) || "ffmpeg";

function run(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(FFMPEG, args, { windowsHide: true });
    let stderr = "";
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}: ${stderr.slice(-600)}`));
    });
  });
}

/** Extract a small mono 16kHz mp3 — keeps the file well under Groq's size limit. */
export async function extractAudio(
  videoPath: string,
  outDir: string
): Promise<string> {
  await mkdir(outDir, { recursive: true });
  const out = path.join(outDir, "audio.mp3");
  await run([
    "-y",
    "-i",
    videoPath,
    "-vn",
    "-ac",
    "1",
    "-ar",
    "16000",
    "-b:a",
    "32k",
    out,
  ]);
  return out;
}

function fmtAssTime(t: number): string {
  if (t < 0) t = 0;
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = Math.floor(t % 60);
  const cs = Math.floor((t - Math.floor(t)) * 100);
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(
    cs
  ).padStart(2, "0")}`;
}

function escapeAss(text: string): string {
  return text.replace(/\n/g, " ").replace(/\{/g, "(").replace(/\}/g, ")");
}

/**
 * Build a TikTok-style .ass subtitle file for one clip.
 * Words are grouped into short lines that appear in sync, relative to clip start.
 */
export function buildAss(words: TranscriptWord[], clipStart: number): string {
  const header = `[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV
Style: Bob,Arial,82,&H0015F7C8,&H00141514,&H88141514,1,1,5,0,2,80,80,260

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  // group into lines of up to 4 words
  const lines: { start: number; end: number; text: string }[] = [];
  let bucket: TranscriptWord[] = [];
  const flush = () => {
    if (!bucket.length) return;
    lines.push({
      start: bucket[0].start,
      end: bucket[bucket.length - 1].end,
      text: bucket.map((w) => w.word.trim()).join(" "),
    });
    bucket = [];
  };
  for (const w of words) {
    bucket.push(w);
    if (bucket.length >= 4) flush();
  }
  flush();

  const events = lines
    .map((l) => {
      const start = fmtAssTime(l.start - clipStart);
      const end = fmtAssTime(l.end - clipStart);
      return `Dialogue: 0,${start},${end},Bob,,0,0,0,,${escapeAss(
        l.text.toUpperCase()
      )}`;
    })
    .join("\n");

  return header + events + "\n";
}

/**
 * Cut [start,end], center-crop to vertical 9:16, scale to 1080x1920,
 * and burn subtitles if an .ass file is provided.
 */
export async function cutVerticalClip(opts: {
  videoPath: string;
  start: number;
  end: number;
  outPath: string;
  assPath?: string;
}): Promise<void> {
  const { videoPath, start, end, outPath, assPath } = opts;
  const duration = Math.max(1, end - start);

  // Output resolution — kept modest so encoding fits low-resource hosts
  // (e.g. Render free tier: ~0.1 CPU / 512MB). Override with BOB_CLIP_HEIGHT.
  const h = parseInt(process.env.BOB_CLIP_HEIGHT || "1280", 10);
  const w = Math.round((h * 9) / 16 / 2) * 2; // keep even width for yuv420p

  let vf = `crop=ih*9/16:ih,scale=${w}:${h}`;
  if (assPath) {
    // ffmpeg filter paths need escaped backslashes and colons on Windows
    const escaped = assPath.replace(/\\/g, "/").replace(/:/g, "\\:");
    vf += `,subtitles='${escaped}'`;
  }

  await run([
    "-y",
    "-ss",
    start.toFixed(2),
    "-i",
    videoPath,
    "-t",
    duration.toFixed(2),
    "-vf",
    vf,
    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-crf",
    "26",
    "-threads",
    "1",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "96k",
    "-movflags",
    "+faststart",
    outPath,
  ]);
}
