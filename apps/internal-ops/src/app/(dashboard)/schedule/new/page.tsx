import { asc } from "drizzle-orm";
import { getDb, clients, leads, projects } from "@repo/db";
import { PageHeader } from "@repo/ui";
import { EventForm } from "../_form";

export const dynamic = "force-dynamic";

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{
    clientId?: string;
    projectId?: string;
    leadId?: string;
  }>;
}) {
  const sp = await searchParams;
  const db = getDb();
  const [allClients, allProjects, allLeads] = await Promise.all([
    db
      .select({ id: clients.id, businessName: clients.businessName })
      .from(clients)
      .orderBy(asc(clients.businessName)),
    db
      .select({ id: projects.id, name: projects.name })
      .from(projects)
      .orderBy(asc(projects.name)),
    db
      .select({ id: leads.id, name: leads.name })
      .from(leads)
      .orderBy(asc(leads.name)),
  ]);

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow="schedule · new"
        title="Schedule event"
        description="Audit, call, deadline, or follow-up. Link to a lead, client, or project."
      />
      <div className="mt-8">
        <EventForm
          mode="create"
          defaults={{
            clientId: sp.clientId,
            projectId: sp.projectId,
            leadId: sp.leadId,
          }}
          clientOptions={allClients.map((c) => ({
            value: c.id,
            label: c.businessName,
          }))}
          projectOptions={allProjects.map((p) => ({
            value: p.id,
            label: p.name,
          }))}
          leadOptions={allLeads.map((l) => ({ value: l.id, label: l.name }))}
        />
      </div>
    </div>
  );
}
