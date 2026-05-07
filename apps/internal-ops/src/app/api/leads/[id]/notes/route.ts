import { desc, eq } from "drizzle-orm";
import { getDb, leadNotes, leads } from "@repo/db";
import { requireRole } from "@/lib/role-guard";
import { HttpError, handleError, json, readJson } from "@/lib/http";
import { createLeadNoteSchema, leadIdParam } from "@/lib/validators/leads";

type RouteCtx = { params: Promise<{ id: string }> };

export const GET = requireRole(
  ["owner", "operator"],
  async (_req, ctx: RouteCtx & { session: unknown }) => {
    try {
      const { id } = leadIdParam.parse(await ctx.params);
      const db = getDb();
      const items = await db
        .select()
        .from(leadNotes)
        .where(eq(leadNotes.leadId, id))
        .orderBy(desc(leadNotes.createdAt));
      return json({ items, total: items.length });
    } catch (err) {
      return handleError(err);
    }
  },
);

export const POST = requireRole(
  ["owner", "operator"],
  async (
    req,
    ctx: RouteCtx & { session: { name: string | null; email: string } },
  ) => {
    try {
      const { id } = leadIdParam.parse(await ctx.params);
      const input = createLeadNoteSchema.parse(await readJson(req));
      const db = getDb();

      const [parent] = await db
        .select({ id: leads.id })
        .from(leads)
        .where(eq(leads.id, id))
        .limit(1);
      if (!parent) throw new HttpError(404, "Lead not found");

      const author =
        input.author === "Operator"
          ? ctx.session.name || ctx.session.email
          : input.author;

      const [row] = await db
        .insert(leadNotes)
        .values({ leadId: id, body: input.body, author })
        .returning();
      return json({ item: row }, 201);
    } catch (err) {
      return handleError(err);
    }
  },
);
