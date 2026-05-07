import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import type {
  ClientStatus,
  LeadStatus,
  ProjectStatus,
  TaskStatus,
} from "../types";

type StatusVariant = "lead" | "client" | "project" | "task";

type StatusValue = LeadStatus | ClientStatus | ProjectStatus | TaskStatus;

const palette: Record<string, { bg: string; text: string; border: string }> = {
  // neutral cool — pre-engagement
  cool: {
    bg: "rgba(148,163,184,0.10)",
    text: "#cbd5e1",
    border: "rgba(148,163,184,0.28)",
  },
  // active blue — engaged / in progress
  blue: {
    bg: "rgba(59,125,255,0.12)",
    text: "#9bbcff",
    border: "rgba(59,125,255,0.32)",
  },
  // amber — waiting / paused / on-hold
  amber: {
    bg: "rgba(251,191,36,0.10)",
    text: "#fbbf24",
    border: "rgba(251,191,36,0.30)",
  },
  // green — won / done / complete
  green: {
    bg: "rgba(52,211,153,0.10)",
    text: "#34d399",
    border: "rgba(52,211,153,0.30)",
  },
  // red — lost / archived
  red: {
    bg: "rgba(248,113,113,0.10)",
    text: "#f87171",
    border: "rgba(248,113,113,0.30)",
  },
  // violet — proposal / review
  violet: {
    bg: "rgba(167,139,250,0.10)",
    text: "#c4b5fd",
    border: "rgba(167,139,250,0.30)",
  },
};

const leadMap: Record<string, keyof typeof palette> = {
  new_lead: "cool",
  new: "cool",
  contacted: "blue",
  qualified: "blue",
  audit_scheduled: "blue",
  in_audit: "blue",
  audit_completed: "violet",
  proposal_sent: "violet",
  won: "green",
  lost: "red",
  on_hold: "amber",
  archived: "red",
};
const clientMap: Record<ClientStatus, keyof typeof palette> = {
  active: "green",
  paused: "amber",
  offboarded: "cool",
};
const projectMap: Record<ProjectStatus, keyof typeof palette> = {
  discovery: "cool",
  planning: "blue",
  building: "blue",
  review: "violet",
  deployed: "green",
  support: "blue",
  complete: "green",
};
const taskMap: Record<TaskStatus, keyof typeof palette> = {
  to_do: "cool",
  in_progress: "blue",
  waiting: "amber",
  done: "green",
};

const labelMap: Record<string, string> = {
  new_lead: "New",
  new: "New (legacy)",
  contacted: "Contacted",
  qualified: "Qualified (legacy)",
  audit_scheduled: "Audit scheduled",
  in_audit: "In audit (legacy)",
  audit_completed: "Audit complete",
  proposal_sent: "Proposal sent",
  won: "Won",
  lost: "Lost",
  on_hold: "On hold",
  archived: "Archived (legacy)",
  active: "Active",
  paused: "Paused",
  offboarded: "Offboarded",
  discovery: "Discovery",
  planning: "Planning",
  building: "Building",
  review: "Review",
  deployed: "Deployed",
  support: "Support",
  complete: "Complete",
  to_do: "To do",
  in_progress: "In progress",
  waiting: "Waiting",
  done: "Done",
};

function colorForVariant(
  variant: StatusVariant,
  status: string,
): keyof typeof palette {
  switch (variant) {
    case "lead":
      return leadMap[status] ?? "cool";
    case "client":
      return clientMap[status as ClientStatus] ?? "cool";
    case "project":
      return projectMap[status as ProjectStatus] ?? "cool";
    case "task":
      return taskMap[status as TaskStatus] ?? "cool";
  }
}

export function StatusBadge({
  variant,
  status,
  label,
  className,
  children,
}: {
  variant: StatusVariant;
  status: StatusValue | string;
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  const tone = palette[colorForVariant(variant, status as string)];
  const text = label ?? labelMap[status as string] ?? (status as string);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.72rem] font-medium tracking-wide border",
        className,
      )}
      style={{
        backgroundColor: tone.bg,
        color: tone.text,
        borderColor: tone.border,
      }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: tone.text, opacity: 0.85 }}
        aria-hidden
      />
      {children ?? text}
    </span>
  );
}
