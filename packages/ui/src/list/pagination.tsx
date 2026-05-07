"use client";

import { cn } from "../lib/cn";

/**
 * Minimal pagination — operator density. Shows range + prev/next.
 * Numeric page list deferred until lists exceed ~5 pages routinely.
 */
export function Pagination({
  page,
  pageSize,
  total,
  onChange,
  className,
}: {
  page: number; // 1-indexed
  pageSize: number;
  total: number;
  onChange: (next: number) => void;
  className?: string;
}) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < lastPage;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 text-[0.78rem] text-[var(--color-foreground)]/60",
        className,
      )}
    >
      <span className="font-mono tabular-nums">
        {start}–{end} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => canPrev && onChange(page - 1)}
          disabled={!canPrev}
          className={cn(
            "h-8 px-2.5 rounded text-[var(--color-foreground)]/70 hover:bg-white/[0.05] hover:text-[var(--color-foreground)] disabled:opacity-30 disabled:pointer-events-none transition-colors",
          )}
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={() => canNext && onChange(page + 1)}
          disabled={!canNext}
          className={cn(
            "h-8 px-2.5 rounded text-[var(--color-foreground)]/70 hover:bg-white/[0.05] hover:text-[var(--color-foreground)] disabled:opacity-30 disabled:pointer-events-none transition-colors",
          )}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
