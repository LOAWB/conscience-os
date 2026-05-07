import { cn } from "../lib/cn";

export function EntityDetailLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex items-center gap-4 animate-pulse">
        <span className="size-12 rounded-lg bg-white/[0.04]" />
        <div className="flex flex-col gap-2 flex-1">
          <span className="h-5 rounded bg-white/[0.04] w-1/3" />
          <span className="h-3 rounded bg-white/[0.04] w-1/4" />
        </div>
      </div>
      <div className="rounded-xl border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[180px_1fr] gap-6 px-5 py-4 animate-pulse"
          >
            <span className="h-3 rounded bg-white/[0.04] w-2/3" />
            <span className="h-3 rounded bg-white/[0.04]" />
          </div>
        ))}
      </div>
    </div>
  );
}
