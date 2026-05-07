import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { audits, events, getDb, leadNotes, leads, tasks } from "@repo/db";
import {
  ActionBar,
  DetailField,
  DetailPanel,
  GlassCard,
  LinkButton,
  PageHeader,
  PriorityChip,
  SectionHeader,
  StatusBadge,
} from "@repo/ui";
import { leadBusinessName, legacyStatusDisplay } from "@/lib/leads-helpers";
import { LeadStatusActions } from "./_status-actions";
import { LeadNotesTimeline } from "./_notes-timeline";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();

  const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  if (!lead) notFound();

  const [notes, leadTasks, leadEvents, leadAudits] = await Promise.all([
    db
      .select()
      .from(leadNotes)
      .where(eq(leadNotes.leadId, id))
      .orderBy(desc(leadNotes.createdAt)),
    db
      .select()
      .from(tasks)
      .where(eq(tasks.leadId, id))
      .orderBy(desc(tasks.createdAt)),
    db
      .select()
      .from(events)
      .where(eq(events.leadId, id))
      .orderBy(desc(events.dateTime)),
    db
      .select()
      .from(audits)
      .where(eq(audits.leadId, id))
      .orderBy(desc(audits.createdAt)),
  ]);

  const statusDisplay = legacyStatusDisplay(lead.status);

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow={`leads · ${lead.tier}`}
        title={lead.name}
        description={leadBusinessName(lead)}
        actions={
          <ActionBar align="right">
            <LinkButton
              href={`/audits/new?leadId=${lead.id}`}
              variant="secondary"
              size="sm"
            >
              File audit
            </LinkButton>
            <LinkButton
              href={`/leads/${lead.id}/edit`}
              variant="ghost"
              size="sm"
            >
              Edit
            </LinkButton>
          </ActionBar>
        }
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="flex flex-col gap-6">
          <DetailPanel>
            <DetailField label="Status">
              <div className="flex items-center gap-2">
                <StatusBadge variant="lead" status={lead.status} />
                {statusDisplay.isLegacy ? (
                  <span className="font-mono text-[0.62rem] uppercase tracking-wider text-[var(--color-foreground)]/40">
                    legacy → maps to {statusDisplay.pipelineEquivalent}
                  </span>
                ) : null}
              </div>
            </DetailField>
            <DetailField label="Tier">
              <span className="font-mono uppercase tracking-wider text-xs text-[var(--color-foreground)]/65">
                {lead.tier}
              </span>
            </DetailField>
            <DetailField label="Email">
              <a
                href={`mailto:${lead.email}`}
                className="text-[var(--color-accent)] hover:underline"
              >
                {lead.email}
              </a>
            </DetailField>
            {lead.phone ? (
              <DetailField label="Phone">
                <a
                  href={`tel:${lead.phone}`}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  {lead.phone}
                </a>
              </DetailField>
            ) : null}
            {lead.businessType ? (
              <DetailField label="Business type">
                {lead.businessType}
              </DetailField>
            ) : null}
            {lead.problems ? (
              <DetailField label="Problems">
                <p className="whitespace-pre-wrap">{lead.problems}</p>
              </DetailField>
            ) : null}
            {lead.tools ? (
              <DetailField label="Tools today">
                <p className="whitespace-pre-wrap">{lead.tools}</p>
              </DetailField>
            ) : null}
            {lead.outcome ? (
              <DetailField label="Desired outcome">
                <p className="whitespace-pre-wrap">{lead.outcome}</p>
              </DetailField>
            ) : null}
            <DetailField label="Source">{lead.source}</DetailField>
            <DetailField label="Next follow-up">
              {lead.nextFollowUpAt
                ? new Date(lead.nextFollowUpAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "—"}
            </DetailField>
            <DetailField label="Created">
              {new Date(lead.createdAt).toLocaleString()}
            </DetailField>
          </DetailPanel>

          <GlassCard className="p-5">
            <SectionHeader title="Notes" hint={`${notes.length}`} />
            <div className="mt-4">
              <LeadNotesTimeline leadId={lead.id} notes={notes} />
            </div>
          </GlassCard>
        </div>

        <aside className="flex flex-col gap-5">
          <GlassCard className="p-5">
            <SectionHeader title="Pipeline" />
            <div className="mt-4">
              <LeadStatusActions
                leadId={lead.id}
                status={lead.status}
                alreadyConvertedClientId={lead.convertedClientId ?? null}
              />
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <SectionHeader title="Tasks" hint={`${leadTasks.length}`} />
            <ul className="mt-3 flex flex-col gap-2">
              {leadTasks.length === 0 ? (
                <li className="text-sm text-[var(--color-foreground)]/55 italic">
                  No tasks linked.
                </li>
              ) : (
                leadTasks.map((t) => (
                  <li key={t.id} className="flex items-center gap-3 text-sm">
                    <PriorityChip level={t.priority} />
                    <span className="truncate text-[var(--color-foreground)]/85">
                      {t.title}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </GlassCard>

          <GlassCard className="p-5">
            <SectionHeader title="Events" hint={`${leadEvents.length}`} />
            <ul className="mt-3 flex flex-col gap-2">
              {leadEvents.length === 0 ? (
                <li className="text-sm text-[var(--color-foreground)]/55 italic">
                  No events scheduled.
                </li>
              ) : (
                leadEvents.map((e) => (
                  <li key={e.id} className="flex items-baseline gap-3 text-sm">
                    <span className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--color-foreground)]/45 w-16 shrink-0">
                      {e.type}
                    </span>
                    <span className="truncate text-[var(--color-foreground)]/85">
                      {e.title}
                    </span>
                    <span className="ml-auto font-mono text-[0.7rem] tabular-nums text-[var(--color-foreground)]/45">
                      {new Date(e.dateTime).toISOString().slice(0, 10)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </GlassCard>

          <GlassCard className="p-5">
            <SectionHeader title="Audits" hint={`${leadAudits.length}`} />
            <ul className="mt-3 flex flex-col gap-2">
              {leadAudits.length === 0 ? (
                <li className="text-sm text-[var(--color-foreground)]/55 italic">
                  No audits filed.
                </li>
              ) : (
                leadAudits.map((a) => (
                  <li key={a.id} className="text-sm">
                    <Link
                      href={`/audits/${a.id}`}
                      className="text-[var(--color-accent)] hover:underline"
                    >
                      Audit · {new Date(a.createdAt).toISOString().slice(0, 10)}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}
