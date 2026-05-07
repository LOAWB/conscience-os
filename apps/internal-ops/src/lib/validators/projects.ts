import { z } from "zod";
import { projectStatusEnum } from "@repo/db";

const projectStatusSchema = z.enum(projectStatusEnum.enumValues);
const isoDateTime = z.iso.datetime({ offset: true });

export const deliverableSchema = z.object({
  label: z.string().trim().min(1).max(300),
  done: z.boolean().default(false),
  dueAt: isoDateTime.optional().nullable(),
});

export const createProjectSchema = z.object({
  clientId: z.uuid(),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(8000).optional().nullable(),
  status: projectStatusSchema.default("discovery"),
  dueDate: isoDateTime.optional().nullable(),
  deliverables: z.array(deliverableSchema).max(100).default([]),
  internalNotes: z.string().trim().max(8000).optional().nullable(),
});

export const updateProjectSchema = createProjectSchema.partial();
export const updateDeliverablesSchema = z.object({
  deliverables: z.array(deliverableSchema).max(100),
});

export const projectIdParam = z.object({ id: z.uuid() });

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type Deliverable = z.infer<typeof deliverableSchema>;
