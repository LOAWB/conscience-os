import { and, asc, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb, audits } from "@repo/db";
import { requireRole } from "@/lib/role-guard";
import { HttpError, handleError, json, readJson } from "@/lib/http";
import { createAuditSchema } from "@/lib/validators/audits";
import { parseListQuery } from "@/lib/validators/list-query";

const SORT_MAP = {
  newest: desc(audits.createdAt),
  oldest: asc(audits.createdAt),
} as const;

const uuid = z.uuid();

export const GET = requireRole(["owner", "operator"], async (req) => {
  try {
    const url = new URL(req.url);
    const q = parseListQuery(url);
    const leadIdRaw = url.searchParams.get("leadId");
    const clientIdRaw = url.searchParams.get("clientId");
    const db = getDb();

    const filters = [];
    if (leadIdRaw) {
      const parsed = uuid.safeParse(leadIdRaw);
      if (!parsed.success) throw new HttpError(422, "Invalid leadId");
      filters.push(eq(audits.leadId, parsed.data));
    }
    if (clientIdRaw) {
      const parsed = uuid.safeParse(clientIdRaw);
      if (!parsed.success) throw new HttpError(422, "Invalid clientId");
      filters.push(eq(audits.clientId, parsed.data));
    }
    const where = filters.length ? and(...filters) : undefined;
    const orderBy =
      SORT_MAP[(q.sort ?? "newest") as keyof typeof SORT_MAP] ??
      SORT_MAP.newest;

    const [items, totalRow] = await Promise.all([
      db
        .select()
        .from(audits)
        .where(where)
        .orderBy(orderBy)
        .limit(q.limit)
        .offset(q.offset),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(audits)
        .where(where),
    ]);

    return json({ items, total: totalRow[0]?.n ?? 0 });
  } catch (err) {
    return handleError(err);
  }
});

export const POST = requireRole(["owner", "operator"], async (req) => {
  try {
    const input = createAuditSchema.parse(await readJson(req));
    const db = getDb();
    const [row] = await db
      .insert(audits)
      .values({
        leadId: input.leadId ?? null,
        clientId: input.clientId ?? null,
        businessOverview: input.businessOverview ?? null,
        currentTools: input.currentTools ?? null,
        painPoints: input.painPoints ?? null,
        opportunities: input.opportunities ?? null,
        recommendedSystems: input.recommendedSystems ?? null,
        nextSteps: input.nextSteps ?? null,
      })
      .returning();
    return json({ item: row }, 201);
  } catch (err) {
    return handleError(err);
  }
});

export const dynamic = "force-dynamic";
