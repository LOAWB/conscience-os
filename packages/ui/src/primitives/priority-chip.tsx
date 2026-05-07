import { cn } from "../lib/cn";
import type { TaskPriority } from "../types";

const styles: Record<TaskPriority, { bg: string; text: string }> = {
  low: { bg: "rgba(148,163,184,0.10)", text: "#94a3b8" },
  medium: { bg: "rgba(59,125,255,0.10)", text: "#9bbcff" },
  high: { bg: "rgba(251,191,36,0.12)", text: "#fbbf24" },
  critical: { bg: "rgba(248,113,113,0.14)", text: "#f87171" },
};

const labels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Med",
  high: "High",
  critical: "Critical",
};

export function PriorityChip({
  level,
  className,
}: {
  level: TaskPriority;
  className?: string;
}) {
  const style = styles[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[0.7rem] font-mono uppercase tracking-wider",
        className,
      )}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {level === "critical" ? (
        <span
          aria-hidden
          className="size-1 rounded-full bg-current animate-pulse"
        />
      ) : null}
      {labels[level]}
    </span>
  );
}
