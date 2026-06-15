"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function UserMenu({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <span
        className="grid h-9 w-9 place-items-center rounded-full bg-coral/90 text-sm font-bold text-ink"
        title={email}
      >
        {initial}
      </span>
      <button
        onClick={signOut}
        disabled={loading}
        className="rounded-full border border-ink/15 px-3 py-1.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-ink/5 disabled:opacity-50"
      >
        {loading ? "…" : "Déconnexion"}
      </button>
    </div>
  );
}
