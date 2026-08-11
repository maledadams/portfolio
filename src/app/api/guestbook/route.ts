import { NextResponse } from "next/server";
import { signGuestbook } from "@/lib/guestbook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUS: Record<string, number> = {
  invalid: 400,
  turnstile: 403,
  "rate-limited": 429,
  unconfigured: 503,
  error: 500,
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ reason: "invalid" }, { status: 400 });
  }

  const { name, message, website, token } = (body ?? {}) as Record<
    string,
    unknown
  >;

  // Honeypot: a real person never fills a field they cannot see. Answer 200 so
  // a bot has no signal that it was caught.
  if (typeof website === "string" && website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (typeof name !== "string" || typeof message !== "string") {
    return NextResponse.json({ reason: "invalid" }, { status: 400 });
  }

  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  const result = await signGuestbook({
    name,
    message,
    ip,
    turnstileToken: token,
  });

  if (result.ok) return NextResponse.json({ ok: true });

  return NextResponse.json(
    { reason: result.reason },
    { status: STATUS[result.reason] ?? 500 },
  );
}
