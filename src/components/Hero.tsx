import Link from "next/link";
import BobMascot from "./BobMascot";
import { Squiggle, ZigZag, StarBurst, Dots, HalfCircle, Planet } from "./Decor";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-wash">
      <div className="absolute inset-0 bg-grid-fade opacity-70" />
      {/* scattered Memphis shapes */}
      <StarBurst className="absolute left-[6%] top-24 hidden md:block" color="var(--sky)" size={54} />
      <Squiggle className="absolute right-[8%] top-16 hidden h-7 w-32 md:block" color="var(--coral)" />
      <ZigZag className="absolute left-1/2 top-6 hidden h-6 w-40 md:block" color="var(--lime)" />
      <Dots className="absolute bottom-8 left-[4%] hidden h-20 w-28 md:block" />
      <HalfCircle className="absolute -right-2 bottom-24 hidden md:block" color="var(--sky)" size={80} />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 md:grid-cols-2 md:py-28">
        {/* Left: copy */}
        <div>
          <span className="chip">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
            </span>
            100% gratuit — sans carte bancaire
          </span>

          <h1 className="mt-6 font-display text-[2.7rem] font-semibold leading-[1.05] md:text-[4rem]">
            Une longue vidéo.
            <br />
            10 clips{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">viraux</span>
              <span className="absolute -bottom-1 left-0 z-0 h-4 w-full -rotate-1 rounded-md bg-lime" />
            </span>
            .
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            Bob regarde ta vidéo, repère les meilleurs moments, recadre en
            vertical et ajoute des sous-titres animés. Prêt pour TikTok, Reels
            et Shorts — en quelques minutes.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/app" className="btn-primary text-base">
              Découper ma vidéo
              <span aria-hidden>→</span>
            </Link>
            <a href="#how" className="btn-ghost text-base">
              Voir comment ça marche
            </a>
          </div>

          <div className="mt-12 flex items-center gap-8">
            {[
              { n: "12k+", l: "clips générés" },
              { n: "0 €", l: "pour toujours" },
              { n: "~3 min", l: "par vidéo" },
            ].map((s, i) => (
              <div key={s.l} className="flex items-center gap-8">
                {i > 0 && <div className="h-9 w-0.5 bg-ink/15" />}
                <div>
                  <p className="font-display text-3xl font-semibold text-ink">{s.n}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">{s.l}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Bob + mock clips */}
        <div className="relative">
          <div className="relative mx-auto h-[160px] w-[360px]">
            <Planet className="absolute left-2 top-0 hidden md:block" color="var(--sky)" size={76} />
            <StarBurst className="absolute right-6 top-2 hidden md:block" color="var(--lime)" size={48} />
            <div className="animate-float absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <BobMascot size={150} />
            </div>
          </div>

          <div className="card-premium mt-6 p-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { t: "0:14", label: "Le hook 🔥", tone: "bg-lime" },
                { t: "0:22", label: "Punchline 😂", tone: "bg-coral" },
                { t: "0:19", label: "Le conseil 💡", tone: "bg-sky" },
              ].map((c, i) => (
                <div
                  key={i}
                  className="aspect-[9/16] overflow-hidden rounded-xl border-2 border-ink bg-panel p-1.5 transition-transform hover:-translate-y-1.5"
                  style={{ transform: `rotate(${i === 1 ? 0 : i === 0 ? -3 : 3}deg)` }}
                >
                  <div className={`flex h-full flex-col justify-between rounded-lg ${c.tone} p-2`}>
                    <span className="self-start rounded-md bg-panel px-1.5 py-0.5 text-[10px] font-bold text-cream">
                      {c.t}
                    </span>
                    <span className="rounded-md bg-panel px-1.5 py-1 text-center text-[11px] font-bold text-cream">
                      {c.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
