// Members (staging). A member record is created when a registration is approved (waiting for
// activation) or paid (active at once). Admins manage them in Keanggotaan → Anggota.

import type { CmsItem, StatusTone } from './types';

export type MemberSource = 'gratis' | 'tahunan' | 'program' | 'manual';
export type MemberState = 'pending' | 'scheduled' | 'active' | 'expiring' | 'expired' | 'inactive';

export const MEMBER_STATES: { value: MemberState; label: string; tone: StatusTone }[] = [
  { value: 'pending', label: 'Menunggu aktivasi', tone: 'pending' },
  { value: 'scheduled', label: 'Terjadwal', tone: 'info' },
  { value: 'active', label: 'Aktif', tone: 'ok' },
  { value: 'expiring', label: 'Akan habis', tone: 'live' },
  { value: 'expired', label: 'Kedaluwarsa', tone: 'muted' },
  { value: 'inactive', label: 'Nonaktif', tone: 'muted' },
];

export const SOURCE_LABEL: Record<MemberSource, string> = {
  gratis: 'Gratis 1 bulan',
  tahunan: 'Aktivasi tahunan',
  program: 'Bonus program',
  manual: 'Didaftarkan admin',
};

export const EXPIRING_DAYS = 14;
const DAY = 86_400_000;

export const addMonths = (iso: string, months: number) => {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
};

/**
 * Where a member stands today: stored status plus the active period. A period that starts later
 * (set by the admin) is "scheduled": not counted as active until its start date; startsIn is the
 * number of days until then.
 */
export function memberState(m: CmsItem, now: number): { state: MemberState; label: string; tone: StatusTone; daysLeft: number | null; share: number; startsIn: number | null } {
  const pick = (state: MemberState) => MEMBER_STATES.find((s) => s.value === state)!;
  if (m.status === 'inactive') return { ...pick('inactive'), state: 'inactive', daysLeft: null, share: 0, startsIn: null };
  if (m.status === 'pending' || !m.expiresAt) return { ...pick('pending'), state: 'pending', daysLeft: null, share: 0, startsIn: null };
  const end = new Date(String(m.expiresAt)).getTime();
  const start = new Date(String(m.activatedAt || m.joinedAt)).getTime();
  const daysLeft = Math.ceil((end - now) / DAY);
  // Compared by calendar day, so activating "now" a little after the page loaded is never scheduled.
  const today = new Date(now).setHours(0, 0, 0, 0);
  const startDay = new Date(start).setHours(0, 0, 0, 0);
  if (startDay > today) return { ...pick('scheduled'), state: 'scheduled', daysLeft, share: 1, startsIn: Math.round((startDay - today) / DAY) };
  const share = Math.min(1, Math.max(0, (end - now) / Math.max(DAY, end - start)));
  const state: MemberState = daysLeft <= 0 ? 'expired' : daysLeft <= EXPIRING_DAYS ? 'expiring' : 'active';
  return { ...pick(state), state, daysLeft, share, startsIn: null };
}

export type MemberEvent = { at: string; by: string; action: 'joined' | 'activated' | 'extended' | 'deactivated' | 'reactivated' | 'reminded' | 'note' | 'field' | 'card'; detail?: string };

export const memberEvents = (m: CmsItem): MemberEvent[] => (Array.isArray(m.events) ? (m.events as MemberEvent[]) : []);

export const withMemberEvent = (m: CmsItem, e: Omit<MemberEvent, 'at'>, patch: Partial<CmsItem> = {}): CmsItem => {
  const at = new Date().toISOString();
  return { ...m, ...patch, events: [...memberEvents(m), { ...e, at }], updatedAt: at };
};

