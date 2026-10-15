import type { Field, PageConfig, Values } from '../types';
import { PEOPLE } from '../seed/people';
import { personId } from '../slug';

const s = (v: Values, k: string) => String(v[k] ?? '');
/** Mentor name for a people id, for repeater row titles. */
const personName = (id: string) => PEOPLE.find((p) => personId(p.name) === id)?.name ?? (id ? id.replace(/^person-/, '').replace(/-/g, ' ') : 'Pilih mentor');

/** Tag, title, orange accent and lead: the head every program section shares. */
const head = (key = 'h-head'): Field[] => [
  { type: 'heading', key, label: 'Judul section', short: 'Judul', icon: 'heading' },
  { key: 'tag', label: 'Label section', type: 'text', max: 30, help: 'Teks kecil oranye di atas judul.' },
  { key: 'title', label: 'Judul', type: 'text', required: true, max: 40 },
  { key: 'accent', label: 'Judul (bagian oranye)', type: 'text', max: 40 },
  { key: 'lead', label: 'Deskripsi', type: 'textarea', max: 240, wide: true },
];

const faqField: Field = {
  key: 'faq',
  label: 'Pertanyaan FAQ',
  type: 'repeater',
  maxItems: 8,
  addLabel: 'Tambah pertanyaan',
  itemTitle: (v) => s(v, 'q'),
  fields: [
    { key: 'q', label: 'Pertanyaan', type: 'text', required: true, max: 90, wide: true },
    { key: 'a', label: 'Jawaban', type: 'textarea', required: true, max: 320, wide: true },
  ],
};

const checksField = (help: string): Field => ({
  key: 'checks',
  label: 'Pernyataan cek kecocokan',
  type: 'repeater',
  fixed: true,
  help,
  itemTitle: (v, i) => `${i + 1}. ${s(v, 'text')}`,
  fields: [{ key: 'text', label: 'Pernyataan', type: 'text', required: true, max: 90, wide: true }],
});

/* ---------------------------------------------------------------------------
   Siap Tembus Scopus 1-on-1
   --------------------------------------------------------------------------- */

