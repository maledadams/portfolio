import { NextResponse } from "next/server";
import { parseAnswers, sendContactMessage } from "@/lib/contact";

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

  const fields = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const { website, token } = fields;

  // Honeypot: a real person never fills a field they cannot see. Answer 200
  // so a bot has no signal that it was caught.
  if (typeof website === "string" && website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const answers = parseAnswers(fields);
  if (!answers) {
    return NextResponse.json({ reason: "invalid" }, { status: 400 });
  }

  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  const result = await sendContactMessage({
    answers,
    ip,
    turnstileToken: token,
  });

  if (result.ok) return NextResponse.json({ ok: true });

  return NextResponse.json(
    { reason: result.reason },
    { status: STATUS[result.reason] ?? 500 },
  );
}
