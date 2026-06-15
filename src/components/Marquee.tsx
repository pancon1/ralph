const ITEMS = [
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
  "Sous-titres animés",
  "Recadrage auto 9:16",
  "Détection des moments forts",
  "Score de viralité",
  "Export HD",
];

export default function Marquee() {
  return (
    <div className="border-y border-ink/10 bg-panel py-4">
      <div className="flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
          {[...ITEMS, ...ITEMS].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-3 whitespace-nowrap font-display text-lg font-bold text-ink"
            >
              {item}
              <span className="text-lime">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
