import { eq } from "drizzle-orm";
import { events, getDb, leadNotes, leads, tasks } from "@repo/db";
import { requireRole } from "@/lib/role-guard";
import { HttpError, handleError, json, readJson } from "@/lib/http";
import { quickCaptureSchema } from "@/lib/validators/quick-capture";

// Tomorrow at 09:00 UTC default for blank dueAt — matches operator instinct
// "remind me first thing in the morning."
function defaultDueAt(now: Date = new Date()): Date {
  const d = new Date(now);
  d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCHours(9, 0, 0, 0);
  return d;
}

export const POST = requireRole(
  ["owner", "operator"],
  async (
    req,
    ctx: {
      params: Promise<unknown>;
      session: { name: string | null; email: string };
    },
  ) => {
    try {
      const input = quickCaptureSchema.parse(await readJson(req));
      const db = getDb();
      const due = input.dueAt ? new Date(input.dueAt) : defaultDueAt();

      if (input.intent === "task") {
        const link = input.linkTo ?? null;
        const [row] = await db
          .insert(tasks)
          .values({
            title: input.text,
            status: "to_do",
            priority: "medium",
            dueDate: due,
            clientId: link?.type === "client" ? link.id : null,
            projectId: link?.type === "project" ? link.id : null,
            leadId: link?.type === "lead" ? link.id : null,
          })
          .returning();
        return json(
          { ok: true, kind: "task", item: row, redirectTo: "/tasks" },
          201,
        );
      }

      if (input.intent === "event") {
        const link = input.linkTo ?? null;
        const [row] = await db
          .insert(events)
          .values({
            title: input.text,
            type: "follow_up",
            dateTime: due,
            durationMinutes: 30,
            clientId: link?.type === "client" ? link.id : null,
            projectId: link?.type === "project" ? link.id : null,
            leadId: link?.type === "lead" ? link.id : null,
          })
          .returning();
        return json(
          { ok: true, kind: "event", item: row, redirectTo: "/schedule" },
          201,
        );
      }

      // intent === 'lead-followup' — schema.refine guarantees linkTo.type='lead'
      const link = input.linkTo!;
      const result = await db.transaction(async (tx) => {
        const [parent] = await tx
          .select({ id: leads.id })
          .from(leads)
          .where(eq(leads.id, link.id))
          .limit(1);
        if (!parent) throw new HttpError(404, "Lead not found");

        const [updated] = await tx
          .update(leads)
          .set({ nextFollowUpAt: due, updatedAt: new Date() })
          .where(eq(leads.id, link.id))
          .returning();

        const [note] = await tx
          .insert(leadNotes)
          .values({
            leadId: link.id,
            body: input.text,
            author: ctx.session.name || ctx.session.email || "QuickCapture",
          })
          .returning();

        return { lead: updated, note };
      });

      return json(
        {
          ok: true,
          kind: "lead-followup",
          lead: result.lead,
          note: result.note,
          redirectTo: `/leads/${link.id}`,
        },
        201,
      );
    } catch (err) {
      return handleError(err);
    }
  },
);

export const dynamic = "force-dynamic";
