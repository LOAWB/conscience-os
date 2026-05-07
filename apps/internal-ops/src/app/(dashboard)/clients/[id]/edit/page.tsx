import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, clients } from "@repo/db";
import { PageHeader } from "@repo/ui";
import { ClientForm } from "../../_form";

export const dynamic = "force-dynamic";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();
  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, id))
    .limit(1);
  if (!client) notFound();

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow="clients · edit"
        title={client.businessName}
        description={client.contactName}
      />
      <div className="mt-8">
        <ClientForm mode="edit" initial={client} />
      </div>
    </div>
  );
}
