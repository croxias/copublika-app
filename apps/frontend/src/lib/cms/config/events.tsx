import type { CmsItem, CollectionConfig, Option, StatusTone, Values } from '../types';
import { PUBLISH_ARCHIVE_STATUSES } from './status';
import { formatDate } from '@/components/admin/cms/ui';

export type EventPhase = 'upcoming' | 'live' | 'ended';

export const PHASES: (Option & { value: EventPhase; tone: StatusTone })[] = [
  { value: 'upcoming', label: 'Upcoming', tone: 'info' },
  { value: 'live', label: 'Live', tone: 'live' },
  { value: 'ended', label: 'Selesai', tone: 'muted' },
];

/** Values match the public TypeBadge classes (td-type webinar/clinic/…). */
export const EVENT_TYPES: Option[] = [
  { value: 'webinar', label: 'Webinar' },
  { value: 'clinic', label: 'Klinik' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'forum', label: 'Forum' },
];

const FORMATS: Option[] = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
  { value: 'hybrid', label: 'Hybrid' },
];

/** "90 menit", "2 jam", "2 hari" → minutes. Unknown text counts as two hours. */
function durationMinutes(text: unknown): number {
  const m = /(\d+(?:[.,]\d+)?)\s*(menit|jam|hari)/i.exec(String(text ?? ''));
  if (!m) return 120;
  const n = Number(m[1].replace(',', '.'));
  return m[2].toLowerCase() === 'menit' ? n : m[2].toLowerCase() === 'jam' ? n * 60 : n * 24 * 60;
}

