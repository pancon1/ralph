import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-cream">
      {/* big CTA */}
      <div className="mx-auto max-w-6xl px-5 py-20 text-center">
        <h2 className="mx-auto max-w-2xl font-display text-4xl font-extrabold tracking-tight md:text-6xl">
          Prêt à devenir viral{" "}
          <span className="relative whitespace-nowrap">
            <span className="relative z-10">avec Bob ?</span>
            <span className="absolute inset-x-0 bottom-1 z-0 h-4 -rotate-1 bg-lime" />
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-lg text-ink-soft">
          Importe ta première vidéo et récupère 10 clips en quelques minutes.
        </p>
        <Link
          href="/app"
          className="mt-8 inline-block rounded-full bg-ink px-8 py-4 text-lg font-semibold text-lime shadow-[0_5px_0_0_var(--lime-deep)] transition-transform hover:-translate-y-0.5"
        >
          Découper ma vidéo gratuitement →
        </Link>
      </div>

      {/* bottom bar */}
      <div className="border-t border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-lime font-display font-extrabold">
              B
            </span>
            <span className="font-display text-lg font-extrabold">
              Bob<span className="text-coral">.io</span>
            </span>
          </div>
          <p className="text-sm text-ink-soft">
            © {new Date().getFullYear()} Bob.io — Fait avec 💚 pour les créateurs.
          </p>
          <div className="flex gap-5 text-sm font-medium text-ink-soft">
            <a href="#" className="hover:text-ink">Confidentialité</a>
            <a href="#" className="hover:text-ink">Conditions</a>
            <a href="#" className="hover:text-ink">Contact</a>
            <Link href="/admin" className="hover:text-ink">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
