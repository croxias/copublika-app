import type { Field, PageConfig, Values } from '../types';

const s = (v: Values, k: string) => String(v[k] ?? '');

const head: Field[] = [
  { key: 'tag', label: 'Label section', type: 'text', max: 30 },
  { key: 'title', label: 'Judul', type: 'text', required: true, max: 40 },
  { key: 'accent', label: 'Judul (bagian oranye)', type: 'text', max: 40 },
];

/** /contact — sections in the order the public page renders them. */
export const page: PageConfig = {
  title: 'Kontak',
  description: 'Halaman /contact. Pesan dari formulir masuk ke Konten → Kotak Pesan.',
  publicHref: '/contact',
  groupSections: true,
  tabs: [
    {
      key: 'contact.hero',
      label: 'Hero',
      description: 'Bagian atas halaman. Kartu di kanan meneruskan pengunjung ke tim yang tepat sesuai topik yang dipilih.',
      fields: [
        { type: 'heading', key: 'h-text', label: 'Teks pembuka', short: 'Teks', icon: 'text' },
        { key: 'badge', label: 'Label kecil', type: 'text', max: 30 },
        { key: 'title', label: 'Judul baris 1', type: 'text', required: true, max: 20 },
        { key: 'accent', label: 'Judul baris 2 (oranye)', type: 'text', max: 20 },
        { key: 'lead', label: 'Paragraf pembuka', type: 'textarea', required: true, max: 260, wide: true },
        { type: 'heading', key: 'h-router', label: 'Kartu penerus pesan', short: 'Kartu', icon: 'cursor' },
        { key: 'routerTitle', label: 'Judul kartu', type: 'text', max: 40, wide: true },
        { key: 'cta', label: 'Tombol', type: 'text', required: true, max: 24 },
      ],
    },
    {
      key: 'contact.topics',
      label: 'Topik & tim',
      description: 'Pilihan topik di hero dan formulir. Setiap topik punya tim, perkiraan waktu balas, dan saluran terbaik.',
      fields: [
        {
          key: 'topics',
          label: 'Topik',
          type: 'repeater',
          maxItems: 6,
          addLabel: 'Tambah topik',
          itemTitle: (v) => `${s(v, 'label')} → ${s(v, 'team')}`,
          fields: [
            { key: 'label', label: 'Topik', type: 'text', required: true, max: 24 },
            { key: 'team', label: 'Diteruskan ke', type: 'text', required: true, max: 30 },
            { key: 'reply', label: 'Perkiraan balasan', type: 'text', required: true, max: 24, placeholder: '± 1 hari kerja' },
            { key: 'channel', label: 'Saluran terbaik', type: 'text', max: 20 },
            { key: 'hint', label: 'Contoh pertanyaan', type: 'textarea', max: 140, rows: 2, wide: true },
          ],
        },
      ],
    },
    {
      key: 'contact.channels',
      label: 'Saluran & jam',
      description: 'Kartu saluran langsung dan jam layanan. Status "Buka sekarang" dihitung otomatis dari jam WIB.',
      fields: [
        { type: 'heading', key: 'h-ch', label: 'Saluran langsung', short: 'Saluran', icon: 'link' },
        {
          key: 'channels',
          label: 'Saluran',
          type: 'repeater',
          maxItems: 6,
          addLabel: 'Tambah saluran',
          itemTitle: (v) => `${s(v, 'label')} · ${s(v, 'value')}`,
          fields: [
            { key: 'label', label: 'Nama saluran', type: 'text', required: true, max: 20 },
            { key: 'value', label: 'Teks yang tampil', type: 'text', required: true, max: 40 },
            { key: 'href', label: 'Link', type: 'url', required: true, wide: true, placeholder: 'mailto:…, https://wa.me/…' },
          ],
        },
        { type: 'heading', key: 'h-hours', label: 'Jam layanan (WIB)', short: 'Jam', icon: 'calendar', help: 'Kosongkan jam buka untuk hari libur.' },
        {
          key: 'days',
          label: 'Hari',
          type: 'repeater',
          fixed: true,
          itemTitle: (v) => `${s(v, 'day')} · ${s(v, 'open') ? `${s(v, 'open')}–${s(v, 'close')}` : 'Tutup'}`,
          fields: [
            { key: 'day', label: 'Hari', type: 'text', required: true, max: 10 },
            { key: 'open', label: 'Buka', type: 'time' },
            { key: 'close', label: 'Tutup', type: 'time' },
          ],
        },
        { key: 'note', label: 'Catatan', type: 'text', max: 100, wide: true },
      ],
    },
    {
      key: 'contact.form',
      label: 'Formulir',
      description: 'Pesan yang dikirim masuk ke Kotak Pesan dengan nomor referensi.',
      source: { label: 'Kotak Pesan', href: '/admin/messages' },
      fields: [
        { type: 'heading', key: 'h-head', label: 'Judul', icon: 'heading' },
        ...head,
        { key: 'lead', label: 'Deskripsi', type: 'textarea', max: 160, rows: 2, wide: true },
        { type: 'heading', key: 'h-send', label: 'Kirim & terima kasih', short: 'Kirim', icon: 'cursor' },
        { key: 'submit', label: 'Tombol kirim', type: 'text', required: true, max: 24 },
        { key: 'consent', label: 'Catatan persetujuan', type: 'textarea', max: 160, rows: 2, wide: true },
        { key: 'successTitle', label: 'Judul setelah terkirim', type: 'text', max: 32 },
        { key: 'successText', label: 'Pesan setelah terkirim', type: 'textarea', max: 160, rows: 2, wide: true },
      ],
    },
    {
      key: 'contact.location',
      label: 'Lokasi',
      hideable: true,
      fields: [
        { key: 'label', label: 'Label kecil', type: 'text', max: 20 },
        { key: 'address', label: 'Alamat', type: 'textarea', required: true, max: 160, rows: 2, wide: true },
        { key: 'mapQuery', label: 'Pencarian peta', type: 'text', max: 100, wide: true, help: 'Teks yang dicari di Google Maps untuk peta kecil.' },
      ],
    },
    {
      key: 'contact.faq',
      label: 'Pertanyaan umum',
      hideable: true,
      fields: [
        { type: 'heading', key: 'h-head', label: 'Judul', icon: 'heading' },
        ...head,
        { type: 'heading', key: 'h-items', label: 'Pertanyaan', icon: 'help' },
        {
          key: 'items',
          label: 'Pertanyaan',
          type: 'repeater',
          maxItems: 8,
          addLabel: 'Tambah pertanyaan',
          itemTitle: (v) => s(v, 'q'),
          fields: [
            { key: 'q', label: 'Pertanyaan', type: 'text', required: true, max: 100, wide: true },
            { key: 'a', label: 'Jawaban', type: 'textarea', required: true, max: 400, rows: 3, wide: true },
          ],
        },
      ],
    },
  ],
};