export const stsPage: PageConfig = {
  title: 'Siap Tembus Scopus',
  titleAccent: '1-on-1',
  description: 'Harga, kursi mentor, dan isi halaman /siap-tembus-scopus. Profil mentor diambil dari Tim & Mentor.',
  publicHref: '/siap-tembus-scopus',
  groupSections: true,
  tabs: [
    {
      key: 'program.sts.offer',
      label: 'Harga & kursi',
      description: 'Dipakai di hero, kartu mentor, form daftar, dan CTA akhir.',
      fields: [
        { type: 'heading', key: 'h-price', label: 'Harga', icon: 'ticket' },
        { key: 'price', label: 'Harga program', type: 'number', required: true, min: 0, suffix: 'rupiah', help: 'Tampil sebagai "Rp. 600.000".' },
        { key: 'unit', label: 'Keterangan harga', type: 'text', max: 40, placeholder: 'per peserta · sekali bayar' },
        { type: 'heading', key: 'h-seats', label: 'Kursi mentor', icon: 'users', help: 'Kursi yang sudah terisi bulan ini dan bulan depan. Sisa kursi di halaman publik dihitung dari sini.' },
        { key: 'seatsPerMentor', label: 'Kuota per mentor per bulan', type: 'number', required: true, min: 1, max: 20, suffix: 'peserta' },
        {
          key: 'mentors',
          label: 'Mentor 1-on-1',
          type: 'repeater',
          maxItems: 12,
          addLabel: 'Tambah mentor',
          itemPerson: (v) => s(v, 'mentor'),
          itemTitle: (v) => `${personName(s(v, 'mentor'))} · terisi ${s(v, 'bookedThis') || 0} bulan ini, ${s(v, 'bookedNext') || 0} bulan depan`,
          fields: [
            { key: 'mentor', label: 'Mentor', type: 'ref', collection: 'people', required: true, filter: (x) => x.kind === 'mentor' || x.kind === 'both', wide: true },
            { key: 'bookedThis', label: 'Terisi bulan ini', type: 'number', min: 0, max: 20, suffix: 'peserta' },
            { key: 'bookedNext', label: 'Terisi bulan depan', type: 'number', min: 0, max: 20, suffix: 'peserta' },
          ],
        },
      ],
    },
    {
      key: 'program.sts.hero',
      label: 'Hero',
      description: 'Bagian paling atas. Harga dan sisa kursi diambil dari tab Harga & kursi.',
      fields: [
        { type: 'heading', key: 'h-text', label: 'Judul & teks', icon: 'heading' },
        { key: 'pill', label: 'Label kecil di atas judul', type: 'text', max: 48, wide: true },
        { key: 'title', label: 'Judul baris 1', type: 'text', required: true, max: 24 },
        { key: 'accent', label: 'Judul baris 2 (oranye)', type: 'text', required: true, max: 24 },
        { key: 'badge', label: 'Badge di samping judul', type: 'text', max: 12 },
        { key: 'lead', label: 'Paragraf pembuka', type: 'textarea', required: true, max: 240, wide: true },
        { type: 'heading', key: 'h-buttons', label: 'Tombol & detail', short: 'Tombol', icon: 'cursor' },
        { key: 'priceLabel', label: 'Label harga', type: 'text', max: 30 },
        { key: 'ctaPrimary', label: 'Tombol utama', type: 'text', required: true, max: 24, help: 'Menggulir ke Pilih mentor.' },
        { key: 'ctaSecondary', label: 'Tombol kedua', type: 'text', max: 24, help: 'Menggulir ke Alur program.' },
        { key: 'trust', label: 'Poin kepercayaan', type: 'tags', help: 'Dua poin kecil di bawah tombol.' },
        { key: 'floatA', label: 'Chip melayang 1', type: 'text', max: 28 },
        { key: 'floatB', label: 'Chip melayang 2', type: 'text', max: 28 },
      ],
    },
    {
      key: 'program.sts.benefits',
      label: 'Yang Anda dapatkan',
      hideable: true,
      description: 'Bento interaktif: agenda sesi, putaran review, dan dokumen hasil.',
      fields: [
        ...head(),
        { type: 'heading', key: 'h-agenda', label: 'Agenda sesi 90 menit', short: 'Agenda', icon: 'calendar' },
        {
          key: 'agenda',
          label: 'Bagian sesi',
          type: 'repeater',
          fixed: true,
          help: 'Panjang tiap bagian di grafik mengikuti jumlah menitnya.',
          itemTitle: (v) => `${s(v, 'min')}′ · ${s(v, 'title')}`,
          fields: [
            { key: 'min', label: 'Menit', type: 'number', required: true, min: 5, max: 90, suffix: 'menit' },
            { key: 'title', label: 'Judul', type: 'text', required: true, max: 32 },
            { key: 'text', label: 'Penjelasan', type: 'textarea', max: 140, wide: true },
          ],
        },
        { type: 'heading', key: 'h-rounds', label: 'Putaran review', short: 'Review', icon: 'progress' },
        {
          key: 'rounds',
          label: 'Fokus tiap putaran',
          type: 'repeater',
          fixed: true,
          itemTitle: (v, i) => `R${i + 1} · ${s(v, 'title')} · ${s(v, 'ready')}%`,
          fields: [
            { key: 'title', label: 'Fokus', type: 'text', required: true, max: 30 },
            { key: 'ready', label: 'Kematangan naskah', type: 'number', required: true, min: 0, max: 100, suffix: '%' },
            { key: 'text', label: 'Penjelasan', type: 'textarea', max: 120, wide: true },
            { key: 'checks', label: 'Daftar periksa', type: 'tags', help: 'Tiga poin pendek.' },
          ],
        },
        { type: 'heading', key: 'h-kit', label: 'Hasil yang Anda pegang', short: 'Hasil', icon: 'display' },
        { key: 'kitTag', label: 'Label kartu', type: 'text', max: 30 },
        { key: 'kitTitle', label: 'Judul kartu', type: 'text', max: 60 },
        {
          key: 'kit',
          label: 'Dokumen hasil',
          type: 'repeater',
          fixed: true,
          itemTitle: (v, i) => `0${i + 1} · ${s(v, 'title')}`,
          fields: [
            { key: 'title', label: 'Nama dokumen', type: 'text', required: true, max: 28 },
            { key: 'when', label: 'Kapan diterima', type: 'text', max: 32 },
            { key: 'tag', label: 'Label di kertas', type: 'text', max: 18 },
            { key: 'foot', label: 'Catatan di kertas', type: 'text', max: 32 },
          ],
        },
      ],
    },
    {
      key: 'program.sts.flow',
      label: 'Alur program',
      hideable: true,
      description: 'Stepper 4 langkah dengan panel "Anda lakukan / Anda dapatkan".',
      fields: [
        ...head(),
        { type: 'heading', key: 'h-steps', label: 'Langkah', icon: 'steps' },
        {
          key: 'steps',
          label: 'Langkah program',
          type: 'repeater',
          fixed: true,
          layout: 'cards',
          itemKicker: (v) => s(v, 'short'),
          itemText: (v) => s(v, 'text'),
          itemTitle: (v) => s(v, 'title'),
          fields: [
            { key: 'title', label: 'Judul langkah', type: 'text', required: true, max: 32 },
            { key: 'short', label: 'Label singkat di stepper', type: 'text', required: true, max: 16 },
            { key: 'text', label: 'Penjelasan', type: 'textarea', required: true, max: 180, wide: true },
            { key: 'give', label: 'Anda lakukan', type: 'text', max: 60, wide: true },
            { key: 'get', label: 'Anda dapatkan', type: 'text', max: 60, wide: true },
          ],
        },
      ],
    },
    {
      key: 'program.sts.mentors',
      label: 'Pilih mentor',
      hideable: true,
      description: 'Kartu mentor, pilihan bulan, dan detail mentor. Profil dari Tim & Mentor, kursi dari tab Harga & kursi.',
      source: { label: 'Tim & Mentor', href: '/admin/library/people' },
      fields: head(),
    },
    {
      key: 'program.sts.fitfaq',
      label: 'Untuk siapa & FAQ',
      hideable: true,
      description: 'Cek kecocokan di kiri, FAQ bernomor di kanan.',
      fields: [
        { type: 'heading', key: 'h-check', label: 'Cek kecocokan', short: 'Cek', icon: 'shield' },
        checksField('Poin pertama menentukan rekomendasi: dicentang → 1-on-1, tidak dicentang → Bootcamp.'),
        { type: 'heading', key: 'h-faq', label: 'FAQ', icon: 'help' },
        faqField,
      ],
    },
    {
      key: 'program.sts.final',
      label: 'CTA akhir',
      hideable: true,
      description: 'Band oranye di akhir halaman. Sisa kursi dan harga terisi otomatis.',
      fields: [
        { key: 'title', label: 'Judul', type: 'text', required: true, max: 60, wide: true },
        { key: 'text', label: 'Paragraf', type: 'textarea', max: 160, wide: true },
        { key: 'includes', label: 'Isi program di kartu harga', type: 'text', max: 48 },
        { key: 'cta', label: 'Tombol', type: 'text', required: true, max: 24 },
      ],
    },
  ],
};

