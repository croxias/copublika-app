// Contact messages (staging). The /contact form appends here and the admin reads them in
// Konten → Kotak Pesan. Kept free of the CMS seed so the public bundle stays small.

import type { CmsItem, StatusTone } from './types';

export type MsgStatus = 'new' | 'replied' | 'closed' | 'spam';

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
  msg(3, 'Tulisan tamu', 'Andi Saputra, M.Pd.', 'Universitas Pendidikan Ganesha', 'andi.saputra@undiksha.ac.id', '', 'Saya ingin menulis tentang pengalaman ditolak 3 kali sebelum diterima di jurnal Q2. Outline: (1) penolakan pertama karena scope, (2) revisi metodologi, (3) strategi cover letter.', '2026-10-13T20:41', { status: 'replied', repliedAt: '2026-10-14T10:15:00.000Z', note: 'Diteruskan ke Tim Editor. Minta draft 1.500 kata.' }),
  msg(4, 'Keanggotaan', 'Putri Maharani', 'Universitas Sriwijaya', 'putri.maharani@unsri.ac.id', '+62 813 9988 1122', 'Saya sudah mendaftar batch 5 dua minggu lalu dengan Google Scholar ID, tapi status masih menunggu verifikasi. Apakah ada dokumen yang kurang?', '2026-10-12T11:18', { status: 'closed', repliedAt: '2026-10-12T14:00:00.000Z', note: 'Sudah diverifikasi, email aktivasi terkirim.' }),
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
    const item: CmsItem = { id: `msg-${Date.now().toString(36)}`, code, ...m, status: 'new', note: '', repliedAt: '', order: list.length + 1, updatedAt: now, createdAt: now };
    stored.collections = { ...(stored.collections ?? {}), messages: [...list, item] };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage blocked or full: the confirmation still shows; nothing is kept in staging.
  }
  return code;
}
