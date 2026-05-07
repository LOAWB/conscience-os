/**
 * Today View — the locked 3-column dashboard composition.
 *
 * STAGE 3: Mock data labeled as demo per A4 amendment. Hard rule #2 of Vessel:
 * "no fake business data presented as real." Every mock row is visibly tagged.
 *
 * STAGE 3+: When face-f ships /api/today, the data layer below switches to
 * real fetch and the demo banner + tags disappear automatically.
 */
import { count } from "drizzle-orm";
import { getDb, leads, clients, projects, tasks } from "@repo/db";
import {
  CountStrip,
  GlassCard,
  InlineNotice,
  PageHeader,
  PriorityChip,
  SectionHeader,
  Tag,
  TodayPanel,
} from "@repo/ui";
import { getSession } from "@/lib/auth";
import { QuickCaptureClient } from "./_today/quick-capture-client";

export const dynamic = "force-dynamic";

// Mock data — labeled. Until /api/today exists.
const MOCK_TODAY_TASKS = [
  {
    id: "t1",
    title: "Follow up with Acme Logistics on audit prep",
    priority: "high" as const,
  },
  {
    id: "t2",
    title: "Send proposal draft to Beta Foods",
    priority: "high" as const,
  },
  {
    id: "t3",
    title: "Review intake notes from yesterday",
    priority: "medium" as const,
  },
  {
    id: "t4",
    title: "Confirm Wednesday audit scope with Northwind",
    priority: "low" as const,
  },
];

const MOCK_OVERDUE = [
  {
    id: "o1",
    title: "Call Beta Inc — was due 2 days ago",
    priority: "critical" as const,
  },
];

const MOCK_UPCOMING = [
  { id: "e1", when: "Tue 10:00", title: "System Audit · Acme Logistics" },
  { id: "e2", when: "Wed 14:00", title: "Discovery call · Northwind" },
  { id: "e3", when: "Thu", title: "Deliverables review · Quanta" },
  { id: "e4", when: "Fri", title: "Follow-up · Pinetree Studio" },
];

export default async function TodayPage() {
  const session = await getSession();
  if (!session) return null;

  const db = getDb();
  const [leadCount, clientCount, projectCount, taskCount] = await Promise.all([
    db.select({ n: count() }).from(leads),
    db.select({ n: count() }).from(clients),
    db.select({ n: count() }).from(projects),
    db.select({ n: count() }).from(tasks),
  ]);

  const overdueCount = MOCK_OVERDUE.length;

  return (
    <div className="px-4 md:px-8 lg:px-10 py-6 md:py-8 max-w-[1400px] mx-auto">
      <PageHeader
        eyebrow={`signed in · ${session.role}`}
        title={`Today${session.name ? `, ${session.name.split(" ")[0]}` : ""}.`}
        description="Open work, upcoming events, quick capture. One round-trip per refresh."
      />

      <div className="mt-6">
        <CountStrip
          counts={[
            {
              label: "Open leads",
              value: leadCount[0]?.n ?? 0,
              href: "/leads",
            },
            {
              label: "Active clients",
              value: clientCount[0]?.n ?? 0,
              href: "/clients",
            },
            {
              label: "Active projects",
              value: projectCount[0]?.n ?? 0,
              href: "/projects",
            },
            {
              label: "Overdue tasks",
              value: overdueCount,
              href: "/tasks",
              tone: overdueCount > 0 ? "warn" : "default",
              hint: "demo",
            },
          ]}
        />
      </div>

      <div className="mt-5">
        <InlineNotice variant="demo" title="Sample data">
          The Today columns below render placeholder rows until face-f ships{" "}
          <code className="font-mono text-[0.78em]">GET /api/today</code>. The
          counts above are real (queried from{" "}
          <code className="font-mono text-[0.78em]">@repo/db</code>).
        </InlineNotice>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TodayPanel
          header={
            <SectionHeader
              title="Today's tasks"
              hint={`${MOCK_TODAY_TASKS.length} open · demo`}
            />
          }
        >
          <ul className="flex flex-col gap-1">
            {MOCK_TODAY_TASKS.map((t) => (
              <DemoTaskRow key={t.id} title={t.title} priority={t.priority} />
            ))}
          </ul>
          {MOCK_OVERDUE.length > 0 ? (
            <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
              <div className="mb-2 text-[0.68rem] font-mono uppercase tracking-[0.18em] text-[#fbbf24]/85">
                Overdue
              </div>
              <ul className="flex flex-col gap-1">
                {MOCK_OVERDUE.map((t) => (
                  <DemoTaskRow
                    key={t.id}
                    title={t.title}
                    priority={t.priority}
                  />
                ))}
              </ul>
            </div>
          ) : null}
        </TodayPanel>

        <TodayPanel
          header={
            <SectionHeader title="Upcoming" hint={`next 7 days · demo`} />
          }
        >
          <ul className="flex flex-col">
            {MOCK_UPCOMING.map((e) => (
              <li
                key={e.id}
                className="flex items-baseline gap-3 py-2 italic opacity-55"
              >
                <span className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--color-foreground)]/45 shrink-0 w-16">
                  {e.when}
                </span>
                <span className="text-sm text-[var(--color-foreground)]/85 truncate">
                  {e.title}
                </span>
                <span className="ml-auto shrink-0">
                  <Tag tone="demo">demo</Tag>
                </span>
              </li>
            ))}
          </ul>
        </TodayPanel>

        <TodayPanel header={<SectionHeader title="Quick capture" />}>
          <QuickCaptureClient />
        </TodayPanel>
      </div>

      <GlassCard
        aura
        className="mt-6 px-5 py-4 text-[0.78rem] text-[var(--color-foreground)]/55"
      >
        Stage 3 in flight: face-e shell green · face-f wiring{" "}
        <code className="font-mono">/api/today</code>,{" "}
        <code className="font-mono">/api/quick-capture</code>, and the six
        domain modules.
      </GlassCard>
    </div>
  );
}

function DemoTaskRow({
  title,
  priority,
}: {
  title: string;
  priority: "low" | "medium" | "high" | "critical";
}) {
  return (
    <li className="flex items-center gap-3 py-1.5 italic opacity-55">
      <input
        type="checkbox"
        disabled
        aria-label="Demo placeholder — wires to /api/today"
        className="size-4 rounded border-[var(--color-border-strong)] bg-white/[0.03] cursor-not-allowed"
      />
      <span className="text-sm text-[var(--color-foreground)]/90 truncate flex-1">
        {title}
      </span>
      <PriorityChip level={priority} />
      <Tag tone="demo">demo</Tag>
    </li>
  );
}