/* ---------------------------------------------------------------------------
   Bootcamp 30 Hari Menulis
   --------------------------------------------------------------------------- */

export const btmPage: PageConfig = {
  title: 'Bootcamp',
  titleAccent: '30 Hari Menulis',
  description: 'Harga, jadwal angkatan, dan isi halaman /bootcamp-menulis.',
  publicHref: '/bootcamp-menulis',
  groupSections: true,
  tabs: [
    {
      key: 'program.btm.offer',
      label: 'Harga & angkatan',
      description: 'Angkatan pertama di daftar dipakai untuk hero, hitung mundur, bar pengumuman, dan rencana 30 hari.',
      fields: [
        { type: 'heading', key: 'h-price', label: 'Harga', icon: 'ticket' },
        { key: 'price', label: 'Harga program', type: 'number', required: true, min: 0, suffix: 'rupiah', help: 'Tampil sebagai "Rp. 450.000".' },
        { key: 'unit', label: 'Keterangan harga', type: 'text', max: 40, placeholder: 'per peserta · satu angkatan' },
        { type: 'heading', key: 'h-batches', label: 'Angkatan', icon: 'calendar', help: 'Webinar otomatis setiap Sabtu selama 4 minggu sejak tanggal mulai.' },
        {
          key: 'batches',
          label: 'Jadwal angkatan',
          type: 'repeater',
          maxItems: 6,
          addLabel: 'Tambah angkatan',
          itemTitle: (v) => `${s(v, 'name')} · ${s(v, 'start')} → ${s(v, 'end')} · ${Math.max(0, Number(v.seats ?? 0) - Number(v.booked ?? 0))}/${s(v, 'seats')} kursi tersisa`,
          fields: [
            { key: 'name', label: 'Nama angkatan', type: 'text', required: true, max: 24 },
            { key: 'webinar', label: 'Jadwal webinar', type: 'text', max: 40, placeholder: 'Setiap Sabtu, 09.00–11.00 WIB' },
            { key: 'start', label: 'Tanggal mulai', type: 'date', required: true },
            { key: 'end', label: 'Tanggal selesai', type: 'date', required: true },
            { key: 'closes', label: 'Pendaftaran ditutup', type: 'date', required: true },
            { key: 'seats', label: 'Kuota kursi', type: 'number', required: true, min: 1, max: 500, suffix: 'peserta', help: 'Batas peserta angkatan ini.' },
            { key: 'booked', label: 'Kursi terisi', type: 'number', min: 0, max: 500, suffix: 'peserta', help: 'Saat terisi penuh, tombol daftar angkatan ini ditutup.' },
          ],
        },
      ],
    },
    {
      key: 'program.btm.hero',
      label: 'Hero',
      description: 'Bagian paling atas. Harga dan hitung mundur diambil dari tab Harga & angkatan.',
      fields: [
        { type: 'heading', key: 'h-text', label: 'Judul & teks', icon: 'heading' },
        { key: 'title', label: 'Judul baris 1', type: 'text', required: true, max: 24 },
        { key: 'accent', label: 'Judul baris 2 (oranye)', type: 'text', required: true, max: 28 },
        { key: 'lead', label: 'Paragraf pembuka', type: 'textarea', required: true, max: 240, wide: true },
        { type: 'heading', key: 'h-buttons', label: 'Tombol & detail', short: 'Tombol', icon: 'cursor' },
        { key: 'priceLabel', label: 'Label harga', type: 'text', max: 30 },
        { key: 'seatsLabel', label: 'Label sisa kursi', type: 'text', max: 20, help: 'Angka kursi diambil dari angkatan pertama di tab Harga & angkatan.' },
        { key: 'ctaSecondary', label: 'Tombol kedua', type: 'text', max: 28, help: 'Menggulir ke Rencana 30 hari. Tombol utama memakai nama angkatan.' },
        { key: 'trust', label: 'Poin kepercayaan', type: 'tags' },
        { key: 'floatB', label: 'Chip melayang', type: 'text', max: 28 },
      ],
    },
    {
      key: 'program.btm.benefits',
      label: 'Yang Anda dapatkan',
      hideable: true,
      description: 'Bento interaktif: webinar mingguan, tools, dan review mentor.',
      fields: [
        ...head(),
        { type: 'heading', key: 'h-weeks', label: 'Webinar mingguan', short: 'Webinar', icon: 'calendar' },
        {
          key: 'weeks',
          label: 'Topik tiap minggu',
          type: 'repeater',
          fixed: true,
          help: 'Juga dipakai di Rencana 30 hari.',
          itemTitle: (v) => `${s(v, 'week')} · ${s(v, 'title')}`,
          fields: [
            { key: 'week', label: 'Minggu', type: 'text', required: true, max: 12 },
            { key: 'title', label: 'Topik', type: 'text', required: true, max: 36 },
            { key: 'text', label: 'Penjelasan', type: 'textarea', max: 140, wide: true },
          ],
        },
        { type: 'heading', key: 'h-tools', label: 'Tools penulisan', short: 'Tools', icon: 'display' },
        {
          key: 'imrad',
          label: 'Template IMRaD · porsi kata',
          type: 'repeater',
          fixed: true,
          itemTitle: (v) => `${s(v, 'label')} · ${s(v, 'share')}%`,
          fields: [
            { key: 'label', label: 'Bagian', type: 'text', required: true, max: 20 },
            { key: 'share', label: 'Porsi', type: 'number', required: true, min: 0, max: 100, suffix: '%' },
          ],
        },
        { key: 'journalChecks', label: 'Checklist jurnal', type: 'tags' },
        {
          key: 'paragraph',
          label: 'Kerangka paragraf',
          type: 'repeater',
          fixed: true,
          itemTitle: (v, i) => `${i + 1}. ${s(v, 'k')}`,
          fields: [
            { key: 'k', label: 'Bagian', type: 'text', required: true, max: 16 },
            { key: 't', label: 'Penjelasan', type: 'text', required: true, max: 60, wide: true },
          ],
        },
        { type: 'heading', key: 'h-review', label: 'Review gratis mentor', short: 'Review', icon: 'quote' },
        { key: 'reviewTag', label: 'Label kartu', type: 'text', max: 36 },
        { key: 'reviewTitle', label: 'Judul kartu', type: 'text', max: 60, wide: true },
        { key: 'reviewLead', label: 'Paragraf', type: 'textarea', max: 200, wide: true },
        {
          key: 'pins',
          label: 'Contoh catatan mentor (pin)',
          type: 'repeater',
          fixed: true,
          itemTitle: (v, i) => `Pin ${i + 1} · ${s(v, 'text')}`,
          fields: [{ key: 'text', label: 'Catatan', type: 'text', required: true, max: 90, wide: true }],
        },
      ],
    },
    {
      key: 'program.btm.plan',
      label: 'Rencana 30 hari',
      hideable: true,
      description: 'Penggeser hari 1–30. Topik minggu diambil dari tab Yang Anda dapatkan → Webinar.',
      fields: [
        ...head(),
        { type: 'heading', key: 'h-target', label: 'Target contoh', short: 'Target', icon: 'chart' },
        { key: 'dailyWords', label: 'Contoh target kata per hari', type: 'number', min: 50, max: 5000, suffix: 'kata', help: 'Untuk perkiraan "kata terkumpul".' },
      ],
    },
    {
      key: 'program.btm.batches',
      label: 'Pilih angkatan',
      hideable: true,
      description: 'Kartu angkatan diisi dari tab Harga & angkatan.',
      fields: head(),
    },
    {
      key: 'program.btm.fitfaq',
      label: 'Untuk siapa & FAQ',
      hideable: true,
      description: 'Cek kecocokan di kiri, FAQ bernomor di kanan.',
      fields: [
        { type: 'heading', key: 'h-check', label: 'Cek kecocokan', short: 'Cek', icon: 'shield' },
        checksField('Poin terakhir mengarahkan ke 1-on-1: bila dicentang, rekomendasinya Siap Tembus Scopus.'),
        { type: 'heading', key: 'h-faq', label: 'FAQ', icon: 'help' },
        faqField,
      ],
    },
    {
      key: 'program.btm.final',
      label: 'CTA akhir',
      hideable: true,
      description: 'Band oranye di akhir halaman. Angkatan, tanggal tutup, dan harga terisi otomatis.',
      fields: [
        { key: 'title', label: 'Judul', type: 'text', required: true, max: 64, wide: true },
        { key: 'includes', label: 'Isi program di kartu harga', type: 'text', max: 48 },
      ],
    },
  ],
};
