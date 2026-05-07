import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * Action bar — bottom-pinned strip for confirm/cancel pairs in modals/drawers.
 */
export function ActionBar({
  children,
  align = "right",
  className,
}: {
  children: ReactNode;
  align?: "left" | "right" | "between";
  className?: string;
}) {
  const alignment = {
    left: "justify-start",
    right: "justify-end",
    between: "justify-between",
  } as const;
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-t border-[var(--color-border)] px-5 py-4",
        alignment[align],
        className,
      )}
    >
      {children}
    </div>
  );
}
