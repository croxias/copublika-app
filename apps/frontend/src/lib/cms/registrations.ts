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

const STORAGE_KEY = 'copublika-cms-v1';
const at = (d: string) => `${d}:00.000Z`;

const person = (i: number, eventId: string, name: string, org: string, created: string, extra: Partial<CmsItem> = {}): CmsItem => ({
  id: `reg-${eventId}-${i}`,
  eventId,
  name,
  email: `${name.toLowerCase().replace(/^(dr|prof)\.?\s+/, '').split(/[\s,]+/).slice(0, 2).join('.')}@kampus.ac.id`,
  org,
  question: '',
  paid: false,
  payment: '',
  status: 'registered',
  order: i,
  updatedAt: at(created),
  ...extra,
});

/** Sample sign-ups so the Pendaftar tab is not empty in staging. */
export const REGISTRATION_SEED: CmsItem[] = [
  person(1, 'event-1', 'Rina Wulandari', 'Universitas Negeri Malang', '2026-10-01T08:12', { question: 'Bagaimana merespons reviewer yang meminta analisis tambahan di luar cakupan studi?' }),
  person(2, 'event-1', 'Ahmad Fauzi', 'Universitas Airlangga', '2026-10-02T13:40'),
  person(3, 'event-1', 'Siti Nurhaliza', 'UIN Sunan Kalijaga', '2026-10-04T19:05', { question: 'Apakah perlu menyertakan nomor baris di response letter?' }),
  person(4, 'event-1', 'Bagas Pratama', 'Universitas Diponegoro', '2026-10-09T10:22'),
  person(5, 'event-1', 'Dewi Kartika', 'Politeknik Negeri Bandung', '2026-10-12T21:10'),
  person(6, 'event-1', 'Yusuf Hidayat', 'Universitas Hasanuddin', '2026-10-14T07:55', { status: 'cancelled' }),
  person(1, 'event-2', 'Maria Gunawan', 'Universitas Katolik Parahyangan', '2026-10-05T09:30', { question: 'Bagaimana menilai jurnal yang baru masuk Scopus?' }),
  person(2, 'event-2', 'Hendra Saputra', 'Universitas Andalas', '2026-10-08T16:18'),
  person(3, 'event-2', 'Lestari Ayu', 'Universitas Udayana', '2026-10-13T11:02'),
  person(1, 'event-3', 'Fikri Ramadhan', 'Universitas Gadjah Mada', '2026-09-28T14:00', { paid: true, payment: 'paid' }),
  person(2, 'event-3', 'Nadia Putri', 'Universitas Islam Indonesia', '2026-10-03T08:45', { paid: true, payment: 'paid' }),
  person(3, 'event-3', 'Rudi Hartono', 'Universitas Sebelas Maret', '2026-10-10T20:30', { paid: true, payment: 'pending' }),
  person(4, 'event-3', 'Intan Permata', 'Universitas Jember', '2026-10-15T09:12', { paid: true, payment: 'pending', status: 'waitlist' }),
];

/**
 * Appends a sign-up from the public form to the browser-local CMS store, keeping any
 * registrations already stored (or the sample ones on first use).
 */
export function addRegistration(r: { eventId: string; eventTitle: string; name: string; email: string; org: string; question: string; paid: boolean }) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const stored = raw ? JSON.parse(raw) : { v: 1, collections: {}, sections: {} };
    if (stored.v !== 1) return;
    const list: CmsItem[] = stored.collections?.registrations ?? REGISTRATION_SEED;
    const item: CmsItem = {
      id: `reg-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      eventId: r.eventId,
      eventTitle: r.eventTitle,
      name: r.name,
      email: r.email,
      org: r.org,
      question: r.question,
      paid: r.paid,
      payment: r.paid ? 'pending' : '',
      status: 'registered',
      order: list.length + 1,
      updatedAt: new Date().toISOString(),
    };
    stored.collections = { ...(stored.collections ?? {}), registrations: [...list, item] };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage blocked or full: the confirmation still shows; nothing is kept in staging.
  }
}
