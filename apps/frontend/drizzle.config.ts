import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside Next, so load .env.local ourselves.
try {
  process.loadEnvFile(".env.local");
} catch {
  // Fall back to variables already in the environment (CI, Vercel).
}

// Migrations need a direct (unpooled) connection; the app uses the pooled one.
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL belum di-set di apps/frontend/.env.local");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  strict: true,
});
