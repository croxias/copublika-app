// Seeds the content tables with the built-in defaults: pnpm db:seed
// Existing rows are left alone, so this never overwrites edits made in the admin.
import { neon } from "@neondatabase/serverless";
import { DEFAULT_HERO_SLIDES } from "../src/lib/content/hero.schema.ts";

try {
  process.loadEnvFile(".env.local");
} catch {}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✗ DATABASE_URL belum di-set di apps/frontend/.env.local");
  process.exit(1);
}

const sql = neon(url);
let inserted = 0;
for (const s of DEFAULT_HERO_SLIDES) {
  const rows = await sql`
    insert into hero_slides
      (id, kicker, title, title_accent, dek, cta_label, cta_href, secondary_label, secondary_href, image_src, image_alt, status, "order")
    values
      (${s.id}, ${s.kicker}, ${s.title}, ${s.titleAccent}, ${s.dek}, ${s.cta.label}, ${s.cta.href},
       ${s.secondary?.label ?? null}, ${s.secondary?.href ?? null}, ${s.image.src}, ${s.image.alt}, ${s.status}, ${s.order})
    on conflict (id) do nothing
    returning id`;
  inserted += rows.length;
}
console.log(`✓ hero_slides: ${inserted} baris baru, ${DEFAULT_HERO_SLIDES.length - inserted} sudah ada`);
