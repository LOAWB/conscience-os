import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb, projects, projectStatusEnum } from "@repo/db";
import type { ProjectStatus } from "@repo/db";
import { requireRole } from "@/lib/role-guard";
import { HttpError, handleError, json, readJson } from "@/lib/http";
import { createProjectSchema } from "@/lib/validators/projects";
import { parseListQuery } from "@/lib/validators/list-query";

const uuidSchema = z.uuid();

const SORT_MAP = {
  newest: desc(projects.createdAt),
  oldest: asc(projects.createdAt),
  due_date: asc(projects.dueDate),
  name: asc(projects.name),
} as const;

const STATUS_VALUES = projectStatusEnum.enumValues;
function isProjectStatus(s: string): s is ProjectStatus {
  return (STATUS_VALUES as readonly string[]).includes(s);
}

export const GET = requireRole(["owner", "operator"], async (req) => {
  try {
    const url = new URL(req.url);
    const q = parseListQuery(url);
    const clientId = url.searchParams.get("clientId");
    const db = getDb();

    const filters = [];
    if (q.status) {
      if (!isProjectStatus(q.status)) {
        throw new HttpError(422, `Invalid project status filter: ${q.status}`);
      }
      filters.push(eq(projects.status, q.status));
    }
    if (clientId) {
      const parsed = uuidSchema.safeParse(clientId);
      if (!parsed.success) {
        throw new HttpError(422, "Invalid clientId — must be a UUID");
      }
      filters.push(eq(projects.clientId, parsed.data));
    }
    if (q.search) {
      const term = `%${q.search}%`;
      filters.push(
        or(ilike(projects.name, term), ilike(projects.description, term)),
      );
    }
    const where = filters.length ? and(...filters) : undefined;
    const orderBy =
      SORT_MAP[(q.sort ?? "newest") as keyof typeof SORT_MAP] ??
      SORT_MAP.newest;

    const [items, totalRow] = await Promise.all([
      db
        .select()
        .from(projects)
        .where(where)
        .orderBy(orderBy)
        .limit(q.limit)
        .offset(q.offset),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(projects)
        .where(where),
    ]);

    return json({ items, total: totalRow[0]?.n ?? 0 });
  } catch (err) {
    return handleError(err);
  }
});

export const POST = requireRole(["owner", "operator"], async (req) => {
  try {
    const input = createProjectSchema.parse(await readJson(req));
    const db = getDb();
    const [row] = await db
      .insert(projects)
      .values({
        clientId: input.clientId,
        name: input.name,
        description: input.description ?? null,
        status: input.status,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        deliverables: input.deliverables,
        internalNotes: input.internalNotes ?? null,
      })
      .returning();
    return json({ item: row }, 201);
  } catch (err) {
    return handleError(err);
  }
});

export const dynamic = "force-dynamic";
