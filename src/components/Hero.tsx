import Link from "next/link";
import BobMascot from "./BobMascot";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-wash">
      <div className="absolute inset-0 bg-grid" />
      {/* soft color blobs */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-lime/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-72 w-72 rounded-full bg-coral/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
        {/* Left: copy */}
        <div>
          <span className="shadow-soft inline-flex items-center gap-2 rounded-full border border-ink/10 bg-card px-4 py-1.5 text-xs font-semibold text-ink-soft">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
            </span>
            100% gratuit — sans carte bancaire
          </span>

          <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
            Une longue vidéo.{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">10 clips viraux.</span>
              <span className="absolute inset-x-0 bottom-1 z-0 h-4 -rotate-1 bg-lime" />
            </span>
          </h1>

          <p className="mt-5 max-w-md text-lg text-ink-soft">
            Bob regarde ta vidéo, repère les meilleurs moments, recadre en
            vertical et ajoute des sous-titres animés. Prêt pour TikTok, Reels
            et Shorts — en quelques minutes.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/app"
              className="rounded-full bg-ink px-7 py-3.5 text-center text-base font-semibold text-lime shadow-[0_5px_0_0_var(--lime-deep)] transition-transform hover:-translate-y-0.5"
            >
              Découper ma vidéo →
            </Link>
            <a
              href="#how"
              className="rounded-full border-2 border-ink px-7 py-3.5 text-center text-base font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              Voir comment ça marche
            </a>
          </div>

          <div className="mt-8 flex items-center gap-6 text-sm text-ink-soft">
            <div>
              <p className="font-display text-2xl font-extrabold text-ink">12k+</p>
              <p>clips générés</p>
            </div>
            <div className="h-8 w-px bg-ink/15" />
            <div>
              <p className="font-display text-2xl font-extrabold text-ink">0 €</p>
              <p>pour toujours</p>
            </div>
            <div className="h-8 w-px bg-ink/15" />
            <div>
              <p className="font-display text-2xl font-extrabold text-ink">~3 min</p>
              <p>par vidéo</p>
            </div>
          </div>
        </div>

        {/* Right: Bob + mock clips */}
        <div className="relative">
          <div className="animate-float">
            <BobMascot size={150} className="mx-auto drop-shadow-xl" />
          </div>

          <div className="glass shadow-float mt-6 rounded-3xl border border-white/40 p-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { t: "0:14", label: "Le hook 🔥", tone: "bg-lime" },
                { t: "0:22", label: "Punchline 😂", tone: "bg-coral/90 text-cream" },
                { t: "0:19", label: "Le conseil 💡", tone: "bg-sky/90" },
              ].map((c, i) => (
                <div
                  key={i}
                  className="aspect-[9/16] overflow-hidden rounded-2xl border-2 border-ink bg-ink p-2 shadow-lg transition-transform hover:-translate-y-1"
                  style={{ transform: `rotate(${i === 1 ? 0 : i === 0 ? -4 : 4}deg)` }}
                >
                  <div className={`flex h-full flex-col justify-between rounded-xl ${c.tone} p-2`}>
                    <span className="self-start rounded-md bg-ink/80 px-1.5 py-0.5 text-[10px] font-semibold text-cream">
                      {c.t}
                    </span>
                    <span className="rounded-md bg-ink px-1.5 py-1 text-center text-[11px] font-bold text-lime">
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
