import { BLOG_ARTICLES } from '@/lib/data/blog-articles';
import { fallbackEvents } from '@/lib/data/fallbacks';
import { EVENTS as LANDING_EVENTS } from '@/components/landing/EventsList';
import type { CmsItem } from '../types';
import { personId } from '../slug';
import { PEOPLE } from './people';
import type { SeedPart } from './types';
import { SEEDED_AT } from './types';

// Blog: the article catalog the public /blog page renders today. Authors that are in the
// people library are linked to it; anyone else is seeded as a guest author.
// "Fajar Ramadhan" in the catalog is "Fajar Ramadhan, Ph.D." in the library.
const personOf = (name: string) => PEOPLE.find((p) => p.name === name || p.name.startsWith(`${name},`));

const blog: CmsItem[] = BLOG_ARTICLES.map((a, i) => {
  const person = personOf(a.author);
  return {
    id: `blog-${a.slug}`,
    title: a.title,
    slug: a.slug,
    category: a.category,
    excerpt: a.excerpt,
    cover: a.cover,
    coverAlt: a.title,
    guestAuthor: !person,
    authorId: person ? personId(person.name) : '',
    author: a.author,
    authorAffiliation: '',
    // The catalog only has YYYY-MM; pin to the first of the month.
    publishAt: `${a.date}-01T08:00`,
    readTime: a.readTime.replace('min', 'menit'),
    content: a.content,
    editorsPick: !!a.editorsPick,
    editorNote: a.editorNote ?? '',
    metaTitle: '',
    metaDescription: '',
    status: 'published',
    order: i + 1,
    updatedAt: SEEDED_AT,
  };
});

const FORMAT: Record<string, string> = { daring: 'online', luring: 'offline', hybrid: 'hybrid' };


const PARAGRAPH_BREAK = '\n\n';

// The landing agenda keeps its card subtitle; dates come from the detail data (WIB).
const landingFor = (i: number) => (i < LANDING_EVENTS.length ? LANDING_EVENTS[i] : undefined);
const wib = (iso: string) => {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return { date: `${get('year')}-${get('month')}-${get('day')}`, time: `${get('hour')}:${get('minute')}` };
};

const events: CmsItem[] = fallbackEvents.map((e, i) => {
  const landing = landingFor(i);
  const [, where] = e.location.split(' · ');
  const w = wib(e.date);
  return {
    id: e.id,
    title: e.title,
    slug: e.slug,
    type: e.type ?? 'webinar',
    sub: landing?.sub ?? '',
    summary: e.description,
    about: (e.blocks ?? []).flatMap((b) => b.paragraphs ?? []).join(PARAGRAPH_BREAK),
    gains: (e.blocks ?? []).flatMap((b) => b.checkmarks ?? []),
    date: w.date,
    time: w.time,
    duration: e.duration ?? '',
    format: FORMAT[(e.format ?? e.location).split(' ')[0].toLowerCase()] ?? 'online',
    location: where ?? e.location,
    language: e.language ?? 'Indonesia',
    isPaid: e.isPaid,
    price: e.isPaid ? 150000 : '',
    memberOnly: !!e.memberOnly,
    capacity: e.capacity,
    registrationUrl: '',
    pinned: false,
    phaseOverride: '',
    guestSpeaker: true,
    speakerId: '',
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
