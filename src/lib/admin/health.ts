import { existsSync } from "node:fs";
import path from "node:path";
import ffmpegStatic from "ffmpeg-static";
import { isStorageConfigured } from "@/lib/engine/storage";

export type HealthCheck = {
  key: string;
  label: string;
  ok: boolean;
  detail: string;
};

export type SystemHealth = {
  checks: HealthCheck[];
  allOk: boolean;
  config: {
    momentsProvider: string;
    transcriptionModel: string;
    llmModel: string;
    claudeEnabled: boolean;
  };
};

async function groqReachable(): Promise<boolean> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(10000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getSystemHealth(): Promise<SystemHealth> {
  const ffmpegPath = (ffmpegStatic as unknown as string) || "";
  const ytDlp = path.join(
    process.cwd(),
    "node_modules",
    "youtube-dl-exec",
    "bin",
    process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp"
  );

  const groqKey = !!process.env.GROQ_API_KEY;
  const groqOk = groqKey ? await groqReachable() : false;

  const checks: HealthCheck[] = [
    {
      key: "groq_key",
      label: "Clé Groq (transcription + IA)",
      ok: groqKey,
      detail: groqKey ? "Configurée" : "Manquante dans .env.local",
    },
    {
      key: "groq_reach",
      label: "Connexion à Groq",
      ok: groqOk,
      detail: groqOk ? "Service joignable" : "Injoignable ou clé invalide",
    },
    {
      key: "ffmpeg",
      label: "ffmpeg (découpe vidéo)",
      ok: !!ffmpegPath && existsSync(ffmpegPath),
      detail: ffmpegPath ? "Binaire présent" : "Introuvable",
    },
    {
      key: "ytdlp",
      label: "yt-dlp (téléchargement)",
      ok: existsSync(ytDlp),
      detail: existsSync(ytDlp) ? "Binaire présent" : "Introuvable",
    },
    {
      key: "storage",
      label: "Stockage des clips",
      ok: true, // local fallback always works; cloud is an upgrade, not a requirement
      detail: isStorageConfigured()
        ? "Permanent (cloud) ✓"
        : "Local — temporaire (configure le cloud pour le rendre permanent)",
    },
  ];

  return {
    checks,
    allOk: checks.every((c) => c.ok),
    config: {
      momentsProvider: process.env.BOB_MOMENTS_PROVIDER || "groq",
      transcriptionModel: process.env.BOB_GROQ_MODEL || "whisper-large-v3-turbo",
      llmModel: process.env.BOB_GROQ_LLM_MODEL || "llama-3.3-70b-versatile",
      claudeEnabled: !!process.env.ANTHROPIC_API_KEY,
    },
  };
}
