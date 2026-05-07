import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * Generic tag — neutral chip used for ad-hoc labels, source tags, tier markers.
 * Distinct from StatusBadge (which encodes pipeline state) and PriorityChip (task priority).
 */
export function Tag({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "demo" | "legacy";
}) {
  const toneStyles = {
    neutral:
      "bg-white/[0.04] text-[var(--color-foreground)]/75 border-white/[0.08]",
    demo: "bg-transparent text-[var(--color-foreground)]/45 border-dashed border-[var(--color-foreground)]/25",
    legacy: "bg-transparent text-amber-300/70 border-amber-300/20",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[0.65rem] uppercase tracking-[0.16em] font-mono",
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
