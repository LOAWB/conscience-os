"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/**
 * DataList — denser-than-table row stack used as the canonical list surface.
 * Preferred over DataTable per Pory: dense rows, less chrome, "operational
 * command center" feel.
 *
 * Typed generic — caller maps each item to a row.
 */
export type DataListColumn<T> = {
  id: string;
  width?: string; // CSS grid track (e.g. "minmax(0,1fr)" or "120px")
  header: ReactNode;
  cell: (item: T) => ReactNode;
  align?: "left" | "right";
};

export function DataList<T>({
  items,
  columns,
  rowKey,
  onRowClick,
  className,
  emptyState,
}: {
  items: readonly T[];
  columns: DataListColumn<T>[];
  rowKey: (item: T, index: number) => string;
  onRowClick?: (item: T) => void;
  className?: string;
  emptyState?: ReactNode;
}) {
  const gridTemplate = columns.map((c) => c.width ?? "minmax(0,1fr)").join(" ");

  if (items.length === 0 && emptyState) {
    return <div className={className}>{emptyState}</div>;
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border)] overflow-hidden",
        className,
      )}
    >
      <div
        role="row"
        className="grid items-center gap-4 px-4 py-2.5 text-[0.7rem] font-mono uppercase tracking-[0.16em] text-[var(--color-foreground)]/45 bg-white/[0.015] border-b border-[var(--color-border)]"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {columns.map((col) => (
          <div
            key={col.id}
            className={cn(col.align === "right" && "text-right")}
          >
            {col.header}
          </div>
        ))}
      </div>
      <ul className="divide-y divide-[var(--color-border)]">
        {items.map((item, i) => {
          const interactive = !!onRowClick;
          return (
            <li
              key={rowKey(item, i)}
              role="row"
              {...(interactive
                ? {
                    tabIndex: 0,
                    onClick: () => onRowClick(item),
                    onKeyDown: (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowClick(item);
                      }
                    },
                  }
                : {})}
              className={cn(
                "grid items-center gap-4 px-4 py-3.5 text-sm",
                interactive &&
                  "cursor-pointer hover:bg-white/[0.025] focus:bg-white/[0.04] focus:outline-none transition-colors duration-100",
              )}
              style={{ gridTemplateColumns: gridTemplate }}
            >
              {columns.map((col) => (
                <div
                  key={col.id}
                  className={cn(
                    "min-w-0",
                    col.align === "right" && "text-right",
                  )}
                >
                  {col.cell(item)}
                </div>
              ))}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
