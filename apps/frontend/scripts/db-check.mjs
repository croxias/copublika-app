// Quick connectivity check: pnpm db:check
import { neon } from "@neondatabase/serverless";

try {
  process.loadEnvFile(".env.local");
} catch {}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✗ DATABASE_URL belum di-set di apps/frontend/.env.local");
  process.exit(1);
}

try {
  const sql = neon(url);
  const [row] = await sql`select current_database() as db, version() as version`;
  console.log(`✓ Terhubung ke database "${row.db}"`);
  console.log(`  ${row.version.split(",")[0]}`);
} catch (err) {
  console.error("✗ Gagal terhubung:", err.message);
  process.exit(1);
}
