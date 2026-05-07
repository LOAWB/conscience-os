import { cn } from "../lib/cn";

export function EntityListLoading({
  rows = 6,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border)] divide-y divide-[var(--color-border)] overflow-hidden",
        className,
      )}
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3.5 animate-pulse"
        >
          <span className="size-8 rounded-md bg-white/[0.04]" />
          <span className="h-4 rounded bg-white/[0.04] flex-1 max-w-[40%]" />
          <span className="h-4 rounded bg-white/[0.04] w-20" />
          <span className="h-4 rounded bg-white/[0.04] w-16" />
        </div>
      ))}
    </div>
  );
}
