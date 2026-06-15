"use client";

import { useEffect, useRef, useState } from "react";
import BobMascot from "@/components/BobMascot";
import ClipCard, { type ClipView } from "./ClipCard";

type Stage =
  | "queued"
  | "downloading"
  | "transcribing"
  | "analyzing"
  | "cutting"
  | "done"
  | "error";

type JobState = {
  id: string;
  stage: Stage;
  progress: number;
  source: string;
  message?: string;
  error?: string;
  clips: ClipView[];
};

const STEPS: { key: Stage; label: string; emoji: string }[] = [
  { key: "downloading", label: "Récupération de la vidéo", emoji: "📥" },
  { key: "transcribing", label: "Transcription audio", emoji: "🎙️" },
  { key: "analyzing", label: "Analyse des moments forts", emoji: "🧠" },
  { key: "cutting", label: "Découpe & sous-titres", emoji: "✂️" },
];

const STAGE_ORDER: Stage[] = [
  "queued",
  "downloading",
  "transcribing",
  "analyzing",
  "cutting",
  "done",
];

export default function Workspace() {
  const [view, setView] = useState<"idle" | "processing" | "done" | "error">(
    "idle"
  );
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [job, setJob] = useState<JobState | null>(null);
  const poll = useRef<ReturnType<typeof setInterval> | null>(null);

  const canStart = url.trim().length > 0 || file !== null;

  const stopPolling = () => {
    if (poll.current) clearInterval(poll.current);
    poll.current = null;
  };

  const reset = () => {
    stopPolling();
    setView("idle");
    setUrl("");
    setFile(null);
    setJob(null);
  };

  useEffect(() => () => stopPolling(), []);

  const start = async () => {
    if (!canStart) return;
    setView("processing");

    const form = new FormData();
    if (file) form.append("file", file);
    else form.append("url", url.trim());

    try {
      const res = await fetch("/api/jobs", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec du lancement");

      const id = data.id as string;
      poll.current = setInterval(async () => {
        const r = await fetch(`/api/jobs/${id}`);
        if (!r.ok) return;
        const j = (await r.json()) as JobState;
        setJob(j);
        if (j.stage === "done") {
          stopPolling();
          setView("done");
        } else if (j.stage === "error") {
          stopPolling();
          setView("error");
        }
      }, 1500);
    } catch (err) {
      setJob({
        id: "",
        stage: "error",
        progress: 100,
        source: file?.name ?? url,
        error: err instanceof Error ? err.message : "Erreur inconnue",
        clips: [],
      });
      setView("error");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      {view === "idle" && (
        <IdleView
          url={url}
          setUrl={setUrl}
          file={file}
          setFile={setFile}
          canStart={canStart}
          onStart={start}
        />
      )}
      {view === "processing" && (
        <ProcessingView
          stage={job?.stage ?? "queued"}
          progress={job?.progress ?? 5}
          source={job?.source ?? (file?.name ?? url)}
          message={job?.message}
        />
      )}
      {view === "done" && job && (
        <ResultsView clips={job.clips} source={job.source} onReset={reset} />
      )}
      {view === "error" && (
        <ErrorView message={job?.error ?? "Une erreur est survenue."} onReset={reset} />
      )}
    </div>
  );
}

/* ---------------- IDLE ---------------- */

function IdleView({
  url,
  setUrl,
  file,
  setFile,
  canStart,
  onStart,
}: {
  url: string;
  setUrl: (v: string) => void;
  file: File | null;
  setFile: (f: File | null) => void;
  canStart: boolean;
  onStart: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <BobMascot size={96} className="mx-auto animate-float" />
      <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight">
        Donne une vidéo à Bob 🎬
      </h1>
      <p className="mt-3 text-ink-soft">
        Colle un lien YouTube ou importe ton fichier. Bob s&apos;occupe du reste —
        gratuitement.
      </p>

      <div className="mt-8 rounded-3xl border border-ink/10 bg-card p-6 text-left shadow-sm">
        <label className="text-sm font-semibold text-ink-soft">Lien de la vidéo</label>
        <input
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (e.target.value) setFile(null);
          }}
          placeholder="https://youtube.com/watch?v=…"
          className="mt-2 w-full rounded-full border border-ink/15 bg-cream px-5 py-3 text-sm outline-none transition-colors focus:border-ink"
        />
        <p className="mt-2 text-xs text-ink-soft">
          ⚠️ Les liens YouTube peuvent être bloqués (YouTube refuse les serveurs).
          Pour un résultat fiable, importe ton fichier ci-dessous.
        </p>

        <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          <span className="h-px flex-1 bg-ink/10" />
          ou
          <span className="h-px flex-1 bg-ink/10" />
        </div>

        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-ink/20 bg-cream px-4 py-8 text-center transition-colors hover:border-ink/40">
          <span className="text-3xl">📁</span>
          <span className="text-sm font-semibold">
            {file?.name ?? "Glisse un fichier MP4 / MOV ou clique pour choisir"}
          </span>
          <span className="text-xs text-ink-soft">Jusqu&apos;à 2 Go · 90 min</span>
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setFile(f);
                setUrl("");
              }
            }}
          />
        </label>

        <button
          onClick={onStart}
          disabled={!canStart}
          className="mt-6 w-full rounded-full bg-ink py-4 text-base font-semibold text-lime shadow-[0_5px_0_0_var(--lime-deep)] transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          ✂️ Générer mes clips
        </button>
      </div>

      <p className="mt-4 text-xs text-ink-soft">
        Astuce : les podcasts, interviews et webinaires donnent les meilleurs clips.
      </p>
    </div>
  );
}

