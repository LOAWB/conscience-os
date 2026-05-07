import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { audits, clients, getDb, leads } from "@repo/db";
import {
  ActionBar,
  DetailField,
  DetailPanel,
  GlassCard,
  LinkButton,
  PageHeader,
  SectionHeader,
} from "@repo/ui";
import { leadBusinessName } from "@/lib/leads-helpers";
import { ExportAuditButton } from "./_export-button";

export const dynamic = "force-dynamic";

export default async function AuditDetailPage({
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

  const [linkedLead, linkedClient] = await Promise.all([
    audit.leadId
      ? db.select().from(leads).where(eq(leads.id, audit.leadId)).limit(1)
      : Promise.resolve([] as never[]),
    audit.clientId
      ? db.select().from(clients).where(eq(clients.id, audit.clientId)).limit(1)
      : Promise.resolve([] as never[]),
  ]);

  const lead = linkedLead[0] ?? null;
  const client = linkedClient[0] ?? null;

  const subjectName = client
    ? client.businessName
    : lead
      ? leadBusinessName(lead)
      : "(unattached)";
  const subjectHref = client
    ? `/clients/${client.id}`
    : lead
      ? `/leads/${lead.id}`
      : null;
  const subjectKind = client ? "Client" : lead ? "Lead" : "Orphan";

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow={`audit · ${subjectKind.toLowerCase()}`}
        title={subjectName}
        description={`Filed ${new Date(audit.createdAt).toLocaleString(
          undefined,
          {
            dateStyle: "long",
            timeStyle: "short",
          },
        )}`}
        actions={
          <ActionBar align="right">
            <LinkButton
              href={`/audits/${audit.id}/edit`}
              variant="ghost"
              size="sm"
            >
              Edit
            </LinkButton>
          </ActionBar>
        }
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col gap-6">
          <DetailPanel>
            <DetailField label="Business overview">
              <Section content={audit.businessOverview} />
            </DetailField>
            <DetailField label="Current tools">
              <Section content={audit.currentTools} />
            </DetailField>
            <DetailField label="Pain points">
              <Section content={audit.painPoints} />
            </DetailField>
            <DetailField label="Opportunities">
              <Section content={audit.opportunities} />
            </DetailField>
            <DetailField label="Recommended systems">
              <Section content={audit.recommendedSystems} />
            </DetailField>
            <DetailField label="Next steps">
              <Section content={audit.nextSteps} />
            </DetailField>
          </DetailPanel>
        </div>

        <aside className="flex flex-col gap-5">
          <GlassCard className="p-5">
            <SectionHeader title="Export" />
            <p className="mt-2 text-sm text-[var(--color-foreground)]/55">
              Generate the proposal-ready markdown. User content is escaped per
              F9 amendment.
            </p>
            <div className="mt-4">
              <ExportAuditButton auditId={audit.id} />
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <SectionHeader title="Subject" />
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <span className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--color-foreground)]/45">
                {subjectKind}
              </span>
              {subjectHref ? (
                <Link
                  href={subjectHref}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  {subjectName}
                </Link>
              ) : (
                <span className="text-[var(--color-foreground)]/55 italic">
                  Unattached
                </span>
              )}
            </div>
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}

function Section({ content }: { content: string | null }) {
  if (!content || !content.trim()) {
    return (
      <span className="text-[var(--color-foreground)]/40 italic">
        None recorded.
      </span>
    );
  }
  return <p className="whitespace-pre-wrap">{content}</p>;
}
