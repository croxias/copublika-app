// Registrations from /daftar (staging). The public form appends here and admins work them in
// Keanggotaan → Pendaftaran. Kept free of the CMS seed so the public bundle stays small.
//
// Flow: a free member registration waits for admin approval; approving it creates a pending
// member and emails an activation link within 1×24 jam. Paid ones (yearly activation,
// programs) wait for a manual transfer and become active members as soon as they are paid.
// Once the member is active the registration leaves this queue (status "activated").

import type { CmsItem, StatusTone } from './types';

export type SignupKind = "gratis" | "tahunan" | "siap-tembus-scopus" | "bootcamp-menulis";
/** "activated" means the member is active: the registration leaves the queue and lives on in Anggota. */
export type SignupStatus = "new" | "approved" | "rejected" | "awaiting_payment" | "activated" | "cancelled";

export const SIGNUP_KINDS: { value: SignupKind; label: string; short: string; paid: boolean }[] = [
  { value: "gratis", label: "Registrasi member", short: "Registrasi", paid: false },
  { value: "tahunan", label: "Aktivasi member", short: "Aktivasi", paid: true },
  { value: "siap-tembus-scopus", label: "Siap Tembus Scopus", short: "Scopus 1:1", paid: true },
  { value: "bootcamp-menulis", label: "Bootcamp 30 Hari Menulis", short: "Bootcamp", paid: true },
];

export const SIGNUP_STATUSES: { value: SignupStatus; label: string; tone: StatusTone; hint: string }[] = [
  { value: "new", label: "Baru", tone: "live", hint: "Menunggu tinjauan admin" },
  { value: "approved", label: "Menunggu aktivasi", tone: "pending", hint: "Disetujui, link aktivasi dikirim" },
  { value: "rejected", label: "Ditolak", tone: "muted", hint: "Tidak memenuhi syarat" },
  { value: "awaiting_payment", label: "Menunggu bayar", tone: "info", hint: "Menunggu transfer manual" },
  { value: "activated", label: "Aktif", tone: "ok", hint: "Sudah menjadi member aktif" },
  { value: "cancelled", label: "Dibatalkan", tone: "muted", hint: "Pembayaran tidak dilanjutkan" },
];

export const kindOf = (v: unknown) => SIGNUP_KINDS.find((k) => k.value === v) ?? SIGNUP_KINDS[0];
export const signupStatusOf = (v: unknown) => SIGNUP_STATUSES.find((s) => s.value === v) ?? SIGNUP_STATUSES[0];
/** Statuses that still need someone to act. */
export const OPEN_STATUSES: SignupStatus[] = ["new", "awaiting_payment"];
/** Older staging data used "paid" and "need_info"; read them as today's statuses. */
export const normalizeSignup = (s: CmsItem): CmsItem => (s.status === "paid" ? { ...s, status: "activated" } : s.status === "need_info" ? { ...s, status: "new" } : s);
/** Registrations shown in Pendaftaran; activated ones are members now. */
export const inQueue = (s: CmsItem) => normalizeSignup(s).status !== "activated";

export const ID_TYPES: Record<string, { label: string; digits: number | null }> = {
  dosen: { label: "NIDN", digits: 10 },
  peneliti: { label: "NIK", digits: 16 },
  umum: { label: "NIK", digits: 16 },
  s2: { label: "NIM", digits: null },
};
/** Profession labels (the "Profesi" field). */
export const ROLE_LABEL: Record<string, string> = { dosen: "Dosen", peneliti: "Peneliti", s2: "Mahasiswa S2", umum: "Umum" };

export const REVIEW_HOURS = 24;

export type SignupEvent = { at: string; by: string; action: "created" | "opened" | "approved" | "rejected" | "paid" | "activated" | "cancelled" | "note" | "reopened" | "field"; detail?: string };

export const signupEvents = (s: CmsItem): SignupEvent[] =>
  Array.isArray(s.events) ? (s.events as SignupEvent[]) : [{ at: String(s.createdAt ?? s.updatedAt), by: String(s.name ?? "Pendaftar"), action: "created" }];

export const withSignupEvent = (s: CmsItem, e: Omit<SignupEvent, "at">, patch: Partial<CmsItem> = {}): CmsItem => {
  const at = new Date().toISOString();
  return { ...s, ...patch, events: [...signupEvents(s), { ...e, at }], updatedAt: at };
};

/* ---------- Automatic checks shown to the reviewer ---------- */

export type Check = { key: string; label: string; ok: boolean | null; detail: string };

