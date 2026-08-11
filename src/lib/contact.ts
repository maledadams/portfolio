import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyTurnstile } from "./turnstile";

export const LIMITS = {
  name: 60,
  email: 120,
  message: 1000,
  /** Messages allowed from one author per rolling window. */
  perWindow: 3,
  windowHours: 24,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function getDb(): Promise<D1Database | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return (env as { DB?: D1Database }).DB ?? null;
  } catch {
    return null;
  }
}

/** Non-reversible, salted by the day so it cannot be used to track anyone. */
async function hashAuthor(ip: string): Promise<string> {
  const day = new Date().toISOString().slice(0, 10);
  const bytes = new TextEncoder().encode(`${day}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest).slice(0, 16))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export type ContactResult =
  | { ok: true }
  | {
      ok: false;
      reason: "invalid" | "turnstile" | "rate-limited" | "unconfigured" | "error";
    };

export async function sendContactMessage(input: {
  name: string;
  email: string;
  message: string;
  ip: string;
  turnstileToken: unknown;
}): Promise<ContactResult> {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (
    name.length === 0 ||
    name.length > LIMITS.name ||
    !EMAIL_RE.test(email) ||
    email.length > LIMITS.email ||
    message.length === 0 ||
    message.length > LIMITS.message
  ) {
    return { ok: false, reason: "invalid" };
  }

  const verified = await verifyTurnstile(input.turnstileToken, input.ip, "contact");
  if (!verified.ok) return { ok: false, reason: "turnstile" };

  const db = await getDb();
  if (!db) return { ok: false, reason: "unconfigured" };

  const author = await hashAuthor(input.ip);

  try {
    const recent = await db
      .prepare(
        `SELECT COUNT(*) AS count
           FROM messages
          WHERE author_hash = ?
            AND created_at > datetime('now', ?)`,
      )
      .bind(author, `-${LIMITS.windowHours} hours`)
      .first<{ count: number }>();

    if ((recent?.count ?? 0) >= LIMITS.perWindow) {
      return { ok: false, reason: "rate-limited" };
    }

    await db
      .prepare(
        `INSERT INTO messages (name, email, message, author_hash)
         VALUES (?, ?, ?, ?)`,
      )
      .bind(name, email, message, author)
      .run();

    return { ok: true };
  } catch {
    return { ok: false, reason: "error" };
  }
}
