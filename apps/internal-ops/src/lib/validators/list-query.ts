import { z } from "zod";

export const listQuerySchema = z.object({
  search: z.string().trim().min(1).max(200).optional(),
  status: z.string().trim().min(1).max(64).optional(),
  sort: z.string().trim().min(1).max(64).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type ListQuery = z.infer<typeof listQuerySchema>;

export function parseListQuery(url: URL): ListQuery {
  const raw = Object.fromEntries(url.searchParams.entries());
  return listQuerySchema.parse(raw);
}
