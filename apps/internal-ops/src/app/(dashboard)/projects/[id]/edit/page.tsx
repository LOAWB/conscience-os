import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { getDb, clients, projects } from "@repo/db";
import { PageHeader } from "@repo/ui";
import { ProjectForm } from "../../_form";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  if (!project) notFound();
  const allClients = await db
    .select({ id: clients.id, businessName: clients.businessName })
    .from(clients)
    .orderBy(asc(clients.businessName));

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader eyebrow="projects · edit" title={project.name} />
      <div className="mt-8">
        <ProjectForm
          mode="edit"
          initial={project}
          clientOptions={allClients.map((c) => ({
            value: c.id,
            label: c.businessName,
          }))}
        />
      </div>
    </div>
  );
}
