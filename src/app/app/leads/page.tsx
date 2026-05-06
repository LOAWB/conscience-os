import Link from "next/link";
import { desc } from "drizzle-orm";
import { ArrowRight, Database, Inbox } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getDb, isDbConnected } from "@/db";
import { leads } from "@/db/schema";
import { StatusBadge } from "@/components/app/status-badge";

export const metadata = {
  title: "Leads · Owner OS",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  if (!isDbConnected()) {
    return <DbNotConnected />;
  }

  const db = getDb();
  let rows;
  try {
    rows = await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt))
      .limit(500);
  } catch (err) {
    console.error("[leads page]", err);
    return <DbError />;
  }

  return (
    <Container className="py-10 sm:py-14">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">
            Pipeline
          </p>
          <h1 className="font-semibold tracking-[-0.02em] text-2xl sm:text-3xl leading-tight">
            Leads
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {rows.length} {rows.length === 1 ? "record" : "records"}
            {" · "}newest first
          </p>
        </div>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-2xl glass-card p-10 text-center">
          <Inbox className="size-6 text-subtle mx-auto" strokeWidth={1.5} />
          <p className="mt-4 text-foreground font-medium">No leads yet</p>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            New intake submissions land here automatically. Try the public form
            at{" "}
            <Link href="/book" className="text-accent hover:underline">
              /book
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="rounded-xl glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[0.92rem]">
              <thead>
                <tr className="text-left text-[0.7rem] uppercase tracking-[0.14em] font-semibold text-subtle">
                  <th className="py-3 px-5">Business</th>
                  <th className="py-3 px-5">Contact</th>
                  <th className="py-3 px-5">Tier</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Submitted</th>
                  <th className="py-3 px-5"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-t border-border hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <div className="font-medium text-foreground">
                        {lead.business}
                      </div>
                      <div className="text-xs text-subtle font-mono">
                        {lead.businessType}
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="text-foreground">{lead.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {lead.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        {lead.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="py-3.5 px-5 text-xs text-muted-foreground font-mono">
                      {formatRelative(lead.createdAt)}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href={`/app/leads/${lead.id}`}
                        className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover"
                      >
                        Open
                        <ArrowRight className="size-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Container>
  );
}

function formatRelative(d: Date) {
  const ms = Date.now() - new Date(d).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function DbNotConnected() {
  return (
    <Container className="py-14">
      <div className="rounded-2xl glass-card p-10 text-center max-w-2xl mx-auto">
        <Database className="size-7 text-accent mx-auto" strokeWidth={1.5} />
        <h1 className="mt-5 font-semibold text-2xl tracking-tight">
          Database not connected
        </h1>
        <p className="mt-3 text-[0.95rem] text-muted-foreground leading-relaxed">
          Owner OS needs a Postgres database to store leads. Provision one and
          set <code className="font-mono text-accent">DATABASE_URL</code> in
          Vercel env, then deploy.
        </p>
        <p className="mt-6 text-xs text-subtle font-mono">
          See <code>m1/CRM-SETUP.md</code> for provisioning steps.
        </p>
      </div>
    </Container>
  );
}

function DbError() {
  return (
    <Container className="py-14">
      <div className="rounded-2xl glass-card p-10 text-center max-w-2xl mx-auto">
        <Database className="size-7 text-error mx-auto" strokeWidth={1.5} />
        <h1 className="mt-5 font-semibold text-2xl tracking-tight">
          Database error
        </h1>
        <p className="mt-3 text-[0.95rem] text-muted-foreground leading-relaxed">
          Couldn't reach the database. Check{" "}
          <code className="font-mono text-accent">DATABASE_URL</code> and that
          migrations have been applied.
        </p>
      </div>
    </Container>
  );
}
