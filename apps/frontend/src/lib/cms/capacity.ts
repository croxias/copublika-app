// Kuota & Kapasitas: every limited thing in one list, read from where it is set: event capacity
// (Agenda Event), Siap Tembus Scopus mentor seats per month ("Harga & kursi") and Bootcamp batch
// seats ("Harga & angkatan"). Nothing here is stored; edits happen in those editors.

import { eventPhase } from './config/events';
import { HOLDS_SEAT, payState, type RegStatus } from './registrations';
import { BOOKED, BOOTCAMP_BATCHES, SEATS_PER_MENTOR, STS_MENTORS, formatDate, seatMonths, type BootcampBatch } from '@/lib/data/programs';
import type { CmsItem, StatusTone } from './types';

export type CapKind = 'event' | 'mentor' | 'bootcamp';
export type CapState = 'full' | 'almost' | 'open' | 'ended';

export type CapRow = {
  id: string;
  kind: CapKind;
  title: string;
  sub: string;
  /** When sign-ups close (event start, batch close date, end of the month). */
  deadline: string;
  cap: number;
  held: number;
  /** Seats held by sign-ups that have not paid yet. */
  pending: number;
  waitlist: number;
  /** Seat use per mentor, for the Scopus rows. */
  parts?: { label: string; held: number; cap: number }[];
  href: string;
  state: CapState;
};

export const CAP_KIND: Record<CapKind, { label: string }> = {
  event: { label: 'Event & webinar' },
  mentor: { label: 'Mentor Scopus' },
  bootcamp: { label: 'Bootcamp' },
};
export const CAP_STATE: Record<CapState, { label: string; tone: StatusTone }> = {
  full: { label: 'Penuh', tone: 'live' },
  almost: { label: 'Hampir penuh', tone: 'pending' },
  open: { label: 'Buka', tone: 'ok' },
  ended: { label: 'Selesai', tone: 'muted' },
};
/** Share of seats taken from which a row counts as "Hampir penuh". */
export const ALMOST = 0.8;

const stateOf = (held: number, cap: number, ended: boolean): CapState => (ended ? 'ended' : cap && held >= cap ? 'full' : cap && held / cap >= ALMOST ? 'almost' : 'open');

export function buildCapacity(sections: Record<string, unknown>, collections: Partial<Record<string, CmsItem[]>>, now: number, payDeadlineHours = 48): CapRow[] {
  const rows: CapRow[] = [];
  const regs = collections.registrations ?? [];

  // Events and webinars.
  for (const e of (collections.events ?? []).filter((x) => x.status === 'published')) {
    const mine = regs.filter((r) => r.eventId === e.id);
    const held = mine.filter((r) => HOLDS_SEAT.includes(r.status as RegStatus));
    const cap = Number(e.capacity) || 0;
    const ended = eventPhase(e, now) === 'ended';
    rows.push({
      id: `event:${e.id}`,
      kind: 'event',
      title: String(e.title),
      sub: `${e.memberOnly ? 'Khusus member' : 'Umum'} · ${e.isPaid ? 'Berbayar' : 'Gratis'}`,
      deadline: String(e.date ?? ''),
      cap,
      held: held.length,
      pending: held.filter((r) => { const p = payState(r, now, payDeadlineHours); return p === 'pending' || p === 'overdue'; }).length,
      waitlist: mine.filter((r) => r.status === 'waitlist').length,
      href: '/admin/events',
      state: stateOf(held.length, cap, ended),
    });
  }

  // Siap Tembus Scopus: one row per month, mentors as parts.
  const sts = (sections['program.sts.offer'] ?? {}) as { seatsPerMentor?: number; mentors?: { mentor: string; bookedThis?: number; bookedNext?: number }[] };
  const perMentor = Number(sts.seatsPerMentor) || SEATS_PER_MENTOR;
  const mentors = sts.mentors?.length ? sts.mentors : STS_MENTORS.map((m) => ({ mentor: m.id, bookedThis: BOOKED[m.id]?.[0] ?? 0, bookedNext: BOOKED[m.id]?.[1] ?? 0 }));
  seatMonths(new Date(now)).forEach((m, i) => {
    const parts = mentors.map((x) => ({
      label: STS_MENTORS.find((p) => p.id === x.mentor)?.name ?? x.mentor,
      held: Math.min(perMentor, Number(i === 0 ? x.bookedThis : x.bookedNext) || 0),
      cap: perMentor,
    }));
    const [y, mo] = m.key.split('-').map(Number);
    const held = parts.reduce((n, p) => n + p.held, 0);
    const cap = parts.length * perMentor;
    rows.push({
      id: `mentor:${m.key}`,
      kind: 'mentor',
      title: `Siap Tembus Scopus · ${m.label}`,
      sub: `${parts.length} mentor · ${perMentor} kursi per mentor`,
      deadline: new Date(y, mo, 0, 23, 59).toISOString(),
      cap,
      held,
      pending: 0,
      waitlist: 0,
      parts,
      href: '/admin/website/siap-tembus-scopus',
      state: stateOf(held, cap, false),
    });
  });

  // Bootcamp batches.
  const btm = (sections['program.btm.offer'] ?? {}) as { batches?: BootcampBatch[] };
  for (const b of btm.batches?.length ? btm.batches : BOOTCAMP_BATCHES) {
    const cap = Number(b.seats) || 0;
    const held = Math.min(cap, Number(b.booked) || 0);
    const ended = new Date(`${b.closes}T23:59:00`).getTime() < now;
    rows.push({
      id: `bootcamp:${b.id}`,
      kind: 'bootcamp',
      title: `Bootcamp 30 Hari · ${b.name}`,
      sub: `Mulai ${formatDate(b.start)} · ${b.webinar || 'webinar mingguan'}`,
      deadline: `${b.closes}T23:59:00`,
      cap,
      held,
      pending: 0,
      waitlist: 0,
      href: '/admin/website/bootcamp-menulis',
      state: stateOf(held, cap, ended),
    });
  }

  // Open ones first, nearest deadline first; finished ones at the end.
  return rows.sort((a, b) => Number(a.state === 'ended') - Number(b.state === 'ended') || a.deadline.localeCompare(b.deadline));
}

/** Days until the deadline (negative once passed). */
export const daysTo = (iso: string, now: number) => Math.ceil((new Date(iso).getTime() - now) / 86_400_000);
