import Link from "next/link";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import {
  clientStatusEnum,
  getDb,
  clients,
  type Client,
  type ClientStatus,
} from "@repo/db";
import {
  ActionBar,
  DataList,
  EntityEmptyState,
  LinkButton,
  PageHeader,
  StatusBadge,
} from "@repo/ui";
import { ClientsListFilters } from "./_filters";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;
const STATUS_VALUES = clientStatusEnum.enumValues as readonly string[];

const SORT_MAP = {
  name: asc(clients.businessName),
  contact: asc(clients.contactName),
  newest: desc(clients.createdAt),
  oldest: asc(clients.createdAt),
} as const;

export default async function ClientsListPage({
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
    sp.status && STATUS_VALUES.includes(sp.status) ? sp.status : "";
  const search = (sp.search ?? "").trim();
  const sort = (sp.sort ?? "name") as keyof typeof SORT_MAP;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const db = getDb();
  const filters = [];
  if (statusParam)
    filters.push(eq(clients.status, statusParam as ClientStatus));
  if (search) {
    const term = `%${search}%`;
    filters.push(
      or(
        ilike(clients.businessName, term),
        ilike(clients.contactName, term),
        ilike(clients.email, term),
      ),
    );
  }
  const where = filters.length ? and(...filters) : undefined;

  const [items, totalRow] = await Promise.all([
    db
      .select()
      .from(clients)
      .where(where)
      .orderBy(SORT_MAP[sort] ?? SORT_MAP.name)
      .limit(PAGE_SIZE)
      .offset(offset),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(clients)
      .where(where),
  ]);
  const total = totalRow[0]?.n ?? 0;

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow="book of business"
        title="Clients"
        description="Active engagements. Each client owns projects, tasks, audits, and a contact log."
        actions={
          <ActionBar align="right">
            <LinkButton href="/clients/new" variant="primary" size="sm">
              New client
            </LinkButton>
          </ActionBar>
        }
      />

      <div className="mt-6">
        <ClientsListFilters
          status={statusParam || "all"}
          search={search}
          sort={sort}
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
        />
      </div>

      <div className="mt-5">
        <DataList<Client>
          items={items}
          rowKey={(c) => c.id}
          columns={[
            {
              id: "business",
              header: "Business",
              width: "minmax(0, 1.6fr)",
              cell: (c) => (
                <Link
                  href={`/clients/${c.id}`}
                  className="font-medium text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {c.businessName}
                </Link>
              ),
            },
            {
              id: "contact",
              header: "Contact",
              width: "minmax(0, 1.2fr)",
              cell: (c) => (
                <span className="text-[var(--color-foreground)]/80">
                  {c.contactName}
                </span>
              ),
            },
            {
              id: "email",
              header: "Email",
              width: "minmax(0, 1.2fr)",
              cell: (c) => (
                <span className="text-[var(--color-foreground)]/55 font-mono text-[0.78rem]">
                  {c.email ?? "—"}
                </span>
              ),
            },
            {
              id: "status",
              header: "Status",
              width: "140px",
              cell: (c) => <StatusBadge variant="client" status={c.status} />,
            },
          ]}
          emptyState={
            <EntityEmptyState
              title="No clients yet"
              description={
                statusParam || search
                  ? "No clients match the current filters."
                  : "Convert a won lead into a client, or add one manually."
              }
              action={
                <LinkButton href="/clients/new" variant="primary" size="sm">
                  New client
                </LinkButton>
              }
            />
          }
        />
      </div>
    </div>
  );
}
