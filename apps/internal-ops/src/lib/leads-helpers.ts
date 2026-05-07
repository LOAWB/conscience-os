import type { Lead, LeadStatus } from "@repo/db";

// F5: business_name may be null on legacy rows that pre-date the backfill.
// Always read with fallback to the legacy `business` column.
export function leadBusinessName(lead: Lead): string {
  return lead.businessName ?? lead.business;
}

// F6: legacy → canonical pipeline mapping for read-display only. Writes are
// constrained by the Zod validator to INTERNAL_OPS_LEAD_STATUSES.
export function legacyStatusDisplay(status: LeadStatus): {
  label: string;
  pipelineEquivalent: LeadStatus;
  isLegacy: boolean;
} {
  switch (status) {
    case "new":
      return {
        label: "New (legacy)",
        pipelineEquivalent: "new_lead",
        isLegacy: true,
      };
    case "qualified":
      return {
        label: "Qualified (legacy)",
        pipelineEquivalent: "on_hold",
        isLegacy: true,
      };
    case "in_audit":
      return {
        label: "In audit (legacy)",
        pipelineEquivalent: "audit_scheduled",
        isLegacy: true,
      };
    case "archived":
      return {
        label: "Archived (legacy)",
        pipelineEquivalent: "on_hold",
        isLegacy: true,
      };
    case "contacted":
      return {
        label: "Contacted",
        pipelineEquivalent: "contacted",
        isLegacy: false,
      };
    case "won":
      return { label: "Won", pipelineEquivalent: "won", isLegacy: false };
    case "lost":
      return { label: "Lost", pipelineEquivalent: "lost", isLegacy: false };
    case "new_lead":
      return { label: "New", pipelineEquivalent: "new_lead", isLegacy: false };
    case "audit_scheduled":
      return {
        label: "Audit scheduled",
        pipelineEquivalent: "audit_scheduled",
        isLegacy: false,
      };
    case "audit_completed":
      return {
        label: "Audit completed",
        pipelineEquivalent: "audit_completed",
        isLegacy: false,
      };
    case "proposal_sent":
      return {
        label: "Proposal sent",
        pipelineEquivalent: "proposal_sent",
        isLegacy: false,
      };
    case "on_hold":
      return {
        label: "On hold",
        pipelineEquivalent: "on_hold",
        isLegacy: false,
      };
  }
}
