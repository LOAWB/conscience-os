/**
 * Today data surface — server component, fetched per request.
 *
 * Calls face-f's getTodaySnapshot() directly (same process; cheaper than
 * fetching /api/today over HTTP). On success, render real schema-backed rows
 * without any demo labels. On error, render <TodayError> so the page surface
 * still renders chrome + counts; the partial-error case (one query failed)
 * also flips into <TodayError> per Pory residual risk R1.
 */
import {
  CountStrip,
  EntityEmptyState,
  PriorityChip,
  SectionHeader,
  StatusBadge,
  TodayPanel,
} from "@repo/ui";
import type { Event as EventRow, Task as TaskRow } from "@repo/db";
import { getTodaySnapshot } from "@/lib/queries/today";
import { TodayError } from "./today-error";
import { QuickCaptureClient } from "./quick-capture-client";

const dayFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  hour: "numeric",
  minute: "2-digit",
});

const dateOnlyFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const timeOnlyFmt = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

function formatEventTime(dt: Date): string {
  const now = new Date();
  const sameDay =
    dt.getUTCFullYear() === now.getUTCFullYear() &&
    dt.getUTCMonth() === now.getUTCMonth() &&
    dt.getUTCDate() === now.getUTCDate();
  if (sameDay) return `Today ${timeOnlyFmt.format(dt)}`;
  return dayFmt.format(dt);
}

function formatTaskDue(dt: Date | null): string | null {
  if (!dt) return null;
  return timeOnlyFmt.format(dt);
}

function formatOverdueDue(dt: Date | null): string | null {
  if (!dt) return null;
  return dateOnlyFmt.format(dt);
}

export async function TodayContent() {
  let snapshot;
  try {
    snapshot = await getTodaySnapshot();
  } catch (err) {
    return <TodayError error={err} />;
  }

  const { counts, todaysTasks, overdueTasks, upcomingEvents } = snapshot;

  return (
    <>
      <div className="mt-6">
        <CountStrip
          counts={[
            { label: "Open leads", value: counts.openLeads, href: "/leads" },
            {
              label: "Active clients",
              value: counts.activeClients,
              href: "/clients",
            },
            {
              label: "Active projects",
              value: counts.activeProjects,
              href: "/projects",
            },
            {
              label: "Overdue tasks",
              value: counts.overdueTasks,
              href: "/tasks",
              tone: counts.overdueTasks > 0 ? "warn" : "default",
            },
          ]}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TodayPanel
          header={
            <SectionHeader
              title="Today's tasks"
              hint={
                todaysTasks.length === 0
                  ? "nothing due today"
                  : `${todaysTasks.length} due`
              }
            />
          }
        >
          {todaysTasks.length === 0 && overdueTasks.length === 0 ? (
            <EntityEmptyState
              title="Nothing due today"
              description="When tasks land here from /api/quick-capture or /tasks/new, you'll see them."
            />
          ) : (
            <>
              {todaysTasks.length > 0 ? (
                <ul className="flex flex-col gap-1">
                  {todaysTasks.map((t) => (
                    <TaskRowToday key={t.id} task={t} />
                  ))}
                </ul>
              ) : null}
              {overdueTasks.length > 0 ? (
                <div
                  className={
                    todaysTasks.length > 0
                      ? "mt-4 pt-3 border-t border-[var(--color-border)]"
                      : ""
                  }
                >
                  <div className="mb-2 text-[0.68rem] font-mono uppercase tracking-[0.18em] text-[#fbbf24]/85">
                    Overdue · {overdueTasks.length}
                  </div>
                  <ul className="flex flex-col gap-1">
                    {overdueTasks.slice(0, 6).map((t) => (
                      <TaskRowOverdue key={t.id} task={t} />
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          )}
        </TodayPanel>

        <TodayPanel
          header={
            <SectionHeader
              title="Upcoming"
              hint={
                upcomingEvents.length === 0
                  ? "nothing scheduled"
                  : "next 7 days"
              }
            />
          }
        >
          {upcomingEvents.length === 0 ? (
            <EntityEmptyState
              title="Nothing scheduled"
              description="Audits, calls, and follow-ups created in /schedule appear here."
            />
          ) : (
            <ul className="flex flex-col">
              {upcomingEvents.map((e) => (
                <EventRowItem key={e.id} event={e} />
              ))}
            </ul>
          )}
        </TodayPanel>

        <TodayPanel header={<SectionHeader title="Quick capture" />}>
          <QuickCaptureClient />
        </TodayPanel>
      </div>
    </>
  );
}

function TaskRowToday({ task }: { task: TaskRow }) {
  const due = formatTaskDue(task.dueDate);
  return (
    <li className="flex items-center gap-3 py-1.5">
      <input
        type="checkbox"
        defaultChecked={task.status === "done"}
        disabled
        aria-label={`${task.title} — quick-complete via /tasks (face-f)`}
        className="size-4 rounded border-[var(--color-border-strong)] bg-white/[0.03] cursor-not-allowed"
      />
      <span className="text-sm text-[var(--color-foreground)]/95 truncate flex-1">
        {task.title}
      </span>
      {due ? (
        <span className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--color-foreground)]/45 shrink-0">
          {due}
        </span>
      ) : null}
      <PriorityChip level={task.priority} />
    </li>
  );
}

function TaskRowOverdue({ task }: { task: TaskRow }) {
  const due = formatOverdueDue(task.dueDate);
  return (
    <li className="flex items-center gap-3 py-1.5">
      <span
        aria-hidden
        className="size-1.5 rounded-full bg-[#fbbf24] shrink-0"
      />
      <span className="text-sm text-[var(--color-foreground)]/95 truncate flex-1">
        {task.title}
      </span>
      {due ? (
        <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[#fbbf24]/85 shrink-0">
          {due}
        </span>
      ) : null}
      <PriorityChip level={task.priority} />
    </li>
  );
}

const eventTypeLabel: Record<EventRow["type"], string> = {
  audit: "Audit",
  call: "Call",
  deadline: "Deadline",
  follow_up: "Follow-up",
  other: "—",
};

function EventRowItem({ event }: { event: EventRow }) {
  const when = formatEventTime(event.dateTime);
  return (
    <li className="flex items-baseline gap-3 py-2">
      <span className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--color-foreground)]/55 shrink-0 w-20">
        {when}
      </span>
      <span className="text-sm text-[var(--color-foreground)]/90 truncate flex-1">
        {event.title}
      </span>
      <span className="shrink-0">
        <StatusBadge
          variant="task"
          status="to_do"
          label={eventTypeLabel[event.type]}
        />
      </span>
    </li>
  );
}
