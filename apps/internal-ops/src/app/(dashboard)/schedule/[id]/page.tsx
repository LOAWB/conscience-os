import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { clients, events, getDb, leads, projects } from "@repo/db";
import {
  ActionBar,
  DetailField,
  DetailPanel,
  GlassCard,
  LinkButton,
  PageHeader,
  SectionHeader,
} from "@repo/ui";
import { DeleteEventButton } from "./_delete-button";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .limit(1);
  if (!event) notFound();

  const [linkedClient, linkedLead, linkedProject] = await Promise.all([
    event.clientId
      ? db.select().from(clients).where(eq(clients.id, event.clientId)).limit(1)
      : Promise.resolve([] as never[]),
    event.leadId
      ? db.select().from(leads).where(eq(leads.id, event.leadId)).limit(1)
      : Promise.resolve([] as never[]),
    event.projectId
      ? db
          .select()
          .from(projects)
          .where(eq(projects.id, event.projectId))
          .limit(1)
      : Promise.resolve([] as never[]),
  ]);
  const c = linkedClient[0] ?? null;
  const l = linkedLead[0] ?? null;
  const p = linkedProject[0] ?? null;

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow={`schedule · ${event.type}`}
        title={event.title}
        description={event.dateTime.toLocaleString(undefined, {
          dateStyle: "full",
          timeStyle: "short",
        })}
        actions={
          <ActionBar align="right">
            <LinkButton
              href={`/schedule/${event.id}/edit`}
              variant="ghost"
              size="sm"
            >
              Edit
            </LinkButton>
            <DeleteEventButton eventId={event.id} />
          </ActionBar>
        }
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <DetailPanel>
          <DetailField label="Type">
            <span className="font-mono uppercase tracking-wider text-xs text-[var(--color-foreground)]/65">
              {event.type}
            </span>
          </DetailField>
          <DetailField label="When">
            {event.dateTime.toLocaleString(undefined, {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </DetailField>
          <DetailField label="Duration">
            {event.durationMinutes} minutes
          </DetailField>
          {event.notes ? (
            <DetailField label="Notes">
              <p className="whitespace-pre-wrap">{event.notes}</p>
            </DetailField>
          ) : null}
          <DetailField label="Created">
            {new Date(event.createdAt).toLocaleString()}
          </DetailField>
        </DetailPanel>

        <aside className="flex flex-col gap-5">
          <GlassCard className="p-5">
            <SectionHeader title="Linked to" />
            <ul className="mt-3 flex flex-col gap-2">
              {!c && !l && !p ? (
                <li className="text-sm text-[var(--color-foreground)]/55 italic">
                  Standalone — not linked to a lead, client, or project.
                </li>
              ) : null}
              {c ? (
                <li className="text-sm">
                  <span className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--color-foreground)]/45 mr-2">
                    client
                  </span>
                  <Link
                    href={`/clients/${c.id}`}
                    className="text-[var(--color-accent)] hover:underline"
                  >
                    {c.businessName}
                  </Link>
                </li>
              ) : null}
              {p ? (
                <li className="text-sm">
                  <span className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--color-foreground)]/45 mr-2">
                    project
                  </span>
                  <Link
                    href={`/projects/${p.id}`}
                    className="text-[var(--color-accent)] hover:underline"
                  >
                    {p.name}
                  </Link>
                </li>
              ) : null}
              {l ? (
                <li className="text-sm">
                  <span className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--color-foreground)]/45 mr-2">
                    lead
                  </span>
                  <Link
                    href={`/leads/${l.id}`}
                    className="text-[var(--color-accent)] hover:underline"
                  >
                    {l.name}
                  </Link>
                </li>
              ) : null}
            </ul>
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}
