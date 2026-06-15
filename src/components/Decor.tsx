/**
 * Futuristic SVG illustration set for Bob.io — soft, desaturated, theme-aware
 * (uses the CSS accent variables). Decorative only (aria-hidden).
 */

/** Soft glowing orb (radial gradient blob). */
export function Orb({
  className = "",
  color = "var(--sky)",
  size = 320,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, color-mix(in srgb, ${color} 45%, transparent), transparent 70%)`,
      }}
    />
  );
}

/** Animated audio waveform — fits a video/clip tool. */
export function Waveform({
  className = "",
  bars = 28,
  color = "var(--lime)",
}: {
  className?: string;
  bars?: number;
  color?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${bars * 8} 60`}
      className={className}
      preserveAspectRatio="none"
    >
      {Array.from({ length: bars }).map((_, i) => {
        const h = 8 + Math.abs(Math.sin(i * 1.3)) * 44;
        return (
          <rect
            key={i}
            x={i * 8 + 1}
            y={(60 - h) / 2}
            width={4}
            height={h}
            rx={2}
            fill={color}
            opacity={0.25 + (i % 5) * 0.12}
          >
            <animate
              attributeName="height"
              values={`${h};${Math.max(6, h * 0.4)};${h}`}
              dur={`${1.4 + (i % 6) * 0.25}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              values={`${(60 - h) / 2};${(60 - Math.max(6, h * 0.4)) / 2};${(60 - h) / 2}`}
              dur={`${1.4 + (i % 6) * 0.25}s`}
              repeatCount="indefinite"
            />
          </rect>
        );
      })}
    </svg>
  );
}

/** Concentric orbit rings with a travelling node. */
export function OrbitRings({ className = "", size = 360 }: { className?: string; size?: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      fill="none"
    >
      {[40, 64, 88].map((r, i) => (
        <circle
          key={r}
          cx="100"
          cy="100"
          r={r}
          stroke="var(--ink)"
          strokeOpacity={0.12 - i * 0.02}
          strokeWidth="1"
          strokeDasharray={i === 1 ? "2 6" : undefined}
        />
      ))}
      <g>
        <circle cx="100" cy="36" r="3.5" fill="var(--lime)" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 100 100"
          to="360 100 100"
          dur="14s"
          repeatCount="indefinite"
        />
      </g>
      <g>
        <circle cx="164" cy="100" r="2.5" fill="var(--coral)" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="360 100 100"
          to="0 100 100"
          dur="20s"
          repeatCount="indefinite"
        />
      </g>
    </svg>
  );
}

/** Scattered constellation of dots + faint links. */
export function Constellation({ className = "" }: { className?: string }) {
  const pts = [
    [10, 20],
    [38, 8],
    [62, 30],
    [88, 16],
    [24, 52],
    [54, 64],
    [82, 56],
  ];
  return (
    <svg aria-hidden viewBox="0 0 100 72" className={className} fill="none">
      <polyline
        points={pts.map((p) => p.join(",")).join(" ")}
        stroke="var(--ink)"
        strokeOpacity="0.1"
        strokeWidth="0.5"
      />
      {pts.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i % 3 === 0 ? 1.6 : 1}
          fill={i % 2 ? "var(--sky)" : "var(--lime)"}
          opacity="0.7"
        />
      ))}
    </svg>
  );
}
