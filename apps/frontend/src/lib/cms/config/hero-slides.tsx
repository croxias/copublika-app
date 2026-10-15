import type { CollectionConfig, Values } from '../types';
import { PUBLISH_STATUSES } from './status';

const str = (v: unknown) => (v === undefined || v === null ? '' : String(v));

export const HERO_MAX_SLIDES = 6;

/** Hero slider on Beranda. Each slide is saved on its own; order = order in the slider. */
export const heroSlidesConfig: CollectionConfig = {
  key: 'heroSlides',
  singular: 'slide',
  statuses: PUBLISH_STATUSES,
  initialStatus: 'draft',
  sortable: true,
  drawer: 'lg',
  titleOf: (s: Values) => `${str(s.title)} ${str(s.titleAccent)}`.trim(),
  subtitleOf: (s: Values) => str(s.kicker),
  columns: [],
  defaults: () => ({
    kicker: '', title: '', titleAccent: '', dek: '',
    ctaLabel: '', ctaHref: '', secondaryLabel: '', secondaryHref: '',
    imageSrc: '', imageAlt: '',
  }),
  fields: [
    { type: 'heading', key: '_copy', label: 'Teks slide' },
    { key: 'kicker', label: 'Label kecil', type: 'text', required: true, max: 24, wide: true, help: 'Juga dipakai sebagai nama slide di navigasi slider.' },
    { key: 'title', label: 'Judul', type: 'text', required: true, max: 40 },
    { key: 'titleAccent', label: 'Judul (bagian oranye)', type: 'text', max: 40 },
    { key: 'dek', label: 'Deskripsi', type: 'textarea', required: true, max: 140, rows: 3 },
    { type: 'heading', key: '_cta', label: 'Tombol' },
    { key: 'ctaLabel', label: 'Tombol utama', type: 'text', required: true, max: 32 },
    { key: 'ctaHref', label: 'Link tombol utama', type: 'url', required: true },
    { key: 'secondaryLabel', label: 'Tautan kedua (opsional)', type: 'text', max: 32 },
    { key: 'secondaryHref', label: 'Link tautan kedua', type: 'url', visibleIf: (v) => !!str(v.secondaryLabel).trim(), required: true },
    { type: 'heading', key: '_img', label: 'Gambar latar' },
    { key: 'imageSrc', label: 'Gambar', type: 'image', required: true, wide: true, aspect: '16 / 9', minWidth: 1600, help: 'Foto lanskap, minimal 1600 px lebar. Bagian kiri bawah tertutup teks.' },
    { key: 'imageAlt', label: 'Deskripsi gambar', type: 'text', required: true, max: 140, wide: true, help: 'Untuk pembaca layar dan SEO. Jelaskan isi foto.' },
  ],
};
