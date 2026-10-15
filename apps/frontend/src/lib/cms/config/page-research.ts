import type { Field, PageConfig } from '../types';
import { PHASES } from '@/lib/content/research';

const sectionHead: Field[] = [
  { key: 'tag', label: 'Label section', type: 'text', max: 30, help: 'Teks kecil oranye di atas judul.' },
  { key: 'heading', label: 'Judul', type: 'text', required: true, max: 40 },
  { key: 'headingAccent', label: 'Judul (bagian oranye)', type: 'text', max: 40 },
  { key: 'sub', label: 'Deskripsi', type: 'textarea', max: 220, wide: true },
];

/** /research — sections in the order app/(public)/research/page.tsx renders them. */
export const page: PageConfig = {
  title: 'Halaman',
  titleAccent: 'Riset',
  description: 'Teks di halaman /research. Daftar proyek, publikasi, dan peta bidang di hero diambil otomatis dari menu Riset & Proyek dan Publikasi Anggota.',
  publicHref: '/research',
  tabs: [
    {
      key: 'research.hero',
      label: 'Hero',
      description: 'Bagian paling atas. Globe 3D di sebelah kanan dibentuk otomatis dari cluster publikasi anggota.',
      fields: [
        { key: 'pulse', label: 'Label kecil di atas judul', type: 'text', max: 60, wide: true },
        { key: 'title', label: 'Judul baris 1', type: 'text', required: true, max: 40 },
        { key: 'titleAccent', label: 'Judul baris 2 (oranye)', type: 'text', max: 40 },
        { key: 'lead', label: 'Paragraf pembuka', type: 'textarea', required: true, max: 260, wide: true },
        { key: 'ctaPrimary', label: 'Tombol utama', type: 'text', max: 24, help: 'Menggulir ke Proyek aktif.' },
        { key: 'ctaSecondary', label: 'Tombol kedua', type: 'text', max: 24, help: 'Menggulir ke Publikasi anggota.' },
        {
          key: 'stats',
          label: 'Angka statistik',
          type: 'repeater',
          fixed: true,
          itemTitle: (s) => [s.value, s.label].filter(Boolean).join(' — '),
          fields: [
            { key: 'value', label: 'Angka', type: 'text', required: true, max: 8, placeholder: '318' },
            { key: 'label', label: 'Keterangan', type: 'text', required: true, max: 24 },
          ],
        },
      ],
    },
    {
      key: 'research.gallery',
      label: 'Proyek aktif',
      hideable: true,
      description: 'Kartu, filter status, dan pagination (3 proyek per halaman) diisi dari Riset & Proyek.',
      source: { label: 'Riset & Proyek', href: '/admin/projects' },
      fields: sectionHead,
    },
    {
      key: 'research.process',
      label: 'Cara kerja',
      hideable: true,
      description: 'Empat kartu tahap, sama dengan tahap di kartu proyek. Tombol di tiap kartu memfilter proyek di tahap itu.',
      fields: [
        ...sectionHead,
        {
          key: 'steps',
          label: 'Tahapan',
          type: 'repeater',
          fixed: true,
          layout: 'cards',
          itemKicker: (s) => String(s.phase ?? ''),
          itemText: (s) => String(s.desc ?? ''),
          itemTitle: (s) => String(s.title ?? ''),
          fields: [
            { key: 'phase', label: 'Fase', type: 'select', required: true, options: PHASES.map((p) => ({ value: p.label, label: p.label })), help: 'Mengikuti tahap proyek; urutan tidak bisa diubah.' },
            { key: 'title', label: 'Judul tahap', type: 'text', required: true, max: 30 },
            { key: 'desc', label: 'Deskripsi', type: 'textarea', required: true, max: 200, wide: true },
            { key: 'output', label: 'Output', type: 'text', max: 40 },
          ],
        },
      ],
    },
    {
      key: 'research.publications',
      label: 'Publikasi anggota',
      hideable: true,
      description: 'Tabel, filter indeks dan cluster, urutan tanggal, tombol Unduh PDF, dan pagination diisi dari Publikasi Anggota.',
      source: { label: 'Publikasi Anggota', href: '/admin/publications' },
      fields: sectionHead,
    },
  ],
};
