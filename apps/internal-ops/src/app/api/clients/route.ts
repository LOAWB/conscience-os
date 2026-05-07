import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb, clients, clientStatusEnum } from "@repo/db";
import type { ClientStatus } from "@repo/db";
import { requireRole } from "@/lib/role-guard";
import { HttpError, handleError, json, readJson } from "@/lib/http";
import { createClientSchema } from "@/lib/validators/clients";
import { parseListQuery } from "@/lib/validators/list-query";

const SORT_MAP = {
  newest: desc(clients.createdAt),
  oldest: asc(clients.createdAt),
  name: asc(clients.businessName),
  contact: asc(clients.contactName),
} as const;

const STATUS_VALUES = clientStatusEnum.enumValues;
function isClientStatus(s: string): s is ClientStatus {
  return (STATUS_VALUES as readonly string[]).includes(s);
}

export const GET = requireRole(["owner", "operator"], async (req) => {
  try {
    const url = new URL(req.url);
    const q = parseListQuery(url);
    const db = getDb();

    const filters = [];
    if (q.status) {
      if (!isClientStatus(q.status)) {
        throw new HttpError(422, `Invalid client status filter: ${q.status}`);
      }
      filters.push(eq(clients.status, q.status));
    }
    if (q.search) {
      const term = `%${q.search}%`;
      filters.push(
        or(
          ilike(clients.businessName, term),
          ilike(clients.contactName, term),
          ilike(clients.email, term),
        ),
      );
    }
    const where = filters.length ? and(...filters) : undefined;
    const orderBy =
      SORT_MAP[(q.sort ?? "name") as keyof typeof SORT_MAP] ?? SORT_MAP.name;

    const [items, totalRow] = await Promise.all([
      db
        .select()
        .from(clients)
        .where(where)
        .orderBy(orderBy)
        .limit(q.limit)
        .offset(q.offset),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(clients)
        .where(where),
    ]);

    return json({ items, total: totalRow[0]?.n ?? 0 });
  } catch (err) {
    return handleError(err);
  }
});

export const POST = requireRole(["owner", "operator"], async (req) => {
  try {
    const input = createClientSchema.parse(await readJson(req));
    const db = getDb();
    const [row] = await db
      .insert(clients)
      .values({
        businessName: input.businessName,
        contactName: input.contactName,
        email: input.email ?? null,
        phone: input.phone ?? null,
        status: input.status,
        notes: input.notes ?? null,
        importantLinks: input.importantLinks,
      })
      .returning();
    return json({ item: row }, 201);
  } catch (err) {
    return handleError(err);
  }
});

export const dynamic = "force-dynamic";
