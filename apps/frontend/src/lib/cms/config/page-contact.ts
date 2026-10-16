import type { Field, PageConfig, Values } from '../types';

export const CHANNEL_KEYS = [
  { key: 'email', label: 'Email' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'threads', label: 'Threads' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'youtube', label: 'YouTube' },
];

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
      description: 'Bagian atas halaman. Semua pesan dibalas oleh Tim Admin CoPublika.',
      fields: [
        { type: 'heading', key: 'h-text', label: 'Teks pembuka', short: 'Teks', icon: 'text' },
        { key: 'badge', label: 'Label kecil', type: 'text', max: 30 },
        { key: 'title', label: 'Judul baris 1', type: 'text', required: true, max: 20 },
        { key: 'accent', label: 'Judul baris 2 (oranye)', type: 'text', max: 20 },
        { key: 'lead', label: 'Paragraf pembuka', type: 'textarea', required: true, max: 260, wide: true },
        { type: 'heading', key: 'h-router', label: 'Kartu penerus pesan', short: 'Kartu', icon: 'cursor' },
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
          itemTitle: (v) => `${s(v, 'label')} · target ${s(v, 'replyHours') || '—'} jam`,
          fields: [
            { key: 'label', label: 'Topik', type: 'text', required: true, max: 24 },
            { key: 'reply', label: 'Perkiraan balasan (tampil di web)', type: 'text', required: true, max: 24, placeholder: '± 1 hari kerja' },
            { key: 'replyHours', label: 'Target balasan', type: 'number', required: true, min: 1, max: 168, suffix: 'jam', help: 'Dipakai Kotak Pesan untuk menandai pesan yang mendekati atau lewat target.' },
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
        { type: 'heading', key: 'h-ch', label: 'Saluran langsung', short: 'Saluran', icon: 'link', help: 'Alamat dan nomor diambil dari Pengaturan Situs → Kontak & sosial. Di sini cukup pilih saluran yang tampil.' },
        ...CHANNEL_KEYS.map((c): Field => ({ key: `show_${c.key}`, label: `Tampilkan ${c.label}`, type: 'toggle', third: true })),
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
        { type: 'heading', key: 'h-addr', label: 'Alamat', icon: 'building' },
        { key: 'label', label: 'Label kecil', type: 'text', max: 20 },
        { key: 'address', label: 'Alamat', type: 'textarea', required: true, max: 160, rows: 2, wide: true },
        { type: 'heading', key: 'h-geo', label: 'Titik di Google Maps', icon: 'link', help: 'Peta kecil dan tombol rute di halaman Kontak memakai titik ini.' },
        { key: 'coords', label: 'Koordinat lokasi', type: 'geo', queryFrom: 'address', wide: true, help: 'Tempel link Google Maps, atau isi lintang dan bujur.' },
        { key: 'mapQuery', label: 'Cadangan pencarian peta', type: 'text', max: 100, wide: true, help: 'Dipakai hanya jika koordinat kosong.' },
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
