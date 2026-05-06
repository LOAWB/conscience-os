import { NextResponse } from "next/server";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { getDb, isDbConnected } from "@/db";
import { leadNotes, leads } from "@/db/schema";
import { getSession } from "@/lib/auth";

const postSchema = z.object({
  body: z.string().min(1).max(4000),
});

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
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
  const rows = await db
    .select()
    .from(leadNotes)
    .where(eq(leadNotes.leadId, id))
    .orderBy(desc(leadNotes.createdAt));
  return NextResponse.json({ notes: rows });
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
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
  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const db = getDb();
  // Verify lead exists
  const lead = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  if (lead.length === 0) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const inserted = await db
    .insert(leadNotes)
    .values({
      leadId: id,
      body: parsed.data.body,
      author: session.email,
    })
    .returning();

  return NextResponse.json({ note: inserted[0] }, { status: 201 });
}
