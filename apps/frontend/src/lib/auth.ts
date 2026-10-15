import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { getDb } from "@/db";
import * as schema from "@/db/schema";

const db = getDb();
if (!db) throw new Error("DATABASE_URL belum di-set di apps/frontend/.env.local");

/** Member accounts for the public site (email + password). Admin login is separate. */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user: schema.user, session: schema.session, account: schema.account, verification: schema.verification },
    // Neon's HTTP driver has no interactive transactions.
    transaction: false,
  }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
  plugins: [nextCookies()],
});

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}
