import Link from "next/link";
import { and, asc, desc, eq, gte, ilike, lt, or } from "drizzle-orm";
import {
  clients,
  events,
  eventTypeEnum,
  getDb,
  leads,
  projects,
  type EventType,
} from "@repo/db";
import {
  ActionBar,
  EntityEmptyState,
  GlassCard,
  LinkButton,
  PageHeader,
  SectionHeader,
} from "@repo/ui";
import { ScheduleFilters } from "./_filters";

export const dynamic = "force-dynamic";

const TYPE_VALUES = eventTypeEnum.enumValues as readonly string[];

function rangeWindow(
  range: string,
  now: Date,
): { from: Date; to: Date | null } {
  const start = new Date(now);
  start.setUTCHours(0, 0, 0, 0);

  if (range === "today") {
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    return { from: start, to: end };
  }
  if (range === "week") {
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 7);
    return { from: now, to: end };
  }
  if (range === "month") {
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 30);
    return { from: now, to: end };
  }
  if (range === "past") {
    return { from: new Date(0), to: now };
  }
  return { from: now, to: null };
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; type?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const range = sp.range ?? "upcoming";
  const typeParam = sp.type && TYPE_VALUES.includes(sp.type) ? sp.type : "";
  const search = (sp.search ?? "").trim();

  const now = new Date();
  const window = rangeWindow(range, now);

  const db = getDb();
  const filters = [];
  filters.push(gte(events.dateTime, window.from));
  if (window.to) filters.push(lt(events.dateTime, window.to));
  if (typeParam) filters.push(eq(events.type, typeParam as EventType));
  if (search) {
    const term = `%${search}%`;
    filters.push(or(ilike(events.title, term), ilike(events.notes, term)));
  }

  const items = await db
    .select({
      id: events.id,
      title: events.title,
      type: events.type,
      dateTime: events.dateTime,
      durationMinutes: events.durationMinutes,
      notes: events.notes,
      clientId: events.clientId,
      leadId: events.leadId,
      projectId: events.projectId,
      clientName: clients.businessName,
      leadName: leads.name,
      projectName: projects.name,
    })
    .from(events)
    .leftJoin(clients, eq(events.clientId, clients.id))
    .leftJoin(leads, eq(events.leadId, leads.id))
    .leftJoin(projects, eq(events.projectId, projects.id))
    .where(and(...filters))
    .orderBy(range === "past" ? desc(events.dateTime) : asc(events.dateTime))
    .limit(200);

  // Group by day for calendar-feel rendering
  const groups = new Map<string, typeof items>();
  for (const ev of items) {
    const key = dayKey(ev.dateTime);
    const list = groups.get(key);
    if (list) list.push(ev);
    else groups.set(key, [ev]);
  }

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow="calendar"
        title="Schedule"
        description="Audits, calls, deadlines, follow-ups. Linked to leads, clients, or projects."
        actions={
          <ActionBar align="right">
            <LinkButton href="/schedule/new" variant="primary" size="sm">
              Schedule event
            </LinkButton>
          </ActionBar>
        }
      />

      <div className="mt-6">
        <ScheduleFilters
          range={range}
          type={typeParam || "all"}
          search={search}
        />
      </div>

      <div className="mt-5">
        {groups.size === 0 ? (
          <EntityEmptyState
            title="Nothing scheduled"
            description={
              range === "past"
                ? "No past events match the current filters."
                : "Schedule an audit, call, or follow-up to see it here."
            }
            action={
              <LinkButton href="/schedule/new" variant="primary" size="sm">
                Schedule event
              </LinkButton>
            }
          />
        ) : (
          <div className="flex flex-col gap-5">
            {[...groups.entries()].map(([day, dayItems]) => (
              <GlassCard key={day} className="px-5 py-4">
                <SectionHeader
                  title={new Date(day).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  hint={`${dayItems.length}`}
                />
                <ul className="mt-3 flex flex-col">
                  {dayItems.map((ev) => {
                    const linkLabel = ev.clientName
                      ? `Client · ${ev.clientName}`
                      : ev.projectName
                        ? `Project · ${ev.projectName}`
                        : ev.leadName
                          ? `Lead · ${ev.leadName}`
                          : null;
                    const linkHref = ev.clientId
                      ? `/clients/${ev.clientId}`
                      : ev.projectId
                        ? `/projects/${ev.projectId}`
                        : ev.leadId
                          ? `/leads/${ev.leadId}`
                          : null;
                    return (
                      <li
                        key={ev.id}
                        className="flex items-baseline gap-4 py-2.5 border-b border-[var(--color-border)] last:border-b-0"
                      >
                        <span className="font-mono text-[0.78rem] tabular-nums text-[var(--color-foreground)]/80 w-16 shrink-0">
                          {ev.dateTime.toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-[var(--color-foreground)]/45 w-20 shrink-0">
                          {ev.type}
                        </span>
                        <Link
                          href={`/schedule/${ev.id}`}
                          className="flex-1 truncate font-medium text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors"
                        >
                          {ev.title}
                        </Link>
                        {linkHref ? (
                          <Link
                            href={linkHref}
                            className="text-[0.78rem] text-[var(--color-foreground)]/55 hover:text-[var(--color-accent)] transition-colors truncate max-w-[220px]"
                          >
                            {linkLabel}
                          </Link>
                        ) : null}
                        <span className="font-mono text-[0.7rem] text-[var(--color-foreground)]/40">
                          {ev.durationMinutes}m
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
