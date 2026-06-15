import Link from "next/link";
import BobMascot from "./BobMascot";
import { Orb, Waveform, OrbitRings, Constellation } from "./Decor";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-wash">
      <div className="absolute inset-0 bg-grid-fade" />
      <Orb className="-left-24 top-10" color="var(--sky)" size={360} />
      <Orb className="-right-20 top-40" color="var(--coral)" size={320} />
      <Constellation className="absolute right-10 top-8 hidden h-24 w-40 md:block" />
      <Waveform className="absolute bottom-0 left-0 h-24 w-full opacity-30" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 md:grid-cols-2 md:py-28">
        {/* Left: copy */}
        <div>
          <span className="chip shadow-soft">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
            </span>
            100% gratuit — sans carte bancaire
          </span>

          <h1 className="mt-6 font-display text-[2.7rem] font-semibold leading-[1.08] md:text-[3.9rem]">
            Une longue vidéo.
            <br />
            10 clips{" "}
            <span className="relative whitespace-nowrap">
              <span className="font-display-italic">viraux</span>
              <span className="absolute -bottom-1 left-0 h-[7px] w-full -rotate-1 rounded-full bg-lime" />
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
                {i > 0 && <div className="h-9 w-px bg-ink/10" />}
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
          <div className="relative mx-auto h-[150px] w-[360px]">
            <OrbitRings className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90" size={360} />
            <div className="animate-float absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <BobMascot size={150} className="drop-shadow-[0_0_30px_rgba(185,224,140,0.25)]" />
            </div>
          </div>

          <div className="glass shadow-float mt-6 rounded-[1.75rem] border border-white/10 p-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { t: "0:14", label: "Le hook 🔥", tone: "bg-lime text-panel" },
                { t: "0:22", label: "Punchline 😂", tone: "bg-coral text-panel" },
                { t: "0:19", label: "Le conseil 💡", tone: "bg-sky text-panel" },
              ].map((c, i) => (
                <div
                  key={i}
                  className="aspect-[9/16] overflow-hidden rounded-2xl bg-panel p-1.5 shadow-lg ring-1 ring-ink/10 transition-transform hover:-translate-y-1.5"
                  style={{ transform: `rotate(${i === 1 ? 0 : i === 0 ? -3 : 3}deg)` }}
                >
                  <div className={`flex h-full flex-col justify-between rounded-[0.85rem] ${c.tone} p-2`}>
                    <span className="self-start rounded-md bg-panel/75 px-1.5 py-0.5 text-[10px] font-semibold text-ink">
                      {c.t}
                    </span>
                    <span className="rounded-md bg-lime px-1.5 py-1 text-center text-[11px] font-semibold text-panel">
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
