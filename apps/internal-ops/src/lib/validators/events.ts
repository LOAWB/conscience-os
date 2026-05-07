import { z } from "zod";
import { eventTypeEnum } from "@repo/db";

const eventTypeSchema = z.enum(eventTypeEnum.enumValues);
const isoDateTime = z.iso.datetime({ offset: true });

export const createEventSchema = z.object({
  title: z.string().trim().min(1).max(300),
  type: eventTypeSchema.default("other"),
  dateTime: isoDateTime,
  durationMinutes: z.coerce
    .number()
    .int()
    .min(1)
    .max(60 * 24)
    .default(30),
  clientId: z.uuid().optional().nullable(),
  leadId: z.uuid().optional().nullable(),
  projectId: z.uuid().optional().nullable(),
  notes: z.string().trim().max(8000).optional().nullable(),
});

export const updateEventSchema = createEventSchema.partial();
export const eventIdParam = z.object({ id: z.uuid() });

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
