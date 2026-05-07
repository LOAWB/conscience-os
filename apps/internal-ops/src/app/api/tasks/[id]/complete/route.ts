import { eq } from "drizzle-orm";
import { getDb, tasks } from "@repo/db";
import { requireRole } from "@/lib/role-guard";
import { HttpError, handleError, json } from "@/lib/http";
import { taskIdParam } from "@/lib/validators/tasks";

type RouteCtx = { params: Promise<{ id: string }> };

// Quick-complete from list view: sets status='done' without requiring a body.
// Idempotent — completing an already-done task returns the unchanged row.
export const POST = requireRole(
  ["owner", "operator"],
  async (_req, ctx: RouteCtx & { session: unknown }) => {
    try {
      const { id } = taskIdParam.parse(await ctx.params);
      const db = getDb();
      const [row] = await db
        .update(tasks)
        .set({ status: "done", updatedAt: new Date() })
        .where(eq(tasks.id, id))
        .returning();
      if (!row) throw new HttpError(404, "Task not found");
      return json({ item: row });
    } catch (err) {
      return handleError(err);
    }
  },
);
