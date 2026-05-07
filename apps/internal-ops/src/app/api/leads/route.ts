import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb, leads, INTERNAL_OPS_LEAD_STATUSES, statusEnum } from "@repo/db";
import type { LeadStatus } from "@repo/db";
import { requireRole } from "@/lib/role-guard";
import { HttpError, handleError, json, readJson } from "@/lib/http";
import { createLeadSchema } from "@/lib/validators/leads";
import { parseListQuery } from "@/lib/validators/list-query";

const ALL_LEAD_STATUSES = statusEnum.enumValues as readonly string[];
function isLeadStatus(s: string): s is LeadStatus {
  return ALL_LEAD_STATUSES.includes(s);
}

const SORT_MAP = {
  newest: desc(leads.createdAt),
  oldest: asc(leads.createdAt),
  name: asc(leads.name),
  business: asc(leads.businessName),
  follow_up: asc(leads.nextFollowUpAt),
} as const;

export const GET = requireRole(["owner", "operator"], async (req) => {
  try {
    const url = new URL(req.url);
    const q = parseListQuery(url);
    const db = getDb();

    const filters = [];
    if (q.status) {
      // F7: read-side filter tolerates the full 12-value enum (legacy + canonical)
      // so existing data is filterable; writes are still constrained to the
      // 8-value canonical set by createLeadSchema/updateLeadSchema.
      if (!isLeadStatus(q.status)) {
        throw new HttpError(422, `Invalid lead status filter: ${q.status}`);
      }
      filters.push(eq(leads.status, q.status));
    }
    if (q.search) {
      const term = `%${q.search}%`;
      filters.push(
        or(
          ilike(leads.name, term),
          ilike(leads.businessName, term),
          ilike(leads.business, term),
          ilike(leads.email, term),
        ),
      );
    }
    const where = filters.length ? and(...filters) : undefined;
    const orderBy =
      SORT_MAP[(q.sort ?? "newest") as keyof typeof SORT_MAP] ??
      SORT_MAP.newest;

    const [items, totalRow] = await Promise.all([
      db
        .select()
        .from(leads)
        .where(where)
        .orderBy(orderBy)
        .limit(q.limit)
        .offset(q.offset),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(leads)
        .where(where),
    ]);

    return json({ items, total: totalRow[0]?.n ?? 0 });
  } catch (err) {
    return handleError(err);
  }
});

export const POST = requireRole(["owner", "operator"], async (req) => {
  try {
    const body = await readJson(req);
    const input = createLeadSchema.parse(body);
    const db = getDb();

    // F4: dual-write canonical `business_name` AND legacy `business` until
    // a future cleanup migration retires the legacy column. Both columns
    // get the same value at write time.
    const [row] = await db
      .insert(leads)
      .values({
        name: input.name,
        email: input.email,
        business: input.businessName,
        businessName: input.businessName,
        phone: input.phone ?? null,
        businessType: input.businessType,
        problems: input.problems,
        tools: input.tools,
        outcome: input.outcome,
        tier: input.tier,
        status: input.status,
        source: input.source,
        notes: input.notes ?? null,
        nextFollowUpAt: input.nextFollowUpAt
          ? new Date(input.nextFollowUpAt)
          : null,
      })
      .returning();

    return json({ item: row }, 201);
  } catch (err) {
    return handleError(err);
  }
});

export const dynamic = "force-dynamic";

// Re-export for callers that need the canonical write-set on the client.
export { INTERNAL_OPS_LEAD_STATUSES };
