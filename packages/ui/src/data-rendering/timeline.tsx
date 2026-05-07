import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export type TimelineItem = {
  id: string;
  at: string;
  title: ReactNode;
  body?: ReactNode;
  by?: string;
  icon?: ReactNode;
};

/**
 * Timeline — vertical event log used by lead/client notes and audit history.
 * Reads top-to-bottom (newest first per caller's sort).
 */
export function Timeline({
  items,
  className,
  emptyState,
}: {
  items: readonly TimelineItem[];
  className?: string;
  emptyState?: ReactNode;
}) {
  if (items.length === 0 && emptyState) return <>{emptyState}</>;
  return (
    <ol className={cn("relative pl-5", className)}>
      <span
        aria-hidden
        className="absolute left-1.5 top-2 bottom-2 w-px bg-[var(--color-border)]"
      />
      {items.map((item) => (
        <li key={item.id} className="relative pb-5 last:pb-0">
          <span
            aria-hidden
            className="absolute -left-[3px] top-1.5 size-2 rounded-full bg-[var(--color-accent)] ring-2 ring-[var(--color-background)]"
            style={{ boxShadow: "0 0 8px rgba(59,125,255,0.55)" }}
          />
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-medium text-[var(--color-foreground)]">
              {item.title}
            </span>
            <span className="font-mono text-[0.68rem] uppercase tracking-wider text-[var(--color-foreground)]/45">
              {item.at}
            </span>
            {item.by ? (
              <span className="text-[0.7rem] text-[var(--color-foreground)]/45">
                · {item.by}
              </span>
            ) : null}
          </div>
          {item.body ? (
            <div className="mt-1 text-sm text-[var(--color-foreground)]/70 leading-relaxed">
              {item.body}
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