/* ---------------- PROCESSING ---------------- */

function ProcessingView({
  stage,
  progress,
  source,
  message,
}: {
  stage: Stage;
  progress: number;
  source: string;
  message?: string;
}) {
  const currentIdx = STAGE_ORDER.indexOf(stage);

  return (
    <div className="mx-auto max-w-xl py-10 text-center">
      <BobMascot size={110} className="mx-auto animate-float" />
      <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight">
        Bob travaille sur ta vidéo…
      </h2>
      <p className="mt-2 truncate text-sm text-ink-soft">{message ?? source}</p>

      <div className="mt-8 h-3 w-full overflow-hidden rounded-full bg-cream-deep">
        <div
          className="h-full rounded-full bg-lime-deep transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-sm font-semibold text-ink-soft">{progress}%</p>

      <ul className="mt-8 space-y-2 text-left">
        {STEPS.map((s) => {
          const idx = STAGE_ORDER.indexOf(s.key);
          const state =
            idx < currentIdx ? "done" : idx === currentIdx ? "active" : "pending";
          return (
            <li
              key={s.key}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                state === "active" ? "border-ink/15 bg-card" : "border-transparent bg-card/50"
              }`}
            >
              <span className="text-xl">{s.emoji}</span>
              <span
                className={`flex-1 text-sm font-semibold ${
                  state === "pending" ? "text-ink-soft" : "text-ink"
                }`}
              >
                {s.label}
              </span>
              {state === "done" && <span className="text-lime-deep">✓</span>}
              {state === "active" && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-xs text-ink-soft">
        Cela peut prendre quelques minutes selon la longueur de la vidéo.
      </p>
    </div>
  );
}

/* ---------------- RESULTS ---------------- */

function ResultsView({
  clips,
  source,
  onReset,
}: {
  clips: ClipView[];
  source: string;
  onReset: () => void;
}) {
  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-lime px-3 py-1 text-xs font-bold text-ink">
            ✨ {clips.length} clips prêts
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
            Voici tes meilleurs moments
          </h2>
          <p className="mt-1 truncate text-sm text-ink-soft">depuis {source}</p>
        </div>
        <button
          onClick={onReset}
          className="rounded-full border-2 border-ink px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-ink hover:text-cream"
        >
          + Nouvelle vidéo
        </button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {clips.map((clip) => (
          <ClipCard key={clip.id} clip={clip} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- ERROR ---------------- */

function ErrorView({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <div className="text-6xl">🛠️</div>
      <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight">
        Aïe, Bob a buté
      </h2>
      <p className="mt-3 rounded-2xl border border-ink/10 bg-card p-4 text-left text-sm text-ink-soft">
        {message}
      </p>
      <button
        onClick={onReset}
        className="mt-6 rounded-full bg-ink px-6 py-3 font-semibold text-lime shadow-[0_4px_0_0_var(--lime-deep)] transition-transform hover:-translate-y-0.5"
      >
        Réessayer
      </button>
    </div>
  );
}
