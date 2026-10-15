import type { CollectionConfig } from '../types';
import { PUBLISH_STATUSES } from './status';

/** Shared testimonial library. Beranda picks which ones run in each marquee row. */
export const testimonialsConfig: CollectionConfig = {
  key: 'testimonials',
  singular: 'testimoni',
  statuses: PUBLISH_STATUSES,
  initialStatus: 'draft',
  sortable: true,
  titleOf: (x) => String(x.name ?? ''),
  subtitleOf: (x) => String(x.quote ?? '').slice(0, 110),
  columns: [
    { label: 'Label', width: '120px', render: (x) => (x.badge ? <span className="cms-pill">{String(x.badge)}</span> : <span className="cms-muted">—</span>) },
    { label: 'Peran / afiliasi', render: (x) => <span className="cms-muted">{String(x.role ?? '')}</span> },
  ],
  defaults: () => ({ name: '', role: '', quote: '', avatar: '', badge: '' }),
  fields: [
    { key: 'name', label: 'Nama', type: 'text', required: true, max: 60, help: 'Tulis lengkap dengan gelar, mis. "Rini Puspita, M.Pd."' },
    { key: 'role', label: 'Peran / afiliasi', type: 'text', required: true, max: 60, placeholder: 'Universitas Negeri Semarang' },
    { key: 'quote', label: 'Kutipan', type: 'textarea', required: true, max: 220, rows: 4 },
    { key: 'badge', label: 'Label pencapaian', type: 'text', max: 16, placeholder: 'Q3 · 2024', help: 'Tampil di pojok kartu, mis. kuartil jurnal dan tahun, atau "Sinta 2".' },
    { key: 'avatar', label: 'Foto (URL)', type: 'image', help: 'Foto persegi, minimal 100×100 px.' },
  ],
};
