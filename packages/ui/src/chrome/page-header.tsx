import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * Page header — title + optional eyebrow + optional description + right-slot actions.
 * Sits at the top of every dashboard route. Calm typographic hierarchy, no chrome.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 border-b border-[var(--color-border)] pb-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <div className="mb-2 text-[0.7rem] font-mono uppercase tracking-[0.18em] text-[var(--color-foreground)]/45">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-2xl md:text-[1.75rem] font-bold tracking-tight leading-tight text-[var(--color-foreground)]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 text-sm text-[var(--color-foreground)]/60 max-w-2xl">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      ) : null}
    </header>
  );
}
