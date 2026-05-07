import Link from "next/link";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import {
  clients,
  getDb,
  projects,
  projectStatusEnum,
  type Project,
  type ProjectStatus,
} from "@repo/db";
import {
  ActionBar,
  DataList,
  EntityEmptyState,
  LinkButton,
  PageHeader,
  ProgressBar,
  StatusBadge,
} from "@repo/ui";
import { ProjectsListFilters } from "./_filters";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;
const STATUS_VALUES = projectStatusEnum.enumValues as readonly string[];

const SORT_MAP = {
  newest: desc(projects.createdAt),
  oldest: asc(projects.createdAt),
  due_date: asc(projects.dueDate),
  name: asc(projects.name),
} as const;

type Deliverable = { label: string; done: boolean };

type Row = Project & { clientName: string };

export default async function ProjectsListPage({
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
  const sort = (sp.sort ?? "newest") as keyof typeof SORT_MAP;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const db = getDb();
  const filters = [];
  if (statusParam)
    filters.push(eq(projects.status, statusParam as ProjectStatus));
  if (search) {
    const term = `%${search}%`;
    filters.push(
      or(ilike(projects.name, term), ilike(projects.description, term)),
    );
  }
  const where = filters.length ? and(...filters) : undefined;

  const [items, totalRow] = await Promise.all([
    db
      .select({
        id: projects.id,
        clientId: projects.clientId,
        name: projects.name,
        description: projects.description,
        status: projects.status,
        dueDate: projects.dueDate,
        deliverables: projects.deliverables,
        internalNotes: projects.internalNotes,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        clientName: clients.businessName,
      })
      .from(projects)
      .leftJoin(clients, eq(projects.clientId, clients.id))
      .where(where)
      .orderBy(SORT_MAP[sort] ?? SORT_MAP.newest)
      .limit(PAGE_SIZE)
      .offset(offset),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(projects)
      .where(where),
  ]);
  const total = totalRow[0]?.n ?? 0;

  const rows: Row[] = items.map((r) => ({
    id: r.id,
    clientId: r.clientId,
    name: r.name,
    description: r.description,
    status: r.status,
    dueDate: r.dueDate,
    deliverables: r.deliverables,
    internalNotes: r.internalNotes,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    clientName: r.clientName ?? "(no client)",
  }));

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow="delivery"
        title="Projects"
        description="Active builds, audits in flight, and support engagements. Each project rolls into a client."
        actions={
          <ActionBar align="right">
            <LinkButton href="/projects/new" variant="primary" size="sm">
              New project
            </LinkButton>
          </ActionBar>
        }
      />

      <div className="mt-6">
        <ProjectsListFilters
          status={statusParam || "all"}
          search={search}
          sort={sort}
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
        />
      </div>

      <div className="mt-5">
        <DataList<Row>
          items={rows}
          rowKey={(p) => p.id}
          columns={[
            {
              id: "name",
              header: "Project",
              width: "minmax(0, 1.6fr)",
              cell: (p) => (
                <Link
                  href={`/projects/${p.id}`}
                  className="font-medium text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {p.name}
                </Link>
              ),
            },
            {
              id: "client",
              header: "Client",
              width: "minmax(0, 1.2fr)",
              cell: (p) => (
                <Link
                  href={`/clients/${p.clientId}`}
                  className="text-[var(--color-foreground)]/70 hover:text-[var(--color-accent)] transition-colors"
                >
                  {p.clientName}
                </Link>
              ),
            },
            {
              id: "status",
              header: "Status",
              width: "140px",
              cell: (p) => <StatusBadge variant="project" status={p.status} />,
            },
            {
              id: "deliverables",
              header: "Deliverables",
              width: "180px",
              cell: (p) => {
                const items = (
                  Array.isArray(p.deliverables)
                    ? (p.deliverables as Deliverable[])
                    : []
                ).filter((d) => d && typeof d.label === "string");
                if (items.length === 0) {
                  return (
                    <span className="font-mono text-[0.72rem] text-[var(--color-foreground)]/40">
                      —
                    </span>
                  );
                }
                const done = items.filter((d) => d.done).length;
                return (
                  <ProgressBar
                    value={done}
                    max={items.length}
                    label={`${done}/${items.length}`}
                  />
                );
              },
            },
            {
              id: "due",
              header: "Due",
              width: "120px",
              align: "right",
              cell: (p) => (
                <span className="font-mono text-[0.72rem] tabular-nums text-[var(--color-foreground)]/55">
                  {p.dueDate
                    ? new Date(p.dueDate).toISOString().slice(0, 10)
                    : "—"}
                </span>
              ),
            },
          ]}
          emptyState={
            <EntityEmptyState
              title="No projects yet"
              description={
                statusParam || search
                  ? "No projects match the current filters."
                  : "Create a project under a client to track deliverables and tasks."
              }
              action={
                <LinkButton href="/projects/new" variant="primary" size="sm">
                  New project
                </LinkButton>
              }
            />
          }
        />
      </div>
    </div>
  );
}
