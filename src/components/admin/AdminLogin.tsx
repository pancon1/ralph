"use client";

import { useState } from "react";
import BobMascot from "@/components/BobMascot";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const j = await res.json();
        setError(j.error || "Échec de la connexion");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-grid px-5">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-ink/10 bg-card p-8 text-center shadow-xl"
      >
        <BobMascot size={84} className="mx-auto" />
        <h1 className="mt-4 font-display text-2xl font-semibold">
          Espace administrateur
        </h1>
        <p className="mt-1 text-sm text-ink-soft">Réservé au gestionnaire de Bob.io</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          autoFocus
          className="mt-6 w-full rounded-full border border-ink/15 bg-cream px-5 py-3 text-sm outline-none transition-colors focus:border-ink"
        />

        {error && <p className="mt-3 text-sm font-medium text-coral">{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-5 w-full rounded-full bg-ink py-3.5 text-sm font-semibold text-lime shadow-soft transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-40 disabled:shadow-none"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        <p className="mt-4 text-xs text-ink-soft">
          Mot de passe par défaut : <code className="font-mono">bob-admin</code>
          <br />
          (modifie <code className="font-mono">ADMIN_PASSWORD</code> dans .env.local)
        </p>
      </form>
    </main>
  );
}
