import { getCloudflareContext } from "@opennextjs/cloudflare";
import es from "../../messages/es.json";
import { verifyTurnstile } from "./turnstile";
import { renderContactEmail } from "./contact-email";
import {
  CONTACT_OPTIONS,
  isOption,
  type ContactAnswers,
  type ServiceKey,
} from "./contact-options";

export const LIMITS = {
  name: 60,
  email: 120,
  message: 1000,
  /** Messages allowed from one author per rolling window. */
  perWindow: 3,
  windowHours: 24,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactEnv = {
  DB?: D1Database;
  RESEND_API_KEY?: string;
  NOTIFY_EMAIL?: string;
};

async function getEnv(): Promise<ContactEnv> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env as ContactEnv;
  } catch {
    return {};
  }
}

/**
 * Turns an untrusted request body into answers, or null if anything is off.
 * Choices must be known option keys; `services` must be a non-empty list of
 * distinct keys. Only the note may be empty.
 */
export function parseAnswers(body: Record<string, unknown>): ContactAnswers | null {
  const { name, email, message = "", services, org, site, budget, timeline } = body;

  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return null;
  }

  const answers = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  };

  if (
    answers.name.length === 0 ||
    answers.name.length > LIMITS.name ||
    !EMAIL_RE.test(answers.email) ||
    answers.email.length > LIMITS.email ||
    answers.message.length > LIMITS.message
  ) {
    return null;
  }

  if (
    !Array.isArray(services) ||
    services.length === 0 ||
    services.length > CONTACT_OPTIONS.services.length ||
    new Set(services).size !== services.length ||
    !services.every((s) => isOption("services", s))
  ) {
    return null;
  }

  if (
    !isOption("org", org) ||
    !isOption("site", site) ||
    !isOption("budget", budget) ||
    !isOption("timeline", timeline)
  ) {
    return null;
  }

  return { ...answers, services: services as ServiceKey[], org, site, budget, timeline };
}

/** Spanish labels for the email, straight from the copy the visitor saw. */
const label = es.contact.flow.options;

/**
 * Emails a copy of a saved message through Resend. Best-effort by design:
 * it runs only after the row is in D1, so a Resend outage or a missing key
 * never loses a message. The HTML version escapes everything the visitor
 * typed (see contact-email.ts), and a plain-text part goes with it. Both
 * values are secrets, so the address never appears in the repo or on the site.
 */
async function notify(env: ContactEnv, a: ContactAnswers): Promise<void> {
  if (!env.RESEND_API_KEY || !env.NOTIFY_EMAIL) return;

  const { subject, html, text } = renderContactEmail(a, label);

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio <contacto@lucia-adams.com>",
        to: [env.NOTIFY_EMAIL],
        reply_to: a.email,
        subject,
        html,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    // The message is already saved; the email is only a heads-up.
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
  answers: ContactAnswers;
  ip: string;
  turnstileToken: unknown;
}): Promise<ContactResult> {
  const a = input.answers;

  const verified = await verifyTurnstile(input.turnstileToken, input.ip, "contact");
  if (!verified.ok) return { ok: false, reason: verified.reason };

  const env = await getEnv();
  const db = env.DB;
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
        `INSERT INTO messages
           (name, email, message, services, org, site, budget, timeline, author_hash)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        a.name,
        a.email,
        a.message,
        a.services.join(","),
        a.org,
        a.site,
        a.budget,
        a.timeline,
        author,
      )
      .run();
  } catch {
    return { ok: false, reason: "error" };
  }

  await notify(env, a);
  return { ok: true };
}
