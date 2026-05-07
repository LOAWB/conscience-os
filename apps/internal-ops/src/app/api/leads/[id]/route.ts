import { eq } from "drizzle-orm";
import { getDb, leads } from "@repo/db";
import { requireRole } from "@/lib/role-guard";
import { HttpError, handleError, json, readJson } from "@/lib/http";
import { leadIdParam, updateLeadSchema } from "@/lib/validators/leads";

type RouteCtx = { params: Promise<{ id: string }> };

export const GET = requireRole(
  ["owner", "operator"],
  async (_req, ctx: RouteCtx & { session: unknown }) => {
    try {
      const { id } = leadIdParam.parse(await ctx.params);
      const db = getDb();
      const [row] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, id))
        .limit(1);
      if (!row) throw new HttpError(404, "Lead not found");
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
      const { id } = leadIdParam.parse(await ctx.params);
      const input = updateLeadSchema.parse(await readJson(req));
      const db = getDb();

      const patch: Record<string, unknown> = {
        updatedAt: new Date(),
      };
      if (input.name !== undefined) patch.name = input.name;
      if (input.email !== undefined) patch.email = input.email;
      // F4: any update to businessName mirrors to legacy business.
      if (input.businessName !== undefined) {
        patch.business = input.businessName;
        patch.businessName = input.businessName;
      }
      if (input.phone !== undefined) patch.phone = input.phone;
      if (input.businessType !== undefined)
        patch.businessType = input.businessType;
      if (input.problems !== undefined) patch.problems = input.problems;
      if (input.tools !== undefined) patch.tools = input.tools;
      if (input.outcome !== undefined) patch.outcome = input.outcome;
      if (input.tier !== undefined) patch.tier = input.tier;
      if (input.status !== undefined) patch.status = input.status;
      if (input.source !== undefined) patch.source = input.source;
      if (input.notes !== undefined) patch.notes = input.notes;
      if (input.nextFollowUpAt !== undefined) {
        patch.nextFollowUpAt = input.nextFollowUpAt
          ? new Date(input.nextFollowUpAt)
          : null;
      }

      const [row] = await db
        .update(leads)
        .set(patch)
        .where(eq(leads.id, id))
        .returning();
      if (!row) throw new HttpError(404, "Lead not found");
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
      const { id } = leadIdParam.parse(await ctx.params);
      const db = getDb();
      const [row] = await db.delete(leads).where(eq(leads.id, id)).returning();
      if (!row) throw new HttpError(404, "Lead not found");
      return new Response(null, { status: 204 });
    } catch (err) {
      return handleError(err);
    }
  },
);
