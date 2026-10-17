// Event registrations (staging). The public form on /event/[slug] appends here and the admin
// reads them in Agenda Event → Pendaftar. Kept free of the CMS seed so the public bundle stays small.

import type { CmsItem, StatusTone } from './types';

export type RegStatus = 'registered' | 'waitlist' | 'attended' | 'noshow' | 'cancelled';

export const REG_STATUSES: { value: RegStatus; label: string; tone: StatusTone }[] = [
  { value: 'registered', label: 'Terdaftar', tone: 'info' },
  { value: 'waitlist', label: 'Daftar tunggu', tone: 'pending' },
  { value: 'attended', label: 'Hadir', tone: 'ok' },
  { value: 'noshow', label: 'Tidak hadir', tone: 'muted' },
  { value: 'cancelled', label: 'Batal', tone: 'muted' },
];

/** Statuses that hold a seat. */
export const HOLDS_SEAT: RegStatus[] = ['registered', 'attended', 'noshow'];

/** Payment of a sign-up: free, waiting for a transfer, past the deadline, or paid. */
export type PayState = 'free' | 'pending' | 'overdue' | 'paid';
export const PAY_STATES: Record<PayState, { label: string; tone: StatusTone }> = {
  free: { label: 'Gratis', tone: 'muted' },
  pending: { label: 'Menunggu bayar', tone: 'pending' },
  overdue: { label: 'Lewat batas', tone: 'live' },
  paid: { label: 'Lunas', tone: 'ok' },
};

/** Where the payment stands; a pending one turns "overdue" after the pay deadline (hours). */
export function payState(r: CmsItem, now: number, deadlineHours: number): PayState {
  if (!r.paid) return 'free';
  if (r.payment === 'paid') return 'paid';
  const since = now - new Date(String(r.createdAt ?? r.updatedAt)).getTime();
  return since > deadlineHours * 3_600_000 ? 'overdue' : 'pending';
}

/** Amount due for a sign-up (the member price when it applied). */
export const amountOf = (r: CmsItem, fallback = 0) => (r.paid ? Number(r.amount) || fallback : 0);

/** Short ticket code for a sign-up, e.g. "EVT-K3F9A2". */
export const ticketCode = () => `EVT-${Date.now().toString(36).toUpperCase().slice(-6)}`;

const STORAGE_KEY = 'copublika-cms-v1';
const at = (d: string) => `${d}:00.000Z`;

const person = (i: number, eventId: string, name: string, org: string, created: string, extra: Partial<CmsItem> = {}): CmsItem => ({
  id: `reg-${eventId}-${i}`,
  eventId,
  code: `EVT-${eventId.replace('event-', '').replace('past-', 'P')}${String(i).padStart(2, '0')}${name.slice(0, 2).toUpperCase()}`,
  name,
  email: `${name.toLowerCase().replace(/^(dr|prof)\.?\s+/, '').split(/[\s,]+/).slice(0, 2).join('.')}@kampus.ac.id`,
  whatsapp: '',
  org,
  question: '',
  consent: i % 2 === 1,
  paid: false,
  payment: '',
  amount: 0,
  memberPrice: false,
  status: 'registered',
  order: i,
  createdAt: at(created),
  updatedAt: at(created),
  ...extra,
});

/** Sample sign-ups so the Pendaftar tab is not empty in staging. */
export const REGISTRATION_SEED: CmsItem[] = [
  person(1, 'event-1', 'Rina Wulandari', 'Universitas Negeri Malang', '2026-10-01T08:12', { whatsapp: '0812 3311 7720', question: 'Bagaimana merespons reviewer yang meminta analisis tambahan di luar cakupan studi?' }),
  person(2, 'event-1', 'Ahmad Fauzi', 'Universitas Airlangga', '2026-10-02T13:40'),
  person(3, 'event-1', 'Siti Nurhaliza', 'UIN Sunan Kalijaga', '2026-10-04T19:05', { question: 'Apakah perlu menyertakan nomor baris di response letter?' }),
  person(4, 'event-1', 'Bagas Pratama', 'Universitas Diponegoro', '2026-10-09T10:22'),
  person(5, 'event-1', 'Dewi Kartika', 'Politeknik Negeri Bandung', '2026-10-12T21:10'),
  person(6, 'event-1', 'Yusuf Hidayat', 'Universitas Hasanuddin', '2026-10-14T07:55', { status: 'cancelled' }),
  person(7, 'event-1', 'Nurul Aini', 'Magister Ilmu Komunikasi, Universitas Indonesia', '2026-10-15T08:30', { email: 'nurul.aini@ui.ac.id' }),
  person(1, 'event-2', 'Maria Gunawan', 'Universitas Katolik Parahyangan', '2026-10-05T09:30', { question: 'Bagaimana menilai jurnal yang baru masuk Scopus?' }),
  person(2, 'event-2', 'Hendra Saputra', 'Universitas Andalas', '2026-10-08T16:18'),
  person(3, 'event-2', 'Rina Wulandari', 'Universitas Negeri Malang', '2026-10-13T11:02', { whatsapp: '0812 3311 7720' }),
  person(4, 'event-2', 'Ahmad Fauzi', 'Universitas Airlangga', '2026-10-14T15:20', { question: 'Apakah editor Q1 menerima studi kasus lokal?' }),
  person(1, 'event-3', 'Fikri Ramadhan', 'Universitas Gadjah Mada', '2026-09-28T14:00', { paid: true, payment: 'paid', amount: 150000, paidAt: at('2026-09-29T09:10'), paymentRef: 'BCA a.n. Fikri Ramadhan' }),
  person(2, 'event-3', 'Nadia Putri', 'Universitas Islam Indonesia', '2026-10-03T08:45', { paid: true, payment: 'paid', amount: 100000, memberPrice: true, paidAt: at('2026-10-03T12:30'), paymentRef: 'Mandiri a.n. Nadia Putri' }),
  person(3, 'event-3', 'Rudi Hartono', 'Universitas Sebelas Maret', '2026-10-10T20:30', { paid: true, payment: 'pending', amount: 150000, whatsapp: '0812 3456 7801' }),
  person(4, 'event-3', 'Intan Permata', 'Universitas Jember', '2026-10-15T09:12', { paid: true, payment: 'pending', amount: 150000, status: 'waitlist' }),
  person(5, 'event-3', 'Rina Wulandari', 'Universitas Negeri Malang', '2026-10-16T10:05', { paid: true, payment: 'paid', amount: 150000, paidAt: at('2026-10-16T13:40'), paymentRef: 'BRI a.n. Rina Wulandari', whatsapp: '0812 3311 7720' }),
  // Finished webinar: attendance already marked.
  person(1, 'event-past-1', 'Rina Wulandari', 'Universitas Negeri Malang', '2026-09-10T09:00', { status: 'attended', whatsapp: '0812 3311 7720' }),
  person(2, 'event-past-1', 'Ahmad Fauzi', 'Universitas Airlangga', '2026-09-11T14:20', { status: 'attended' }),
  person(3, 'event-past-1', 'Siti Nurhaliza', 'UIN Sunan Kalijaga', '2026-09-12T08:05', { status: 'noshow' }),
  person(4, 'event-past-1', 'Bagas Pratama', 'Universitas Diponegoro', '2026-09-14T19:40', { status: 'attended' }),
  person(5, 'event-past-1', 'Nurul Aini', 'Magister Ilmu Komunikasi, Universitas Indonesia', '2026-09-15T10:30', { status: 'attended', email: 'nurul.aini@ui.ac.id' }),
  person(6, 'event-past-1', 'Lestari Ayu', 'Universitas Udayana', '2026-09-16T21:15', { status: 'noshow' }),
  person(7, 'event-past-1', 'Teguh Prasetya', 'Universitas Negeri Semarang', '2026-09-18T07:50', { status: 'cancelled' }),
];

