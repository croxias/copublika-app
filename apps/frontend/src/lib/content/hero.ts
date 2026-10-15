import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getDb } from "@/db";
import { heroSlides } from "@/db/schema";
import { DEFAULT_HERO_SLIDES, heroSlideSchema, type HeroSlide } from "./hero.schema";

export { DEFAULT_HERO_SLIDES, heroSlideSchema, type HeroSlide };

/** Cache tag for the hero slides; the admin save action revalidates it. */
export const HERO_SLIDES_TAG = "hero-slides";

type HeroSlideRow = typeof heroSlides.$inferSelect;

export const rowToSlide = (r: HeroSlideRow): unknown => ({
  id: r.id,
  kicker: r.kicker,
  title: r.title,
  titleAccent: r.titleAccent,
  dek: r.dek,
  cta: { label: r.ctaLabel, href: r.ctaHref },
  secondary: r.secondaryLabel && r.secondaryHref ? { label: r.secondaryLabel, href: r.secondaryHref } : null,
  image: { src: r.imageSrc, alt: r.imageAlt },
  status: r.status,
  order: r.order,
});

const readPublished = unstable_cache(
  async (): Promise<unknown[] | null> => {
    const db = getDb();
    if (!db) return null;
    const rows = await db.select().from(heroSlides).where(eq(heroSlides.status, "published")).orderBy(asc(heroSlides.order));
    return rows.map(rowToSlide);
  },
  ["hero-slides:published"],
  { tags: [HERO_SLIDES_TAG] },
);

/**
 * Published slides in display order, from the database. Falls back to the
 * built-in defaults when the database is not configured, unreachable or empty,
 * and drops rows that fail validation rather than breaking the landing page.
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
  let rows: unknown[] | null = null;
  try {
    rows = await readPublished();
  } catch (err) {
    console.error("[content] hero slides: database read failed, using defaults", err);
  }
  const slides = (rows ?? []).flatMap((row) => {
    const parsed = heroSlideSchema.safeParse(row);
    return parsed.success ? [parsed.data] : [];
  });
  return slides.length ? slides : DEFAULT_HERO_SLIDES.filter((s) => s.status === "published");
}
