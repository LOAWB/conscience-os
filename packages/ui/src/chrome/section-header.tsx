import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * Section header — smaller than PageHeader. Used inside a panel for column titles
 * (TODAY'S TASKS, UPCOMING, QUICK CAPTURE).
 */
export function SectionHeader({
  title,
  hint,
  actions,
  className,
}: {
  title: ReactNode;
  hint?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center justify-between gap-3 mb-3", className)}
    >
      <div className="flex items-baseline gap-2">
        <h2 className="text-[0.72rem] font-mono uppercase tracking-[0.18em] text-[var(--color-foreground)]/55">
          {title}
        </h2>
        {hint ? (
          <span className="text-[0.7rem] text-[var(--color-foreground)]/35">
            {hint}
          </span>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
