import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { audits, getDb } from "@repo/db";
import { PageHeader } from "@repo/ui";
import { AuditForm } from "../../_form";

export const dynamic = "force-dynamic";

export default async function EditAuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();
  const [audit] = await db
    .select()
    .from(audits)
    .where(eq(audits.id, id))
    .limit(1);
  if (!audit) notFound();

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader eyebrow="audit · edit" title="Edit audit" />
      <div className="mt-8">
        <AuditForm
          mode="edit"
          initial={audit}
          leadOptions={[]}
          clientOptions={[]}
        />
      </div>
    </div>
  );
}
