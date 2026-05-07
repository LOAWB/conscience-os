"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/cn";

type Tab<V extends string> = {
  value: V;
  label: ReactNode;
  count?: number;
};

export function Tabs<V extends string>({
  items,
  value,
  onChange,
  className,
}: {
  items: Tab<V>[];
  value: V;
  onChange: (next: V) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center gap-1 border-b border-[var(--color-border)]",
        className,
      )}
    >
      {items.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative px-3.5 py-2.5 text-[0.85rem] font-medium transition-colors duration-150 -mb-px border-b-2",
              active
                ? "text-[var(--color-foreground)] border-[var(--color-accent)]"
                : "text-[var(--color-foreground)]/55 border-transparent hover:text-[var(--color-foreground)]/85",
            )}
          >
            {tab.label}
            {typeof tab.count === "number" ? (
              <span className="ml-2 font-mono text-[0.7rem] text-[var(--color-foreground)]/45 tabular-nums">
                {tab.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
