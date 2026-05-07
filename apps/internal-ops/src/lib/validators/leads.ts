import { z } from "zod";
import { INTERNAL_OPS_LEAD_STATUSES, tierEnum } from "@repo/db";

const tierSchema = z.enum(tierEnum.enumValues);
// F7: writes constrained to the canonical 8-state pipeline; legacy enum
// values are read-only display.
const leadStatusWriteSchema = z.enum(INTERNAL_OPS_LEAD_STATUSES);

const isoDateTime = z.iso.datetime({ offset: true });

export const createLeadSchema = z.object({
  name: z.string().trim().min(1).max(200),
  // F4: businessName is the canonical field exposed at the API boundary.
  // The handler dual-writes it to both `business` and `business_name` columns.
  businessName: z.string().trim().min(1).max(200),
  email: z.email().max(320),
  phone: z.string().trim().max(40).optional().nullable(),
  businessType: z.string().trim().max(120).default(""),
  problems: z.string().trim().max(4000).default(""),
  tools: z.string().trim().max(4000).default(""),
  outcome: z.string().trim().max(4000).default(""),
  tier: tierSchema.default("audit"),
  status: leadStatusWriteSchema.default("new_lead"),
  source: z.string().trim().max(80).default("website"),
  notes: z.string().trim().max(8000).optional().nullable(),
  nextFollowUpAt: isoDateTime.optional().nullable(),
});

export const updateLeadSchema = createLeadSchema.partial();

export const leadIdParam = z.object({ id: z.uuid() });

export const createLeadNoteSchema = z.object({
  body: z.string().trim().min(1).max(8000),
  author: z.string().trim().min(1).max(200).default("Operator"),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type CreateLeadNoteInput = z.infer<typeof createLeadNoteSchema>;
