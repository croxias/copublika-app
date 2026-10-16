// Contact messages (staging). The /contact form appends here and the admin reads them in
// Konten → Kotak Pesan. Kept free of the CMS seed so the public bundle stays small.

import type { CmsItem, StatusTone } from './types';

export type MsgStatus = 'new' | 'replied' | 'closed' | 'spam';

/**
 * Who answers messages. Until Team Management + RBAC exist, every reply and action is made
 * on behalf of the admin team; later only users with the admin role may respond.
 */
export const RESPONDER = 'Tim Admin CoPublika';

export const MSG_STATUSES: { value: MsgStatus; label: string; tone: StatusTone }[] = [
  { value: 'new', label: 'Baru', tone: 'live' },
  { value: 'replied', label: 'Dibalas', tone: 'info' },
  { value: 'closed', label: 'Selesai', tone: 'ok' },
  { value: 'spam', label: 'Spam', tone: 'muted' },
];

const STORAGE_KEY = 'copublika-cms-v1';

const msg = (i: number, topic: string, name: string, org: string, email: string, whatsapp: string, message: string, created: string, extra: Partial<CmsItem> = {}): CmsItem => ({
  id: `msg-${i}`,
  topic,
  name,
  org,
  email,
  whatsapp,
  message,
  code: `CP-${String(1040 + i * 37)}`,
  status: 'new',
  note: '',
  repliedAt: '',
  order: i,
  updatedAt: `${created}:00.000Z`,
  createdAt: `${created}:00.000Z`,
  ...extra,
});

/** Sample messages so Kotak Pesan is not empty in staging. */
export const MESSAGE_SEED: CmsItem[] = [
  msg(1, 'Program', 'Dr. Rahmat Hidayat', 'Universitas Negeri Padang', 'rahmat.h@unp.ac.id', '+62 812 3344 5566', 'Selamat siang. Apakah Bootcamp 30 Hari Menulis angkatan 1 masih ada kursi? Saya ingin mendaftarkan 3 dosen dari prodi kami sekaligus, apakah ada skema pembayaran kelompok?', '2026-10-15T09:24'),
  msg(2, 'Kolaborasi', 'Lia Anggraini', 'LPPM Universitas Brawijaya', 'lia.anggraini@ub.ac.id', '', 'Kami berencana mengadakan pelatihan penulisan artikel untuk 60 dosen muda pada Januari. Apakah CoPublika membuka kerja sama in-house training? Mohon informasi proposal dan biayanya.', '2026-10-14T15:02'),
  msg(3, 'Tulisan tamu', 'Andi Saputra, M.Pd.', 'Universitas Pendidikan Ganesha', 'andi.saputra@undiksha.ac.id', '', 'Saya ingin menulis tentang pengalaman ditolak 3 kali sebelum diterima di jurnal Q2. Outline: (1) penolakan pertama karena scope, (2) revisi metodologi, (3) strategi cover letter.', '2026-10-13T20:41', { status: 'replied', repliedAt: '2026-10-14T10:15:00.000Z', note: 'Minta draft 1.500 kata.', events: [{ at: '2026-10-13T20:41:00.000Z', by: 'Andi Saputra, M.Pd.', action: 'created' }, { at: '2026-10-14T09:02:00.000Z', by: RESPONDER, action: 'opened' }, { at: '2026-10-14T10:15:00.000Z', by: RESPONDER, action: 'replied', detail: 'Email · Outline tulisan diterima' }] }),
  msg(4, 'Keanggotaan', 'Putri Maharani', 'Universitas Sriwijaya', 'putri.maharani@unsri.ac.id', '+62 813 9988 1122', 'Saya sudah mendaftar batch 5 dua minggu lalu dengan Google Scholar ID, tapi status masih menunggu verifikasi. Apakah ada dokumen yang kurang?', '2026-10-12T11:18', { status: 'closed', repliedAt: '2026-10-12T14:00:00.000Z', note: 'Sudah diverifikasi, email aktivasi terkirim.', events: [{ at: '2026-10-12T11:18:00.000Z', by: 'Putri Maharani', action: 'created' }, { at: '2026-10-12T14:00:00.000Z', by: RESPONDER, action: 'replied', detail: 'Email · Status pendaftaran anggota' }, { at: '2026-10-12T14:05:00.000Z', by: RESPONDER, action: 'status', detail: 'Selesai' }] }),
  msg(5, 'Program', 'Bima Arya', 'Politeknik Negeri Jakarta', 'bima.arya@pnj.ac.id', '', 'Mentor untuk bidang teknik sipil di Siap Tembus Scopus siapa saja ya? Saya ingin memilih mentor yang pernah publikasi di bidang material konstruksi.', '2026-10-15T07:55'),
  msg(6, 'Lainnya', 'Promo SEO Murah', '', 'promo@seo-cepat.biz', '', 'Jasa naik peringkat Google halaman 1 dalam 7 hari! Hubungi kami sekarang.', '2026-10-11T03:12', { status: 'spam' }),
];

/** Appends a message from the public form to the browser-local CMS store. Returns a reference code. */
export function addMessage(m: { topic: string; name: string; org: string; email: string; whatsapp: string; message: string }): string {
  const code = `CP-${Date.now().toString(36).slice(-5).toUpperCase()}`;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const stored = raw ? JSON.parse(raw) : { v: 1, collections: {}, sections: {} };
    if (stored.v !== 1) return code;
    const list: CmsItem[] = stored.collections?.messages ?? MESSAGE_SEED;
    const now = new Date().toISOString();
    const item: CmsItem = { id: `msg-${Date.now().toString(36)}`, code, ...m, status: 'new', note: '', repliedAt: '', order: list.length + 1, updatedAt: now, createdAt: now, events: [{ at: now, by: m.name, action: 'created' }] };
    stored.collections = { ...(stored.collections ?? {}), messages: [...list, item] };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage blocked or full: the confirmation still shows; nothing is kept in staging.
  }
  return code;
}

