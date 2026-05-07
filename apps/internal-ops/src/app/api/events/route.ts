import { and, asc, desc, eq, gte, ilike, lt, or, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb, events, eventTypeEnum } from "@repo/db";
import type { EventType } from "@repo/db";
import { requireRole } from "@/lib/role-guard";
import { HttpError, handleError, json, readJson } from "@/lib/http";
import { createEventSchema } from "@/lib/validators/events";
import { parseListQuery } from "@/lib/validators/list-query";

const SORT_MAP = {
  upcoming: asc(events.dateTime),
  recent: desc(events.dateTime),
  newest: desc(events.createdAt),
} as const;

const TYPE_VALUES = eventTypeEnum.enumValues as readonly string[];
const isType = (s: string): s is EventType => TYPE_VALUES.includes(s);
const uuid = z.uuid();
const isoDate = z.iso.datetime({ offset: true });

export const GET = requireRole(["owner", "operator"], async (req) => {
  try {
    const url = new URL(req.url);
    const q = parseListQuery(url);
    const typeRaw = url.searchParams.get("type");
    const fromRaw = url.searchParams.get("from");
    const toRaw = url.searchParams.get("to");
    const clientIdRaw = url.searchParams.get("clientId");
    const leadIdRaw = url.searchParams.get("leadId");
    const projectIdRaw = url.searchParams.get("projectId");
    const db = getDb();

    const filters = [];
    if (typeRaw) {
      if (!isType(typeRaw)) {
        throw new HttpError(422, `Invalid event type filter: ${typeRaw}`);
      }
      filters.push(eq(events.type, typeRaw));
    }
    if (fromRaw) {
      const parsed = isoDate.safeParse(fromRaw);
      if (!parsed.success) throw new HttpError(422, "Invalid 'from' datetime");
      filters.push(gte(events.dateTime, new Date(parsed.data)));
    }
    if (toRaw) {
      const parsed = isoDate.safeParse(toRaw);
      if (!parsed.success) throw new HttpError(422, "Invalid 'to' datetime");
      filters.push(lt(events.dateTime, new Date(parsed.data)));
    }
    for (const [val, col] of [
      [clientIdRaw, events.clientId],
      [leadIdRaw, events.leadId],
      [projectIdRaw, events.projectId],
    ] as const) {
      if (val) {
        const parsed = uuid.safeParse(val);
        if (!parsed.success)
          throw new HttpError(422, "Invalid uuid filter param");
        filters.push(eq(col, parsed.data));
      }
    }
    if (q.search) {
      const term = `%${q.search}%`;
      filters.push(or(ilike(events.title, term), ilike(events.notes, term)));
    }
    const where = filters.length ? and(...filters) : undefined;
    const orderBy =
      SORT_MAP[(q.sort ?? "upcoming") as keyof typeof SORT_MAP] ??
      SORT_MAP.upcoming;

    const [items, totalRow] = await Promise.all([
      db
        .select()
        .from(events)
        .where(where)
        .orderBy(orderBy)
        .limit(q.limit)
        .offset(q.offset),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(events)
        .where(where),
    ]);

    return json({ items, total: totalRow[0]?.n ?? 0 });
  } catch (err) {
    return handleError(err);
  }
});

export const POST = requireRole(["owner", "operator"], async (req) => {
  try {
    const input = createEventSchema.parse(await readJson(req));
    const db = getDb();
    const [row] = await db
      .insert(events)
      .values({
        title: input.title,
        type: input.type,
        dateTime: new Date(input.dateTime),
        durationMinutes: input.durationMinutes,
        clientId: input.clientId ?? null,
        leadId: input.leadId ?? null,
        projectId: input.projectId ?? null,
        notes: input.notes ?? null,
      })
      .returning();
    return json({ item: row }, 201);
  } catch (err) {
    return handleError(err);
  }
});

export const dynamic = "force-dynamic";
