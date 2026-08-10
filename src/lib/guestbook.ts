import { getCloudflareContext } from "@opennextjs/cloudflare";

export type GuestbookEntry = {
  id: number;
  name: string;
  message: string;
  created_at: string;
};

export const LIMITS = {
  name: 40,
  message: 220,
  /** Signatures allowed from one author per rolling window. */
  perWindow: 3,
  windowHours: 24,
};

/**
 * Returns the D1 binding, or null when it is not configured. The site has to
 * keep rendering without a database, otherwise local development and any
 * preview built before the D1 instance exists would fail outright.
 */
async function getDb(): Promise<D1Database | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return (env as { DB?: D1Database }).DB ?? null;
  } catch {
    return null;
  }
}

export async function listEntries(): Promise<GuestbookEntry[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const { results } = await db
      .prepare(
        `SELECT id, name, message, created_at
           FROM guestbook
          WHERE approved = 1
          ORDER BY created_at DESC
          LIMIT 24`,
      )
      .all<GuestbookEntry>();
    return results ?? [];
  } catch {
    // Table missing (migration not applied yet) must not take the page down.
    return [];
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

export type SignResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "invalid" | "rate-limited" | "error" };

export async function signGuestbook(input: {
  name: string;
  message: string;
  ip: string;
}): Promise<SignResult> {
  const name = input.name.trim();
  const message = input.message.trim();

  if (
    name.length === 0 ||
    name.length > LIMITS.name ||
    message.length === 0 ||
    message.length > LIMITS.message
  ) {
    return { ok: false, reason: "invalid" };
  }

  const db = await getDb();
  if (!db) return { ok: false, reason: "unconfigured" };

  const author = await hashAuthor(input.ip);

  try {
    const recent = await db
      .prepare(
        `SELECT COUNT(*) AS count
           FROM guestbook
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
        `INSERT INTO guestbook (name, message, author_hash)
         VALUES (?, ?, ?)`,
      )
      .bind(name, message, author)
      .run();

    return { ok: true };
  } catch {
    return { ok: false, reason: "error" };
  }
}
