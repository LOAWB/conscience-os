import { eq } from "drizzle-orm";
import { getDb, projects } from "@repo/db";
import { requireRole } from "@/lib/role-guard";
import { HttpError, handleError, json, readJson } from "@/lib/http";
import {
  projectIdParam,
  updateDeliverablesSchema,
} from "@/lib/validators/projects";

type RouteCtx = { params: Promise<{ id: string }> };

export const PATCH = requireRole(
  ["owner", "operator"],
  async (req, ctx: RouteCtx & { session: unknown }) => {
    try {
      const { id } = projectIdParam.parse(await ctx.params);
      const input = updateDeliverablesSchema.parse(await readJson(req));
      const db = getDb();
      const [row] = await db
        .update(projects)
        .set({
          deliverables: input.deliverables,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, id))
        .returning();
      if (!row) throw new HttpError(404, "Project not found");
      return json({ item: row });
    } catch (err) {
      return handleError(err);
    }
  },
);
