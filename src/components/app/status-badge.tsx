import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/db/schema";

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-accent/10 text-accent border-accent/30",
  contacted: "bg-warn/10 text-warn border-warn/30",
  qualified: "bg-success/10 text-success border-success/30",
  in_audit: "bg-accent/15 text-accent border-accent/40",
  won: "bg-success/15 text-success border-success/40",
  lost: "bg-white/[0.04] text-subtle border-white/10",
  archived: "bg-white/[0.02] text-subtle border-white/[0.06]",
};

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  in_audit: "In audit",
  won: "Won",
  lost: "Lost",
  archived: "Archived",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-[0.7rem] font-medium border font-mono uppercase tracking-wider",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
