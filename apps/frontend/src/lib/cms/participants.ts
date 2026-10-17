// Peserta: everyone who signed up for an event or a program, member or not, as one row per
// email with their activity history. Built from the registrations, signups and members
// collections, so it needs no storage of its own.

import { memberState } from './members';
import { kindOf } from './signups';
import type { CmsItem, StatusTone } from './types';

export type Activity = {
  id: string;
  kind: 'event' | 'program';
  title: string;
  /** Event date, or when the program registration came in. */
  date: string;
  status: string;
  tone: StatusTone;
  amount: number;
  paid: boolean;
};

export type MemberLink = 'active' | 'pending' | 'past' | 'none';

export type Participant = {
  email: string;
  name: string;
  whatsapp: string;
  org: string;
  consent: boolean;
  activities: Activity[];
  joined: number;
  attended: number;
  spent: number;
  last: string;
  member: MemberLink;
  memberCode: string;
  /** A non-member who joined two or more activities: worth inviting to membership. */
  prospect: boolean;
};

const REG_LABEL: Record<string, { label: string; tone: StatusTone }> = {
  registered: { label: 'Terdaftar', tone: 'info' },
  waitlist: { label: 'Daftar tunggu', tone: 'pending' },
  attended: { label: 'Hadir', tone: 'ok' },
  noshow: { label: 'Tidak hadir', tone: 'muted' },
  cancelled: { label: 'Batal', tone: 'muted' },
};
const SIGNUP_LABEL: Record<string, { label: string; tone: StatusTone }> = {
  new: { label: 'Baru', tone: 'pending' },
  awaiting_payment: { label: 'Menunggu bayar', tone: 'pending' },
  activated: { label: 'Lunas', tone: 'ok' },
  approved: { label: 'Disetujui', tone: 'info' },
  rejected: { label: 'Ditolak', tone: 'muted' },
  cancelled: { label: 'Dibatalkan', tone: 'muted' },
};

export const MIN_PROSPECT = 2;

/** All participants, most recent activity first. */
export function buildParticipants(collections: Partial<Record<string, CmsItem[]>>, now: number, expiringDays?: number): Participant[] {
  const events = collections.events ?? [];
  const members = collections.members ?? [];
  const map = new Map<string, Participant>();
  const touch = (email: string, base: { name: string; whatsapp?: unknown; org?: unknown; consent?: unknown }) => {
    const key = email.trim().toLowerCase();
    if (!key) return null;
    let p = map.get(key);
    if (!p) {
      p = { email: key, name: base.name, whatsapp: '', org: '', consent: false, activities: [], joined: 0, attended: 0, spent: 0, last: '', member: 'none', memberCode: '', prospect: false };
      map.set(key, p);
    }
    if (base.name) p.name = base.name;
    if (base.whatsapp) p.whatsapp = String(base.whatsapp);
    if (base.org) p.org = String(base.org);
    if (base.consent) p.consent = true;
    return p;
  };

  for (const r of collections.registrations ?? []) {
    const p = touch(String(r.email ?? ''), { name: String(r.name ?? ''), whatsapp: r.whatsapp, org: r.org, consent: r.consent });
    if (!p) continue;
    const ev = events.find((e) => e.id === r.eventId);
    const st = REG_LABEL[String(r.status)] ?? REG_LABEL.registered;
    p.activities.push({
      id: String(r.id),
      kind: 'event',
      title: String(ev?.title ?? r.eventTitle ?? 'Event'),
      date: String(ev?.date ?? r.createdAt ?? r.updatedAt ?? ''),
      status: st.label,
      tone: st.tone,
      amount: r.paid ? Number(r.amount) || 0 : 0,
      paid: !!r.paid && r.payment === 'paid',
    });
  }
  for (const s of collections.signups ?? []) {
    if (s.kind === 'gratis' || s.kind === 'tahunan') continue; // membership itself, not an activity
    const p = touch(String(s.email ?? ''), { name: String(s.name ?? ''), whatsapp: s.whatsapp, org: s.institution });
    if (!p) continue;
    const st = SIGNUP_LABEL[String(s.status === 'paid' ? 'activated' : s.status)] ?? SIGNUP_LABEL.new;
    p.activities.push({
      id: String(s.id),
      kind: 'program',
      title: kindOf(s.kind).label,
      date: String(s.createdAt ?? ''),
      status: st.label,
      tone: st.tone,
      amount: Number(s.total) || 0,
      paid: s.status === 'activated' || s.status === 'paid',
    });
  }

  const out = [...map.values()].map((p) => {
    const live = p.activities.filter((a) => a.status !== 'Batal' && a.status !== 'Dibatalkan' && a.status !== 'Ditolak');
    const m = members.find((x) => String(x.email).toLowerCase() === p.email);
    const ms = m ? memberState(m, now, expiringDays).state : null;
    const member: MemberLink = !m ? 'none' : ms === 'active' || ms === 'expiring' ? 'active' : ms === 'pending' || ms === 'scheduled' ? 'pending' : 'past';
    p.activities.sort((a, b) => b.date.localeCompare(a.date));
    return {
      ...p,
      joined: live.length,
      attended: p.activities.filter((a) => a.status === 'Hadir').length,
      spent: p.activities.filter((a) => a.paid).reduce((n, a) => n + a.amount, 0),
      last: p.activities[0]?.date ?? '',
      member,
      memberCode: m ? String(m.code ?? '') : '',
      prospect: member !== 'active' && member !== 'pending' && live.length >= MIN_PROSPECT,
      name: m ? String(m.name) : p.name,
    };
  });
  return out.sort((a, b) => b.last.localeCompare(a.last));
}

/** Activities of one email (for the member dialog). */
export const activitiesOf = (email: string, collections: Partial<Record<string, CmsItem[]>>, now: number) =>
  buildParticipants(collections, now).find((p) => p.email === email.trim().toLowerCase())?.activities ?? [];

export const MEMBER_LINK_LABEL: Record<MemberLink, { label: string; tone: StatusTone }> = {
  active: { label: 'Member aktif', tone: 'ok' },
  pending: { label: 'Member baru', tone: 'pending' },
  past: { label: 'Mantan member', tone: 'muted' },
  none: { label: 'Non-member', tone: 'info' },
};
