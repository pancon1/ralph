const FEATURES = [
  {
    title: "Détection des moments forts",
    desc: "Bob lit la vidéo comme un humain et choisit les extraits avec le meilleur potentiel viral.",
    icon: "🎯",
    span: "lg:col-span-2",
    accent: "bg-lime",
  },
  {
    title: "Sous-titres animés",
    desc: "Synchronisés au mot près, dans le style qui retient l'attention.",
    icon: "💬",
    span: "",
    accent: "bg-card",
  },
  {
    title: "Recadrage vertical auto",
    desc: "Suit la personne qui parle pour un format 9:16 parfait.",
    icon: "📱",
    span: "",
    accent: "bg-card",
  },
  {
    title: "Score de viralité",
    desc: "Chaque clip reçoit une note pour savoir lequel poster en premier.",
    icon: "📈",
    span: "lg:col-span-2",
    accent: "bg-sky",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-cream-deep">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-coral">
            Tout ce que Klap fait
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            …mais en gratuit, et avec le sourire 😎
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`shadow-soft rounded-3xl border border-ink/10 p-7 transition-transform hover:-translate-y-1 ${f.accent} ${f.span} ${
                f.accent === "bg-card" ? "" : "text-ink"
              }`}
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-2xl">
                {f.icon}
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold">{f.title}</h3>
              <p className="mt-2 max-w-md text-ink-soft">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
