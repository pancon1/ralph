const STEPS = [
  {
    n: "01",
    title: "Dépose ta vidéo",
    desc: "Colle un lien YouTube ou importe ton fichier. Podcast, interview, live, cours… Bob avale tout.",
    icon: "📥",
  },
  {
    n: "02",
    title: "Bob analyse",
    desc: "Il transcrit, comprend le contexte et repère les moments qui ont le plus de chances de devenir viraux.",
    icon: "🧠",
  },
  {
    n: "03",
    title: "Découpe & habillage",
    desc: "Recadrage vertical automatique sur la personne qui parle, sous-titres animés et titre accrocheur.",
    icon: "✂️",
  },
  {
    n: "04",
    title: "Télécharge & poste",
    desc: "Récupère tes clips en HD, prêts à publier sur TikTok, Reels et Shorts. Gratuitement.",
    icon: "🚀",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">
          Comment ça marche
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
          De 60 minutes à 10 clips, en 4 étapes
        </h2>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s) => (
          <div
            key={s.n}
            className="shadow-soft group rounded-3xl border border-ink/10 bg-card p-6 transition-all hover:-translate-y-1.5 hover:shadow-float"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">{s.icon}</span>
              <span className="font-display text-3xl font-semibold text-ink/10">
                {s.n}
              </span>
            </div>
            <h3 className="mt-4 font-display text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
