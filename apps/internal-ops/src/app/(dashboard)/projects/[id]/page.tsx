import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { clients, events, getDb, projects, tasks } from "@repo/db";
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
import { DeliverablesEditor } from "./_deliverables-editor";

export const dynamic = "force-dynamic";

type Deliverable = { label: string; done: boolean; dueAt?: string | null };

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  if (!project) notFound();

  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, project.clientId))
    .limit(1);

  const [projectTasks, projectEvents] = await Promise.all([
    db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, id))
      .orderBy(desc(tasks.createdAt)),
    db
      .select()
      .from(events)
      .where(eq(events.projectId, id))
      .orderBy(desc(events.dateTime))
      .limit(10),
  ]);

  const deliverables = (
    Array.isArray(project.deliverables)
      ? (project.deliverables as Deliverable[])
      : []
  ).filter((d) => d && typeof d.label === "string");

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow={
          client ? (
            <Link
              href={`/clients/${client.id}`}
              className="hover:text-[var(--color-accent)] transition-colors"
            >
              {client.businessName}
            </Link>
          ) : (
            "projects"
          )
        }
        title={project.name}
        description={project.description ?? undefined}
        actions={
          <ActionBar align="right">
            <LinkButton
              href={`/tasks/new?projectId=${project.id}`}
              variant="secondary"
              size="sm"
            >
              New task
            </LinkButton>
            <LinkButton
              href={`/projects/${project.id}/edit`}
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
              <StatusBadge variant="project" status={project.status} />
            </DetailField>
            <DetailField label="Due date">
              {project.dueDate
                ? new Date(project.dueDate).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "—"}
            </DetailField>
            {project.internalNotes ? (
              <DetailField label="Internal notes">
                <p className="whitespace-pre-wrap">{project.internalNotes}</p>
              </DetailField>
            ) : null}
            <DetailField label="Created">
              {new Date(project.createdAt).toLocaleString()}
            </DetailField>
          </DetailPanel>

          <GlassCard className="p-5">
            <SectionHeader
              title="Deliverables"
              hint={`${deliverables.length}`}
            />
            <div className="mt-4">
              <DeliverablesEditor
                projectId={project.id}
                initial={deliverables}
              />
            </div>
          </GlassCard>
        </div>

        <aside className="flex flex-col gap-5">
          <GlassCard className="p-5">
            <SectionHeader title="Tasks" hint={`${projectTasks.length}`} />
            <ul className="mt-3 flex flex-col gap-2">
              {projectTasks.length === 0 ? (
                <li className="text-sm text-[var(--color-foreground)]/55 italic">
                  No tasks linked.{" "}
                  <Link
                    href={`/tasks/new?projectId=${project.id}`}
                    className="text-[var(--color-accent)] hover:underline"
                  >
                    Add one
                  </Link>
                  .
                </li>
              ) : (
                projectTasks.map((t) => (
                  <li key={t.id} className="flex items-center gap-3 text-sm">
                    <PriorityChip level={t.priority} />
                    <span className="truncate text-[var(--color-foreground)]/85">
                      {t.title}
                    </span>
                    <span className="ml-auto">
                      <StatusBadge variant="task" status={t.status} />
                    </span>
                  </li>
                ))
              )}
            </ul>
          </GlassCard>

          <GlassCard className="p-5">
            <SectionHeader title="Events" hint={`${projectEvents.length}`} />
            <ul className="mt-3 flex flex-col gap-2">
              {projectEvents.length === 0 ? (
                <li className="text-sm text-[var(--color-foreground)]/55 italic">
                  No events scheduled.
                </li>
              ) : (
                projectEvents.map((e) => (
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
        </aside>
      </div>
    </div>
  );
}
