import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb, tasks, taskStatusEnum, taskPriorityEnum } from "@repo/db";
import type { TaskPriority, TaskStatus } from "@repo/db";
import { requireRole } from "@/lib/role-guard";
import { HttpError, handleError, json, readJson } from "@/lib/http";
import { createTaskSchema } from "@/lib/validators/tasks";
import { parseListQuery } from "@/lib/validators/list-query";

const SORT_MAP = {
  newest: desc(tasks.createdAt),
  oldest: asc(tasks.createdAt),
  due_date: asc(tasks.dueDate),
  priority: asc(tasks.priority),
  title: asc(tasks.title),
} as const;

const STATUS_VALUES = taskStatusEnum.enumValues as readonly string[];
const PRIORITY_VALUES = taskPriorityEnum.enumValues as readonly string[];
const isStatus = (s: string): s is TaskStatus => STATUS_VALUES.includes(s);
const isPriority = (s: string): s is TaskPriority =>
  PRIORITY_VALUES.includes(s);
const uuid = z.uuid();

export const GET = requireRole(["owner", "operator"], async (req) => {
  try {
    const url = new URL(req.url);
    const q = parseListQuery(url);
    const priorityRaw = url.searchParams.get("priority");
    const clientIdRaw = url.searchParams.get("clientId");
    const projectIdRaw = url.searchParams.get("projectId");
    const leadIdRaw = url.searchParams.get("leadId");
    const db = getDb();

    const filters = [];
    if (q.status) {
      if (!isStatus(q.status)) {
        throw new HttpError(422, `Invalid task status filter: ${q.status}`);
      }
      filters.push(eq(tasks.status, q.status));
    }
    if (priorityRaw) {
      if (!isPriority(priorityRaw)) {
        throw new HttpError(
          422,
          `Invalid task priority filter: ${priorityRaw}`,
        );
      }
      filters.push(eq(tasks.priority, priorityRaw));
    }
    for (const [val, col] of [
      [clientIdRaw, tasks.clientId],
      [projectIdRaw, tasks.projectId],
      [leadIdRaw, tasks.leadId],
    ] as const) {
      if (val) {
        const parsed = uuid.safeParse(val);
        if (!parsed.success) {
          throw new HttpError(422, "Invalid uuid filter param");
        }
        filters.push(eq(col, parsed.data));
      }
    }
    if (q.search) {
      const term = `%${q.search}%`;
      filters.push(
        or(ilike(tasks.title, term), ilike(tasks.description, term)),
      );
    }
    const where = filters.length ? and(...filters) : undefined;
    const orderBy =
      SORT_MAP[(q.sort ?? "due_date") as keyof typeof SORT_MAP] ??
      SORT_MAP.due_date;

    const [items, totalRow] = await Promise.all([
      db
        .select()
        .from(tasks)
        .where(where)
        .orderBy(orderBy)
        .limit(q.limit)
        .offset(q.offset),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(tasks)
        .where(where),
    ]);

    return json({ items, total: totalRow[0]?.n ?? 0 });
  } catch (err) {
    return handleError(err);
  }
});

export const POST = requireRole(["owner", "operator"], async (req) => {
  try {
    const input = createTaskSchema.parse(await readJson(req));
    const db = getDb();
    const [row] = await db
      .insert(tasks)
      .values({
        title: input.title,
        description: input.description ?? null,
        status: input.status,
        priority: input.priority,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        clientId: input.clientId ?? null,
        projectId: input.projectId ?? null,
        leadId: input.leadId ?? null,
      })
      .returning();
    return json({ item: row }, 201);
  } catch (err) {
    return handleError(err);
  }
});

export const dynamic = "force-dynamic";
