import { readFile } from "node:fs/promises";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * Optional permanent storage for generated clips, via any S3-compatible
 * provider (Cloudflare R2, Supabase Storage, Backblaze B2, etc.).
 *
 * When the BOB_S3_* env vars are set, clips are uploaded to the bucket and
 * served from its public URL. Otherwise the app falls back to local disk
 * (the /clips/[id]/[file] route), which is fine for local dev but ephemeral
 * on free hosts.
 */

function config() {
  const endpoint = process.env.BOB_S3_ENDPOINT;
  const bucket = process.env.BOB_S3_BUCKET;
  const accessKeyId = process.env.BOB_S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.BOB_S3_SECRET_ACCESS_KEY;
  const publicUrl = process.env.BOB_S3_PUBLIC_URL;
  const region = process.env.BOB_S3_REGION || "auto";

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey || !publicUrl) {
    return null;
  }
  return { endpoint, bucket, accessKeyId, secretAccessKey, publicUrl, region };
}

export function isStorageConfigured(): boolean {
  return config() !== null;
}

let client: S3Client | null = null;

function getClient(cfg: NonNullable<ReturnType<typeof config>>): S3Client {
  if (!client) {
    client = new S3Client({
      region: cfg.region,
      endpoint: cfg.endpoint,
      forcePathStyle: true, // required by R2/Supabase/B2-style endpoints
      credentials: {
        accessKeyId: cfg.accessKeyId,
        secretAccessKey: cfg.secretAccessKey,
      },
    });
  }
  return client;
}

/**
 * Upload a local clip file to the bucket and return its public URL.
 * Returns null if storage isn't configured (caller falls back to local).
 */
export async function uploadClip(
  localPath: string,
  key: string
): Promise<string | null> {
  const cfg = config();
  if (!cfg) return null;

  const body = await readFile(localPath);
  await getClient(cfg).send(
    new PutObjectCommand({
      Bucket: cfg.bucket,
      Key: key,
      Body: body,
      ContentType: "video/mp4",
      CacheControl: "public, max-age=86400",
    })
  );

  // public base URL + key (works for R2 public dev URL, Supabase public bucket, etc.)
  return `${cfg.publicUrl.replace(/\/$/, "")}/${key}`;
}
