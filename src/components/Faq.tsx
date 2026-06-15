const QA = [
  {
    q: "C'est vraiment gratuit ? Où est le piège ?",
    a: "Oui, gratuit pour les créateurs. Bob.io est financé autrement (offres pro pour les équipes à venir). Pour toi, créateur solo : pas de carte bancaire, pas de filigrane forcé.",
  },
  {
    q: "Quels formats de vidéo puis-je importer ?",
    a: "Un lien YouTube ou un fichier MP4 / MOV. Idéal pour les podcasts, interviews, webinaires, lives et cours en ligne.",
  },
  {
    q: "Combien de temps pour générer mes clips ?",
    a: "En général 2 à 5 minutes selon la durée de la vidéo. Bob te prévient quand c'est prêt.",
  },
  {
    q: "Les sous-titres sont-ils en français ?",
    a: "Oui. Bob détecte automatiquement la langue parlée et génère des sous-titres synchronisés, y compris en français.",
  },
  {
    q: "En quoi Bob.io est différent de Klap ?",
    a: "Même promesse — transformer une longue vidéo en clips courts — mais une interface plus simple, plus chaleureuse, et surtout gratuite pour les créateurs.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="bg-cream-deep">
      <div className="mx-auto max-w-3xl px-5 py-20 md:py-28">
        <div className="text-center">
          <p className="eyebrow">
            FAQ
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
            Les questions que tu te poses
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {QA.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-ink/10 bg-card p-5 [&_summary]:cursor-pointer"
            >
              <summary className="flex items-center justify-between font-display text-lg font-bold marker:content-none">
                {item.q}
                <span className="ml-4 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-lime text-panel transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
