import { getCloudflareContext } from "@opennextjs/cloudflare";

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "turnstile" | "unconfigured" };

/**
 * Verifies a Turnstile token against Cloudflare's siteverify endpoint.
 *
 * Fail-closed: in production a missing TURNSTILE_SECRET rejects every
 * submission instead of waving it through, so a forgotten secret can never
 * leave the form open to bots. Only `next dev` skips the check, so local work
 * doesn't need a widget. Set it with `wrangler secret put TURNSTILE_SECRET`.
 */
export async function verifyTurnstile(
  token: unknown,
  ip: string,
  expectedAction: string,
): Promise<VerifyResult> {
  let secret: string | undefined;
  let hostnames = new Set<string>();
  try {
    const { env } = await getCloudflareContext({ async: true });
    const e = env as { TURNSTILE_SECRET?: string; TURNSTILE_HOSTNAMES?: string };
    secret = e.TURNSTILE_SECRET;
    // The frontend hostnames a token may come from, per deployment. The
    // production value in wrangler.jsonc never includes localhost.
    hostnames = new Set(
      (e.TURNSTILE_HOSTNAMES ?? "")
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean),
    );
  } catch {
    secret = undefined;
  }

  if (!secret) {
    return process.env.NODE_ENV === "development"
      ? { ok: true }
      : { ok: false, reason: "unconfigured" };
  }

  if (hostnames.size === 0) return { ok: false, reason: "unconfigured" };

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
      hostname?: string;
    };
    // All three must hold: a token minted for another form (action) or on
    // another site (hostname) is rejected even if Cloudflare says success.
    if (
      result.success !== true ||
      result.action !== expectedAction ||
      !result.hostname ||
      !hostnames.has(result.hostname)
    ) {
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
