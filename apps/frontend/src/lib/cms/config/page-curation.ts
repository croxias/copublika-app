import type { PageConfig, Values } from '../types';

export const page: PageConfig = {
  title: 'Proses',
  titleAccent: 'Kurasi',
  description: 'Halaman /curation-process: menjelaskan tahapan seleksi anggota batch.',
  publicHref: '/curation-process',
  tabs: [
    {
      key: 'curation.header',
      label: 'Judul halaman',
      fields: [
        { key: 'eyebrow', label: 'Label kecil', type: 'text', max: 32 },
        { key: 'title', label: 'Judul', type: 'text', required: true, max: 60 },
        { key: 'description', label: 'Deskripsi', type: 'textarea', max: 200 },
      ],
    },
    {
      key: 'curation.steps',
      label: 'Langkah',
      fields: [
        {
          key: 'steps',
          label: 'Langkah seleksi',
          type: 'repeater',
          maxItems: 8,
          addLabel: 'Tambah langkah',
          help: 'Nomor langkah dibuat otomatis sesuai urutan.',
          itemTitle: (v: Values) => String(v.title ?? ''),
          fields: [
            { key: 'title', label: 'Judul', type: 'text', required: true, max: 50, wide: true },
            { key: 'desc', label: 'Deskripsi', type: 'textarea', required: true, max: 220 },
          ],
        },
      ],
    },
  ],
};
