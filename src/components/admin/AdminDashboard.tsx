"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ---------------- types ---------------- */

type Health = {
  checks: { key: string; label: string; ok: boolean; detail: string }[];
  allOk: boolean;
  config: {
    momentsProvider: string;
    transcriptionModel: string;
    llmModel: string;
    claudeEnabled: boolean;
  };
};

type Stats = {
  total: number;
  done: number;
  errors: number;
  active: number;
  totalClips: number;
  successRate: number;
};

type RecentJob = {
  id: string;
  source: string;
  stage: string;
  clips: number;
  createdAt: number;
};

type Overview = {
  health: Health;
  stats: Stats;
  recentJobs: RecentJob[];
  defaultPassword: boolean;
};

type GuardianReport = {
  scannedAt: number;
  vulnerabilities: {
    critical: number;
    high: number;
    moderate: number;
    low: number;
    total: number;
  };
  outdated: { name: string; current: string; latest: string; type: string }[];
  riskLevel: "ok" | "attention" | "urgent";
  summary: string;
  recommendations: string[];
};

/* ---------------- main ---------------- */

export default function AdminDashboard() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/overview");
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* header */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime text-panel font-display text-lg font-semibold">
              B
            </span>
            <span className="font-display text-xl font-semibold">
              Bob<span className="text-coral">.io</span>
            </span>
            <span className="ml-1 rounded-full bg-coral/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-ink/5"
            >
              Voir le site
            </Link>
            <button
              onClick={logout}
              className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold transition-colors hover:bg-ink/5"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="font-display text-3xl font-semibold">
          Tableau de bord
        </h1>
        <p className="mt-1 text-ink-soft">Gère, surveille et sécurise Bob.io.</p>

        {data?.defaultPassword && (
          <div className="mt-5 rounded-2xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm font-medium text-ink">
            ⚠️ Tu utilises le mot de passe admin par défaut. Définis{" "}
            <code className="font-mono">ADMIN_PASSWORD</code> dans{" "}
            <code className="font-mono">.env.local</code> pour sécuriser cet espace.
          </div>
        )}

        {loading ? (
          <p className="mt-10 text-ink-soft">Chargement…</p>
        ) : !data ? (
          <p className="mt-10 text-coral">Impossible de charger les données.</p>
        ) : (
          <div className="mt-6 space-y-6">
            <StatsRow stats={data.stats} />

            <div className="grid gap-6 lg:grid-cols-2">
              <HealthPanel health={data.health} />
              <GuardianPanel />
            </div>

            <RecentJobsPanel jobs={data.recentJobs} />

            <ToolboxPanel />
          </div>
        )}
      </main>
    </div>
  );
}

/* ---------------- stats ---------------- */

