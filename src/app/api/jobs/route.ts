import { NextRequest, NextResponse } from "next/server";
import { createJob, startPipeline } from "@/lib/engine/jobs";
import { getUser } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 800;

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let url: string | undefined;
    let file: File | undefined;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const u = form.get("url");
      const f = form.get("file");
      if (typeof u === "string" && u.trim()) url = u.trim();
      if (f instanceof File && f.size > 0) file = f;
    } else {
      const body = await req.json().catch(() => ({}));
      if (typeof body.url === "string") url = body.url.trim();
    }

    if (!url && !file) {
      return NextResponse.json(
        { error: "Fournis un lien vidéo ou un fichier." },
        { status: 400 }
      );
    }

    const user = await getUser();
    const job = await createJob(file ? file.name : url!, user?.id);
    startPipeline(job.id, { url, file });

    return NextResponse.json({ id: job.id, stage: job.stage });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}
