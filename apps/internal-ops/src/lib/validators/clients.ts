import { z } from "zod";
import { clientStatusEnum } from "@repo/db";

const clientStatusSchema = z.enum(clientStatusEnum.enumValues);

export const importantLinkSchema = z.object({
  label: z.string().trim().min(1).max(200),
  url: z.url().max(2000),
});

export const createClientSchema = z.object({
  businessName: z.string().trim().min(1).max(200),
  contactName: z.string().trim().min(1).max(200),
  email: z.email().max(320).optional().nullable(),
  phone: z.string().trim().max(40).optional().nullable(),
  status: clientStatusSchema.default("active"),
  notes: z.string().trim().max(8000).optional().nullable(),
  importantLinks: z.array(importantLinkSchema).max(50).default([]),
});

export const updateClientSchema = createClientSchema.partial();
export const clientIdParam = z.object({ id: z.uuid() });

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type ImportantLink = z.infer<typeof importantLinkSchema>;
