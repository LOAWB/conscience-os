import Link from "next/link";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import {
  clients,
  getDb,
  leads,
  projects,
  tasks,
  taskPriorityEnum,
  taskStatusEnum,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "@repo/db";
import {
  ActionBar,
  DataList,
  EntityEmptyState,
  LinkButton,
  PageHeader,
  PriorityChip,
  StatusBadge,
} from "@repo/ui";
import { TasksListFilters } from "./_filters";
import { TaskDrawer } from "./_task-drawer";
import { QuickCompleteButton } from "./_quick-complete-button";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 30;
const STATUS_VALUES = taskStatusEnum.enumValues as readonly string[];
const PRIORITY_VALUES = taskPriorityEnum.enumValues as readonly string[];

const SORT_MAP = {
  due_date: asc(tasks.dueDate),
  priority: asc(tasks.priority),
  newest: desc(tasks.createdAt),
  title: asc(tasks.title),
} as const;

type Row = Task & {
  clientName: string | null;
  projectName: string | null;
  leadName: string | null;
};

export default async function TasksListPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    priority?: string;
    search?: string;
    sort?: string;
    page?: string;
    open?: string;
  }>;
}) {
  const sp = await searchParams;
  const statusParam =
    sp.status && STATUS_VALUES.includes(sp.status) ? sp.status : "";
  const priorityParam =
    sp.priority && PRIORITY_VALUES.includes(sp.priority) ? sp.priority : "";
  const search = (sp.search ?? "").trim();
  const sort = (sp.sort ?? "due_date") as keyof typeof SORT_MAP;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const db = getDb();
  const filters = [];
  if (statusParam) filters.push(eq(tasks.status, statusParam as TaskStatus));
  if (priorityParam)
    filters.push(eq(tasks.priority, priorityParam as TaskPriority));
  if (search) {
    const term = `%${search}%`;
    filters.push(or(ilike(tasks.title, term), ilike(tasks.description, term)));
  }
  const where = filters.length ? and(...filters) : undefined;

  const [items, totalRow, allClients, allProjects, allLeads] =
    await Promise.all([
      db
        .select({
          id: tasks.id,
          title: tasks.title,
          description: tasks.description,
          status: tasks.status,
          priority: tasks.priority,
          dueDate: tasks.dueDate,
          clientId: tasks.clientId,
          projectId: tasks.projectId,
          leadId: tasks.leadId,
          createdAt: tasks.createdAt,
          updatedAt: tasks.updatedAt,
          clientName: clients.businessName,
          projectName: projects.name,
          leadName: leads.name,
        })
        .from(tasks)
        .leftJoin(clients, eq(tasks.clientId, clients.id))
        .leftJoin(projects, eq(tasks.projectId, projects.id))
        .leftJoin(leads, eq(tasks.leadId, leads.id))
        .where(where)
        .orderBy(SORT_MAP[sort] ?? SORT_MAP.due_date)
        .limit(PAGE_SIZE)
        .offset(offset),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(tasks)
        .where(where),
      db
        .select({ id: clients.id, businessName: clients.businessName })
        .from(clients)
        .orderBy(asc(clients.businessName)),
      db
        .select({ id: projects.id, name: projects.name })
        .from(projects)
        .orderBy(asc(projects.name)),
      db
        .select({ id: leads.id, name: leads.name })
        .from(leads)
        .orderBy(asc(leads.name)),
    ]);

  const total = totalRow[0]?.n ?? 0;
  const rows = items as Row[];

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow="execution"
        title="Tasks"
        description="Operator inbox. Click any row to edit in the side panel — list context stays visible."
        actions={
          <ActionBar align="right">
            <LinkButton href="/tasks/new" variant="primary" size="sm">
              New task
            </LinkButton>
          </ActionBar>
        }
      />

      <div className="mt-6">
        <TasksListFilters
          status={statusParam || "all"}
          priority={priorityParam || "all"}
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
          rowKey={(t) => t.id}
          columns={[
            {
              id: "complete",
              header: "",
              width: "44px",
              cell: (t) =>
                t.status === "done" ? (
                  <span className="opacity-30 text-[0.72rem] font-mono">✓</span>
                ) : (
                  <QuickCompleteButton taskId={t.id} />
                ),
            },
            {
              id: "title",
              header: "Task",
              width: "minmax(0, 1.8fr)",
              cell: (t) => (
                <Link
                  href={`/tasks?open=${t.id}`}
                  scroll={false}
                  className="font-medium text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {t.title}
                </Link>
              ),
            },
            {
              id: "linked",
              header: "Linked to",
              width: "minmax(0, 1fr)",
              cell: (t) => {
                if (t.projectId && t.projectName) {
                  return (
                    <Link
                      href={`/projects/${t.projectId}`}
                      className="text-[0.78rem] text-[var(--color-foreground)]/70 hover:text-[var(--color-accent)]"
                    >
                      Project · {t.projectName}
                    </Link>
                  );
                }
                if (t.clientId && t.clientName) {
                  return (
                    <Link
                      href={`/clients/${t.clientId}`}
                      className="text-[0.78rem] text-[var(--color-foreground)]/70 hover:text-[var(--color-accent)]"
                    >
                      Client · {t.clientName}
                    </Link>
                  );
                }
                if (t.leadId && t.leadName) {
                  return (
                    <Link
                      href={`/leads/${t.leadId}`}
                      className="text-[0.78rem] text-[var(--color-foreground)]/70 hover:text-[var(--color-accent)]"
                    >
                      Lead · {t.leadName}
                    </Link>
                  );
                }
                return (
                  <span className="text-[0.78rem] text-[var(--color-foreground)]/40 italic">
                    standalone
                  </span>
                );
              },
            },
            {
              id: "priority",
              header: "Priority",
              width: "100px",
              cell: (t) => <PriorityChip level={t.priority} />,
            },
            {
              id: "status",
              header: "Status",
              width: "120px",
              cell: (t) => <StatusBadge variant="task" status={t.status} />,
            },
            {
              id: "due",
              header: "Due",
              width: "140px",
              align: "right",
              cell: (t) => (
                <span className="font-mono text-[0.72rem] tabular-nums text-[var(--color-foreground)]/55">
                  {t.dueDate
                    ? new Date(t.dueDate).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </span>
              ),
            },
          ]}
          emptyState={
            <EntityEmptyState
              title="No tasks"
              description={
                statusParam || priorityParam || search
                  ? "No tasks match the current filters."
                  : "Create a task to track operator work."
              }
              action={
                <LinkButton href="/tasks/new" variant="primary" size="sm">
                  New task
                </LinkButton>
              }
            />
          }
        />
      </div>

      <TaskDrawer
        clientOptions={allClients.map((c) => ({
          value: c.id,
          label: c.businessName,
        }))}
        projectOptions={allProjects.map((p) => ({
          value: p.id,
          label: p.name,
        }))}
        leadOptions={allLeads.map((l) => ({ value: l.id, label: l.name }))}
      />
    </div>
  );
}
