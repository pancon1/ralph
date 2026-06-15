import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthEnabled } from "@/lib/supabase/config";
import { createClient, getUser } from "@/lib/supabase/server";
import AppHeader from "@/components/app/AppHeader";
import ClipCard, { type ClipView } from "@/components/app/ClipCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mes clips — Bob.io" };

type Row = {
  id: string;
  title: string;
  caption: string;
  url: string;
  duration: string;
  start_label: string | null;
  score: number;
  hashtags: string[] | null;
};

export default async function MesClipsPage() {
  if (!isAuthEnabled()) redirect("/app");

  const user = await getUser();
  if (!user) redirect("/login?next=/mes-clips");

  const supabase = await createClient();
  const { data } = await supabase
    .from("clips")
    .select("id,title,caption,url,duration,start_label,score,hashtags")
    .order("created_at", { ascending: false });

  const clips: ClipView[] = (data ?? []).map((r: Row) => ({
    id: r.id,
    title: r.title,
    caption: r.caption,
    url: r.url,
    duration: r.duration,
    startLabel: r.start_label ?? "",
    score: r.score,
    hashtags: r.hashtags ?? [],
  }));

  return (
    <div className="flex min-h-full flex-1 flex-col bg-grid">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-3xl font-semibold">
              Mes clips
            </h1>
            <p className="mt-1 text-ink-soft">
              {clips.length > 0
                ? `${clips.length} clip${clips.length > 1 ? "s" : ""} généré${
                    clips.length > 1 ? "s" : ""
                  }`
                : "Tes clips générés apparaîtront ici."}
            </p>
          </div>
          <Link
            href="/app"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-lime shadow-soft transition-transform hover:-translate-y-0.5"
          >
            + Nouvelle vidéo
          </Link>
        </div>

        {clips.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-ink/20 bg-card p-12 text-center">
            <div className="text-5xl">🎬</div>
            <p className="mt-3 font-display text-xl font-bold">
              Aucun clip pour l&apos;instant
            </p>
            <p className="mt-1 text-ink-soft">
              Lance ta première vidéo dans l&apos;atelier.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {clips.map((clip) => (
              <ClipCard key={clip.id} clip={clip} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
