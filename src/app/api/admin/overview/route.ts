import { NextResponse } from "next/server";
import { isAdmin, isDefaultPassword } from "@/lib/admin/auth";
import { getSystemHealth } from "@/lib/admin/health";
import { getStats, listJobs } from "@/lib/engine/jobs";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const [health, stats, jobs] = await Promise.all([
    getSystemHealth(),
    getStats(),
    listJobs(),
  ]);

  return NextResponse.json({
    health,
    stats,
    recentJobs: jobs.slice(0, 8).map((j) => ({
      id: j.id,
      source: j.source,
      stage: j.stage,
      clips: j.clips.length,
      createdAt: j.createdAt,
    })),
    defaultPassword: isDefaultPassword(),
  });
}
