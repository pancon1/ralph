import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="border-b border-ink/10 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-lime font-display text-lg font-extrabold">
            B
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight">
            Bob<span className="text-coral">.io</span>
          </span>
          <span className="ml-1 rounded-full bg-lime px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
            Atelier
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-ink/15 bg-card px-3 py-1.5 text-xs font-semibold text-ink-soft sm:flex">
            <span className="h-2 w-2 rounded-full bg-lime-deep" />
            Crédits illimités · Gratuit
          </span>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-coral/90 text-sm font-bold text-cream">
            R
          </div>
        </div>
      </div>
    </header>
  );
}
