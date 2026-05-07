// Status enums mirrored from @repo/db.
// Kept literal here so @repo/ui has no runtime dependency on @repo/db.
// If the db enums change, update both files in lockstep.

export const LEAD_STATUSES = [
  "new_lead",
  "contacted",
  "audit_scheduled",
  "audit_completed",
  "proposal_sent",
  "won",
  "lost",
  "on_hold",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

// Legacy lead values still tolerated on read (face-f maps to canonical for display).
export const LEAD_STATUSES_LEGACY = [
  "new",
  "contacted",
  "qualified",
  "in_audit",
  "won",
  "lost",
  "archived",
] as const;
export type LeadStatusLegacy = (typeof LEAD_STATUSES_LEGACY)[number];

export const CLIENT_STATUSES = ["active", "paused", "offboarded"] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export const PROJECT_STATUSES = [
  "discovery",
  "planning",
  "building",
  "review",
  "deployed",
  "support",
  "complete",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const TASK_STATUSES = [
  "to_do",
  "in_progress",
  "waiting",
  "done",
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["low", "medium", "high", "critical"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const EVENT_TYPES = [
  "audit",
  "call",
  "deadline",
  "follow_up",
  "other",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];
