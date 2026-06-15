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

/** Write BOB_YT_COOKIES to a cookies.txt file, returning its path (or null). */
async function writeCookiesFile(workDir: string): Promise<string | null> {
  const raw = process.env.BOB_YT_COOKIES;
  if (!raw || !raw.trim()) return null;

  let content = raw;
  // Accept a base64-encoded value (avoids newline issues in some env UIs).
  if (!/\s/.test(raw) && /^[A-Za-z0-9+/=]+$/.test(raw) && raw.length > 100) {
    try {
      content = Buffer.from(raw, "base64").toString("utf8");
    } catch {
      content = raw;
    }
  }

  const file = path.join(workDir, "cookies.txt");
  await writeFile(file, content, "utf8");
  return file;
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

  // YouTube blocks datacenter IPs. Supplying cookies (Netscape format) from a
  // logged-in account lets yt-dlp pass the bot check. Set BOB_YT_COOKIES on the
  // host (raw cookies.txt content, or base64-encoded).
  const cookiesPath = await writeCookiesFile(workDir);
  if (cookiesPath) {
    args.push("--cookies", cookiesPath);
  }

  await new Promise<void>((resolve, reject) => {
    const proc = spawn(bin, args, { windowsHide: true });
    let stderr = "";
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) return resolve();
      // YouTube blocks downloads from datacenter IPs — give a clear, actionable message.
      if (/sign in to confirm|not a bot|bot|cookies/i.test(stderr)) {
        const hasCookies = Boolean(process.env.BOB_YT_COOKIES?.trim());
        return reject(
          new Error(
            hasCookies
              ? "YouTube a rejeté les cookies (ils ont sûrement expiré). Ré-exporte des cookies YouTube récents, ou importe un fichier 📁."
              : "YouTube bloque les téléchargements depuis le serveur. Importe ton fichier vidéo avec le bouton 📁, ou configure des cookies YouTube (voir COOKIES_SETUP)."
          )
        );
      }
      reject(new Error(`Échec du téléchargement : ${stderr.slice(-300)}`));
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
