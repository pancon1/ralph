import Link from "next/link";

const LINKS = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Comment ça marche", href: "#how" },
  { label: "Gratuit ?", href: "#free" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  return (
    <header className="glass sticky top-0 z-50 border-b border-ink/10">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-lime font-display text-lg font-extrabold">
            B
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight">
            Bob<span className="text-coral">.io</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5 sm:block"
          >
            Se connecter
          </Link>
          <Link
            href="/app"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-lime shadow-[0_4px_0_0_var(--lime-deep)] transition-transform hover:-translate-y-0.5"
          >
            Essayer gratuitement
          </Link>
        </div>
      </nav>
    </header>
  );
}
