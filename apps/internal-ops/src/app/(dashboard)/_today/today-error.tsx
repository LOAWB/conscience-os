/**
 * Today error surface. Renders when getTodaySnapshot() throws OR when a future
 * partial-error path lands (face-f could ship a partial-success response that
 * surfaces per-query errors).
 *
 * Per Pory round-2 residual risk R1: partial errors must NOT silently render
 * empty rows. The page must communicate the failure.
 */
import { GlassCard, InlineNotice } from "@repo/ui";

export function TodayError({ error }: { error: unknown }) {
  const message =
    error instanceof Error ? error.message : "Unable to load Today snapshot.";
  return (
    <div className="mt-6 flex flex-col gap-4">
      <InlineNotice variant="warn" title="Today data unavailable">
        {message} — try refreshing. If the error persists, check{" "}
        <code className="font-mono text-[0.78em]">/api/health</code> and the
        internal-ops Railway logs.
      </InlineNotice>
      <GlassCard
        aura
        className="px-5 py-6 text-sm text-[var(--color-foreground)]/55"
      >
        Counts, today's tasks, and upcoming events couldn't be queried. The rest
        of the dashboard remains available via the sidebar.
      </GlassCard>
    </div>
  );
}
