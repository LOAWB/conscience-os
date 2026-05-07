import { asc } from "drizzle-orm";
import { getDb, clients, leads } from "@repo/db";
import { PageHeader } from "@repo/ui";
import { AuditForm } from "../_form";

export const dynamic = "force-dynamic";

export default async function NewAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ leadId?: string; clientId?: string }>;
}) {
  const sp = await searchParams;
  const db = getDb();
  const [allLeads, allClients] = await Promise.all([
    db
      .select({
        id: leads.id,
        name: leads.name,
        businessName: leads.businessName,
      })
      .from(leads)
      .orderBy(asc(leads.name)),
    db
      .select({ id: clients.id, businessName: clients.businessName })
      .from(clients)
      .orderBy(asc(clients.businessName)),
  ]);

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow="audits · new"
        title="File a system audit"
        description="Structured capture. Each section seeds the proposal markdown export."
      />
      <div className="mt-8">
        <AuditForm
          mode="create"
          defaults={{ leadId: sp.leadId, clientId: sp.clientId }}
          leadOptions={allLeads.map((l) => ({
            value: l.id,
            label: `${l.name}${l.businessName ? ` — ${l.businessName}` : ""}`,
          }))}
          clientOptions={allClients.map((c) => ({
            value: c.id,
            label: c.businessName,
          }))}
        />
      </div>
    </div>
  );
}
