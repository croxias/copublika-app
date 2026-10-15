import type { CmsItem } from '../types';
import type { SeedPart } from './types';
import { SEEDED_AT } from './types';

// Landing FAQ, copied from components/landing/FAQ.tsx.
const LANDING_FAQS: [string, string][] = [
  ['Apa itu CoPublika?', 'CoPublika adalah komunitas yang dibentuk khusus untuk akademisi pemula — dosen, peneliti, dan mahasiswa S2/S3 — yang ingin membangun rekam jejak publikasi terindeks. Kami menggabungkan kelompok riset, bootcamp, dan ruang komunitas dalam satu sistem.'],
  ['Siapa target anggota komunitas?', 'Akademisi pemula — dosen baru, peneliti awal karir, mahasiswa pascasarjana — yang merasa siap belajar tetapi membutuhkan struktur, mentor, dan teman seperjuangan untuk menjaga konsistensi.'],
  ['Apakah ada biaya untuk bergabung?', 'Forum komunitas, blog, dan beberapa webinar bersifat gratis. Program berstruktur seperti Siap Tembus Scopus berbayar — dengan opsi cicilan dan beasiswa institusi. Detail tarif disampaikan saat pendaftaran batch.'],
  ['Saya belum pernah submit ke jurnal sama sekali — apakah masih relevan?', 'Sangat relevan. Banyak peserta yang bergabung dari titik nol — kami mendampingi sejak pemilihan topik. Tidak ada pertanyaan yang terlalu kecil di komunitas.'],
  ['Apakah CoPublika menjamin naskah saya akan diterima Scopus?', 'Tidak ada lembaga yang dapat memberi jaminan absolut — keputusan akhir ada di tangan editor jurnal. Yang kami jaminkan adalah proses: kerangka kerja, mentor berpengalaman, dan klinik revisi yang konsisten.'],
  ['Bagaimana cara mendaftar?', 'Klik tombol Daftar di pojok kanan atas, atau pergi ke halaman program yang anda minati. Setelah membuat akun, anda akan langsung terhubung ke forum dan jadwal batch terdekat.'],
];

export const LANDING_FAQ_IDS = LANDING_FAQS.map((_, i) => `faq-${i + 1}`);

const faqs: CmsItem[] = LANDING_FAQS.map(([question, answer], i) => ({
  id: LANDING_FAQ_IDS[i],
  question,
  answer,
  category: i === 5 ? 'pendaftaran' : i === 2 ? 'program' : 'umum',
  status: 'published',
  order: i + 1,
  updatedAt: SEEDED_AT,
}));

export const seed: SeedPart = { collections: { faqs } };
