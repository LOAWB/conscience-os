import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { getDb, clients, events, leads, projects } from "@repo/db";
import { PageHeader } from "@repo/ui";
import { EventForm } from "../../_form";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .limit(1);
  if (!event) notFound();
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
      <PageHeader eyebrow="schedule · edit" title={event.title} />
      <div className="mt-8">
        <EventForm
          mode="edit"
          initial={event}
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
