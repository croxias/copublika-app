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
  // New members wait for admin approval and an activation link, so signing up never signs in.
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: false,
    resetPasswordTokenExpiresIn: 60 * 60,
    // Email delivery is not wired yet (backend phase). Until then the link is written to the
    // server log so the reset flow can be tested end to end.
    sendResetPassword: async ({ user, url }) => {
      console.info(`[auth] Link atur ulang password untuk ${user.email}: ${url}`);
    },
  },
  session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
  plugins: [nextCookies()],
});

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}
