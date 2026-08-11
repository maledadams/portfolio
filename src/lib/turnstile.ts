import { getCloudflareContext } from "@opennextjs/cloudflare";

export type VerifyResult = { ok: true } | { ok: false; reason: "turnstile" };

/**
 * Verifies a Turnstile token against Cloudflare's siteverify endpoint.
 *
 * Skip-open when TURNSTILE_SECRET isn't configured yet: the widget has to be
 * created by hand in the dashboard (see README), so until that happens the
 * forms still work on honeypot + rate limiting alone. The moment the secret
 * is set with `wrangler secret put TURNSTILE_SECRET`, every submission is
 * checked automatically with no further code changes.
 */
export async function verifyTurnstile(
  token: unknown,
  ip: string,
  expectedAction: string,
): Promise<VerifyResult> {
  let secret: string | undefined;
  try {
    const { env } = await getCloudflareContext({ async: true });
    secret = (env as { TURNSTILE_SECRET?: string }).TURNSTILE_SECRET;
  } catch {
    secret = undefined;
  }

  if (!secret) return { ok: true };

  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return { ok: false, reason: "turnstile" };
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token, remoteip: ip }),
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!response.ok) return { ok: false, reason: "turnstile" };

    const result = (await response.json()) as {
      success?: boolean;
      action?: string;
    };
    if (!result.success) return { ok: false, reason: "turnstile" };
    if (result.action && result.action !== expectedAction) {
      return { ok: false, reason: "turnstile" };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: "turnstile" };
  }
}

/** Null until the real widget's site key replaces the placeholder. */
export async function getTurnstileSiteKey(): Promise<string | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const key = (env as { TURNSTILE_SITE_KEY?: string }).TURNSTILE_SITE_KEY;
    return key && !key.startsWith("REPLACE_") ? key : null;
  } catch {
    return null;
  }
}
