import { cn } from "../lib/cn";

export function ProgressBar({
  value,
  max = 100,
  label,
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="relative flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-accent)]"
          style={{
            width: `${pct}%`,
            boxShadow: "0 0 8px rgba(59,125,255,0.45)",
            transition: "width 200ms ease-out",
          }}
        />
      </div>
      <span className="font-mono text-[0.72rem] text-[var(--color-foreground)]/55 tabular-nums shrink-0">
        {label ?? `${Math.round(pct)}%`}
      </span>
    </div>
  );
}
