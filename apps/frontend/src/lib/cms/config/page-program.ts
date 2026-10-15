import type { Field, PageConfig, Values } from '../types';

const s = (v: Values, k: string) => String(v[k] ?? '');
const BATCHES = { label: 'Manajemen Batch', href: '/admin/batches' };

const textList = (key: string, label: string, max: number, maxItems: number): Field => ({
  key,
  label,
  type: 'repeater',
  maxItems,
  addLabel: 'Tambah poin',
  itemTitle: (v: Values) => s(v, 'text'),
  fields: [{ key: 'text', label: 'Poin', type: 'text', required: true, max, wide: true }],
});

export const page: PageConfig = {
  title: 'Siap Tembus',
  titleAccent: 'Scopus',
  description: 'Halaman program bootcamp. Nama batch, kuota, dan link daftar diambil otomatis dari batch yang sedang dibuka.',
  publicHref: '/siap-tembus-scopus',
  tabs: [
    {
      key: 'sts.hero',
      label: 'Hero',
      source: BATCHES,
      fields: [
        { key: 'titleLine', label: 'Judul baris pertama', type: 'text', required: true, max: 24 },
        { key: 'titleAccent', label: 'Judul (bagian oranye)', type: 'text', required: true, max: 32 },
        { key: 'lead', label: 'Paragraf pembuka', type: 'textarea', required: true, max: 220 },
        { key: 'primaryLabel', label: 'Tombol daftar', type: 'text', required: true, max: 20, help: 'Nama batch ditambahkan otomatis, mis. "Daftar Batch #07".' },
        { key: 'secondaryLabel', label: 'Tombol kedua', type: 'text', max: 20, help: 'Menggulir ke section Kurikulum.' },
        {
          key: 'stats',
          label: 'Kartu angka di ilustrasi',
          type: 'repeater',
          maxItems: 2,
          itemTitle: (v) => `${s(v, 'value')} ${s(v, 'label')}`,
          fields: [
            { key: 'value', label: 'Angka', type: 'text', required: true, max: 8 },
            { key: 'label', label: 'Label', type: 'text', required: true, max: 16 },
          ],
        },
        {
          key: 'meta',
          label: 'Info singkat',
          type: 'repeater',
          maxItems: 3,
          help: 'Kolom "Kuota tersisa" ditambahkan otomatis dari batch yang dibuka.',
          itemTitle: (v) => `${s(v, 'label')}: ${s(v, 'value')}`,
          fields: [
            { key: 'label', label: 'Label', type: 'text', required: true, max: 16 },
            { key: 'value', label: 'Isi', type: 'text', required: true, max: 20 },
            { key: 'sub', label: 'Keterangan kecil', type: 'text', max: 32 },
          ],
        },
      ],
    },
    {
      key: 'sts.fit',
      label: 'Untuk siapa',
      hideable: true,
      fields: [
        { key: 'tag', label: 'Label kecil', type: 'text', max: 24 },
        { key: 'title', label: 'Judul', type: 'text', required: true, max: 60 },
        { type: 'heading', key: 'h-ideal', label: 'Kartu profil ideal' },
        { key: 'idealLabel', label: 'Judul kartu', type: 'text', max: 24, wide: true },
        textList('ideal', 'Profil ideal', 120, 6),
        { type: 'heading', key: 'h-output', label: 'Kartu output' },
        { key: 'outputLabel', label: 'Judul kartu', type: 'text', max: 24, wide: true },
        textList('outputs', 'Output peserta', 120, 6),
      ],
    },
    {
      key: 'sts.curriculum',
      label: 'Kurikulum',
      hideable: true,
      fields: [
        { key: 'tag', label: 'Label kecil', type: 'text', max: 32 },
        { key: 'title', label: 'Judul', type: 'text', required: true, max: 40 },
        { key: 'sub', label: 'Subjudul', type: 'textarea', max: 180, rows: 2 },
        {
          key: 'phases',
          label: 'Fase',
          type: 'repeater',
          maxItems: 8,
          addLabel: 'Tambah fase',
          help: 'Jumlah fase juga menentukan titik di ilustrasi hero.',
          itemTitle: (v) => `${s(v, 'week')} · ${s(v, 'title')}`,
          fields: [
            { key: 'week', label: 'Minggu', type: 'text', required: true, max: 10, placeholder: 'W 1–2' },
            { key: 'phase', label: 'Label fase', type: 'text', max: 32, placeholder: 'Phase 01 / Discover' },
            { key: 'title', label: 'Judul', type: 'text', required: true, max: 50, wide: true },
            { key: 'desc', label: 'Deskripsi', type: 'textarea', max: 160, rows: 2 },
            { key: 'deliverable', label: 'Output fase', type: 'text', max: 40 },
          ],
        },
      ],
    },
    {
      key: 'sts.mentors',
      label: 'Mentor',
      hideable: true,
      fields: [
        { key: 'tag', label: 'Label kecil', type: 'text', max: 32 },
        { key: 'title', label: 'Judul', type: 'text', required: true, max: 50 },
        { key: 'sub', label: 'Subjudul', type: 'textarea', max: 160, rows: 2 },
        {
          key: 'mentors',
          label: 'Mentor yang ditampilkan',
          type: 'ref',
          collection: 'people',
          multiple: true,
          filter: (x) => x.kind === 'mentor' || x.kind === 'both',
          help: 'Kartu memakai nama, bidang keahlian, bio, dan metrik dari Tim & Mentor.',
        },
      ],
    },
    {
      key: 'sts.free',
      label: 'Kursi gratis & CTA',
      hideable: true,
      source: BATCHES,
      fields: [
        { key: 'pill', label: 'Label kecil', type: 'text', max: 32 },
        { key: 'titleAccent', label: 'Judul (bagian oranye)', type: 'text', required: true, max: 24, help: 'Judul lengkap: "<batch> — <teks ini>. Hanya N kursi tersisa dari M." Angka kursi otomatis.' },
        { key: 'lead', label: 'Paragraf', type: 'textarea', max: 240 },
        {
          key: 'features',
          label: 'Yang didapat',
          type: 'repeater',
          maxItems: 6,
          addLabel: 'Tambah poin',
          itemTitle: (v) => s(v, 'text'),
          fields: [{ key: 'text', label: 'Poin', type: 'text', required: true, max: 40, wide: true }],
        },
        { type: 'heading', key: 'h-buttons', label: 'Tombol' },
        { key: 'primaryLabel', label: 'Tombol utama', type: 'text', required: true, max: 28, wide: true, help: 'Nama batch ditambahkan otomatis.' },
        { key: 'secondaryLabel', label: 'Tombol kedua', type: 'text', max: 20 },
        { key: 'secondaryHref', label: 'Link tombol kedua', type: 'url' },
      ],
    },
  ],
};
