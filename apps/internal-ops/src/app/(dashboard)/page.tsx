/**
 * Today View — Stage 2 stub.
 *
 * face-e replaces with the locked 3-column composition (today's tasks +
 * upcoming events + quick capture) using <TodayPanel>, <CountStrip>, and
 * <QuickCapturePanel> from @repo/ui. face-f provides /api/today as the
 * data source.
 *
 * For now: server-render counts directly from @repo/db so foundation-green
 * smoke test can confirm the pipeline (auth -> db -> render) works.
 */
import { count } from "drizzle-orm";
import { getDb, leads, clients, projects, tasks } from "@repo/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const session = await getSession();
  if (!session) return null; // layout already redirected

  const db = getDb();
  const [leadCount, clientCount, projectCount, taskCount] = await Promise.all([
    db.select({ n: count() }).from(leads),
    db.select({ n: count() }).from(clients),
    db.select({ n: count() }).from(projects),
    db.select({ n: count() }).from(tasks),
  ]);

  return (
    <div className="p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Today</h1>
        <p className="text-sm opacity-60">
          Welcome back{session.name ? `, ${session.name}` : ""}.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-10">
        <Stat label="Leads" value={leadCount[0]?.n ?? 0} />
        <Stat label="Clients" value={clientCount[0]?.n ?? 0} />
        <Stat label="Projects" value={projectCount[0]?.n ?? 0} />
        <Stat label="Tasks" value={taskCount[0]?.n ?? 0} />
      </div>

      <div className="rounded-xl border border-dashed border-[var(--border-soft)] p-6">
        <p className="text-sm opacity-60">
          Today View placeholder. face-e binds the 3-column composition with
          tasks · upcoming events · quick capture against /api/today (face-f).
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--card-glass)] p-5 backdrop-blur-md">
      <div className="text-xs uppercase tracking-wider opacity-50">{label}</div>
      <div className="mt-2 text-3xl font-bold tabular-nums">{value}</div>
    </div>
  );
}
