/**
 * Retro Memphis-style SVG shapes for Bob.io — bold, geometric, 80s/90s.
 * Decorative only (aria-hidden). Colors use the theme accent variables.
 */

export function Squiggle({ className = "", color = "var(--coral)" }: { className?: string; color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 28" className={className} fill="none">
      <path
        d="M2 14C2 6 14 6 14 14s12 8 12 0 12-8 12 0 12 8 12 0 12-8 12 0 12 8 12 0 12-8 12 0"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ZigZag({ className = "", color = "var(--sky)" }: { className?: string; color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 24" className={className} fill="none">
      <path d="M2 20 14 4l12 16L38 4l12 16L62 4l12 16L86 4l12 16L110 4" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StarBurst({ className = "", color = "var(--sky)", size = 60 }: { className?: string; color?: string; size?: number }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" width={size} height={size} className={className}>
      <path
        d="M50 4l10 26 26-10-16 24 24 12-28 4 10 26-22-18-22 18 10-26-28-4 24-12-16-24 26 10z"
        fill={color}
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Dots({ className = "", color = "var(--ink)" }: { className?: string; color?: string }) {
  const rows = 4;
  const cols = 6;
  return (
    <svg aria-hidden viewBox="0 0 120 80" className={className}>
      {Array.from({ length: rows * cols }).map((_, i) => (
        <circle key={i} cx={10 + (i % cols) * 20} cy={10 + Math.floor(i / cols) * 20} r="3" fill={color} opacity="0.55" />
      ))}
    </svg>
  );
}

export function HalfCircle({ className = "", color = "var(--lime)", size = 64 }: { className?: string; color?: string; size?: number }) {
  return (
    <svg aria-hidden viewBox="0 0 100 50" width={size} height={size / 2} className={className}>
      <path d="M2 48a48 48 0 0 1 96 0z" fill={color} stroke="var(--ink)" strokeWidth="3" />
    </svg>
  );
}

export function Blob({ className = "", color = "var(--coral)", size = 120 }: { className?: string; color?: string; size?: number }) {
  return (
    <svg aria-hidden viewBox="0 0 200 200" width={size} height={size} className={className}>
      <path
        fill={color}
        stroke="var(--ink)"
        strokeWidth="4"
        d="M163 71c11 22 9 52-7 71s-46 28-71 22-46-25-52-49 5-52 26-67 51-19 73-6c12 7 20 17 22 28z"
      />
    </svg>
  );
}

/** A small ringed planet / circle with orbit — retro space sticker. */
export function Planet({ className = "", color = "var(--sky)", size = 90 }: { className?: string; color?: string; size?: number }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" width={size} height={size} className={className}>
      <ellipse cx="50" cy="54" rx="46" ry="16" fill="none" stroke="var(--ink)" strokeWidth="3" opacity="0.7" />
      <circle cx="50" cy="46" r="26" fill={color} stroke="var(--ink)" strokeWidth="3.5" />
      <circle cx="42" cy="40" r="5" fill="var(--card)" opacity="0.7" />
    </svg>
  );
}
