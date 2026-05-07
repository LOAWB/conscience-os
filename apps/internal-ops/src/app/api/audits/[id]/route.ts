import { eq } from "drizzle-orm";
import { getDb, audits } from "@repo/db";
import { requireRole } from "@/lib/role-guard";
import { HttpError, handleError, json, readJson } from "@/lib/http";
import { auditIdParam, updateAuditSchema } from "@/lib/validators/audits";

type RouteCtx = { params: Promise<{ id: string }> };

export const GET = requireRole(
  ["owner", "operator"],
  async (_req, ctx: RouteCtx & { session: unknown }) => {
    try {
      const { id } = auditIdParam.parse(await ctx.params);
      const db = getDb();
      const [row] = await db
        .select()
        .from(audits)
        .where(eq(audits.id, id))
        .limit(1);
      if (!row) throw new HttpError(404, "Audit not found");
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
      const { id } = auditIdParam.parse(await ctx.params);
      const input = updateAuditSchema.parse(await readJson(req));
      const db = getDb();

      const patch: Record<string, unknown> = { updatedAt: new Date() };
      if (input.businessOverview !== undefined)
        patch.businessOverview = input.businessOverview;
      if (input.currentTools !== undefined)
        patch.currentTools = input.currentTools;
      if (input.painPoints !== undefined) patch.painPoints = input.painPoints;
      if (input.opportunities !== undefined)
        patch.opportunities = input.opportunities;
      if (input.recommendedSystems !== undefined)
        patch.recommendedSystems = input.recommendedSystems;
      if (input.nextSteps !== undefined) patch.nextSteps = input.nextSteps;

      const [row] = await db
        .update(audits)
        .set(patch)
        .where(eq(audits.id, id))
        .returning();
      if (!row) throw new HttpError(404, "Audit not found");
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
      const { id } = auditIdParam.parse(await ctx.params);
      const db = getDb();
      const [row] = await db
        .delete(audits)
        .where(eq(audits.id, id))
        .returning();
      if (!row) throw new HttpError(404, "Audit not found");
      return new Response(null, { status: 204 });
    } catch (err) {
      return handleError(err);
    }
  },
);
