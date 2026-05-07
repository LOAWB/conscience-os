import { eq } from "drizzle-orm";
import { getDb, tasks } from "@repo/db";
import { requireRole } from "@/lib/role-guard";
import { HttpError, handleError, json, readJson } from "@/lib/http";
import { taskIdParam, updateTaskSchema } from "@/lib/validators/tasks";

type RouteCtx = { params: Promise<{ id: string }> };

export const GET = requireRole(
  ["owner", "operator"],
  async (_req, ctx: RouteCtx & { session: unknown }) => {
    try {
      const { id } = taskIdParam.parse(await ctx.params);
      const db = getDb();
      const [row] = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, id))
        .limit(1);
      if (!row) throw new HttpError(404, "Task not found");
      return json({ item: row });
    } catch (err) {
      return handleError(err);
    }
  },
);

export const PATCH = requireRole(
  ["owner", "operator"],
  async (req, ctx: RouteCtx & { session: unknown }) => {
    try {
      const { id } = taskIdParam.parse(await ctx.params);
      const input = updateTaskSchema.parse(await readJson(req));
      const db = getDb();

      const patch: Record<string, unknown> = { updatedAt: new Date() };
      if (input.title !== undefined) patch.title = input.title;
      if (input.description !== undefined)
        patch.description = input.description;
      if (input.status !== undefined) patch.status = input.status;
      if (input.priority !== undefined) patch.priority = input.priority;
      if (input.dueDate !== undefined) {
        patch.dueDate = input.dueDate ? new Date(input.dueDate) : null;
      }
      if (input.clientId !== undefined) patch.clientId = input.clientId;
      if (input.projectId !== undefined) patch.projectId = input.projectId;
      if (input.leadId !== undefined) patch.leadId = input.leadId;

      const [row] = await db
        .update(tasks)
        .set(patch)
        .where(eq(tasks.id, id))
        .returning();
      if (!row) throw new HttpError(404, "Task not found");
      return json({ item: row });
    } catch (err) {
      return handleError(err);
    }
  },
);

export const DELETE = requireRole(
  ["owner", "operator"],
  async (_req, ctx: RouteCtx & { session: unknown }) => {
    try {
      const { id } = taskIdParam.parse(await ctx.params);
      const db = getDb();
      const [row] = await db.delete(tasks).where(eq(tasks.id, id)).returning();
      if (!row) throw new HttpError(404, "Task not found");
      return new Response(null, { status: 204 });
    } catch (err) {
      return handleError(err);
    }
  },
);
