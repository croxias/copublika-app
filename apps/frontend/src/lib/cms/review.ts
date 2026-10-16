// Writer → editor review flow for blog articles (staging phase).
//
// A writer (a person in Tim & Mentor with "Akses penulis blog") drafts in Ruang Penulis and
// submits. Editors in /admin/blog review: they may make small edits, then request changes,
// reject, or approve. Only approval sets the public status (published / scheduled).
// Writer articles carry `writerId`, `review`, `round` and `history` on top of the blog fields.

import type { CmsItem, StatusTone, Values } from './types';

export type ReviewState = 'draft' | 'submitted' | 'changes' | 'approved' | 'rejected';

export const REVIEW_STATES: { value: ReviewState; label: string; tone: StatusTone; hint: string }[] = [
  { value: 'draft', label: 'Draft', tone: 'muted', hint: 'Masih ditulis, belum dikirim ke editor.' },
  { value: 'submitted', label: 'Menunggu review', tone: 'info', hint: 'Sedang dibaca tim editor. Naskah dikunci sampai ada keputusan.' },
  { value: 'changes', label: 'Perlu revisi', tone: 'pending', hint: 'Editor meminta perbaikan. Baca catatannya, perbaiki, lalu ajukan lagi.' },
  { value: 'approved', label: 'Disetujui', tone: 'ok', hint: 'Disetujui editor dan tayang (atau terjadwal tayang) di Blog.' },
  { value: 'rejected', label: 'Ditolak', tone: 'muted', hint: 'Tidak diterbitkan. Alasannya ada di riwayat.' },
];

export const reviewOf = (x: Values): ReviewState => (x.review as ReviewState) ?? 'draft';
export const reviewLabel = (x: Values) => REVIEW_STATES.find((s) => s.value === reviewOf(x))?.label ?? 'Draft';

export type ReviewEvent = {
  at: string;
  by: 'writer' | 'editor';
  name: string;
  action: 'created' | 'submitted' | 'resubmitted' | 'withdrawn' | 'edited' | 'changes' | 'approved' | 'scheduled' | 'rejected';
  note?: string;
  /** Labels of the fields an editor changed. */
  fields?: string[];
};

export const EVENT_LABEL: Record<ReviewEvent['action'], string> = {
  created: 'Mulai menulis',
  submitted: 'Diajukan ke editor',
  resubmitted: 'Diajukan ulang setelah revisi',
  withdrawn: 'Pengajuan ditarik',
  edited: 'Editor menyunting',
  changes: 'Editor meminta revisi',
  approved: 'Disetujui & diterbitkan',
  scheduled: 'Disetujui & dijadwalkan',
  rejected: 'Ditolak',
};

export const historyOf = (x: Values) => (Array.isArray(x.history) ? (x.history as ReviewEvent[]) : []);

/** Articles that came from Ruang Penulis. Editor-written articles have no writerId. */
export const isWriterArticle = (x: Values) => !!x.writerId;

/** Shown in the admin table: editor articles, and writer articles once approved. */
export const inAdminTable = (x: Values) => !isWriterArticle(x) || reviewOf(x) === 'approved';

/** Waiting for an editor decision. */
export const inQueue = (x: Values) => isWriterArticle(x) && reviewOf(x) === 'submitted';

/** The fields a writer fills in; editors may touch the same ones (plus slug) during review. */
export const WRITER_KEYS = ['title', 'category', 'excerpt', 'cover', 'coverAlt', 'content'] as const;

const event = (e: Omit<ReviewEvent, 'at'>, at = new Date().toISOString()): ReviewEvent => ({ ...e, at });

export function withEvent(item: CmsItem, e: Omit<ReviewEvent, 'at'>, patch: Values = {}): CmsItem {
  return { ...item, ...patch, history: [...historyOf(item), event(e)], updatedAt: new Date().toISOString() };
}

/** Checks a writer must pass before submitting. */
export function submitChecks(x: Values, words: number) {
  return [
    { ok: String(x.title ?? '').trim().length >= 15, label: 'Judul jelas (minimal 15 karakter)' },
    { ok: String(x.excerpt ?? '').trim().length >= 60, label: 'Ringkasan 1–2 kalimat (minimal 60 karakter)' },
    { ok: !!String(x.cover ?? '').trim(), label: 'Gambar sampul terpasang' },
    { ok: words >= 300, label: `Isi minimal 300 kata (sekarang ${words})` },
  ];
}

/** Checks an editor ticks before approving. */
export const EDITOR_CHECKS = [
  'Orisinal dan bebas plagiarisme',
  'Gambar sampul boleh dipakai (lisensi jelas)',
  'Fakta, angka, dan rujukan sudah dicek',
  'Sesuai gaya dan nada Blog CoPublika',
];
