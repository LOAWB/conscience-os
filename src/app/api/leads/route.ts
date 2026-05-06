import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb, isDbConnected } from "@/db";
import { leads } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET() {
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

  const db = getDb();
  const rows = await db
    .select()
    .from(leads)
    .orderBy(desc(leads.createdAt))
    .limit(500);

  return NextResponse.json({ leads: rows });
}
