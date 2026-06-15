import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthEnabled } from "@/lib/supabase/config";
import { getUser } from "@/lib/supabase/server";
import AuthForm from "@/components/auth/AuthForm";
import BobMascot from "@/components/BobMascot";

export const dynamic = "force-dynamic";
export const metadata = { title: "Connexion — Bob.io" };

export default async function LoginPage() {
  if (!isAuthEnabled()) {
    return (
      <main className="grid min-h-screen place-items-center bg-grid px-5 text-center">
        <div className="max-w-md">
          <BobMascot size={90} className="mx-auto" />
          <h1 className="mt-4 font-display text-2xl font-semibold">
            Les comptes arrivent bientôt
          </h1>
          <p className="mt-2 text-ink-soft">
            L&apos;authentification n&apos;est pas encore configurée sur ce site.
          </p>
          <Link
            href="/app"
            className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-lime"
          >
            Aller à l&apos;atelier
          </Link>
        </div>
      </main>
    );
  }

  const user = await getUser();
  if (user) redirect("/app");

  return <AuthForm />;
}
