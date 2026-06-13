import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin/auth";
import { runGuardianScan } from "@/lib/agent/guardian";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const report = await runGuardianScan();
  return NextResponse.json(report);
}
