import { z } from "zod";
import { taskStatusEnum, taskPriorityEnum } from "@repo/db";

const taskStatusSchema = z.enum(taskStatusEnum.enumValues);
const taskPrioritySchema = z.enum(taskPriorityEnum.enumValues);
const isoDateTime = z.iso.datetime({ offset: true });

export const createTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(300),
    description: z.string().trim().max(8000).optional().nullable(),
    status: taskStatusSchema.default("to_do"),
    priority: taskPrioritySchema.default("medium"),
    dueDate: isoDateTime.optional().nullable(),
    clientId: z.uuid().optional().nullable(),
    projectId: z.uuid().optional().nullable(),
    leadId: z.uuid().optional().nullable(),
  })
  .refine((t) => !(t.clientId && t.leadId) || !!t.projectId, {
    message:
      "Tasks may link to (clientId+projectId), leadId, or be free-floating; cannot link to both client and lead without a project context.",
  });

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(300).optional(),
  description: z.string().trim().max(8000).optional().nullable(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  dueDate: isoDateTime.optional().nullable(),
  clientId: z.uuid().optional().nullable(),
  projectId: z.uuid().optional().nullable(),
  leadId: z.uuid().optional().nullable(),
});

export const taskIdParam = z.object({ id: z.uuid() });

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
