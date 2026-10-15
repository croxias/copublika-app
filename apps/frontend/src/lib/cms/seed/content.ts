import { BLOG_ARTICLES } from '@/lib/data/blog-articles';
import { fallbackEvents } from '@/lib/data/fallbacks';
import { EVENTS as LANDING_EVENTS } from '@/components/landing/EventsList';
import type { Event } from '@/types';
import type { CmsItem } from '../types';
import type { SeedPart } from './types';
import { SEEDED_AT } from './types';

// Blog: the article catalog the public /blog page renders today.
const blog: CmsItem[] = BLOG_ARTICLES.map((a, i) => ({
  id: `blog-${a.slug}`,
  title: a.title,
  slug: a.slug,
  category: a.category,
  excerpt: a.excerpt,
  cover: a.cover,
  coverAlt: a.title,
  author: a.author,
  // The catalog only has YYYY-MM; pin to the first of the month.
  publishAt: `${a.date}-01T08:00`,
  readTime: a.readTime.replace('min', 'menit'),
  content: a.content,
  featured: !!a.featured,
  metaTitle: '',
  metaDescription: '',
  status: 'published',
  order: i + 1,
  updatedAt: SEEDED_AT,
}));

const FORMAT: Record<string, string> = { daring: 'online', luring: 'offline', hybrid: 'hybrid' };

/** Event detail blocks as Markdown, so the description field holds the full page copy. */
function toMarkdown(e: Event): string {
  const parts = [e.description];
  for (const b of e.blocks ?? []) {
    parts.push(`## ${b.heading}`);
    parts.push(...(b.paragraphs ?? []));
    if (b.checkmarks?.length) parts.push(b.checkmarks.map((c) => `- ${c}`).join('\n'));
  }
  return parts.join('\n\n');
}

// The landing agenda (components/landing/EventsList.tsx) lists the first four
// detail-page events with newer dates and a card subtitle; it wins on those.
const landingFor = (i: number) => (i < LANDING_EVENTS.length ? LANDING_EVENTS[i] : undefined);

const events: CmsItem[] = fallbackEvents.map((e, i) => {
  const landing = landingFor(i);
  const [, where] = e.location.split(' · ');
  return {
    id: e.id,
    title: e.title,
    slug: e.slug,
    type: e.type ?? 'webinar',
    sub: landing?.sub ?? '',
    description: toMarkdown(e),
    date: landing?.date ?? e.date.slice(0, 10),
    time: (e.time ?? '').slice(0, 5).replace('.', ':'),
    duration: e.duration ?? '',
    format: FORMAT[(e.format ?? e.location).split(' ')[0].toLowerCase()] ?? 'online',
    location: where ?? e.location,
    language: e.language ?? 'Indonesia',
    isPaid: e.isPaid,
    price: '',
    memberOnly: !!e.memberOnly,
    capacity: e.capacity,
    registrationUrl: '',
    phaseOverride: '',
    speakerName: e.speaker?.name ?? '',
    speakerRole: e.speaker?.role ?? '',
    speakerAvatar: e.speaker?.avatar ?? '',
    speakerBadges: e.speaker?.badges ?? [],
    schedule: (e.schedule ?? []).map((s) => ({ time: s.time, title: s.title, description: s.description })),
    targetAudience: e.targetAudience ?? [],
    benefits: e.benefits ?? [],
    status: 'published',
    order: i + 1,
    updatedAt: SEEDED_AT,
  };
});

export const seed: SeedPart = { collections: { blog, events } };
