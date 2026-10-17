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
    memberPrice: e.isPaid ? 100000 : '',
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

// A finished webinar, so Agenda Event → Pendaftar → Selesai and the Peserta history have data.
const pastEvent: CmsItem = {
  id: 'event-past-1',
  title: 'Webinar: Menulis Abstrak yang Dilirik Editor',
  slug: 'webinar-menulis-abstrak',
  type: 'webinar',
  sub: 'Struktur abstrak 250 kata yang lolos desk review',
  summary: 'Membedah struktur abstrak yang membuat editor mau membaca lebih jauh, lengkap dengan contoh sebelum dan sesudah revisi.',
  about: 'Sesi praktis membedah 6 abstrak peserta secara langsung.\n\nPeserta membawa draf abstrak sendiri dan mendapat umpan balik.',
  gains: ['Template abstrak 5 kalimat', 'Contoh sebelum dan sesudah revisi', 'Sertifikat peserta'],
  date: '2026-09-19',
  time: '19:30',
  duration: '90 menit',
  format: 'online',
  location: 'Zoom',
  language: 'Indonesia',
  isPaid: false,
  price: '',
  memberPrice: '',
  memberOnly: false,
  capacity: 200,
  registrationUrl: '',
  pinned: false,
  phaseOverride: '',
  guestSpeaker: false,
  speakerId: 'person-dr-maya-rahmawati',
  speakerName: '',
  speakerRole: '',
  speakerAvatar: '',
  speakerBadges: [],
  schedule: [],
  targetAudience: ['Dosen dan peneliti yang sedang menyiapkan submission'],
  benefits: ['Rekaman sesi', 'Sertifikat'],
  status: 'published',
  order: events.length + 1,
  updatedAt: SEEDED_AT,
};

// More finished events (two years) so the Selesai table can be searched, filtered and paged.
const past = (id: string, title: string, slug: string, type: string, date: string, time: string, extra: Partial<CmsItem> = {}): CmsItem => ({
  ...pastEvent,
  id,
  title,
  slug,
  type,
  sub: '',
  summary: title,
  date,
  time,
  speakerId: 'person-dr-ade-putranto',
  order: events.length + 2,
  ...extra,
});
const morePast: CmsItem[] = [
  past('event-past-2', 'Klinik Manuskrip: Cover Letter yang Meyakinkan Editor', 'klinik-cover-letter', 'clinic', '2026-08-22', '19:30', { isPaid: true, price: 100000, memberPrice: 50000, capacity: 60 }),
  past('event-past-3', 'Workshop Luring: Analisis Data Kualitatif dengan NVivo', 'workshop-nvivo', 'workshop', '2026-07-12', '09:00', { isPaid: true, price: 200000, memberPrice: 150000, capacity: 40, format: 'offline', location: 'Bandung', duration: '1 hari' }),
  past('event-past-4', 'Webinar: Memilih Jurnal Q1 untuk Peneliti Pemula', 'webinar-memilih-jurnal-q1', 'webinar', '2026-06-20', '19:30', { capacity: 300 }),
  past('event-past-5', 'Forum Member: Kolaborasi Riset Lintas Kampus', 'forum-kolaborasi-lintas-kampus', 'forum', '2025-11-15', '13:00', { memberOnly: true, capacity: 80 }),
  past('event-past-6', 'Webinar: Etika Publikasi dan Jurnal Predator', 'webinar-etika-publikasi', 'webinar', '2025-09-06', '19:30', { capacity: 400 }),
];

export const seed: SeedPart = { collections: { blog, events: [...events, pastEvent, ...morePast] } };
