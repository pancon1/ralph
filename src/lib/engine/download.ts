import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

/** Resolve the bundled yt-dlp binary shipped with youtube-dl-exec. */
function ytDlpBinary(): string {
  const exe = process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp";
  const candidates = [
    path.join(process.cwd(), "node_modules", "youtube-dl-exec", "bin", exe),
    path.join(process.cwd(), "node_modules", ".bin", exe),
  ];
  const found = candidates.find((p) => existsSync(p));
  if (!found) {
    throw new Error(
      `Binaire yt-dlp introuvable. Cherché : ${candidates.join(", ")}`
    );
  }
  return found;
}

/** Download a YouTube (or other supported) URL to a single combined file in workDir. */
export async function downloadVideo(
  url: string,
  workDir: string
): Promise<string> {
  await mkdir(workDir, { recursive: true });
  const template = path.join(workDir, "source.%(ext)s");
  const bin = ytDlpBinary();

  // A single combined stream avoids the video+audio merge, which needs format
  // variants that aren't available without a JS runtime (and can hang).
  const args = [
    url,
    "-f",
    "best[ext=mp4][height<=1080]/best[ext=mp4]/best",
    "--no-playlist",
    "--no-warnings",
    "--socket-timeout",
    "30",
    "--retries",
    "3",
    "-o",
    template,
  ];

  await new Promise<void>((resolve, reject) => {
    const proc = spawn(bin, args, { windowsHide: true });
    let stderr = "";
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`yt-dlp exited ${code}: ${stderr.slice(-600)}`));
    });
  });

  // Locate the produced file (extension chosen by yt-dlp).
  const files = await readdir(workDir);
  const produced = files.find((f) => f.startsWith("source."));
  if (!produced) {
    throw new Error("yt-dlp n'a produit aucun fichier vidéo.");
  }
  return path.join(workDir, produced);
}

/** Persist an uploaded file to workDir and return its path. */
export async function saveUpload(
  file: File,
  workDir: string
): Promise<string> {
  await mkdir(workDir, { recursive: true });
  const ext = path.extname(file.name) || ".mp4";
  const out = path.join(workDir, `source${ext}`);
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(out, buf);
  return out;
}
