import { z } from "zod";

const longText = z.string().trim().max(20000).optional().nullable();

export const createAuditSchema = z
  .object({
    leadId: z.uuid().optional().nullable(),
    clientId: z.uuid().optional().nullable(),
    businessOverview: longText,
    currentTools: longText,
    painPoints: longText,
    opportunities: longText,
    recommendedSystems: longText,
    nextSteps: longText,
  })
  .refine((a) => !!a.leadId || !!a.clientId, {
    message: "Audit must attach to a lead or a client (CHECK constraint).",
  });

// Audit→subject linkage (leadId/clientId) is set at create time only; PATCH
// CANNOT mutate it. This preserves the DB CHECK constraint
// `(lead_id IS NOT NULL) OR (client_id IS NOT NULL)` without per-request
// refines, since PATCH simply has no field that could null both columns.
// To re-attach an audit, delete and recreate.
export const updateAuditSchema = z.object({
  businessOverview: longText,
  currentTools: longText,
  painPoints: longText,
  opportunities: longText,
  recommendedSystems: longText,
  nextSteps: longText,
});

export const auditIdParam = z.object({ id: z.uuid() });

export type CreateAuditInput = z.infer<typeof createAuditSchema>;
export type UpdateAuditInput = z.infer<typeof updateAuditSchema>;