const INSTITUTIONAL = /\.(ac|go|sch|or)\.id$|\.edu(\.[a-z]{2})?$/i;

export function autoChecks(s: CmsItem, all: CmsItem[]): Check[] {
  const role = String(s.role ?? "");
  const id = String(s.idNumber ?? "");
  const rule = ID_TYPES[role];
  const idOk = rule ? (rule.digits ? new RegExp(`^\\d{${rule.digits}}$`).test(id) : /^[A-Za-z0-9./-]{5,20}$/.test(id)) : false;
  const email = String(s.email ?? "").toLowerCase();
  const others = all.filter((x) => x.id !== s.id && x.status !== "rejected" && x.status !== "cancelled");
  const dupEmail = others.some((x) => String(x.email ?? "").toLowerCase() === email);
  const dupId = id ? others.some((x) => String(x.idNumber ?? "") === id) : false;
  const domain = email.split("@")[1] ?? "";
  return [
    { key: "id", label: `Format ${rule?.label ?? "identitas"}`, ok: id ? idOk : null, detail: id ? (idOk ? `${rule?.label} ${rule?.digits ? `${rule.digits} digit` : ""} sesuai` : "Format tidak sesuai kategori") : "Tidak diisi" },
    { key: "dup", label: "Bukan pendaftaran ganda", ok: !(dupEmail || dupId), detail: dupEmail ? "Email sudah dipakai pendaftaran lain" : dupId ? "Nomor identitas sudah dipakai" : "Email dan identitas unik" },
    { key: "mail", label: "Email institusi", ok: INSTITUTIONAL.test(domain) ? true : null, detail: INSTITUTIONAL.test(domain) ? domain : `${domain || "—"} (bukan domain institusi, periksa afiliasi)` },
    { key: "scholar", label: "Google Scholar", ok: s.scholar ? true : null, detail: s.scholar ? String(s.scholar) : "Tidak dicantumkan (opsional)" },
  ];
}

/* ---------- Public form → staging store ---------- */

const STORAGE_KEY = "copublika-cms-v1";

export type SignupInput = {
  code: string;
  kind: SignupKind;
  name: string;
  email: string;
  whatsapp: string;
  address: string;
  role: string;
  institution: string;
  idNumber: string;
  /** "stem" | "nonstem" and the field label (typed text when "Lainnya"). */
  stream: string;
  field: string;
  scholar: string;
  detail: string;
  total: number;
};

/** Appends a registration to the browser-local CMS store so it shows up in the admin. */
export function addSignup(input: SignupInput) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const stored = raw ? JSON.parse(raw) : { v: 1, collections: {}, sections: {} };
    if (stored.v !== 1) return;
    const list: CmsItem[] = stored.collections?.signups ?? SIGNUP_SEED;
    const now = new Date().toISOString();
    const paid = kindOf(input.kind).paid && input.total > 0;
    const item: CmsItem = {
      id: `sgn-${Date.now().toString(36)}`,
      ...input,
      status: paid ? "awaiting_payment" : "new",
      note: "",
      reason: "",
      paidAt: "",
      paymentRef: "",
      order: list.length + 1,
      createdAt: now,
      updatedAt: now,
      events: [{ at: now, by: input.name, action: "created" }],
    };
    stored.collections = { ...(stored.collections ?? {}), signups: [...list, item] };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage blocked or full: the confirmation still shows; nothing is kept in staging.
  }
}

/* ---------- Sample data so the queue is not empty in staging ---------- */

const ago = (h: number) => new Date(Date.UTC(2026, 9, 16, 9) - h * 3_600_000).toISOString();

const sg = (i: number, kind: SignupKind, name: string, role: string, institution: string, email: string, idNumber: string, hoursAgo: number, extra: Partial<CmsItem> = {}): CmsItem => ({
  id: `sgn-${i}`,
  code: `CP-${kind === "gratis" || kind === "tahunan" ? "MBR" : kind === "siap-tembus-scopus" ? "STS" : "BTM"}-${(4120 + i * 53).toString(36).toUpperCase()}`,
  kind,
  name,
  email,
  whatsapp: `0812 ${String(3000 + i * 111).slice(0, 4)} ${String(4500 + i * 37).slice(0, 4)}`,
  address: "",
  role,
  institution,
  idNumber,
  stream: "",
  field: "",
  scholar: "",
  detail: kind === "siap-tembus-scopus" ? "Dr. Bayu Setiawan · Oktober 2026" : kind === "bootcamp-menulis" ? "Angkatan 1 · 2 Nov 2026 – 1 Des 2026" : kind === "tahunan" ? "Perpanjangan 12 bulan" : "Masa aktif bulan pertama",
  total: kind === "gratis" ? 0 : kind === "tahunan" ? 75_000 : kind === "siap-tembus-scopus" ? 600_000 : 450_000,
  status: kind === "gratis" ? "new" : "awaiting_payment",
  note: "",
  reason: "",
  paidAt: "",
  paymentRef: "",
  order: i,
  createdAt: ago(hoursAgo),
  updatedAt: ago(hoursAgo),
  ...extra,
});

