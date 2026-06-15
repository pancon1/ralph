"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import BobMascot from "@/components/BobMascot";

type Mode = "signin" | "signup";

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        if (data.session) {
          window.location.href = "/app";
        } else {
          setInfo(
            "Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi."
          );
          setMode("signin");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = "/app";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-grid px-5 py-10">
      <div className="w-full max-w-sm rounded-3xl border border-ink/10 bg-card p-8 shadow-float">
        <div className="text-center">
          <Link href="/">
            <BobMascot size={76} className="mx-auto" />
          </Link>
          <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight">
            {mode === "signin" ? "Bon retour 👋" : "Crée ton compte"}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {mode === "signin"
              ? "Connecte-toi pour retrouver tes clips."
              : "Gratuit, et tes clips sont gardés rien que pour toi."}
          </p>
        </div>

        <button
          onClick={google}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 bg-cream py-3 text-sm font-semibold transition-colors hover:bg-cream-deep"
        >
          <GoogleIcon /> Continuer avec Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          <span className="h-px flex-1 bg-ink/10" />
          ou
          <span className="h-px flex-1 bg-ink/10" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-full border border-ink/15 bg-cream px-5 py-3 text-sm outline-none transition-colors focus:border-ink"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe (6+ caractères)"
            className="w-full rounded-full border border-ink/15 bg-cream px-5 py-3 text-sm outline-none transition-colors focus:border-ink"
          />

          {error && <p className="text-sm font-medium text-coral">{error}</p>}
          {info && <p className="text-sm font-medium text-lime-deep">{info}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink py-3.5 text-sm font-semibold text-lime shadow-[0_4px_0_0_var(--lime-deep)] transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none"
          >
            {loading
              ? "…"
              : mode === "signin"
              ? "Se connecter"
              : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          {mode === "signin" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setInfo(null);
            }}
            className="font-semibold text-ink underline"
          >
            {mode === "signin" ? "Inscris-toi" : "Connecte-toi"}
          </button>
        </p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75z"
      />
    </svg>
  );
}