/** Upcoming → Live while it runs → Selesai, from date + time + duration; an override wins. */
export function eventPhase(x: Values, now = Date.now()): EventPhase {
  if (x.phaseOverride === 'upcoming' || x.phaseOverride === 'live' || x.phaseOverride === 'ended') return x.phaseOverride;
  const date = String(x.date ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'upcoming';
  const start = new Date(`${date}T${/^\d{2}:\d{2}$/.test(String(x.time ?? '')) ? x.time : '00:00'}:00`).getTime();
  const end = start + durationMinutes(x.duration) * 60_000;
  return now < start ? 'upcoming' : now <= end ? 'live' : 'ended';
}

function PhaseBadge({ item }: { item: Values }) {
  const p = PHASES.find((x) => x.value === eventPhase(item))!;
  return (
    <span className={`cms-badge cms-badge--${p.tone}`} title={item.phaseOverride ? 'Diatur manual' : 'Otomatis dari tanggal'}>
      {p.label}
      {item.phaseOverride ? ' · manual' : ''}
    </span>
  );
}

const PHASE_RANK: Record<EventPhase, number> = { live: 0, upcoming: 1, ended: 2 };
const dateValue = (x: CmsItem) => new Date(String(x.date ?? '')).getTime() || 0;

/** Events: /event, /event/[slug] and the landing EventsBoard. */
export const eventsConfig: CollectionConfig = {
  key: 'events',
  singular: 'event',
  statuses: PUBLISH_ARCHIVE_STATUSES,
  initialStatus: 'draft',
  drawer: 'lg',
  // Running and upcoming events first (soonest on top), finished ones after (latest on top).
  sortBy: (a, b) => {
    const pa = eventPhase(a);
    const pb = eventPhase(b);
    if (pa !== pb) return PHASE_RANK[pa] - PHASE_RANK[pb];
    return pa === 'ended' ? dateValue(b) - dateValue(a) : dateValue(a) - dateValue(b);
  },
  titleOf: (x) => String(x.title ?? ''),
  subtitleOf: (x) => [x.location, FORMATS.find((f) => f.value === x.format)?.label].filter(Boolean).join(' · '),
  publicHref: (x) => (x.slug ? `/event/${x.slug}` : null),
  columns: [
    { label: 'Tanggal', width: '130px', render: (x) => <span className="cms-nowrap">{formatDate(String(x.date ?? ''))}{x.time ? <small className="cms-muted"> · {String(x.time)}</small> : null}</span> },
    { label: 'Fase', width: '130px', render: (x) => <PhaseBadge item={x} /> },
    { label: 'Tipe', width: '110px', render: (x) => <span className="cms-pill">{EVENT_TYPES.find((t) => t.value === x.type)?.label ?? '—'}</span> },
  ],
  filter: { label: 'Fase', options: () => PHASES, match: (x, v) => eventPhase(x) === v },
  defaults: () => ({
    title: '',
    slug: '',
    type: 'webinar',
    sub: '',
    description: '',
    date: '',
    time: '19:30',
    duration: '90 menit',
    format: 'online',
    location: '',
    language: 'Indonesia',
    isPaid: false,
    price: '',
    memberOnly: false,
    capacity: '',
    registrationUrl: '',
    phaseOverride: '',
    speakerName: '',
    speakerRole: '',
    speakerAvatar: '',
    speakerBadges: [],
    schedule: [],
    targetAudience: [],
    benefits: [],
  }),
  fields: [
    { key: 'title', label: 'Judul event', type: 'text', required: true, max: 120, wide: true },
    { key: 'slug', label: 'Slug (alamat URL)', type: 'slug', from: 'title', required: true, help: 'Tampil sebagai copublika.id/event/slug.' },
    { key: 'type', label: 'Tipe event', type: 'select', required: true, options: EVENT_TYPES },
    { key: 'sub', label: 'Subjudul kartu beranda', type: 'text', max: 80, wide: true, help: 'Satu kalimat pendek di kartu agenda Beranda, mis. pembicara.' },
    { type: 'heading', key: 'when', label: 'Waktu & tempat' },
    { key: 'date', label: 'Tanggal', type: 'date', required: true },
    { key: 'time', label: 'Jam mulai (WIB)', type: 'time' },
    { key: 'duration', label: 'Durasi', type: 'text', max: 24, placeholder: '90 menit · 2 jam · 2 hari' },
    { key: 'format', label: 'Format', type: 'select', required: true, options: FORMATS },
    { key: 'location', label: 'Lokasi', type: 'text', required: true, max: 80, placeholder: 'Zoom · Yogyakarta · Hybrid Jakarta' },
    { key: 'language', label: 'Bahasa', type: 'text', max: 24 },
    {
      key: 'phaseOverride',
      label: 'Fase',
      type: 'select',
      wide: true,
      options: [
        { value: 'upcoming', label: 'Paksa: Upcoming' },
        { value: 'live', label: 'Paksa: Live' },
        { value: 'ended', label: 'Paksa: Selesai' },
      ],
      help: 'Kosong (—) = otomatis: Upcoming sebelum mulai, Live selama acara (jam mulai + durasi), lalu Selesai. Pilih manual hanya jika jadwal berubah mendadak.',
    },
    { type: 'heading', key: 'access', label: 'Akses & pendaftaran' },
    { key: 'isPaid', label: 'Event berbayar', type: 'toggle' },
    { key: 'price', label: 'Harga', type: 'number', min: 0, suffix: 'Rupiah', visibleIf: (v) => !!v.isPaid },
    { key: 'memberOnly', label: 'Khusus anggota', type: 'toggle', help: 'Anggota mendaftar dari dashboard member; tamu diarahkan untuk bergabung dulu.' },
    { key: 'capacity', label: 'Kuota peserta', type: 'number', min: 1, suffix: 'orang' },
    { key: 'registrationUrl', label: 'Link pendaftaran', type: 'url', wide: true, help: 'Kosongkan untuk memakai form pendaftaran CoPublika.' },
    { type: 'heading', key: 'h-speaker', label: 'Pembicara', help: 'Tampil di halaman detail event dan di bawah judul pada daftar /event.' },
    { key: 'speakerName', label: 'Nama pembicara', type: 'text', max: 60 },
    { key: 'speakerRole', label: 'Jabatan / afiliasi', type: 'text', max: 80 },
    { key: 'speakerAvatar', label: 'Foto pembicara (URL)', type: 'image', wide: true },
    { key: 'speakerBadges', label: 'Label kredensial', type: 'tags', max: 4, placeholder: 'mis. Reviewer Q1' },
    { type: 'heading', key: 'content', label: 'Isi halaman event' },
    { key: 'description', label: 'Deskripsi event', type: 'markdown', required: true },
    {
      key: 'schedule',
      label: 'Rundown',
      type: 'repeater',
      addLabel: 'Tambah sesi',
      maxItems: 12,
      itemTitle: (v) => [v.time, v.title].filter(Boolean).join(' · '),
      fields: [
        { key: 'time', label: 'Waktu', type: 'text', required: true, max: 16, placeholder: '19:30' },
        { key: 'title', label: 'Sesi', type: 'text', required: true, max: 60 },
        { key: 'description', label: 'Keterangan', type: 'textarea', max: 160, rows: 2 },
      ],
    },
    { key: 'targetAudience', label: 'Cocok untuk', type: 'tags', help: 'Daftar peserta yang paling cocok, satu per tag.' },
    { key: 'benefits', label: 'Yang didapat peserta', type: 'tags', help: 'Tampil di kartu pendaftaran.' },
  ],
};
