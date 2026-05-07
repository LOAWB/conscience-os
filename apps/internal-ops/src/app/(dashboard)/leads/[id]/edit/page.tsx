import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, leads } from "@repo/db";
import { PageHeader } from "@repo/ui";
import { LeadForm } from "../../_form";
import { leadBusinessName } from "@/lib/leads-helpers";

export const dynamic = "force-dynamic";

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();
  const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  if (!lead) notFound();

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow="leads · edit"
        title={lead.name}
        description={leadBusinessName(lead)}
      />
      <div className="mt-8">
        <LeadForm mode="edit" initial={lead} />
      </div>
    </div>
  );
}
