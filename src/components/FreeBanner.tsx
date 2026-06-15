const ROWS = [
  { feature: "Clips IA par mois", bob: "Illimité", them: "10 puis payant" },
  { feature: "Sous-titres animés", bob: "Inclus", them: "Inclus" },
  { feature: "Export sans filigrane", bob: "Gratuit", them: "Abonnement" },
  { feature: "Qualité HD", bob: "Gratuit", them: "Abonnement" },
  { feature: "Carte bancaire requise", bob: "Non", them: "Oui" },
];

export default function FreeBanner() {
  return (
    <section id="free" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <div className="overflow-hidden rounded-[2.5rem] border-2 border-ink bg-ink text-cream">
        <div className="grid gap-10 p-8 md:grid-cols-2 md:p-12">
          {/* left pitch */}
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-lime px-4 py-1.5 text-xs font-bold text-ink">
              💚 Notre promesse
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
              Gratuit. <br />
              Vraiment gratuit.
            </h2>
            <p className="mt-4 max-w-md text-cream/70">
              Les autres outils te font payer dès le 11ᵉ clip. Bob reste gratuit
              pour les créateurs — pas de filigrane caché, pas de carte bancaire,
              pas de mauvaise surprise.
            </p>
            <a
              href="/app"
              className="mt-7 w-fit rounded-full bg-lime px-7 py-3.5 font-semibold text-ink shadow-soft transition-transform hover:-translate-y-0.5"
            >
              Commencer sans payer →
            </a>
          </div>

          {/* right table */}
          <div className="rounded-3xl bg-cream p-2 text-ink">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-soft">
              <span></span>
              <span className="text-center font-display text-base text-ink">Bob.io</span>
              <span className="text-center">Les autres</span>
            </div>
            <div className="space-y-1">
              {ROWS.map((r) => (
                <div
                  key={r.feature}
                  className="grid grid-cols-[1.4fr_1fr_1fr] items-center gap-2 rounded-2xl bg-card px-4 py-3 text-sm"
                >
                  <span className="font-medium">{r.feature}</span>
                  <span className="text-center font-bold text-lime-deep">{r.bob}</span>
                  <span className="text-center text-ink-soft line-through decoration-coral/60">
                    {r.them}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