// Sign-ups for the other finished events, attendance marked (a few "belum ditandai" on one).
const POOL: [string, string][] = [
  ['Rina Wulandari', 'Universitas Negeri Malang'], ['Ahmad Fauzi', 'Universitas Airlangga'], ['Siti Nurhaliza', 'UIN Sunan Kalijaga'],
  ['Bagas Pratama', 'Universitas Diponegoro'], ['Dewi Kartika', 'Politeknik Negeri Bandung'], ['Maria Gunawan', 'Universitas Katolik Parahyangan'],
  ['Hendra Saputra', 'Universitas Andalas'], ['Fikri Ramadhan', 'Universitas Gadjah Mada'], ['Nadia Putri', 'Universitas Islam Indonesia'],
  ['Intan Permata', 'Universitas Jember'], ['Yusuf Hidayat', 'Universitas Hasanuddin'], ['Lestari Ayu', 'Universitas Udayana'],
];
const pastRun = (eventId: string, created: string, count: number, attendEvery: number, paid?: { amount: number }, unmarked = 0): CmsItem[] =>
  POOL.slice(0, count).map(([name, org], i) =>
    person(i + 1, eventId, name, org, created, {
      status: i >= count - unmarked ? 'registered' : i % attendEvery === attendEvery - 1 ? 'noshow' : 'attended',
      ...(paid ? { paid: true, payment: 'paid', amount: paid.amount, paidAt: at(created) } : {}),
    }),
  );
REGISTRATION_SEED.push(
  ...pastRun('event-past-2', '2026-08-15T10:00', 9, 4, { amount: 100000 }),
  ...pastRun('event-past-3', '2026-07-01T09:00', 7, 5, { amount: 200000 }),
  ...pastRun('event-past-4', '2026-06-10T20:00', 12, 3, undefined, 2),
  ...pastRun('event-past-5', '2025-11-05T08:00', 6, 6),
  ...pastRun('event-past-6', '2025-08-28T19:00', 10, 2),
);

/**
 * Appends a sign-up from the public form to the browser-local CMS store, keeping any
 * registrations already stored (or the sample ones on first use).
 */
export function addRegistration(r: { eventId: string; eventTitle: string; code: string; name: string; email: string; whatsapp: string; org: string; question: string; consent: boolean; paid: boolean; amount: number; memberPrice: boolean; status?: RegStatus }) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const stored = raw ? JSON.parse(raw) : { v: 1, collections: {}, sections: {} };
    if (stored.v !== 1) return;
    const list: CmsItem[] = stored.collections?.registrations ?? REGISTRATION_SEED;
    const item: CmsItem = {
      id: `reg-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      eventId: r.eventId,
      eventTitle: r.eventTitle,
      code: r.code,
      name: r.name,
      email: r.email,
      whatsapp: r.whatsapp,
      org: r.org,
      question: r.question,
      consent: r.consent,
      paid: r.paid,
      payment: r.paid ? 'pending' : '',
      amount: r.paid ? r.amount : 0,
      memberPrice: r.memberPrice,
      status: r.status ?? 'registered',
      source: 'public',
      order: list.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    stored.collections = { ...(stored.collections ?? {}), registrations: [...list, item] };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage blocked or full: the confirmation still shows; nothing is kept in staging.
  }
}