function StatsRow({ stats }: { stats: Stats }) {
  const cards = [
    { label: "Vidéos traitées", value: stats.total, emoji: "🎬" },
    { label: "Clips générés", value: stats.totalClips, emoji: "✂️" },
    { label: "Taux de succès", value: `${stats.successRate}%`, emoji: "✅" },
    { label: "En cours", value: stats.active, emoji: "⏳" },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl border border-ink/10 bg-card p-5">
          <span className="text-2xl">{c.emoji}</span>
          <p className="mt-2 font-display text-3xl font-semibold">{c.value}</p>
          <p className="text-sm text-ink-soft">{c.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------------- health ---------------- */

function HealthPanel({ health }: { health: Health }) {
  return (
    <section className="rounded-3xl border border-ink/10 bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">État du système</h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            health.allOk ? "bg-lime text-panel" : "bg-coral/90 text-panel"
          }`}
        >
          {health.allOk ? "Tout va bien" : "Attention"}
        </span>
      </div>

      <ul className="mt-4 space-y-2">
        {health.checks.map((c) => (
          <li
            key={c.key}
            className="flex items-center justify-between rounded-xl bg-cream px-4 py-2.5 text-sm"
          >
            <span className="font-medium">{c.label}</span>
            <span className={c.ok ? "text-lime-deep" : "text-coral"}>
              {c.ok ? "✓ " : "✕ "}
              <span className="text-ink-soft">{c.detail}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-xl bg-cream px-4 py-3 text-xs text-ink-soft">
        <p>Moteur de détection : <b className="text-ink">{health.config.momentsProvider}</b></p>
        <p>Transcription : <b className="text-ink">{health.config.transcriptionModel}</b></p>
        <p>Modèle IA : <b className="text-ink">{health.config.llmModel}</b></p>
        <p>Claude (premium) : <b className="text-ink">{health.config.claudeEnabled ? "activé" : "désactivé"}</b></p>
      </div>
    </section>
  );
}

/* ---------------- guardian agent ---------------- */

function GuardianPanel() {
  const [report, setReport] = useState<GuardianReport | null>(null);
  const [scanning, setScanning] = useState(false);

  const scan = async () => {
    setScanning(true);
    try {
      const res = await fetch("/api/admin/security", { method: "POST" });
      if (res.ok) setReport(await res.json());
    } finally {
      setScanning(false);
    }
  };

  const risk = report?.riskLevel;
  const riskStyle =
    risk === "urgent"
      ? "bg-coral/90 text-panel"
      : risk === "attention"
      ? "bg-[#ffd23d] text-ink"
      : "bg-lime text-panel";

  return (
    <section className="rounded-3xl border border-ink/10 bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🛡️</span>
          <h2 className="font-display text-xl font-bold">Bob Guardian</h2>
        </div>
        {risk && (
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${riskStyle}`}>
            {risk === "ok" ? "Sécurisé" : risk === "attention" ? "À surveiller" : "Urgent"}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Agent IA de sécurité et de mises à jour.
      </p>

      {!report ? (
        <div className="mt-5 rounded-2xl bg-cream p-5 text-center">
          <p className="text-sm text-ink-soft">
            Lance un scan : Bob vérifie les failles de sécurité et les paquets à
            mettre à jour, puis t&apos;explique quoi faire.
          </p>
          <button
            onClick={scan}
            disabled={scanning}
            className="mt-4 rounded-full bg-lime px-6 py-3 text-sm font-semibold text-panel shadow-soft transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-50"
          >
            {scanning ? "Analyse en cours…" : "🔍 Lancer un scan"}
          </button>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {/* AI summary */}
          <div className="rounded-2xl bg-cream p-4">
            <p className="text-sm text-ink">{report.summary}</p>
          </div>

          {/* vuln counts */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { k: "Critiques", v: report.vulnerabilities.critical, c: "text-coral" },
              { k: "Élevées", v: report.vulnerabilities.high, c: "text-coral" },
              { k: "Moyennes", v: report.vulnerabilities.moderate, c: "text-ink" },
              { k: "Obsolètes", v: report.outdated.length, c: "text-ink" },
            ].map((x) => (
              <div key={x.k} className="rounded-xl bg-cream py-3">
                <p className={`font-display text-2xl font-semibold ${x.c}`}>{x.v}</p>
                <p className="text-[11px] text-ink-soft">{x.k}</p>
              </div>
            ))}
          </div>

          {/* recommendations */}
          {report.recommendations.length > 0 && (
            <div>
              <p className="text-sm font-semibold">Recommandations de Bob :</p>
              <ul className="mt-2 space-y-1">
                {report.recommendations.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink-soft">
                    <span className="text-lime-deep">→</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={scan}
            disabled={scanning}
            className="w-full rounded-full border border-ink/15 py-2.5 text-sm font-semibold transition-colors hover:bg-ink/5 disabled:opacity-50"
          >
            {scanning ? "Analyse…" : "↻ Relancer le scan"}
          </button>
        </div>
      )}
    </section>
  );
}

/* ---------------- recent jobs ---------------- */

const STAGE_LABEL: Record<string, string> = {
  queued: "En file",
  downloading: "Téléchargement",
  transcribing: "Transcription",
  analyzing: "Analyse",
  cutting: "Découpe",
  done: "Terminé",
  error: "Erreur",
};

function RecentJobsPanel({ jobs }: { jobs: RecentJob[] }) {
  return (
    <section className="rounded-3xl border border-ink/10 bg-card p-6">
      <h2 className="font-display text-xl font-bold">Activité récente</h2>
      {jobs.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">
          Aucune vidéo traitée pour l&apos;instant.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="pb-2 font-semibold">Source</th>
                <th className="pb-2 font-semibold">Statut</th>
                <th className="pb-2 font-semibold">Clips</th>
                <th className="pb-2 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-t border-ink/5">
                  <td className="max-w-[240px] truncate py-2.5 pr-4">{j.source}</td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        j.stage === "done"
                          ? "bg-lime text-panel"
                          : j.stage === "error"
                          ? "bg-coral/90 text-panel"
                          : "bg-cream-deep text-ink-soft"
                      }`}
                    >
                      {STAGE_LABEL[j.stage] ?? j.stage}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">{j.clips}</td>
                  <td className="py-2.5 text-ink-soft">
                    {new Date(j.createdAt).toLocaleString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* ---------------- free tools toolbox ---------------- */

const TOOLS = [
  {
    cat: "Hébergement gratuit",
    items: [
      { name: "Vercel", desc: "Déployer le site gratuitement", url: "https://vercel.com" },
      { name: "Netlify", desc: "Alternative d'hébergement gratuit", url: "https://netlify.com" },
    ],
  },
  {
    cat: "Statistiques de visite",
    items: [
      { name: "Plausible (auto-hébergé)", desc: "Analytics respectueux, gratuit", url: "https://plausible.io/self-hosted-web-analytics" },
      { name: "Umami", desc: "Analytics open-source gratuit", url: "https://umami.is" },
      { name: "Google Analytics", desc: "Statistiques détaillées gratuites", url: "https://analytics.google.com" },
    ],
  },
  {
    cat: "Surveillance & disponibilité",
    items: [
      { name: "UptimeRobot", desc: "Alerte si le site tombe (gratuit)", url: "https://uptimerobot.com" },
      { name: "Better Stack", desc: "Monitoring + logs, palier gratuit", url: "https://betterstack.com" },
    ],
  },
  {
    cat: "Sécurité & maintenance",
    items: [
      { name: "Dependabot (GitHub)", desc: "MàJ auto des dépendances", url: "https://github.com/dependabot" },
      { name: "Snyk", desc: "Scan de vulnérabilités gratuit", url: "https://snyk.io" },
    ],
  },
  {
    cat: "Référencement (SEO)",
    items: [
      { name: "Google Search Console", desc: "Visibilité sur Google (gratuit)", url: "https://search.google.com/search-console" },
      { name: "PageSpeed Insights", desc: "Tester la vitesse du site", url: "https://pagespeed.web.dev" },
    ],
  },
];

function ToolboxPanel() {
  return (
    <section className="rounded-3xl border border-ink/10 bg-card p-6">
      <h2 className="font-display text-xl font-bold">
        Boîte à outils — gestion de site (100% gratuit)
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Une sélection d&apos;outils gratuits pour héberger, surveiller, sécuriser et
        faire grandir Bob.io.
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((group) => (
          <div key={group.cat}>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-coral">
              {group.cat}
            </p>
            <ul className="mt-2 space-y-2">
              {group.items.map((t) => (
                <li key={t.name}>
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl bg-cream px-3 py-2 transition-colors hover:bg-cream-deep"
                  >
                    <span className="text-sm font-semibold">{t.name} ↗</span>
                    <span className="block text-xs text-ink-soft">{t.desc}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
