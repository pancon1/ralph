import { redirect } from "next/navigation";
import AppHeader from "@/components/app/AppHeader";
import Workspace from "@/components/app/Workspace";
import { isAuthEnabled } from "@/lib/supabase/config";
import { getUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AppPage() {
  // When accounts are enabled, the workshop requires login.
  if (isAuthEnabled()) {
    const user = await getUser();
    if (!user) redirect("/login?next=/app");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-grid">
      <AppHeader />
      <main className="flex-1">
        <Workspace />
      </main>
    </div>
  );
}
