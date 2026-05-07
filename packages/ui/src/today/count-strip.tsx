import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export type Count = {
  label: string;
  value: number;
  href?: string;
  tone?: "default" | "warn";
  hint?: ReactNode;
};

/**
 * Top strip — open leads · active clients · active projects · overdue tasks.
 * One-click drill-down via href. Operator density: small caps + mono numerals.
 */
export function CountStrip({
  counts,
  className,
}: {
  counts: readonly Count[];
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-3", className)}>
      {counts.map((c) => {
        const inner = (
          <div
            className={cn(
              "rounded-xl border border-[var(--color-border)] bg-white/[0.018] hover:bg-white/[0.035] transition-colors duration-150 px-4 py-3.5 backdrop-blur-md",
              c.href && "cursor-pointer",
            )}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[0.68rem] font-mono uppercase tracking-[0.18em] text-[var(--color-foreground)]/55">
                {c.label}
              </span>
              {c.hint ? (
                <span className="text-[0.65rem] text-[var(--color-foreground)]/35 font-mono uppercase tracking-wider">
                  {c.hint}
                </span>
              ) : null}
            </div>
            <div
              className={cn(
                "mt-2 font-mono text-[1.65rem] tabular-nums tracking-tight",
                c.tone === "warn"
                  ? "text-[#fbbf24]"
                  : "text-[var(--color-foreground)]",
              )}
            >
              {c.value}
            </div>
          </div>
        );
        return c.href ? (
          <Link key={c.label} href={c.href} className="block">
            {inner}
          </Link>
        ) : (
          <div key={c.label}>{inner}</div>
        );
      })}
    </div>
  );
}
