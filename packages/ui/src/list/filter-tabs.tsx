"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/cn";

type Item<V extends string> = {
  value: V;
  label: ReactNode;
  count?: number;
};

/**
 * Segmented filter tabs — primary list filter affordance.
 * Operational density: small caps, mono count, single-row.
 *
 * Aliased as SegmentedControl for the discoverable name.
 */
export function FilterTabs<V extends string>({
  items,
  value,
  onChange,
  className,
}: {
  items: Item<V>[];
  value: V;
  onChange: (next: V) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-[var(--color-border)] bg-white/[0.02] p-1",
        className,
      )}
    >
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(it.value)}
            className={cn(
              "inline-flex items-center gap-2 rounded px-3 py-1.5 text-[0.78rem] font-medium tracking-wide transition-colors duration-150",
              active
                ? "bg-[rgba(59,125,255,0.18)] text-[#cbdaff] border border-[rgba(59,125,255,0.32)]"
                : "text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)] hover:bg-white/[0.04] border border-transparent",
            )}
          >
            <span>{it.label}</span>
            {typeof it.count === "number" ? (
              <span className="font-mono text-[0.68rem] tabular-nums text-[var(--color-foreground)]/45">
                {it.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export const SegmentedControl = FilterTabs;
