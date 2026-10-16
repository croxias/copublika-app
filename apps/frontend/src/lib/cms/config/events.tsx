import type { CmsItem, CollectionConfig, FieldContext, Option, StatusTone, Values } from '../types';
import { HOLDS_SEAT } from '../registrations';
import { PUBLISH_ARCHIVE_STATUSES } from './status';

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

export const FORMATS: Option[] = [
  { value: 'online', label: 'Daring' },
  { value: 'offline', label: 'Luring' },
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

/** Seats held by sign-ups (registered, attended, no-show) for one event. */
export const seatsTaken = (eventId: string, ctx?: FieldContext) =>
  (ctx?.collections.registrations ?? []).filter((r) => r.eventId === eventId && HOLDS_SEAT.includes(r.status as never)).length;

/** Display name of the speaker: the linked person, or the guest name. */
export function speakerName(x: Values, ctx?: FieldContext) {
  if (!x.guestSpeaker && x.speakerId && ctx) {
    const p = ctx.collections.people?.find((y) => y.id === x.speakerId);
    if (p) return String(p.name ?? '');
  }
  return String(x.speakerName ?? '');
}

const typeLabel = (v: unknown) => EVENT_TYPES.find((t) => t.value === v)?.label ?? '—';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function DateTile({ x }: { x: Values }) {
  const d = String(x.date ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return <span className="cms-muted">—</span>;
  return (
    <span className="evt-date">
      <b>{Number(d.slice(8))}</b>
      <span><strong>{MONTHS[Number(d.slice(5, 7)) - 1]} {d.slice(0, 4)}</strong><small>{x.time ? `${String(x.time)} WIB` : '—'}</small></span>
    </span>
  );
}

function Quota({ x, ctx }: { x: CmsItem; ctx: FieldContext }) {
  const cap = Number(x.capacity) || 0;
  const taken = seatsTaken(x.id, ctx);
  const share = cap ? Math.min(1, taken / cap) : 0;
  const tone = cap && taken >= cap ? 'is-full' : share >= 0.85 ? 'is-low' : '';
  return (
    <span className={`evt-quota ${tone}`} title={`${taken} pendaftar dari ${cap || '—'} kursi`}>
      <span>{taken}<small>/{cap || '—'}</small></span>
      <i aria-hidden="true"><b style={{ width: `${share * 100}%` }} /></i>
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
  drawer: 'center',
  // Running and upcoming events first (soonest on top), finished ones after (latest on top).
  sortBy: (a, b) => {
    const pa = eventPhase(a);
    const pb = eventPhase(b);
    if (pa !== pb) return PHASE_RANK[pa] - PHASE_RANK[pb];
    return pa === 'ended' ? dateValue(b) - dateValue(a) : dateValue(a) - dateValue(b);
  },
  titleOf: (x) => String(x.title ?? ''),
  subtitleOf: (x, ctx) => [speakerName(x, ctx), x.pinned ? '★ disematkan' : ''].filter(Boolean).join(' · ') || '—',
  publicHref: (x) => (x.slug ? `/event/${x.slug}` : null),
  columns: [
    { label: 'Tanggal', width: '150px', render: (x) => <DateTile x={x} /> },
    { label: 'Jenis & tempat', width: '170px', render: (x) => <span className="evt-place"><span className="cms-pill">{typeLabel(x.type)}</span><strong>{FORMATS.find((f) => f.value === x.format)?.label ?? '—'}</strong><small>{String(x.location ?? '')}</small></span> },
    { label: 'Kuota', width: '130px', render: (x, ctx) => <Quota x={x} ctx={ctx} /> },
    { label: 'Fase', width: '110px', render: (x) => <PhaseBadge item={x} /> },
  ],
  filter: { label: 'Fase', options: () => PHASES, match: (x, v) => eventPhase(x) === v },
  defaults: () => ({
    title: '',
    slug: '',
    type: 'webinar',
    sub: '',
    summary: '',
    about: '',
    gains: [],
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
    pinned: false,
    phaseOverride: '',
    guestSpeaker: false,
    speakerId: '',
    speakerName: '',
    speakerRole: '',
    speakerAvatar: '',
    speakerBadges: [],
    schedule: [],
    targetAudience: [],
    benefits: [],
  }),
  fields: [
    { type: 'heading', key: 'h-info', icon: 'file', label: 'Info event' },
    { key: 'title', icon: 'heading', label: 'Judul event', type: 'text', required: true, max: 120, wide: true },
    { key: 'slug', icon: 'link', label: 'Slug (alamat URL)', type: 'slug', from: 'title', required: true, help: 'Tampil sebagai copublika.id/event/slug.' },
    { key: 'type', icon: 'tag', label: 'Jenis event', type: 'select', required: true, options: EVENT_TYPES },
    { key: 'summary', icon: 'quote', label: 'Ringkasan', type: 'textarea', required: true, max: 240, rows: 3, help: 'Muncul di bawah judul halaman event, kartu acara terdekat, dan hasil pencarian.' },
    { key: 'sub', icon: 'text', label: 'Subjudul kartu Beranda', type: 'text', max: 80, wide: true, help: 'Satu kalimat pendek di kartu agenda Beranda.' },
    { key: 'pinned', icon: 'star', label: 'Sematkan sebagai acara terdekat', type: 'toggle', wide: true, help: 'Tampil di tiket "Acara terdekat" /event selama belum lewat. Kosongkan untuk memakai acara dengan tanggal terdekat.' },

    { type: 'heading', key: 'h-when', icon: 'calendar', label: 'Waktu & tempat' },
    { key: 'date', icon: 'calendar', label: 'Tanggal', type: 'date', required: true },
    { key: 'time', icon: 'progress', label: 'Jam mulai (WIB)', type: 'time', required: true },
    { key: 'duration', icon: 'progress', label: 'Durasi', type: 'text', max: 24, placeholder: '90 menit · 2 jam · 2 hari' },
    { key: 'format', icon: 'display', label: 'Format', type: 'select', required: true, options: FORMATS },
    { key: 'location', icon: 'building', label: 'Lokasi / platform', type: 'text', required: true, max: 80, placeholder: 'Zoom · Yogyakarta · Hybrid Jakarta' },
    { key: 'language', icon: 'text', label: 'Bahasa', type: 'text', max: 24 },
    {
      key: 'phaseOverride',
      icon: 'eye',
      label: 'Fase (manual)',
      type: 'select',
      options: [{ value: '', label: 'Otomatis dari tanggal' }, ...PHASES],
      help: 'Biarkan otomatis kecuali acara ditunda atau dibatalkan.',
    },

    { type: 'heading', key: 'h-access', icon: 'ticket', label: 'Akses & pendaftaran', help: 'Kursi terisi dihitung dari tab Pendaftar; setelah kuota penuh, pendaftar baru masuk daftar tunggu. Event khusus anggota meminta tamu masuk dulu.' },
    { key: 'capacity', icon: 'users', label: 'Kuota peserta', type: 'number', min: 1, suffix: 'orang', required: true, third: true },
    { key: 'isPaid', icon: 'ticket', label: 'Event berbayar', type: 'toggle', third: true },
    { key: 'memberOnly', icon: 'shield', label: 'Khusus anggota', type: 'toggle', third: true },
    { key: 'price', icon: 'ticket', label: 'Harga', type: 'number', min: 0, suffix: 'Rupiah', required: true, visibleIf: (v) => !!v.isPaid, help: 'Tampil sebagai "Rp. 150.000".', third: true },
    { key: 'registrationUrl', icon: 'link', label: 'Link pendaftaran eksternal', type: 'url', wide: true, help: 'Opsional. Kosongkan untuk memakai form CoPublika (disarankan).' },
    { key: 'benefits', icon: 'star', label: 'Fasilitas peserta', type: 'tags', max: 6, help: 'Daftar bercentang di kartu pendaftaran, mis. "Rekaman lengkap".' },

    { type: 'heading', key: 'h-speaker', icon: 'mentor', label: 'Pembicara' },
    { key: 'guestSpeaker', icon: 'users', label: 'Pembicara tamu', type: 'toggle', wide: true, onLabel: 'Ya, bukan tim atau mentor CoPublika' },
    { key: 'speakerId', icon: 'user', label: 'Pembicara', type: 'ref', collection: 'people', visibleIf: (v) => !v.guestSpeaker, help: 'Dipilih dari Pustaka → Tim & Mentor; foto dan profil ikut dari sana.' },
    { key: 'speakerName', icon: 'user', label: 'Nama pembicara', type: 'text', max: 60, visibleIf: (v) => !!v.guestSpeaker },
    { key: 'speakerRole', icon: 'building', label: 'Profil singkat', type: 'textarea', max: 220, rows: 2, visibleIf: (v) => !!v.guestSpeaker },
    { key: 'speakerAvatar', icon: 'image', label: 'Foto pembicara', type: 'image', wide: true, aspect: '1 / 1', visibleIf: (v) => !!v.guestSpeaker },
    { key: 'speakerBadges', icon: 'tag', label: 'Label kredensial', type: 'tags', max: 4, placeholder: 'mis. Reviewer Q1', visibleIf: (v) => !!v.guestSpeaker },

    { type: 'heading', key: 'h-about', icon: 'pen', label: 'Tentang acara', help: 'Bagian "Tentang acara" di halaman detail.' },
    { key: 'about', icon: 'pen', label: 'Isi', type: 'richtext', required: true },

    { type: 'heading', key: 'h-gains', icon: 'steps', label: 'Yang didapat', help: 'Kartu bercentang "Yang Anda dapatkan".' },
    { key: 'gains', icon: 'star', label: 'Poin yang didapat peserta', type: 'tags', max: 8, placeholder: 'Ketik satu poin lalu Enter' },

    { type: 'heading', key: 'h-schedule', icon: 'steps', label: 'Susunan acara' },
    {
      key: 'schedule',
      label: 'Susunan acara',
      type: 'repeater',
      addLabel: 'Tambah sesi',
      maxItems: 12,
      itemTitle: (v) => [v.time, v.title].filter(Boolean).join(' · '),
      fields: [
        { key: 'time', label: 'Waktu', type: 'text', required: true, max: 24, placeholder: '19.30 — 19.45' },
        { key: 'title', label: 'Sesi', type: 'text', required: true, max: 60 },
        { key: 'description', label: 'Keterangan', type: 'textarea', max: 200, rows: 2 },
      ],
    },

    { type: 'heading', key: 'h-audience', icon: 'users', label: 'Untuk siapa' },
    { key: 'targetAudience', icon: 'users', label: 'Peserta yang paling cocok', type: 'tags', max: 6, help: 'Satu poin per tag.' },
  ],
  // Only one pinned event at a time.
  afterSave: (saved, all) => (saved.pinned ? all.map((x) => (x.id !== saved.id && x.pinned ? { ...x, pinned: false } : x)) : all),
};