/** A member record from a registration; `active` when it is paid, pending when only approved. */
export function memberFromSignup(s: CmsItem, active: boolean, by: string): CmsItem {
  const now = new Date().toISOString();
  const source: MemberSource = s.kind === 'gratis' ? 'gratis' : s.kind === 'tahunan' ? 'tahunan' : 'program';
  const months = source === 'gratis' ? 1 : 12;
  return {
    id: `mbr-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
    code: String(s.code).replace(/^CP-(MBR|STS|BTM)-/, 'MB-'),
    name: s.name,
    email: s.email,
    whatsapp: s.whatsapp,
    address: s.address ?? '',
    role: s.role ?? '',
    institution: s.institution ?? '',
    idNumber: s.idNumber ?? '',
    stream: s.stream ?? '',
    field: s.field ?? '',
    scholar: s.scholar ?? '',
    source,
    program: source === 'program' ? s.kind : '',
    months,
    signupId: s.id,
    signupCode: s.code,
    joinedAt: now,
    activatedAt: active ? now : '',
    expiresAt: active ? addMonths(now, months) : '',
    status: active ? 'active' : 'pending',
    note: '',
    order: 0,
    updatedAt: now,
    events: [
      { at: now, by, action: 'joined', detail: `Dari pendaftaran ${String(s.code)}` },
      ...(active ? [{ at: now, by, action: 'activated' as const, detail: `${months} bulan` }] : []),
    ],
  };
}

/* ---------- Sample members so the directory is not empty in staging ---------- */

const T = Date.UTC(2026, 9, 16, 9);
const iso = (days: number) => new Date(T + days * DAY).toISOString();

const mb = (i: number, name: string, role: string, institution: string, email: string, idNumber: string, source: MemberSource, activatedDays: number | null, months: number, extra: Partial<CmsItem> = {}): CmsItem => ({
  id: `mbr-${i}`,
  code: `MB-${(2400 + i * 41).toString(36).toUpperCase()}`,
  name,
  email,
  whatsapp: `0813 ${String(2000 + i * 97).slice(0, 4)} ${String(6100 + i * 53).slice(0, 4)}`,
  address: '',
  role,
  institution,
  idNumber,
  stream: '',
  field: '',
  scholar: '',
  source,
  program: source === 'program' ? (i % 2 ? 'siap-tembus-scopus' : 'bootcamp-menulis') : '',
  months,
  signupId: '',
  signupCode: '',
  joinedAt: iso(activatedDays ?? -2),
  activatedAt: activatedDays === null ? '' : iso(activatedDays),
  expiresAt: activatedDays === null ? '' : addMonths(iso(activatedDays), months),
  status: activatedDays === null ? 'pending' : 'active',
  note: '',
  order: i,
  updatedAt: iso(activatedDays ?? -2),
  events: activatedDays === null ? [{ at: iso(-2), by: 'Tim Admin CoPublika', action: 'joined' }] : [{ at: iso(activatedDays), by: 'Tim Admin CoPublika', action: 'joined' }, { at: iso(activatedDays), by: 'Tim Admin CoPublika', action: 'activated', detail: `${months} bulan` }],
  ...extra,
});

export const MEMBER_SEED: CmsItem[] = [
  // Linked to the sample registrations in signups.ts.
  mb(1, 'Bambang Prasetyo', 'dosen', 'Politeknik Negeri Semarang', 'bambang.p@polines.ac.id', '0610078102', 'gratis', null, 1, { stream: 'stem', field: 'Teknik Mesin', signupId: 'sgn-8', signupCode: 'CP-MBR-3I8', joinedAt: iso(-3.3) }),
  mb(2, 'Dewi Lestari', 'peneliti', 'LIPI Bandung', 'dewi.lestari@gmail.com', '3273015208910004', 'tahunan', -2.5, 12, { stream: 'stem', field: 'Bioteknologi', signupId: 'sgn-7', signupCode: 'CP-MBR-3GR' }),
  // Earlier members.
  mb(3, 'Dr. Ahmad Fauzi', 'dosen', 'Universitas Diponegoro', 'ahmad.fauzi@undip.ac.id', '0012037901', 'program', -120, 12, { stream: 'stem', field: 'Ilmu Komputer / Informatika', scholar: 'Aa1Bb2Cc3DdA' }),
  mb(4, 'Nurul Aini', 's2', 'Magister Ilmu Komunikasi, Universitas Indonesia', 'nurul.aini@ui.ac.id', '2306219874', 'gratis', -22, 1, { stream: 'nonstem', field: 'Ilmu Komunikasi' }),
  mb(5, 'Yusuf Maulana', 'peneliti', 'BRIN — Pusat Riset Sosial', 'yusuf.maulana@brin.go.id', '3171041103880007', 'tahunan', -300, 12, { stream: 'nonstem', field: 'Sosiologi' }),
  mb(6, 'Dr. Ratna Sari', 'dosen', 'Universitas Hasanuddin', 'ratna.sari@unhas.ac.id', '0009128406', 'program', -380, 12, { stream: 'stem', field: 'Farmasi' }),
  mb(7, 'Teguh Wibowo', 'umum', 'Komunitas Literasi Semarang', 'teguh.wibowo@gmail.com', '3374020507900003', 'gratis', -40, 1, { stream: 'nonstem', field: 'Bahasa & Sastra Indonesia' }),
  mb(8, 'Lina Marlina', 's2', 'Magister Pendidikan, Universitas Negeri Jakarta', 'lina.marlina@unj.ac.id', '9912345', 'program', -60, 12, { stream: 'nonstem', field: 'Pendidikan Bahasa Indonesia', status: 'inactive', note: 'Dinonaktifkan atas permintaan member.' }),
];
