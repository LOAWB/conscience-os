import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * DetailField — labeled field row inside a DetailPanel.
 * Two-column at md+: label on left, value on right. Stacks at sm.
 */
export function DetailField({
  label,
  children,
  hint,
  className,
}: {
  label: ReactNode;
  children: ReactNode;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-[180px_1fr] gap-1 md:gap-6 px-5 py-4",
        className,
      )}
    >
      <dt className="text-[0.72rem] font-mono uppercase tracking-[0.16em] text-[var(--color-foreground)]/45 md:pt-0.5">
        {label}
      </dt>
      <dd className="text-sm text-[var(--color-foreground)]/90">
        {children}
        {hint ? (
          <p className="mt-1 text-xs text-[var(--color-foreground)]/45">
            {hint}
          </p>
        ) : null}
      </dd>
    </div>
  );
}
