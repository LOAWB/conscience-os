import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { audits, clients, events, getDb, projects, tasks } from "@repo/db";
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

export const dynamic = "force-dynamic";

type ImportantLink = { label: string; url: string };

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();

  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, id))
    .limit(1);
  if (!client) notFound();

  const [clientProjects, clientTasks, clientEvents, clientAudits] =
    await Promise.all([
      db
        .select()
        .from(projects)
        .where(eq(projects.clientId, id))
        .orderBy(desc(projects.createdAt)),
      db
        .select()
        .from(tasks)
        .where(eq(tasks.clientId, id))
        .orderBy(desc(tasks.createdAt))
        .limit(10),
      db
        .select()
        .from(events)
        .where(eq(events.clientId, id))
        .orderBy(desc(events.dateTime))
        .limit(10),
      db
        .select()
        .from(audits)
        .where(eq(audits.clientId, id))
        .orderBy(desc(audits.createdAt)),
    ]);

  const links = (
    Array.isArray(client.importantLinks)
      ? (client.importantLinks as ImportantLink[])
      : []
  ).filter((l) => l && l.label && l.url);

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow="clients"
        title={client.businessName}
        description={client.contactName}
        actions={
          <ActionBar align="right">
            <LinkButton
              href={`/projects/new?clientId=${client.id}`}
              variant="secondary"
              size="sm"
            >
              New project
            </LinkButton>
            <LinkButton
              href={`/audits/new?clientId=${client.id}`}
              variant="secondary"
              size="sm"
            >
              File audit
            </LinkButton>
            <LinkButton
              href={`/clients/${client.id}/edit`}
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
              <StatusBadge variant="client" status={client.status} />
            </DetailField>
            {client.email ? (
              <DetailField label="Email">
                <a
                  href={`mailto:${client.email}`}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  {client.email}
                </a>
              </DetailField>
            ) : null}
            {client.phone ? (
              <DetailField label="Phone">
                <a
                  href={`tel:${client.phone}`}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  {client.phone}
                </a>
              </DetailField>
            ) : null}
            {client.notes ? (
              <DetailField label="Notes">
                <p className="whitespace-pre-wrap">{client.notes}</p>
              </DetailField>
            ) : null}
            <DetailField label="Created">
              {new Date(client.createdAt).toLocaleString()}
            </DetailField>
          </DetailPanel>

          <GlassCard className="p-5">
            <SectionHeader title="Projects" hint={`${clientProjects.length}`} />
            <ul className="mt-3 flex flex-col gap-2">
              {clientProjects.length === 0 ? (
                <li className="text-sm text-[var(--color-foreground)]/55 italic">
                  No projects yet.{" "}
                  <Link
                    href={`/projects/new?clientId=${client.id}`}
                    className="text-[var(--color-accent)] hover:underline"
                  >
                    Add one
                  </Link>
                  .
                </li>
              ) : (
                clientProjects.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 text-sm">
                    <Link
                      href={`/projects/${p.id}`}
                      className="font-medium text-[var(--color-foreground)] hover:text-[var(--color-accent)]"
                    >
                      {p.name}
                    </Link>
                    <span className="ml-auto">
                      <StatusBadge variant="project" status={p.status} />
                    </span>
                  </li>
                ))
              )}
            </ul>
          </GlassCard>

          {links.length > 0 ? (
            <GlassCard className="p-5">
              <SectionHeader title="Important links" hint={`${links.length}`} />
              <ul className="mt-3 flex flex-col gap-2">
                {links.map((l, i) => (
                  <li key={i} className="text-sm flex items-center gap-3">
                    <span className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--color-foreground)]/45 w-32 shrink-0 truncate">
                      {l.label}
                    </span>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-[var(--color-accent)] hover:underline"
                    >
                      {l.url}
                    </a>
                  </li>
                ))}
              </ul>
            </GlassCard>
          ) : null}
        </div>

        <aside className="flex flex-col gap-5">
          <GlassCard className="p-5">
            <SectionHeader title="Tasks" hint={`${clientTasks.length}`} />
            <ul className="mt-3 flex flex-col gap-2">
              {clientTasks.length === 0 ? (
                <li className="text-sm text-[var(--color-foreground)]/55 italic">
                  No tasks linked.
                </li>
              ) : (
                clientTasks.map((t) => (
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
            <SectionHeader title="Events" hint={`${clientEvents.length}`} />
            <ul className="mt-3 flex flex-col gap-2">
              {clientEvents.length === 0 ? (
                <li className="text-sm text-[var(--color-foreground)]/55 italic">
                  No events scheduled.
                </li>
              ) : (
                clientEvents.map((e) => (
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
            <SectionHeader title="Audits" hint={`${clientAudits.length}`} />
            <ul className="mt-3 flex flex-col gap-2">
              {clientAudits.length === 0 ? (
                <li className="text-sm text-[var(--color-foreground)]/55 italic">
                  No audits filed.
                </li>
              ) : (
                clientAudits.map((a) => (
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
