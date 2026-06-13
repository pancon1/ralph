import { createHash } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "bob_admin";

/** The configured admin password (set ADMIN_PASSWORD in .env.local). */
function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "bob-admin";
}

/** Token stored in the cookie — a hash of the password, never the password itself. */
export function sessionToken(): string {
  return createHash("sha256")
    .update(`bob.io::${adminPassword()}`)
    .digest("hex");
}

export function checkPassword(password: string): boolean {
  return password === adminPassword();
}

/** Read the admin session from cookies (server-side). */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === sessionToken();
}

/** True when the admin password is still the insecure default. */
export function isDefaultPassword(): boolean {
  return !process.env.ADMIN_PASSWORD;
}
