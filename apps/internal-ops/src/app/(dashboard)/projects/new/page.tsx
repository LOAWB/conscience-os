import { asc } from "drizzle-orm";
import { getDb, clients } from "@repo/db";
import { PageHeader } from "@repo/ui";
import { ProjectForm } from "../_form";

export const dynamic = "force-dynamic";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const { clientId } = await searchParams;
  const db = getDb();
  const allClients = await db
    .select({ id: clients.id, businessName: clients.businessName })
    .from(clients)
    .orderBy(asc(clients.businessName));

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow="projects · new"
        title="New project"
        description="Each project rolls into a client. Track deliverables, link tasks, and progress through delivery states."
      />
      <div className="mt-8">
        <ProjectForm
          mode="create"
          defaultClientId={clientId}
          clientOptions={allClients.map((c) => ({
            value: c.id,
            label: c.businessName,
          }))}
        />
      </div>
    </div>
  );
}
