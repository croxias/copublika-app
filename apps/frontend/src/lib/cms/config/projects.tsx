import type { CollectionConfig, FieldContext, Option } from '../types';
import { PHASES, STATUS_ID } from '@/lib/content/research';
import { PUBLISH_ARCHIVE_STATUSES } from './status';

/** Cluster list managed from "Kelola cluster" (section research.clusters). */
export const clusterOptions = (ctx: FieldContext): Option[] => {
  const items = (ctx.sections['research.clusters']?.items as { name?: string }[] | undefined) ?? [];
  return items.map((c) => String(c.name ?? '').trim()).filter(Boolean).map((name) => ({ value: name, label: name }));
};

/** Same four stages as the public cards and the "Cara kerja" section, ending at Submit. */
export const PROJECT_PHASES: Option[] = PHASES.map((p, i) => ({
  value: p.key,
  label: `${i + 1}. ${p.label}`,
  hint: `Tahap ${i + 1} dari ${PHASES.length} · status di kartu: ${STATUS_ID[p.key]}`,
}));

const phaseLabel = (v: unknown) => {
  const i = PHASES.findIndex((p) => p.key === v);
  return i < 0 ? '—' : `${i + 1}/${PHASES.length} · ${PHASES[i].label}`;
};

/** Active research projects: /research gallery and /research-project/[slug]. */
export const projectsConfig: CollectionConfig = {
  key: 'projects',
  singular: 'proyek',
  statuses: PUBLISH_ARCHIVE_STATUSES,
  initialStatus: 'draft',
  sortable: true,
  drawer: 'lg',
  titleOf: (x) => String(x.title ?? ''),
  subtitleOf: (x) => [x.leadName, x.leadAffiliation].filter(Boolean).join(' · '),
  columns: [
    { label: 'Cluster', width: '160px', render: (x) => (x.cluster ? <span className="cms-pill">{String(x.cluster)}</span> : <span className="cms-muted">—</span>) },
    { label: 'Tahap riset', width: '170px', render: (x) => phaseLabel(x.phase) },
  ],
  filter: { label: 'Cluster', options: clusterOptions, match: (x, v) => x.cluster === v },
  publicHref: (x) => (x.slug ? `/research-project/${String(x.slug)}` : null),
  defaults: () => ({
    title: '', slug: '', cluster: '', phase: 'recruiting', abstract: '', tags: [],
    methodology: '', targetJournals: [], requiredExpertise: [], timeline: '',
    leadName: '', leadRole: 'Author', leadAffiliation: '', collaborators: [], startedAt: '',
  }),
  fields: [
    { type: 'heading', key: 'h-public', label: 'Kartu proyek', help: 'Tampil untuk semua pengunjung di galeri /research.' },
    { key: 'title', label: 'Judul proyek', type: 'text', required: true, max: 160, wide: true },
    { key: 'slug', label: 'Slug URL', type: 'slug', from: 'title', required: true, help: 'Alamat halaman: /research-project/<slug>.' },
    { key: 'cluster', label: 'Cluster', type: 'select', required: true, options: clusterOptions, help: 'Daftar cluster diatur lewat tombol “Kelola cluster”.' },
    { key: 'phase', label: 'Tahap riset', type: 'select', required: true, options: PROJECT_PHASES, help: 'Rekrut tim → Penulisan → Review artikel → Submit. Menentukan status dan progres di kartu.' },
    { key: 'startedAt', label: 'Mulai (tahun-bulan)', type: 'text', placeholder: '2025-01', max: 7 },
    { key: 'abstract', label: 'Abstrak / teaser', type: 'textarea', required: true, max: 600, rows: 4, help: 'Kartu galeri menampilkan 2 baris pertama.' },
    { key: 'tags', label: 'Tag', type: 'tags' },
    { type: 'heading', key: 'h-locked', label: 'Khusus anggota', help: 'Metodologi di kartu di-blur untuk tamu; halaman detail proyek hanya bisa dibuka setelah login.' },
    { key: 'methodology', label: 'Metodologi', type: 'textarea', max: 1500, rows: 6 },
    { key: 'targetJournals', label: 'Target jurnal', type: 'tags' },
    { key: 'requiredExpertise', label: 'Keahlian yang dicari', type: 'tags' },
    { key: 'timeline', label: 'Timeline', type: 'text', max: 140, wide: true },
    { type: 'heading', key: 'h-authors', label: 'Author & co-author' },
    { key: 'leadName', label: 'Author — nama', type: 'text', required: true, max: 80 },
    { key: 'leadRole', label: 'Author — peran', type: 'text', max: 60, placeholder: 'Author' },
    { key: 'leadAffiliation', label: 'Author — afiliasi', type: 'text', max: 100, wide: true },
    {
      key: 'collaborators',
      label: 'Co-author',
      type: 'repeater',
      addLabel: 'Tambah co-author',
      itemTitle: (c) => [c.name, c.role].filter(Boolean).join(' — '),
      fields: [
        { key: 'name', label: 'Nama', type: 'text', required: true, max: 80 },
        { key: 'role', label: 'Peran', type: 'text', max: 80, placeholder: 'Co-author · Data Analyst' },
      ],
    },
  ],
};
