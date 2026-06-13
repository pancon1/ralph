import { NextRequest } from "next/server";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const CLIPS_DIR = path.join(process.cwd(), ".bob-clips");

// Only allow safe filenames (no path traversal).
const SAFE = /^[A-Za-z0-9._-]+$/;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; file: string }> }
) {
  const { id, file } = await params;

  if (!SAFE.test(id) || !SAFE.test(file) || !file.endsWith(".mp4")) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(CLIPS_DIR, id, file);

  let size: number;
  try {
    size = (await stat(filePath)).size;
  } catch {
    return new Response("Clip introuvable", { status: 404 });
  }

  const data = await readFile(filePath);
  const baseHeaders: Record<string, string> = {
    "Content-Type": "video/mp4",
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=3600",
  };

  // Range request → 206 partial content (lets the <video> player seek).
  const range = req.headers.get("range");
  const match = range && /bytes=(\d+)-(\d*)/.exec(range);
  if (match) {
    const start = parseInt(match[1], 10);
    const end = match[2] ? parseInt(match[2], 10) : size - 1;
    if (start <= end && end < size) {
      const chunk = data.subarray(start, end + 1);
      return new Response(chunk, {
        status: 206,
        headers: {
          ...baseHeaders,
          "Content-Range": `bytes ${start}-${end}/${size}`,
          "Content-Length": String(chunk.length),
        },
      });
    }
  }

  return new Response(data, {
    status: 200,
    headers: { ...baseHeaders, "Content-Length": String(size) },
  });
}
