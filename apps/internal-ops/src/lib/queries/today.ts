import {
  and,
  asc,
  count,
  eq,
  gte,
  isNotNull,
  lt,
  ne,
  notInArray,
} from "drizzle-orm";
import {
  events,
  getDb,
  leads,
  clients,
  projects,
  tasks,
  type Event as EventRow,
  type LeadStatus,
  type ProjectStatus,
  type Task as TaskRow,
} from "@repo/db";

export type TodaySnapshot = {
  counts: {
    openLeads: number;
    activeClients: number;
    activeProjects: number;
    overdueTasks: number;
  };
  todaysTasks: TaskRow[];
  overdueTasks: TaskRow[];
  upcomingEvents: EventRow[];
};

// Mutable arrays — drizzle's notInArray rejects `as const` readonly tuples.
const CLOSED_LEAD_STATUSES: LeadStatus[] = ["won", "lost", "archived"];
const CLOSED_PROJECT_STATUSES: ProjectStatus[] = ["complete", "support"];

export async function getTodaySnapshot(
  now: Date = new Date(),
): Promise<TodaySnapshot> {
  const db = getDb();

  // Day boundaries in the server's wall clock (Railway runs UTC by default;
  // operator's local-day handling is a Phase 2 concern per M0 plan).
  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);
  const sevenDaysOut = new Date(now);
  sevenDaysOut.setUTCDate(sevenDaysOut.getUTCDate() + 7);

  const [
    openLeadsRows,
    activeClientsRows,
    activeProjectsRows,
    overdueCountRows,
    todaysTasksRows,
    overdueTasksRows,
    upcomingEventsRows,
  ] = await Promise.all([
    db
      .select({ n: count() })
      .from(leads)
      .where(notInArray(leads.status, CLOSED_LEAD_STATUSES)),
    db.select({ n: count() }).from(clients).where(eq(clients.status, "active")),
    db
      .select({ n: count() })
      .from(projects)
      .where(notInArray(projects.status, CLOSED_PROJECT_STATUSES)),
    db
      .select({ n: count() })
      .from(tasks)
      .where(
        and(
          ne(tasks.status, "done"),
          isNotNull(tasks.dueDate),
          lt(tasks.dueDate, now),
        ),
      ),
    db
      .select()
      .from(tasks)
      .where(
        and(
          ne(tasks.status, "done"),
          gte(tasks.dueDate, startOfDay),
          lt(tasks.dueDate, endOfDay),
        ),
      )
      .orderBy(asc(tasks.priority), asc(tasks.dueDate)),
    db
      .select()
      .from(tasks)
      .where(
        and(
          ne(tasks.status, "done"),
          isNotNull(tasks.dueDate),
          lt(tasks.dueDate, startOfDay),
        ),
      )
      .orderBy(asc(tasks.dueDate))
      .limit(50),
    db
      .select()
      .from(events)
      .where(and(gte(events.dateTime, now), lt(events.dateTime, sevenDaysOut)))
      .orderBy(asc(events.dateTime))
      .limit(50),
  ]);

  return {
    counts: {
      openLeads: openLeadsRows[0]?.n ?? 0,
      activeClients: activeClientsRows[0]?.n ?? 0,
      activeProjects: activeProjectsRows[0]?.n ?? 0,
      overdueTasks: overdueCountRows[0]?.n ?? 0,
    },
    todaysTasks: todaysTasksRows,
    overdueTasks: overdueTasksRows,
    upcomingEvents: upcomingEventsRows,
  };
}
