"use client";

import { useState } from "react";

export type ClipView = {
  id: string;
  title: string;
  caption: string;
  duration: string;
  startLabel: string;
  score: number;
  hashtags: string[];
  url: string; // mp4 path
};

export default function ClipCard({ clip }: { clip: ClipView }) {
  const [copied, setCopied] = useState(false);

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(
        `${clip.title}\n${clip.hashtags.join(" ")}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard not available */
    }
  };

  const scoreColor =
    clip.score >= 90
      ? "bg-lime text-ink"
      : clip.score >= 80
      ? "bg-sky text-ink"
      : "bg-cream-deep text-ink";

  return (
    <div className="group overflow-hidden rounded-3xl border border-ink/10 bg-card transition-transform hover:-translate-y-1">
      {/* vertical video player */}
      <div className="relative aspect-[9/16] overflow-hidden bg-ink">
        <video
          src={clip.url}
          controls
          preload="metadata"
          playsInline
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute left-3 top-3 flex w-[calc(100%-1.5rem)] items-center justify-between">
          <span className="rounded-lg bg-ink/80 px-2 py-1 text-[11px] font-bold text-cream">
            {clip.startLabel} · {clip.duration}
          </span>
          <span className={`rounded-lg px-2 py-1 text-[11px] font-semibold ${scoreColor}`}>
            {clip.score}% 🔥
          </span>
        </div>
      </div>

      {/* meta */}
      <div className="p-4">
        <h3 className="font-display text-base font-bold leading-tight">{clip.title}</h3>
        {clip.caption && (
          <p className="mt-1 line-clamp-2 text-sm text-ink-soft">
            « {clip.caption} »
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {clip.hashtags.map((h) => (
            <span
              key={h}
              className="rounded-full bg-cream-deep px-2 py-0.5 text-[11px] font-semibold text-ink-soft"
            >
              {h.startsWith("#") ? h : `#${h}`}
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <a
            href={clip.url}
            download={`${clip.title}.mp4`}
            className="flex-1 rounded-full bg-ink py-2 text-center text-sm font-semibold text-lime transition-transform hover:-translate-y-0.5"
          >
            ⬇ Télécharger
          </a>
          <button
            onClick={copyCaption}
            className="rounded-full border border-ink/15 px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
            aria-label="Copier le titre et les hashtags"
          >
            {copied ? "✓" : "⧉"}
          </button>
        </div>
      </div>
    </div>
  );
}
