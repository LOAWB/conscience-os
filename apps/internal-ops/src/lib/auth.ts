/**
 * internal-ops auth utilities.
 *
 * Multi-user model from day 1 (per Pory cosign): real users + sessions tables
 * with server-side session revocation. JWT cookie 'conscience_ops_session'
 * (distinct from any future public-site auth so the trust boundary is
 * unambiguous at the cookie level).
 */
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb, sessions, users } from "@repo/db";
import type { UserRole } from "@repo/db";
import { randomUUID } from "crypto";

export const COOKIE_NAME = "conscience_ops_session";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const ALG = "HS256";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET env var is required. Generate with: openssl rand -base64 48",
    );
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: string;
  role: UserRole;
  jti: string;
  iat?: number;
  exp?: number;
};

export type IssueOptions = {
  ip?: string;
  userAgent?: string;
};

/**
 * Sign a JWT for the given user, persist a sessions row keyed by the JWT's jti,
 * and return both the token and the jti so the caller can attach the cookie.
 */
export async function issueSession(
  user: { id: string; role: UserRole },
  opts: IssueOptions = {},
): Promise<{ token: string; jti: string }> {
  const jti = randomUUID();
  const expiresAt = new Date(Date.now() + COOKIE_MAX_AGE * 1000);

  const token = await new SignJWT({
    userId: user.id,
    role: user.role,
    jti,
  })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setJti(jti)
    .setExpirationTime(`${COOKIE_MAX_AGE}s`)
    .sign(getSecret());

  const db = getDb();
  await db.insert(sessions).values({
    userId: user.id,
    jti,
    ip: opts.ip ?? null,
    userAgent: opts.userAgent ?? null,
    expiresAt,
  });

  return { token, jti };
}

/**
 * Verify a JWT and confirm its sessions row exists and isn't revoked.
 * Returns the verified payload + the user record on success, null otherwise.
 */
export async function verifySession(
  token: string,
): Promise<{ payload: SessionPayload; userId: string; role: UserRole } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: [ALG],
    });
    const typed = payload as SessionPayload;
    if (!typed.userId || !typed.jti || !typed.role) return null;

    const db = getDb();
    const rows = await db
      .select({
        revokedAt: sessions.revokedAt,
        userId: sessions.userId,
      })
      .from(sessions)
      .where(eq(sessions.jti, typed.jti))
      .limit(1);

    if (rows.length === 0) return null;
    if (rows[0].revokedAt) return null;

    return { payload: typed, userId: typed.userId, role: typed.role };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/**
 * Read + verify the current request's session cookie. Returns null when
 * unauthenticated. Looks up the user record so callers always get a fresh
 * role + name (in case the user was promoted/demoted since the JWT issued).
 */
export async function getSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const verified = await verifySession(token);
  if (!verified) return null;

  const db = getDb();
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, verified.userId))
    .limit(1);

  if (rows.length === 0) return null;

  const u = rows[0];
  return {
    userId: u.id,
    email: u.email,
    role: u.role,
    name: u.name,
    jti: verified.payload.jti,
  };
}

/**
 * Revoke a session by jti. Used by /api/auth/logout. Idempotent.
 */
export async function revokeSession(jti: string) {
  const db = getDb();
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(eq(sessions.jti, jti));
}

/**
 * Look up a user by email (case-insensitive). Returns null if not found.
 */
export async function findUserByEmail(email: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);

  if (rows.length > 0) return rows[0];

  // Fallback: case-insensitive match (since email column doesn't enforce lowercase)
  const allRows = await db.select().from(users);
  return (
    allRows.find(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase(),
    ) ?? null
  );
}
