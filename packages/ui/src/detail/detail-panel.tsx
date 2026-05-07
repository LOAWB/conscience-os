import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * DetailPanel — vertical container for an entity detail screen.
 * Pairs with DetailField for the field grid.
 */
export function DetailPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-white/[0.018] divide-y divide-[var(--color-border)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
