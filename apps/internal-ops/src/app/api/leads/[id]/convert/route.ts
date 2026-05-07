import { eq } from "drizzle-orm";
import { getDb, leads, clients } from "@repo/db";
import { requireRole } from "@/lib/role-guard";
import { HttpError, handleError, json } from "@/lib/http";
import { leadIdParam } from "@/lib/validators/leads";

type RouteCtx = { params: Promise<{ id: string }> };

// F8: lead → client conversion. Atomic transaction with row-lock on the lead
// so two concurrent convert clicks cannot create duplicate clients.
//   1. SELECT ... FOR UPDATE the lead row inside the transaction
//   2. Throw 422 if `converted_client_id` is already set (idempotent — caller
//      gets the existing clientId back to navigate to)
//   3. Insert client copying name/business/email/phone from the lead
//   4. Update lead with converted_client_id + status='won'
//   5. Commit
export const POST = requireRole(
  ["owner", "operator"],
  async (_req, ctx: RouteCtx & { session: unknown }) => {
    try {
      const { id } = leadIdParam.parse(await ctx.params);
      const db = getDb();

      const result = await db.transaction(async (tx) => {
        const [lead] = await tx
          .select()
          .from(leads)
          .where(eq(leads.id, id))
          .for("update")
          .limit(1);

        if (!lead) throw new HttpError(404, "Lead not found");

        if (lead.convertedClientId) {
          throw new HttpError(422, "Lead already converted", {
            clientId: lead.convertedClientId,
          });
        }

        const businessName = lead.businessName ?? lead.business;
        const [client] = await tx
          .insert(clients)
          .values({
            businessName,
            contactName: lead.name,
            email: lead.email,
            phone: lead.phone ?? null,
            status: "active",
            notes: lead.notes ?? null,
          })
          .returning();

        const [updated] = await tx
          .update(leads)
          .set({
            status: "won",
            convertedClientId: client.id,
            updatedAt: new Date(),
          })
          .where(eq(leads.id, id))
          .returning();

        return { client, lead: updated };
      });

      return json(
        {
          client: result.client,
          lead: result.lead,
          redirectTo: `/clients/${result.client.id}`,
        },
        201,
      );
    } catch (err) {
      return handleError(err);
    }
  },
);
