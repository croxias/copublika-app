import type { PageConfig, Values } from '../types';

const s = (v: Values, k: string) => String(v[k] ?? '');

export const page: PageConfig = {
  title: 'Kontak',
  description: 'Halaman /contact. Email, WhatsApp, dan sosial media diambil dari Pengaturan Situs, kecuali diisi ulang di sini.',
  publicHref: '/contact',
  tabs: [
    {
      key: 'contact.hero',
      label: 'Judul halaman',
      fields: [
        { key: 'badge', label: 'Label kecil', type: 'text', max: 24 },
        { key: 'title', label: 'Judul', type: 'text', required: true, max: 40 },
        { key: 'sub', label: 'Subjudul', type: 'textarea', max: 180, rows: 2 },
      ],
    },
    {
      key: 'contact.channels',
      label: 'Saluran langsung',
      fields: [
        { key: 'heading', label: 'Judul kolom', type: 'text', max: 32, wide: true },
        {
          key: 'channels',
          label: 'Saluran',
          type: 'repeater',
          maxItems: 6,
          addLabel: 'Tambah saluran',
          help: 'Kosongkan daftar untuk memakai email, WhatsApp, Instagram, dan Threads dari Pengaturan Situs.',
          itemTitle: (v) => `${s(v, 'label')} · ${s(v, 'value')}`,
          fields: [
            { key: 'label', label: 'Nama saluran', type: 'text', required: true, max: 20 },
            { key: 'value', label: 'Teks yang tampil', type: 'text', required: true, max: 40 },
            { key: 'href', label: 'Link', type: 'url', required: true, wide: true, placeholder: 'mailto:…, https://wa.me/…' },
          ],
        },
      ],
    },
    {
      key: 'contact.form',
      label: 'Formulir',
      fields: [
        { key: 'title', label: 'Judul formulir', type: 'text', required: true, max: 32, wide: true },
        {
          key: 'topics',
          label: 'Pilihan topik',
          type: 'repeater',
          maxItems: 6,
          addLabel: 'Tambah topik',
          itemTitle: (v) => s(v, 'label'),
          fields: [{ key: 'label', label: 'Topik', type: 'text', required: true, max: 24, wide: true }],
        },
        { key: 'consent', label: 'Catatan persetujuan', type: 'text', max: 120, wide: true },
        { key: 'successTitle', label: 'Judul setelah terkirim', type: 'text', max: 32 },
        { key: 'successDesc', label: 'Pesan setelah terkirim', type: 'text', max: 100 },
      ],
    },
    {
      key: 'contact.location',
      label: 'Lokasi',
      hideable: true,
      fields: [
        { key: 'label', label: 'Label kecil', type: 'text', max: 20, wide: true },
        { key: 'address', label: 'Alamat', type: 'textarea', required: true, max: 160, rows: 2 },
      ],
    },
  ],
};
