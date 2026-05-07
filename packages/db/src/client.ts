import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type DbClient = ReturnType<typeof drizzle<typeof schema>>;

const cache: {
  client: ReturnType<typeof postgres> | null;
  db: DbClient | null;
} = {
  client: null,
  db: null,
};

export function isDbConnected(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb(): DbClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not configured. Set it in the service env or .env.local.",
    );
  }
  if (!cache.db) {
    cache.client = postgres(url, {
      prepare: false,
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    cache.db = drizzle(cache.client, { schema });
  }
  return cache.db;
}

export { schema };
