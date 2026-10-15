import { slugify } from '../slug';
import type { CmsItem } from '../types';
import type { SeedPart } from './types';
import { SEEDED_AT } from './types';

type Testi = { badge: string; quote: string; avatar: number; name: string; role: string };

// Copied from components/landing/AlumniMarquee.tsx (ROW_A, then ROW_B).
const ROW_A: Testi[] = [
  { badge: 'Q3 · 2024', quote: 'Saya kira mengirim ke jurnal Scopus mustahil di tahun pertama mengajar. Tiga bulan setelah bootcamp, naskah pertama saya diterima di jurnal Q3.', avatar: 44, name: 'Rini Puspita, M.Pd.', role: 'Universitas Negeri Semarang' },
  { badge: 'Q2 · 2025', quote: 'Yang paling berharga bukan modulnya — tapi komunitasnya. Saya menemukan co-author yang sefrekuensi di cluster Public Health.', avatar: 33, name: 'dr. Andika Hidayat', role: 'Peneliti Kesehatan, Surabaya' },
  { badge: 'Sinta 2', quote: 'Klinik manuskrip mingguan memaksa saya konsisten. Yang dulu saya tunda berbulan-bulan akhirnya saya selesaikan dalam 6 minggu.', avatar: 24, name: 'Siti Nurhaliza, M.A.', role: 'Mahasiswa S2 Sosiologi, UI' },
  { badge: 'Q3 · 2024', quote: 'Pertanyaan paling kecil saya pun ditanggapi seperti pertanyaan penting. Itu yang bikin saya bertahan ketika revisi terasa berat.', avatar: 11, name: 'Reza Maulana', role: 'Dosen Junior, ITB' },
  { badge: 'Q1 · 2025', quote: "Mentor saya membaca naskah saya tiga kali sebelum disubmit. Detail itu yang membuat reviewer Q1 saya menulis 'this is well-structured'.", avatar: 68, name: 'Putri Andini, Ph.D.', role: 'Peneliti BRIN' },
];

const ROW_B: Testi[] = [
  { badge: 'Q2 · 2024', quote: 'Saya sudah lima tahun jadi dosen tetap dan baru kali ini merasa naskah saya benar-benar ditulis bersama, bukan sendirian.', avatar: 14, name: 'Dr. Bayu Wijaya', role: 'Universitas Brawijaya' },
  { badge: 'Sinta 1', quote: 'Komunitas yang sehat ternyata sangat berpengaruh. Saya jadi terbiasa menulis 30 menit setiap hari karena ada teman yang juga menulis.', avatar: 29, name: 'Anisa Kurnia, M.Si.', role: 'Mahasiswa S2 Biologi, UGM' },
  { badge: 'Q3 · 2025', quote: 'Saya pikir saya tidak punya cerita untuk ditulis. Workshop CoPublika mengajari saya cara menemukan narasi dari data harian.', avatar: 58, name: 'Hadi Suryanto', role: 'Praktisi & Dosen Tamu, Bandung' },
  { badge: 'Q2 · 2024', quote: 'Editor tamu yang dihadirkan benar-benar memberi insight tentang apa yang dilihat reviewer. Ini hal yang tidak saya dapat di kampus.', avatar: 36, name: 'Dr. Lestari Wahyuni', role: 'Editor & Pendidik, Yogyakarta' },
  { badge: 'Q1 · 2024', quote: 'Saya bergabung dari Papua dan tidak pernah merasa jauh. Mentor saya selalu hadir untuk review draft saya di Zoom mingguan.', avatar: 42, name: 'Yohanes Mbete, S.Pd.', role: 'Dosen STKIP, Jayapura' },
];

export const testimonialId = (name: string) => `testi-${slugify(name)}`;

/** Ids per marquee row, for the Beranda seed. */
export const HOME_TESTIMONIAL_ROWS = { a: ROW_A.map((t) => testimonialId(t.name)), b: ROW_B.map((t) => testimonialId(t.name)) };

const testimonials: CmsItem[] = [...ROW_A, ...ROW_B].map((t, i) => ({
  id: testimonialId(t.name),
  name: t.name,
  role: t.role,
  quote: t.quote,
  badge: t.badge,
  avatar: `https://i.pravatar.cc/100?img=${t.avatar}`,
  status: 'published',
  order: i + 1,
  updatedAt: SEEDED_AT,
}));

export const seed: SeedPart = { collections: { testimonials } };
