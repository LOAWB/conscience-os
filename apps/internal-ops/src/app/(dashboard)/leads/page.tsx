import Link from "next/link";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb, leads, statusEnum, type Lead, type LeadStatus } from "@repo/db";
import {
  ActionBar,
  DataList,
  EntityEmptyState,
  LinkButton,
  PageHeader,
  StatusBadge,
} from "@repo/ui";
import { legacyStatusDisplay } from "@/lib/leads-helpers";
import { LeadsListFilters } from "./_filters";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;
const ALL_STATUSES = statusEnum.enumValues as readonly string[];

const SORT_MAP = {
  newest: desc(leads.createdAt),
  oldest: asc(leads.createdAt),
  name: asc(leads.name),
  business: asc(leads.businessName),
  follow_up: asc(leads.nextFollowUpAt),
} as const;

export default async function LeadsListPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const statusParam =
    sp.status && ALL_STATUSES.includes(sp.status) ? sp.status : "";
  const search = (sp.search ?? "").trim();
  const sort = (sp.sort ?? "newest") as keyof typeof SORT_MAP;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const db = getDb();
  const filters = [];
  if (statusParam) filters.push(eq(leads.status, statusParam as LeadStatus));
  if (search) {
    const term = `%${search}%`;
    filters.push(
      or(
        ilike(leads.name, term),
        ilike(leads.businessName, term),
        ilike(leads.business, term),
        ilike(leads.email, term),
      ),
    );
  }
  const where = filters.length ? and(...filters) : undefined;

  const [items, totalRow] = await Promise.all([
    db
      .select()
      .from(leads)
      .where(where)
      .orderBy(SORT_MAP[sort] ?? SORT_MAP.newest)
      .limit(PAGE_SIZE)
      .offset(offset),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(leads)
      .where(where),
  ]);
  const total = totalRow[0]?.n ?? 0;

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow="pipeline"
        title="Leads"
        description="Inbound interest, in-flight audits, and proposals. Track follow-ups and convert won leads to clients."
        actions={
          <ActionBar align="right">
            <LinkButton href="/leads/new" variant="primary" size="sm">
              New lead
            </LinkButton>
          </ActionBar>
        }
      />

      <div className="mt-6">
        <LeadsListFilters
          status={statusParam || "all"}
          search={search}
          sort={sort}
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
        />
      </div>

      <div className="mt-5">
        <DataList<Lead>
          items={items}
          rowKey={(l) => l.id}
          columns={[
            {
              id: "name",
              header: "Contact",
              width: "minmax(0, 1.4fr)",
              cell: (l) => (
                <Link
                  href={`/leads/${l.id}`}
                  className="font-medium text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {l.name}
                </Link>
              ),
            },
            {
              id: "business",
              header: "Business",
              width: "minmax(0, 1.4fr)",
              cell: (l) => (
                <span className="text-[var(--color-foreground)]/80">
                  {l.businessName ?? l.business}
                </span>
              ),
            },
            {
              id: "status",
              header: "Status",
              width: "200px",
              cell: (l) => <LeadStatusCell status={l.status} />,
            },
            {
              id: "tier",
              header: "Tier",
              width: "100px",
              cell: (l) => (
                <span className="font-mono text-[0.72rem] uppercase tracking-wider text-[var(--color-foreground)]/55">
                  {l.tier}
                </span>
              ),
            },
            {
              id: "follow_up",
              header: "Follow-up",
              width: "160px",
              align: "right",
              cell: (l) => (
                <span className="font-mono text-[0.72rem] tabular-nums text-[var(--color-foreground)]/55">
                  {l.nextFollowUpAt
                    ? new Date(l.nextFollowUpAt).toISOString().slice(0, 10)
                    : "—"}
                </span>
              ),
            },
          ]}
          emptyState={
            <EntityEmptyState
              title="No leads yet"
              description={
                statusParam || search
                  ? "No leads match the current filters."
                  : "When the public site captures a lead, it lands here. You can also create a lead manually."
              }
              action={
                <LinkButton href="/leads/new" variant="primary" size="sm">
                  New lead
                </LinkButton>
              }
            />
          }
        />
      </div>
    </div>
  );
}

function LeadStatusCell({ status }: { status: LeadStatus }) {
  const display = legacyStatusDisplay(status);
  return (
    <div className="flex items-center gap-2">
      <StatusBadge variant="lead" status={status} />
      {display.isLegacy ? (
        <span className="font-mono text-[0.62rem] uppercase tracking-wider text-[var(--color-foreground)]/40">
          legacy
        </span>
      ) : null}
    </div>
  );
}
