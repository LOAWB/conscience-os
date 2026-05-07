import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { audits, clients, getDb, leads, type Audit } from "@repo/db";
import {
  ActionBar,
  DataList,
  EntityEmptyState,
  LinkButton,
  PageHeader,
} from "@repo/ui";
import { leadBusinessName } from "@/lib/leads-helpers";

export const dynamic = "force-dynamic";

type Row = Audit & {
  subjectLabel: string;
  subjectHref: string | null;
};

export default async function AuditsListPage() {
  const db = getDb();
  const items = await db
    .select({
      id: audits.id,
      leadId: audits.leadId,
      clientId: audits.clientId,
      businessOverview: audits.businessOverview,
      currentTools: audits.currentTools,
      painPoints: audits.painPoints,
      opportunities: audits.opportunities,
      recommendedSystems: audits.recommendedSystems,
      nextSteps: audits.nextSteps,
      createdAt: audits.createdAt,
      updatedAt: audits.updatedAt,
      leadName: leads.name,
      leadBusiness: leads.businessName,
      leadBusinessLegacy: leads.business,
      clientBusiness: clients.businessName,
    })
    .from(audits)
    .leftJoin(leads, eq(audits.leadId, leads.id))
    .leftJoin(clients, eq(audits.clientId, clients.id))
    .orderBy(desc(audits.createdAt))
    .limit(100);

  const rows: Row[] = items.map((r) => {
    const subjectLabel = r.clientId
      ? (r.clientBusiness ?? "(client)")
      : r.leadId
        ? (r.leadBusiness ?? r.leadBusinessLegacy ?? r.leadName ?? "(lead)")
        : "(unattached)";
    const subjectHref = r.clientId
      ? `/clients/${r.clientId}`
      : r.leadId
        ? `/leads/${r.leadId}`
        : null;
    return {
      id: r.id,
      leadId: r.leadId,
      clientId: r.clientId,
      businessOverview: r.businessOverview,
      currentTools: r.currentTools,
      painPoints: r.painPoints,
      opportunities: r.opportunities,
      recommendedSystems: r.recommendedSystems,
      nextSteps: r.nextSteps,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      subjectLabel,
      subjectHref,
    };
  });

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow="discovery"
        title="System audits"
        description="Structured captures of business overview, tools, pain points, opportunities, recommendations, and next steps."
        actions={
          <ActionBar align="right">
            <LinkButton href="/audits/new" variant="primary" size="sm">
              File audit
            </LinkButton>
          </ActionBar>
        }
      />

      <div className="mt-6">
        <DataList<Row>
          items={rows}
          rowKey={(a) => a.id}
          columns={[
            {
              id: "subject",
              header: "Subject",
              width: "minmax(0, 1.5fr)",
              cell: (a) =>
                a.subjectHref ? (
                  <Link
                    href={a.subjectHref}
                    className="font-medium text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    {a.subjectLabel}
                  </Link>
                ) : (
                  <span className="text-[var(--color-foreground)]/55 italic">
                    {a.subjectLabel}
                  </span>
                ),
            },
            {
              id: "kind",
              header: "Kind",
              width: "100px",
              cell: (a) => (
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-foreground)]/55">
                  {a.clientId ? "client" : a.leadId ? "lead" : "orphan"}
                </span>
              ),
            },
            {
              id: "preview",
              header: "Pain points",
              width: "minmax(0, 2fr)",
              cell: (a) => (
                <span className="text-[var(--color-foreground)]/65 text-[0.85rem] line-clamp-1">
                  {(a.painPoints ?? "—").slice(0, 200)}
                </span>
              ),
            },
            {
              id: "filed",
              header: "Filed",
              width: "120px",
              align: "right",
              cell: (a) => (
                <span className="font-mono text-[0.72rem] tabular-nums text-[var(--color-foreground)]/55">
                  {new Date(a.createdAt).toISOString().slice(0, 10)}
                </span>
              ),
            },
            {
              id: "open",
              header: "",
              width: "80px",
              align: "right",
              cell: (a) => (
                <Link
                  href={`/audits/${a.id}`}
                  className="text-[0.78rem] text-[var(--color-accent)] hover:underline"
                >
                  Open
                </Link>
              ),
            },
          ]}
          emptyState={
            <EntityEmptyState
              title="No audits yet"
              description="File a structured audit against a lead or client. The export feeds the proposal."
              action={
                <LinkButton href="/audits/new" variant="primary" size="sm">
                  File audit
                </LinkButton>
              }
            />
          }
        />
      </div>
    </div>
  );
}
