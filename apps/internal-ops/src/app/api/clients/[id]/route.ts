import { eq } from "drizzle-orm";
import { getDb, clients } from "@repo/db";
import { requireRole } from "@/lib/role-guard";
import { HttpError, handleError, json, readJson } from "@/lib/http";
import { clientIdParam, updateClientSchema } from "@/lib/validators/clients";

type RouteCtx = { params: Promise<{ id: string }> };

export const GET = requireRole(
  ["owner", "operator"],
  async (_req, ctx: RouteCtx & { session: unknown }) => {
    try {
      const { id } = clientIdParam.parse(await ctx.params);
      const db = getDb();
      const [row] = await db
        .select()
        .from(clients)
        .where(eq(clients.id, id))
        .limit(1);
      if (!row) throw new HttpError(404, "Client not found");
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
      const { id } = clientIdParam.parse(await ctx.params);
      const input = updateClientSchema.parse(await readJson(req));
      const db = getDb();

      const patch: Record<string, unknown> = { updatedAt: new Date() };
      if (input.businessName !== undefined)
        patch.businessName = input.businessName;
      if (input.contactName !== undefined)
        patch.contactName = input.contactName;
      if (input.email !== undefined) patch.email = input.email;
      if (input.phone !== undefined) patch.phone = input.phone;
      if (input.status !== undefined) patch.status = input.status;
      if (input.notes !== undefined) patch.notes = input.notes;
      if (input.importantLinks !== undefined)
        patch.importantLinks = input.importantLinks;

      const [row] = await db
        .update(clients)
        .set(patch)
        .where(eq(clients.id, id))
        .returning();
      if (!row) throw new HttpError(404, "Client not found");
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
      const { id } = clientIdParam.parse(await ctx.params);
      const db = getDb();
      const [row] = await db
        .delete(clients)
        .where(eq(clients.id, id))
        .returning();
      if (!row) throw new HttpError(404, "Client not found");
      return new Response(null, { status: 204 });
    } catch (err) {
      return handleError(err);
    }
  },
);
