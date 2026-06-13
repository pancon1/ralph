import Anthropic from "@anthropic-ai/sdk";
import type { Moment, Transcript } from "./types";

// Default provider is Groq (free — same key as transcription).
// Set BOB_MOMENTS_PROVIDER=claude to use Anthropic instead (needs credit).
const PROVIDER = (process.env.BOB_MOMENTS_PROVIDER || "groq").toLowerCase();
const CLAUDE_MODEL = process.env.BOB_CLAUDE_MODEL || "claude-sonnet-4-6";
const GROQ_LLM_MODEL = process.env.BOB_GROQ_LLM_MODEL || "llama-3.3-70b-versatile";

const SYSTEM = `Tu es Bob, un monteur expert en clips viraux pour TikTok, Reels et Shorts.
On te donne la transcription horodatée d'une longue vidéo. Tu dois sélectionner les meilleurs
extraits autonomes qui ont le plus de potentiel viral.

Règles pour chaque extrait :
- Durée entre 15 et 60 secondes.
- Commence sur un "hook" fort et se termine sur une idée complète (pas coupé au milieu d'une phrase).
- Aligne start/end sur les horodatages fournis.
- Privilégie : histoires, punchlines, conseils actionnables, statistiques surprenantes, moments émotionnels.
- Pas de chevauchement entre les extraits.

Réponds UNIQUEMENT avec un objet JSON valide de la forme :
{"clips":[{"start":number,"end":number,"title":string,"caption":string,"score":number,"hashtags":[string]}]}
où start/end sont en secondes, score est un entier 0-100 (potentiel viral),
title est court et accrocheur (langue de la vidéo), caption est la phrase-hook affichée sur le clip,
hashtags contient 2-4 hashtags pertinents. Aucun texte hors du JSON.`;

function buildTranscriptBlock(t: Transcript): string {
  // Compact, timestamped segments keep token usage low even for long videos.
  return t.segments
    .map((s) => `[${s.start.toFixed(1)}-${s.end.toFixed(1)}] ${s.text}`)
    .join("\n");
}

export async function findMoments(
  transcript: Transcript,
  maxClips = 6
): Promise<Moment[]> {
  const block = buildTranscriptBlock(transcript);
  const userPrompt = `Voici la transcription horodatée (en secondes). Sélectionne jusqu'à ${maxClips} extraits.\n\n${block}`;

  const raw =
    PROVIDER === "claude"
      ? await callClaude(userPrompt)
      : await callGroq(userPrompt);

  const parsed = extractJson(raw);
  const clips: Moment[] = Array.isArray(parsed?.clips) ? parsed.clips : [];

  const duration = transcript.duration ?? Infinity;
  return clips
    .map((c) => sanitize(c, duration))
    .filter((c): c is Moment => c !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxClips);
}

/* ---------- Groq LLM (free, default) ---------- */

async function callGroq(userPrompt: string): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error(
      "GROQ_API_KEY manquante. Ajoute-la dans bob-io/.env.local (voir .env.example)."
    );
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_LLM_MODEL,
      temperature: 0.4,
      max_tokens: 2000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Groq (détection) a échoué (${res.status}): ${body.slice(0, 300)}`);
  }

  const json = await res.json();
  return json?.choices?.[0]?.message?.content ?? "";
}

/* ---------- Claude (optional, premium) ---------- */

async function callClaude(userPrompt: string): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      "ANTHROPIC_API_KEY manquante. Ajoute-la dans bob-io/.env.local (voir .env.example)."
    );
  }

  const client = new Anthropic({ apiKey: key });
  const msg = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2000,
    system: SYSTEM,
    messages: [{ role: "user", content: userPrompt }],
  });

  return msg.content
    .filter((c) => c.type === "text")
    .map((c) => (c as { text: string }).text)
    .join("");
}

/* ---------- shared parsing ---------- */

function extractJson(text: string): { clips?: Moment[] } | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const startIdx = raw.indexOf("{");
  const endIdx = raw.lastIndexOf("}");
  if (startIdx === -1 || endIdx === -1) return null;
  try {
    return JSON.parse(raw.slice(startIdx, endIdx + 1));
  } catch {
    return null;
  }
}

function sanitize(c: Moment, duration: number): Moment | null {
  if (typeof c.start !== "number" || typeof c.end !== "number") return null;
  const start = Math.max(0, c.start);
  let end = Math.min(duration, c.end);
  if (end - start < 5) return null;
  if (end - start > 90) end = start + 60; // hard cap

  // Some models return score on a 0-1 scale — normalise to 0-100.
  let score = typeof c.score === "number" ? c.score : 70;
  if (score > 0 && score <= 1) score *= 100;

  return {
    start,
    end,
    title: String(c.title ?? "Extrait").slice(0, 80),
    caption: String(c.caption ?? "").slice(0, 140),
    score: Math.max(0, Math.min(100, Math.round(score))),
    hashtags: Array.isArray(c.hashtags)
      ? c.hashtags.slice(0, 4).map((h) => String(h))
      : [],
  };
}
