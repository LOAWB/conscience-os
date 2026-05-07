import { eq } from "drizzle-orm";
import { getDb, projects } from "@repo/db";
import { requireRole } from "@/lib/role-guard";
import { HttpError, handleError, json, readJson } from "@/lib/http";
import { projectIdParam, updateProjectSchema } from "@/lib/validators/projects";

type RouteCtx = { params: Promise<{ id: string }> };

export const GET = requireRole(
  ["owner", "operator"],
  async (_req, ctx: RouteCtx & { session: unknown }) => {
    try {
      const { id } = projectIdParam.parse(await ctx.params);
      const db = getDb();
      const [row] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id))
        .limit(1);
      if (!row) throw new HttpError(404, "Project not found");
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
      const { id } = projectIdParam.parse(await ctx.params);
      const input = updateProjectSchema.parse(await readJson(req));
      const db = getDb();

      const patch: Record<string, unknown> = { updatedAt: new Date() };
      if (input.clientId !== undefined) patch.clientId = input.clientId;
      if (input.name !== undefined) patch.name = input.name;
      if (input.description !== undefined)
        patch.description = input.description;
      if (input.status !== undefined) patch.status = input.status;
      if (input.dueDate !== undefined) {
        patch.dueDate = input.dueDate ? new Date(input.dueDate) : null;
      }
      if (input.deliverables !== undefined)
        patch.deliverables = input.deliverables;
      if (input.internalNotes !== undefined)
        patch.internalNotes = input.internalNotes;

      const [row] = await db
        .update(projects)
        .set(patch)
        .where(eq(projects.id, id))
        .returning();
      if (!row) throw new HttpError(404, "Project not found");
      return json({ item: row });
    } catch (err) {
      return handleError(err);
    }
  },
);

export const DELETE = requireRole(
  ["owner"],
  async (_req, ctx: RouteCtx & { session: unknown }) => {
    try {
      const { id } = projectIdParam.parse(await ctx.params);
      const db = getDb();
      const [row] = await db
        .delete(projects)
        .where(eq(projects.id, id))
        .returning();
      if (!row) throw new HttpError(404, "Project not found");
      return new Response(null, { status: 204 });
    } catch (err) {
      return handleError(err);
    }
  },
);
