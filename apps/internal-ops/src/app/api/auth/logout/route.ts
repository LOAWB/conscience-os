import { NextRequest, NextResponse } from "next/server";
import {
  clearSessionCookie,
  COOKIE_NAME,
  revokeSession,
  verifySession,
} from "@/lib/auth";

async function handle(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (token) {
    const verified = await verifySession(token);
    if (verified?.payload.jti) {
      await revokeSession(verified.payload.jti);
    }
  }
  await clearSessionCookie();

  // Form-action POST: redirect back to login. JSON-API POST: ok response.
  const accept = req.headers.get("accept") || "";
  if (accept.includes("text/html")) {
    return NextResponse.redirect(new URL("/login", req.url), { status: 303 });
  }
  return NextResponse.json({ ok: true });
}

export const POST = handle;
