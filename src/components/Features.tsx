const FEATURES = [
  {
    title: "Détection des moments forts",
    desc: "Bob lit la vidéo comme un humain et choisit les extraits avec le meilleur potentiel viral.",
    icon: "🎯",
    span: "lg:col-span-2",
    glow: "glow-lime",
    ring: "text-lime",
  },
  {
    title: "Sous-titres animés",
    desc: "Synchronisés au mot près, dans le style qui retient l'attention.",
    icon: "💬",
    span: "",
    glow: "",
    ring: "text-sky",
  },
  {
    title: "Recadrage vertical auto",
    desc: "Suit la personne qui parle pour un format 9:16 parfait.",
    icon: "📱",
    span: "",
    glow: "",
    ring: "text-coral",
  },
  {
    title: "Score de viralité",
    desc: "Chaque clip reçoit une note pour savoir lequel poster en premier.",
    icon: "📈",
    span: "lg:col-span-2",
    glow: "glow-violet",
    ring: "text-coral",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-cream-deep">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">
            Tout ce que Klap fait
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
            …mais en gratuit, et avec le sourire 😎
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`card-premium p-7 transition-transform hover:-translate-y-1 ${f.span} ${f.glow}`}
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl border border-ink/10 bg-cream-deep text-2xl ${f.ring}`}
              >
                {f.icon}
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold">{f.title}</h3>
              <p className="mt-2 max-w-md text-ink-soft">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
