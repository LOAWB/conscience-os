import { eq } from "drizzle-orm";
import { getDb, audits, leads, clients } from "@repo/db";
import { requireRole } from "@/lib/role-guard";
import { HttpError, handleError } from "@/lib/http";
import { auditIdParam } from "@/lib/validators/audits";
import {
  renderAuditMarkdown,
  type AuditExportSubject,
} from "@/lib/exporters/audit-markdown";

type RouteCtx = { params: Promise<{ id: string }> };

export const GET = requireRole(
  ["owner", "operator"],
  async (_req, ctx: RouteCtx & { session: unknown }) => {
    try {
      const { id } = auditIdParam.parse(await ctx.params);
      const db = getDb();

      const [audit] = await db
        .select()
        .from(audits)
        .where(eq(audits.id, id))
        .limit(1);
      if (!audit) throw new HttpError(404, "Audit not found");

      let subject: AuditExportSubject = { kind: "orphan" };
      if (audit.leadId) {
        const [lead] = await db
          .select()
          .from(leads)
          .where(eq(leads.id, audit.leadId))
          .limit(1);
        if (lead) subject = { kind: "lead", lead };
      } else if (audit.clientId) {
        const [client] = await db
          .select()
          .from(clients)
          .where(eq(clients.id, audit.clientId))
          .limit(1);
        if (client) subject = { kind: "client", client };
      }

      const md = renderAuditMarkdown(audit, subject);
      const filename = `audit-${audit.id.slice(0, 8)}-${audit.createdAt
        .toISOString()
        .slice(0, 10)}.md`;

      return new Response(md, {
        status: 200,
        headers: {
          "content-type": "text/markdown; charset=utf-8",
          "content-disposition": `attachment; filename="${filename}"`,
          "cache-control": "private, no-store",
        },
      });
    } catch (err) {
      return handleError(err);
    }
  },
);
