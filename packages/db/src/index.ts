// @repo/db public surface
// face-d Stage 2 implementation: schema + client + seed.

export * from "./schema";
export { getDb, isDbConnected } from "./client";
export type { DbClient } from "./client";
