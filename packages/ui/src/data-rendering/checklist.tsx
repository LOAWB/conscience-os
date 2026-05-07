"use client";

import { cn } from "../lib/cn";

export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

/**
 * Checklist — used by project deliverables (per M0 schema: jsonb array of {label, done}).
 * Composable for both editable + read-only modes.
 */
export function Checklist({
  items,
  onToggle,
  className,
  emptyState,
  readOnly,
}: {
  items: readonly ChecklistItem[];
  onToggle?: (id: string, next: boolean) => void;
  className?: string;
  emptyState?: React.ReactNode;
  readOnly?: boolean;
}) {
  if (items.length === 0 && emptyState) return <>{emptyState}</>;
  return (
    <ul className={cn("flex flex-col gap-1", className)}>
      {items.map((item) => (
        <li
          key={item.id}
          className={cn(
            "flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors",
            !readOnly && "hover:bg-white/[0.025]",
          )}
        >
          <input
            type="checkbox"
            checked={item.done}
            disabled={readOnly}
            onChange={(e) => onToggle?.(item.id, e.target.checked)}
            className="size-4 rounded border-[var(--color-border-strong)] bg-white/[0.03] accent-[var(--color-accent)]"
          />
          <span
            className={cn(
              "text-sm transition-colors",
              item.done
                ? "text-[var(--color-foreground)]/45 line-through"
                : "text-[var(--color-foreground)]/90",
            )}
          >
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
