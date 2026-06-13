import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Transcript } from "./types";

const GROQ_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const MODEL = process.env.BOB_GROQ_MODEL || "whisper-large-v3-turbo";

type GroqResponse = {
  text: string;
  language?: string;
  duration?: number;
  segments?: { start: number; end: number; text: string }[];
  words?: { word: string; start: number; end: number }[];
};

/** Transcribe an audio file with Groq Whisper, requesting word-level timestamps. */
export async function transcribe(audioPath: string): Promise<Transcript> {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error(
      "GROQ_API_KEY manquante. Ajoute-la dans bob-io/.env.local (voir .env.example)."
    );
  }

  const data = await readFile(audioPath);
  const form = new FormData();
  form.append(
    "file",
    new Blob([new Uint8Array(data)], { type: "audio/mpeg" }),
    path.basename(audioPath)
  );
  form.append("model", MODEL);
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "word");
  form.append("timestamp_granularities[]", "segment");

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Groq transcription a échoué (${res.status}): ${body.slice(0, 400)}`);
  }

  const json = (await res.json()) as GroqResponse;

  return {
    text: json.text ?? "",
    language: json.language,
    duration: json.duration,
    segments: (json.segments ?? []).map((s) => ({
      start: s.start,
      end: s.end,
      text: s.text.trim(),
    })),
    words: (json.words ?? []).map((w) => ({
      word: w.word,
      start: w.start,
      end: w.end,
    })),
  };
}
