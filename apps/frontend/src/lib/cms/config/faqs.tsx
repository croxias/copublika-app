import type { CollectionConfig } from '../types';
import { PUBLISH_STATUSES } from './status';

export const FAQ_CATEGORIES = [
  { value: 'umum', label: 'Umum' },
  { value: 'program', label: 'Program' },
  { value: 'pendaftaran', label: 'Pendaftaran' },
];

const categoryLabel = (v: unknown) => FAQ_CATEGORIES.find((c) => c.value === v)?.label ?? '—';

/** Shared FAQ library. Pages pick which questions they show, in their own order. */
export const faqsConfig: CollectionConfig = {
  key: 'faqs',
  singular: 'pertanyaan',
  statuses: PUBLISH_STATUSES,
  initialStatus: 'draft',
  sortable: true,
  titleOf: (x) => String(x.question ?? ''),
  subtitleOf: (x) => String(x.answer ?? '').slice(0, 110),
  columns: [{ label: 'Kategori', width: '140px', render: (x) => <span className="cms-pill">{categoryLabel(x.category)}</span> }],
  filter: { label: 'Kategori', options: () => FAQ_CATEGORIES, match: (x, v) => x.category === v },
  defaults: () => ({ question: '', answer: '', category: 'umum' }),
  fields: [
    { key: 'question', label: 'Pertanyaan', type: 'text', required: true, max: 120, wide: true },
    { key: 'answer', label: 'Jawaban', type: 'textarea', required: true, max: 600, rows: 5 },
    { key: 'category', label: 'Kategori', type: 'select', required: true, options: FAQ_CATEGORIES, help: 'Untuk memudahkan pencarian. Halaman mana yang menampilkan pertanyaan ini diatur di editor halaman.' },
  ],
};
