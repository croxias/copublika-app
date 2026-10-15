import type { CollectionConfig, Option } from '../types';
import { PUBLISH_STATUSES } from './status';
import { clusterOptions } from './projects';

export const QUARTILES: Option[] = [
  { value: 'q1', label: 'Scopus Q1' },
  { value: 'q2', label: 'Scopus Q2' },
  { value: 'q3', label: 'Scopus Q3' },
  { value: 'q4', label: 'Scopus Q4' },
  ...[1, 2, 3, 4, 5, 6].map((n) => ({ value: `sinta${n}`, label: `Sinta ${n}` })),
];

const MONTHS: Option[] = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((m, i) => ({ value: String(i + 1), label: m }));

const quartileLabel = (v: unknown) => QUARTILES.find((q) => q.value === v)?.label ?? '—';

/** Members' published papers: /research explorer, and the homepage marquee when starred. */
export const publicationsConfig: CollectionConfig = {
  key: 'publications',
  singular: 'publikasi',
  statuses: PUBLISH_STATUSES,
  initialStatus: 'draft',
  sortable: true,
  titleOf: (x) => String(x.title ?? ''),
  subtitleOf: (x) => [x.authors, x.year].filter(Boolean).join(' · '),
  columns: [
    { label: 'Indeks', width: '110px', render: (x) => <span className="cms-pill">{quartileLabel(x.quartile)}</span> },
    { label: 'Jurnal', width: '200px', render: (x) => String(x.journal ?? '') },
    { label: 'PDF', width: '80px', render: (x) => (x.pdf ? <span className="cms-pill">Ada</span> : <span className="cms-muted">—</span>) },
    { label: 'Beranda', width: '90px', render: (x) => (x.showOnHome ? <span className="cms-star" title="Tampil di beranda">★</span> : <span className="cms-muted">—</span>) },
  ],
  filter: { label: 'Cluster', options: clusterOptions, match: (x, v) => x.cluster === v },
  publicHref: () => '/research',
  defaults: () => ({
    title: '', journal: '', quartile: 'q1', cluster: '', cardCategory: '', authors: '',
    year: new Date().getFullYear(), month: '', url: '', pdf: '', image: '', projectId: '', showOnHome: false,
  }),
  fields: [
    { key: 'title', label: 'Judul paper', type: 'text', required: true, max: 200, wide: true },
    { key: 'authors', label: 'Penulis', type: 'text', required: true, max: 200, wide: true, placeholder: 'Putranto, A., Kartika, L.' },
    { key: 'journal', label: 'Jurnal', type: 'text', required: true, max: 120 },
    { key: 'quartile', label: 'Indeks / quartile', type: 'select', required: true, options: QUARTILES },
    { key: 'year', label: 'Tahun terbit', type: 'number', required: true, min: 1990, max: 2100 },
    { key: 'month', label: 'Bulan terbit', type: 'select', options: MONTHS },
    { key: 'cluster', label: 'Cluster', type: 'select', options: clusterOptions },
    { key: 'url', label: 'DOI / link artikel', type: 'url', placeholder: 'https://doi.org/…' },
    { key: 'pdf', label: 'Link file PDF', type: 'url', placeholder: 'https://…/naskah.pdf', help: 'Tombol “Unduh PDF” di tabel /research. Kosongkan bila belum ada; tabel menampilkan “Belum tersedia”.' },
    { key: 'projectId', label: 'Proyek riset asal', type: 'ref', collection: 'projects', help: 'Opsional. Hubungkan jika paper ini lahir dari proyek di Riset & Proyek.' },
    { type: 'heading', key: 'h-home', label: 'Beranda', help: 'Kartu di marquee “Riset terkini” pada Beranda.' },
    { key: 'showOnHome', label: 'Tampilkan di beranda', type: 'toggle', wide: true, help: 'Muncul di marquee Riset pada Beranda; urutan mengikuti urutan di tabel.' },
    { key: 'image', label: 'Gambar kartu', type: 'image', wide: true, visibleIf: (v) => !!v.showOnHome, required: true },
    { key: 'cardCategory', label: 'Label kategori di kartu', type: 'text', max: 24, wide: true, visibleIf: (v) => !!v.showOnHome, placeholder: 'Pendidikan', help: 'Kosongkan untuk memakai nama cluster.' },
  ],
};