/* ---------- Reply templates ---------- */

/** Placeholders a template may use; filled from the message when an admin picks it. */
export const TEMPLATE_TOKENS = ['{nama}', '{kode}', '{topik}', '{tim}'];

const tpl = (i: number, title: string, topic: string, subject: string, body: string): CmsItem => ({
  id: `tpl-${i}`, title, topic, subject, body, status: 'published', order: i, updatedAt: '2026-10-14T00:00:00.000Z',
});

export const TEMPLATE_SEED: CmsItem[] = [
  tpl(1, 'Balasan umum', '', 'Re: {topik} — CoPublika ({kode})', 'Halo {nama},\n\nTerima kasih sudah menghubungi CoPublika. Pesan Anda sudah kami terima dan sedang kami tindak lanjuti.\n\n\n\nSalam,\n{tim}'),
  tpl(2, 'Info program & pembayaran', 'Program', 'Info program CoPublika ({kode})', 'Halo {nama},\n\nTerima kasih atas minat Anda pada program CoPublika. Berikut informasi yang Anda tanyakan:\n\n- Jadwal angkatan terdekat: …\n- Biaya dan skema pembayaran: …\n- Cara mendaftar: copublika.id/daftar\n\nKalau ada pertanyaan lain, balas saja email ini.\n\nSalam,\n{tim}'),
  tpl(3, 'Proposal kerja sama', 'Kolaborasi', 'Proposal kerja sama CoPublika ({kode})', 'Halo {nama},\n\nTerima kasih atas tawaran kerja samanya. Kami lampirkan profil dan contoh proposal in-house training CoPublika.\n\nApakah Anda berkenan untuk diskusi 30 menit minggu ini? Silakan pilih waktu yang nyaman.\n\nSalam,\n{tim}'),
  tpl(4, 'Outline tulisan diterima', 'Tulisan tamu', 'Outline tulisan Anda ({kode})', 'Halo {nama},\n\nTerima kasih sudah mengirim outline. Kami tertarik dengan ide Anda. Catatan kami:\n\n1. …\n2. …\n\nSilakan kirim draft 1.000–1.500 kata dalam dua minggu.\n\nSalam,\n{tim}'),
  tpl(5, 'Status pendaftaran anggota', 'Keanggotaan', 'Status pendaftaran CoPublika ({kode})', 'Halo {nama},\n\nKami sudah memeriksa pendaftaran Anda. Statusnya saat ini: …\n\nJika ada dokumen yang perlu dilengkapi, kami akan menghubungi Anda melalui email ini.\n\nSalam,\n{tim}'),
];

/** Reference code; messages stored before codes existed get their seed code back. */
export const codeOf = (m: CmsItem) => {
  if (m.code) return String(m.code);
  const n = /^msg-(\d+)$/.exec(m.id)?.[1];
  return n ? `CP-${1040 + Number(n) * 37}` : m.id.toUpperCase();
};

export function fillTemplate(text: string, m: CmsItem, team = RESPONDER) {
  const first = String(m.name ?? '').replace(/^(dr|prof)\.?\s+/i, '').split(/[\s,]+/)[0];
  return text.replaceAll('{nama}', first).replaceAll('{kode}', codeOf(m)).replaceAll('{topik}', String(m.topic ?? '')).replaceAll('{tim}', team);
}

/* ---------- History ---------- */

export type MsgEvent = { at: string; by: string; action: 'created' | 'opened' | 'replied' | 'status' | 'note'; detail?: string };

export const eventsOf = (m: CmsItem): MsgEvent[] =>
  Array.isArray(m.events) ? (m.events as MsgEvent[]) : [{ at: String(m.createdAt ?? m.updatedAt), by: String(m.name ?? 'Pengirim'), action: 'created' }];

export const withMsgEvent = (m: CmsItem, e: Omit<MsgEvent, 'at'>, patch: Partial<CmsItem> = {}): CmsItem => {
  const at = new Date().toISOString();
  return { ...m, ...patch, events: [...eventsOf(m), { ...e, at }], updatedAt: at };
};

/* ---------- Reply target (SLA) ---------- */

export type Sla = { tone: 'ok' | 'soon' | 'late' | 'done'; label: string; share: number };

/** How a message stands against its topic's reply target. */
export function slaOf(m: CmsItem, targetHours: number, now: number): Sla {
  const created = new Date(String(m.createdAt)).getTime();
  const due = created + targetHours * 3_600_000;
  if (m.status !== 'new') {
    const at = m.repliedAt ? new Date(String(m.repliedAt)).getTime() : 0;
    return { tone: 'done', label: at && at <= due ? 'Tepat waktu' : at ? 'Terlambat dibalas' : 'Selesai', share: 1 };
  }
  const left = due - now;
  const share = Math.min(1, Math.max(0, (now - created) / (due - created)));
  if (left <= 0) {
    const h = Math.round(-left / 3_600_000);
    return { tone: 'late', label: h >= 24 ? `Lewat ${Math.round(h / 24)} hari` : `Lewat ${Math.max(1, h)} jam`, share: 1 };
  }
  const h = left / 3_600_000;
  return { tone: share >= 0.6 ? 'soon' : 'ok', label: h < 1 ? `${Math.max(1, Math.round(h * 60))} menit lagi` : `${Math.round(h)} jam lagi`, share };
}
