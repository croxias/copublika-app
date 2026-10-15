import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let client: NeonHttpDatabase<typeof schema> | null = null;

/**
 * Drizzle client over Neon's HTTP driver. Created lazily so pages can still
 * build and fall back to default content when DATABASE_URL is not set.
 */
export function getDb() {
  if (!process.env.DATABASE_URL) return null;
  client ??= drizzle(neon(process.env.DATABASE_URL), { schema });
  return client;
}
