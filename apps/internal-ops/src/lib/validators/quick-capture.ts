import { z } from "zod";

const isoDateTime = z.iso.datetime({ offset: true });

const linkTo = z.object({
  type: z.enum(["lead", "client", "project"]),
  id: z.uuid(),
});

export const quickCaptureSchema = z
  .object({
    intent: z.enum(["task", "event", "lead-followup"]),
    text: z.string().trim().min(1).max(8000),
    dueAt: isoDateTime.optional().nullable(),
    linkTo: linkTo.optional().nullable(),
  })
  .refine(
    (q) =>
      q.intent !== "lead-followup" || (!!q.linkTo && q.linkTo.type === "lead"),
    {
      message: "intent='lead-followup' requires linkTo.type='lead' with a uuid",
      path: ["linkTo"],
    },
  );

export type QuickCaptureInput = z.infer<typeof quickCaptureSchema>;
