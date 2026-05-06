import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

let client: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function isDbConnected(): boolean {
  return Boolean(databaseUrl);
}

export function getDb() {
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not configured. Set it in Vercel env or .env.local.",
    );
  }
  if (!dbInstance) {
    client = postgres(databaseUrl, {
      prepare: false,
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    dbInstance = drizzle(client, { schema });
  }
  return dbInstance;
}

export { schema };
