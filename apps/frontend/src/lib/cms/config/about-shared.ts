import type { Field, Option, Values } from '../types';

export const str = (v: unknown) => (v === undefined || v === null ? '' : String(v));

/** Icons the About pages can show (components/about/IconBadge). */
export const ICON_OPTIONS: Option[] = [
  ['users', 'Orang / komunitas'], ['network', 'Jaringan'], ['handshake', 'Jabat tangan'], ['cap', 'Toga / mentor'],
  ['book', 'Buku'], ['file', 'Dokumen'], ['scan', 'Review / pindai'], ['flask', 'Riset / lab'], ['layers', 'Lapisan / cluster'],
  ['grid', 'Grid / divisi'], ['trend', 'Grafik naik'], ['rocket', 'Roket'], ['target', 'Target'], ['eye', 'Mata / visi'],
  ['shield', 'Perisai / mutu'], ['globe', 'Globe / akses'], ['compass', 'Kompas / arah'], ['hourglass', 'Jam pasir'],
  ['calendar', 'Kalender'], ['calendarCheck', 'Kalender centang'], ['coffee', 'Kopi / diskusi'], ['flag', 'Bendera'],
  ['pin', 'Lokasi'], ['award', 'Penghargaan'], ['sprout', 'Tunas / posisi terbuka'], ['building', 'Gedung / instansi'],
].map(([value, label]) => ({ value, label }));

export const iconField = (help?: string): Field => ({ key: 'icon', label: 'Ikon', type: 'icon', required: true, options: ICON_OPTIONS, help, wide: true });

/** Section label + one-line title split into its plain and orange parts. */
export const titleFields = (withTag = true): Field[] => [
  { type: 'heading', key: '_head', label: 'Judul section', short: 'Judul', icon: 'heading', help: 'Judul tampil dalam satu baris di layar lebar, jadi usahakan singkat.' },
  ...(withTag ? [{ key: 'tag', label: 'Label kecil', type: 'text', max: 32, wide: true } as Field] : []),
  { key: 'title', label: 'Judul', type: 'text', required: true, max: 28 },
  { key: 'accent', label: 'Judul (bagian oranye)', type: 'text', max: 28 },
];

export const heroFields = (withLead: boolean): Field[] => [
  { type: 'heading', key: '_hero', label: 'Teks hero', short: 'Teks', icon: 'text' },
  { key: 'eyebrow', label: 'Label kecil', type: 'text', max: 40, wide: true },
  { key: 'title', label: 'Judul baris 1', type: 'text', required: true, max: 32 },
  { key: 'accent', label: 'Judul baris 2 (oranye)', type: 'text', required: true, max: 32 },
  ...(withLead ? [{ key: 'lead', label: 'Paragraf pembuka', type: 'textarea', max: 220, rows: 3 } as Field] : []),
];

/** Closing orange "join" section shared by Our Team and Our Mentors. */
export const joinFields = (withList: boolean): Field[] => [
  { type: 'heading', key: '_head', label: 'Judul', icon: 'heading' },
  { key: 'eyebrow', label: 'Label kecil', type: 'text', max: 40, wide: true },
  { key: 'title', label: 'Judul (putih)', type: 'text', required: true, max: 32 },
  { key: 'accent', label: 'Judul (hitam)', type: 'text', required: true, max: 32 },
  { type: 'heading', key: '_perks', label: 'Kartu keuntungan', short: 'Keuntungan', icon: 'chart', help: 'Tiga kartu hitam di sisi kiri.' },
  {
    key: 'perks',
    label: 'Keuntungan',
    type: 'repeater',
    required: true,
    maxItems: 3,
    fixed: true,
    layout: 'cards',
    itemTitle: (p: Values) => str(p.title),
    itemText: (p: Values) => str(p.text),
    itemIcon: (p: Values) => str(p.icon),
    fields: [
      iconField(),
      { key: 'title', label: 'Judul', type: 'text', required: true, max: 32 },
      { key: 'text', label: 'Deskripsi', type: 'textarea', required: true, max: 120, rows: 2 },
    ],
  },
  { type: 'heading', key: '_card', label: 'Kartu putih', short: 'Kartu', icon: 'cursor', help: withList ? 'Kartu putih di sisi kanan: daftar syarat dan tombol.' : 'Daftar posisi terbuka di kartu ini diambil otomatis dari Struktur organisasi.' },
  ...(withList
    ? ([
        { key: 'listTitle', label: 'Judul kartu', type: 'text', required: true, max: 40, wide: true },
        { key: 'list', label: 'Poin', type: 'repeater', required: true, maxItems: 6, addLabel: 'Tambah poin', itemTitle: (r: Values) => str(r.text), fields: [{ key: 'text', label: 'Poin', type: 'text', required: true, max: 90, wide: true }] },
      ] as Field[])
    : []),
  { key: 'ctaLabel', label: 'Tombol utama', type: 'text', required: true, max: 32 },
  { key: 'ctaHref', label: 'Link tombol utama', type: 'url', required: true },
  { key: 'secondaryLabel', label: 'Tombol kedua', type: 'text', max: 32 },
  { key: 'secondaryHref', label: 'Link tombol kedua', type: 'url' },
  { key: 'note', label: 'Catatan kecil', type: 'textarea', max: 160, rows: 2 },
];

/** Switcher between the three About editors. */
export const ABOUT_FAMILY = [
  { key: 'about', label: 'About Us', href: '/admin/website/about', hint: '/about · 5 section' },
  { key: 'about-team', label: 'Our Team', href: '/admin/website/about-team', hint: '/about/team · 4 section' },
  { key: 'about-mentors', label: 'Our Mentors', href: '/admin/website/about-mentors', hint: '/about/mentors · 4 section' },
];
