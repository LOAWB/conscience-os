import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb, isDbConnected } from "@/db";
import { leads, statusEnum, tierEnum } from "@/db/schema";
import { getSession } from "@/lib/auth";

const patchSchema = z
  .object({
    status: z.enum(statusEnum.enumValues).optional(),
    tier: z.enum(tierEnum.enumValues).optional(),
    nextAction: z.string().max(500).nullable().optional(),
    nextActionAt: z.string().nullable().optional(),
  })
  .strict();

async function requireAuth() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConnected()) {
    return NextResponse.json(
      { error: "Database not connected" },
      { status: 503 },
    );
  }
  const { id } = await ctx.params;
  const db = getDb();
  const rows = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ lead: rows[0] });
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConnected()) {
    return NextResponse.json(
      { error: "Database not connected" },
      { status: 503 },
    );
  }

  const { id } = await ctx.params;
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;
  if (parsed.data.tier !== undefined) updates.tier = parsed.data.tier;
  if (parsed.data.nextAction !== undefined)
    updates.nextAction = parsed.data.nextAction;
  if (parsed.data.nextActionAt !== undefined) {
    updates.nextActionAt = parsed.data.nextActionAt
      ? new Date(parsed.data.nextActionAt)
      : null;
  }

  const db = getDb();
  const updated = await db
    .update(leads)
    .set(updates)
    .where(eq(leads.id, id))
    .returning();
  if (updated.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ lead: updated[0] });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConnected()) {
    return NextResponse.json(
      { error: "Database not connected" },
      { status: 503 },
    );
  }
  const { id } = await ctx.params;
  const db = getDb();
  await db.delete(leads).where(eq(leads.id, id));
  return NextResponse.json({ ok: true });
}
