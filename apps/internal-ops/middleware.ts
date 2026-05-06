import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "conscience_ops_session";
const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/health"];

export const config = {
  // Match everything except static assets, _next internals, and favicon.
  // Public paths get a special pass below.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp)$).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return redirectOrUnauthorized(req);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return redirectOrUnauthorized(req);
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    // NOTE: we do NOT verify the sessions table revocation status here because
    // edge middleware can't talk to Postgres. Revocation is enforced by
    // route handlers via getSession() (which queries the sessions table).
    // Middleware acts as a fast-path filter; getSession is the authoritative
    // gate for sensitive operations.
    return NextResponse.next();
  } catch {
    return redirectOrUnauthorized(req);
  }
}

function redirectOrUnauthorized(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("redirect", pathname);
  return NextResponse.redirect(url);
}