export const SIGNUP_SEED: CmsItem[] = [
  sg(1, "gratis", "Dr. Rina Kusumawati", "dosen", "Universitas Negeri Malang", "rina.kusumawati@um.ac.id", "0015048203", 3, { stream: "nonstem", field: "Teknologi Pendidikan", scholar: "Xk3pQ9AAAAAJ" }),
  sg(2, "gratis", "Hendra Wijaya", "s2", "Magister Manajemen, Universitas Gadjah Mada", "hendra.wijaya@mail.ugm.ac.id", "23/519874/PEK/2", 9, { stream: "nonstem", field: "Manajemen" }),
  sg(3, "gratis", "Sari Puspitasari", "peneliti", "BRIN — Pusat Riset Kesehatan", "sari.puspita@gmail.com", "3273014506900002", 30, { stream: "stem", field: "Kesehatan Masyarakat" }),
  sg(4, "gratis", "Agus Santoso", "umum", "", "agus.santoso88@gmail.com", "3273011205880006", 52, { stream: "nonstem", field: "Bahasa & Sastra Indonesia" }),
  sg(5, "siap-tembus-scopus", "Dr. Fitri Handayani", "dosen", "Universitas Andalas", "fitri.handayani@unand.ac.id", "0021118705", 20, { stream: "stem", field: "Kimia" }),
  sg(6, "bootcamp-menulis", "Rudi Hartono", "s2", "Magister Pendidikan, Universitas Pendidikan Indonesia", "rudi.hartono@upi.edu", "2210457", 6, { stream: "nonstem", field: "Manajemen Pendidikan" }),
  sg(7, "tahunan", "Dewi Lestari", "peneliti", "LIPI Bandung", "dewi.lestari@gmail.com", "3273015208910004", 70, { stream: "stem", field: "Bioteknologi", status: "activated", paidAt: ago(60), paymentRef: "BCA 16/10 a.n. Dewi Lestari", events: [{ at: ago(70), by: "Dewi Lestari", action: "created" }, { at: ago(60), by: "Tim Admin CoPublika", action: "paid", detail: "BCA 16/10 a.n. Dewi Lestari" }, { at: ago(60), by: "Tim Admin CoPublika", action: "activated", detail: "Member aktif 12 bulan" }] }),
  sg(8, "gratis", "Bambang Prasetyo", "dosen", "Politeknik Negeri Semarang", "bambang.p@polines.ac.id", "0610078102", 96, { stream: "stem", field: "Teknik Mesin", status: "approved", events: [{ at: ago(96), by: "Bambang Prasetyo", action: "created" }, { at: ago(80), by: "Tim Admin CoPublika", action: "approved", detail: "Link aktivasi dikirim" }] }),
];

const HOUR = 3_600_000;

/** Review clock for a registration: 1×24 jam for new ones, waiting time for payment or activation. */
export function signupTiming(s: CmsItem, now: number): { tone: 'ok' | 'soon' | 'late' | 'done'; label: string; share: number; bar: boolean } {
  const age = (now - new Date(String(s.createdAt)).getTime()) / HOUR;
  if (s.status === 'new') {
    const left = REVIEW_HOURS - age;
    const share = Math.min(1, Math.max(0, age / REVIEW_HOURS));
    if (left <= 0) return { tone: 'late', label: `Lewat ${Math.max(1, Math.round(-left))} jam`, share: 1, bar: true };
    return { tone: share >= 0.6 ? 'soon' : 'ok', label: `${Math.max(1, Math.round(left))} jam lagi`, share, bar: true };
  }
  if (s.status === 'awaiting_payment' || s.status === 'approved') {
    const since = (now - new Date(String(s.updatedAt)).getTime()) / HOUR;
    return { tone: 'soon', label: since < 24 ? `Menunggu ${Math.max(1, Math.round(since))} jam` : `Menunggu ${Math.round(since / 24)} hari`, share: Math.min(1, since / 72), bar: true };
  }
  return { tone: 'done', label: signupStatusOf(s.status).label, share: 1, bar: false };
}
