import { eq } from "drizzle-orm";
import { getDb, events } from "@repo/db";
import { requireRole } from "@/lib/role-guard";
import { HttpError, handleError, json, readJson } from "@/lib/http";
import { eventIdParam, updateEventSchema } from "@/lib/validators/events";

type RouteCtx = { params: Promise<{ id: string }> };

export const GET = requireRole(
  ["owner", "operator"],
  async (_req, ctx: RouteCtx & { session: unknown }) => {
    try {
      const { id } = eventIdParam.parse(await ctx.params);
      const db = getDb();
      const [row] = await db
        .select()
        .from(events)
        .where(eq(events.id, id))
        .limit(1);
      if (!row) throw new HttpError(404, "Event not found");
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
      const { id } = eventIdParam.parse(await ctx.params);
      const input = updateEventSchema.parse(await readJson(req));
      const db = getDb();

      const patch: Record<string, unknown> = {};
      if (input.title !== undefined) patch.title = input.title;
      if (input.type !== undefined) patch.type = input.type;
      if (input.dateTime !== undefined)
        patch.dateTime = new Date(input.dateTime);
      if (input.durationMinutes !== undefined)
        patch.durationMinutes = input.durationMinutes;
      if (input.clientId !== undefined) patch.clientId = input.clientId;
      if (input.leadId !== undefined) patch.leadId = input.leadId;
      if (input.projectId !== undefined) patch.projectId = input.projectId;
      if (input.notes !== undefined) patch.notes = input.notes;

      const [row] = await db
        .update(events)
        .set(patch)
        .where(eq(events.id, id))
        .returning();
      if (!row) throw new HttpError(404, "Event not found");
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
      const { id } = eventIdParam.parse(await ctx.params);
      const db = getDb();
      const [row] = await db
        .delete(events)
        .where(eq(events.id, id))
        .returning();
      if (!row) throw new HttpError(404, "Event not found");
      return new Response(null, { status: 204 });
    } catch (err) {
      return handleError(err);
    }
  },
);
