import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { findUserByEmail, issueSession, setSessionCookie } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(1).max(200),
});

// In-memory rate limit (resets on cold start). 5 attempts per IP per 15 min.
// For a single-instance Railway deployment this is sufficient. Move to a
// Postgres-backed counter if internal-ops scales beyond one instance.
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const ATTEMPT_LIMIT = 5;
const attempts = new Map<string, number[]>();

function recordAttempt(ip: string, success: boolean) {
  if (success) {
    attempts.delete(ip);
    return;
  }
  const now = Date.now();
  const list = (attempts.get(ip) ?? []).filter(
    (t) => now - t < ATTEMPT_WINDOW_MS,
  );
  list.push(now);
  attempts.set(ip, list);
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (attempts.get(ip) ?? []).filter(
    (t) => now - t < ATTEMPT_WINDOW_MS,
  );
  attempts.set(ip, list);
  return list.length >= ATTEMPT_LIMIT;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(json);
  if (!parsed.success) {
    recordAttempt(ip, false);
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const { email, password } = parsed.data;
  const user = await findUserByEmail(email);

  if (!user) {
    recordAttempt(ip, false);
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    recordAttempt(ip, false);
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const userAgent = req.headers.get("user-agent") || "unknown";
  const { token } = await issueSession(
    { id: user.id, role: user.role },
    { ip, userAgent },
  );
  await setSessionCookie(token);
  recordAttempt(ip, true);

  return NextResponse.json({ ok: true });
}
