import type { Field, PageConfig } from '../types';

const sectionHead = (help: string): Field[] => [
  { type: 'heading', key: 'h-head', label: 'Judul section', icon: 'heading', help },
  { key: 'tag', label: 'Label section', type: 'text', max: 30, help: 'Teks kecil oranye di atas judul.' },
  { key: 'title', label: 'Judul', type: 'text', required: true, max: 40 },
  { key: 'accent', label: 'Judul (bagian oranye)', type: 'text', max: 40 },
  { key: 'lead', label: 'Deskripsi', type: 'textarea', max: 220, wide: true },
];

/** /event and /event/[slug] — sections in the order the public pages render them. */
export const page: PageConfig = {
  title: 'Halaman',
  titleAccent: 'Event',
  description: 'Teks di halaman /event dan halaman tiap event. Daftar acara, kuota, dan pendaftar diatur di Konten → Agenda Event.',
  publicHref: '/event',
  groupSections: true,
  tabs: [
    {
      key: 'event.hero',
      label: 'Hero',
      description: 'Bagian paling atas /event. Kalender 3D, kartu tanggal yang melayang, dan tiga angka dihitung otomatis dari Agenda Event.',
      source: { label: 'Agenda Event', href: '/admin/events' },
      preview: 'eventHero',
      fields: [
        { type: 'heading', key: 'h-text', label: 'Teks pembuka', short: 'Teks', icon: 'text' },
        { key: 'pill', label: 'Label kecil di atas judul', type: 'text', max: 60, wide: true },
        { key: 'title', label: 'Judul baris 1', type: 'text', required: true, max: 30 },
        { key: 'accent', label: 'Judul baris 2 (oranye)', type: 'text', max: 30 },
        { key: 'lead', label: 'Paragraf pembuka', type: 'textarea', required: true, max: 260, wide: true },
        { type: 'heading', key: 'h-cta', label: 'Tombol', icon: 'cursor', help: 'Tombol utama menggulir ke Acara terdekat; tombol kedua membuka kalender bulanan.' },
        { key: 'ctaPrimary', label: 'Tombol utama', type: 'text', required: true, max: 28 },
        { key: 'ctaSecondary', label: 'Tombol kedua', type: 'text', max: 28 },
      ],
    },
    {
      key: 'event.next',
      label: 'Acara terdekat',
      hideable: true,
      description: 'Tiket lebar berisi acara yang disematkan, atau acara dengan tanggal terdekat, lengkap dengan hitung mundur.',
      source: { label: 'Agenda Event', href: '/admin/events' },
      preview: 'eventNext',
      fields: sectionHead('Atur acara yang tampil lewat tombol "Sematkan sebagai acara terdekat" di Agenda Event.'),
    },
    {
      key: 'event.agenda',
      label: 'Agenda',
      description: 'Tabel acara (4 per halaman) dengan pencarian, filter jenis, dan tampilan kalender bulanan.',
      source: { label: 'Agenda Event', href: '/admin/events' },
      preview: 'eventAgenda',
      fields: sectionHead('Jenis acara dan jumlahnya di filter mengikuti Agenda Event.'),
    },
    {
      key: 'event.detail',
      label: 'Halaman event',
      description: 'Teks yang sama di setiap halaman event (/event/slug). Isi acara, pembicara, dan susunan acara diambil dari eventnya.',
      preview: 'eventDetail',
      fields: [
        { type: 'heading', key: 'h-price', label: 'Harga & pendaftaran', short: 'Pendaftaran', icon: 'ticket' },
        { key: 'nonMemberPrice', label: 'Harga untuk non-anggota', type: 'number', min: 0, suffix: 'Rupiah', help: 'Ditampilkan di kartu pendaftaran event gratis, mis. "umum Rp. 75.000".' },
        { key: 'doneTitle', label: 'Judul setelah mendaftar', type: 'text', required: true, max: 40 },
        { key: 'doneText', label: 'Keterangan setelah mendaftar', type: 'textarea', max: 160, rows: 2, wide: true },
        { type: 'heading', key: 'h-more', label: 'Acara berikutnya', short: 'Acara berikutnya', icon: 'calendar', help: 'Tiga acara terdekat di bagian bawah halaman event.' },
        { key: 'moreTag', label: 'Label section', type: 'text', max: 30 },
        { key: 'moreTitle', label: 'Judul', type: 'text', required: true, max: 30 },
        { key: 'moreAccent', label: 'Judul (bagian oranye)', type: 'text', max: 30 },
      ],
    },
  ],
};
