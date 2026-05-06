import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getDb, isDbConnected } from "@/db";
import { leads, leadNotes } from "@/db/schema";
import { LeadStatusControls } from "@/components/app/lead-status-controls";
import { LeadNotes } from "@/components/app/lead-notes";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isDbConnected()) {
    return (
      <Container className="py-14">
        <div className="rounded-2xl glass-card p-10 text-center max-w-xl mx-auto">
          <p className="text-foreground">Database not connected.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Set <code className="text-accent font-mono">DATABASE_URL</code> to
            enable.
          </p>
        </div>
      </Container>
    );
  }

  const db = getDb();
  const rows = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  if (rows.length === 0) notFound();
  const lead = rows[0];

  const notes = await db
    .select()
    .from(leadNotes)
    .where(eq(leadNotes.leadId, id))
    .orderBy(desc(leadNotes.createdAt));

  return (
    <Container className="py-10 sm:py-14" size="default">
      <div className="mb-7">
        <Link
          href="/app/leads"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          All leads
        </Link>
      </div>

      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-8 border-b border-border">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-subtle mb-2">
            {lead.businessType}
          </p>
          <h1 className="font-semibold tracking-[-0.02em] text-2xl sm:text-3xl leading-tight">
            {lead.business}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>{lead.name}</span>
            <span>·</span>
            <a
              href={`mailto:${lead.email}`}
              className="text-accent hover:underline font-mono text-xs"
            >
              {lead.email}
            </a>
            <span>·</span>
            <span className="text-xs font-mono">
              Submitted {new Date(lead.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px] gap-10 mt-10">
        <div className="space-y-9">
          <Field label="What's slowing them down" value={lead.problems} />
          <Field
            label="Tools in use"
            value={lead.tools || "(not provided)"}
            muted={!lead.tools}
          />
          <Field
            label="What 'fixed' looks like"
            value={lead.outcome || "(not provided)"}
            muted={!lead.outcome}
          />

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">
              Notes
            </h2>
            <LeadNotes leadId={lead.id} initialNotes={notes} />
          </section>
        </div>

        <aside className="lg:sticky lg:top-20 self-start space-y-5">
          <LeadStatusControls
            leadId={lead.id}
            initialStatus={lead.status}
            initialTier={lead.tier}
            initialNextAction={lead.nextAction}
          />
        </aside>
      </div>
    </Container>
  );
}

function Field({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
        {label}
      </h2>
      <p
        className={`text-[0.98rem] leading-relaxed whitespace-pre-wrap ${muted ? "text-subtle italic" : "text-foreground"}`}
      >
        {value}
      </p>
    </section>
  );
}
