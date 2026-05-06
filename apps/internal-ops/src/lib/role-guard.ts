/**
 * Role-based handler guard. Wraps a route handler and short-circuits
 * with 401 (no session) or 403 (wrong role) when authorization fails.
 *
 * Usage:
 *   export const GET = requireRole(['owner','operator'], async (req, ctx) => { ... });
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./auth";
import type { UserRole } from "@repo/db";

type SessionContext = NonNullable<Awaited<ReturnType<typeof getSession>>>;

export type AuthedHandler<TParams = unknown> = (
  req: NextRequest,
  ctx: { params: Promise<TParams>; session: SessionContext },
) => Promise<Response> | Response;

export function requireRole<TParams = unknown>(
  allowedRoles: readonly UserRole[],
  handler: AuthedHandler<TParams>,
) {
  return async (req: NextRequest, ctx: { params: Promise<TParams> }) => {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!allowedRoles.includes(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return handler(req, { params: ctx.params, session });
  };
}
