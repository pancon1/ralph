import Link from "next/link";
import { isAuthEnabled } from "@/lib/supabase/config";
import { getUser } from "@/lib/supabase/server";
import UserMenu from "@/components/auth/UserMenu";

export default async function AppHeader() {
  const authOn = isAuthEnabled();
  const user = authOn ? await getUser() : null;

  return (
    <header className="glass border-b border-ink/10">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime text-panel font-display text-lg font-semibold">
            B
          </span>
          <span className="font-display text-xl font-semibold">
            Bob<span className="text-coral">.io</span>
          </span>
          <span className="ml-1 rounded-full bg-lime px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
            Atelier
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/mes-clips"
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-ink/5"
              >
                Mes clips
              </Link>
              <UserMenu email={user.email ?? "?"} />
            </>
          ) : authOn ? (
            <Link
              href="/login"
              className="rounded-full bg-lime px-5 py-2 text-sm font-semibold text-panel"
            >
              Se connecter
            </Link>
          ) : (
            <span className="hidden items-center gap-1.5 rounded-full border border-ink/15 bg-card px-3 py-1.5 text-xs font-semibold text-ink-soft sm:flex">
              <span className="h-2 w-2 rounded-full bg-lime-deep" />
              Crédits illimités · Gratuit
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
