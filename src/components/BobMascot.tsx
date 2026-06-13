type Props = {
  className?: string;
  size?: number;
};

/** Bob — the friendly little robot editor that powers Bob.io */
export default function BobMascot({ className = "", size = 160 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      role="img"
      aria-label="Bob, le robot monteur"
    >
      {/* antenna */}
      <line x1="100" y1="34" x2="100" y2="14" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />
      <circle cx="100" cy="12" r="9" fill="var(--coral)" stroke="var(--ink)" strokeWidth="5" />

      {/* head */}
      <rect x="34" y="34" width="132" height="116" rx="34" fill="var(--lime)" stroke="var(--ink)" strokeWidth="6" />

      {/* face screen */}
      <rect x="52" y="58" width="96" height="64" rx="22" fill="var(--ink)" />

      {/* eyes */}
      <g className="animate-blink">
        <circle cx="82" cy="90" r="11" fill="var(--lime)" />
        <circle cx="118" cy="90" r="11" fill="var(--lime)" />
        <circle cx="85" cy="87" r="3.5" fill="var(--ink)" />
        <circle cx="121" cy="87" r="3.5" fill="var(--ink)" />
      </g>

      {/* smile */}
      <path d="M80 108 Q100 120 120 108" stroke="var(--lime)" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* cheeks */}
      <circle cx="58" cy="106" r="6" fill="var(--coral)" opacity="0.85" />
      <circle cx="142" cy="106" r="6" fill="var(--coral)" opacity="0.85" />

      {/* ears / knobs */}
      <rect x="22" y="78" width="14" height="30" rx="7" fill="var(--ink)" />
      <rect x="164" y="78" width="14" height="30" rx="7" fill="var(--ink)" />

      {/* body hint */}
      <rect x="68" y="150" width="64" height="22" rx="11" fill="var(--cream-deep)" stroke="var(--ink)" strokeWidth="6" />
    </svg>
  );
}
