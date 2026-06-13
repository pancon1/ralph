import { exec } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(exec);

export type Vulnerabilities = {
  critical: number;
  high: number;
  moderate: number;
  low: number;
  info: number;
  total: number;
};

export type OutdatedPackage = {
  name: string;
  current: string;
  latest: string;
  type: "major" | "minor" | "patch" | "other";
};

export type GuardianReport = {
  scannedAt: number;
  vulnerabilities: Vulnerabilities;
  outdated: OutdatedPackage[];
  riskLevel: "ok" | "attention" | "urgent";
  summary: string; // AI-written, French
  recommendations: string[];
};

/** Run `npm audit --json` and read the vulnerability counts. */
async function audit(): Promise<Vulnerabilities> {
  const empty: Vulnerabilities = {
    critical: 0,
    high: 0,
    moderate: 0,
    low: 0,
    info: 0,
    total: 0,
  };
  try {
    // npm audit exits non-zero when vulns exist but still prints JSON.
    const { stdout } = await run("npm audit --json", {
      cwd: process.cwd(),
      maxBuffer: 10 * 1024 * 1024,
    }).catch((e: { stdout?: string }) => ({ stdout: e.stdout ?? "" }));
    const json = JSON.parse(stdout || "{}");
    const v = json?.metadata?.vulnerabilities ?? {};
    return {
      critical: v.critical ?? 0,
      high: v.high ?? 0,
      moderate: v.moderate ?? 0,
      low: v.low ?? 0,
      info: v.info ?? 0,
      total: v.total ?? 0,
    };
  } catch {
    return empty;
  }
}

function diffType(current: string, latest: string): OutdatedPackage["type"] {
  const c = current.split(".").map((n) => parseInt(n, 10));
  const l = latest.split(".").map((n) => parseInt(n, 10));
  if (l[0] > c[0]) return "major";
  if (l[1] > c[1]) return "minor";
  if (l[2] > c[2]) return "patch";
  return "other";
}

/** Run `npm outdated --json` and list packages with newer versions. */
async function outdated(): Promise<OutdatedPackage[]> {
  try {
    const { stdout } = await run("npm outdated --json", {
      cwd: process.cwd(),
      maxBuffer: 10 * 1024 * 1024,
    }).catch((e: { stdout?: string }) => ({ stdout: e.stdout ?? "" }));
    const json = JSON.parse(stdout || "{}");
    return Object.entries(json).map(([name, info]) => {
      const i = info as { current?: string; latest?: string };
      const current = i.current ?? "?";
      const latest = i.latest ?? "?";
      return { name, current, latest, type: diffType(current, latest) };
    });
  } catch {
    return [];
  }
}

function computeRisk(
  v: Vulnerabilities,
  out: OutdatedPackage[]
): GuardianReport["riskLevel"] {
  if (v.critical > 0 || v.high > 0) return "urgent";
  if (v.moderate > 0 || out.some((o) => o.type === "major")) return "attention";
  return "ok";
}

/** Ask Groq (free) to write a friendly French summary + recommendations. */
async function aiNarrative(
  v: Vulnerabilities,
  out: OutdatedPackage[],
  risk: string
): Promise<{ summary: string; recommendations: string[] }> {
  const key = process.env.GROQ_API_KEY;
  const fallback = {
    summary:
      risk === "ok"
        ? "Aucun problème de sécurité critique détecté. Le site est sain."
        : "Des éléments demandent ton attention — vois les détails ci-dessous.",
    recommendations: [],
  };
  if (!key) return fallback;

  const model = process.env.BOB_GROQ_LLM_MODEL || "llama-3.3-70b-versatile";
  const data = {
    vulnerabilities: v,
    outdated: out.slice(0, 30),
    riskLevel: risk,
  };

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 700,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `Tu es "Bob Guardian", l'agent IA de sécurité et de maintenance d'un site web.
On te donne le résultat d'un scan (vulnérabilités npm + paquets obsolètes).
Explique la situation à un propriétaire NON technique, en français simple, rassurant mais honnête.
Réponds en JSON : {"summary": string (2-3 phrases), "recommendations": [string] (1-4 actions concrètes et prioritaires)}.
N'invente rien : base-toi uniquement sur les chiffres fournis. Pas de jargon inutile.`,
          },
          {
            role: "user",
            content: `Résultat du scan : ${JSON.stringify(data)}`,
          },
        ],
      }),
    });
    if (!res.ok) return fallback;
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    return {
      summary: typeof parsed.summary === "string" ? parsed.summary : fallback.summary,
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations.map((r: unknown) => String(r)).slice(0, 4)
        : [],
    };
  } catch {
    return fallback;
  }
}

/** Full security + updates scan, narrated by the Guardian agent. */
export async function runGuardianScan(): Promise<GuardianReport> {
  const [v, out] = await Promise.all([audit(), outdated()]);
  const riskLevel = computeRisk(v, out);
  const { summary, recommendations } = await aiNarrative(v, out, riskLevel);
  return {
    scannedAt: Date.now(),
    vulnerabilities: v,
    outdated: out,
    riskLevel,
    summary,
    recommendations,
  };
}
