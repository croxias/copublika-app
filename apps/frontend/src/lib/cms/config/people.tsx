import { findUsages } from '../store';
import type { CollectionConfig } from '../types';
import { SECTION_LABELS } from './pages';
import { PUBLISH_STATUSES } from './status';

export const PERSON_KINDS = [
  { value: 'mentor', label: 'Mentor' },
  { value: 'team', label: 'Tim inti' },
  { value: 'both', label: 'Tim inti & mentor' },
];

const kindLabel = (v: unknown) => PERSON_KINDS.find((k) => k.value === v)?.label ?? '—';

/** Shared people library: About (Tim), Beranda (Kenapa Bergabung) and Siap Tembus Scopus (Mentor) pick from it. */
export const peopleConfig: CollectionConfig = {
  key: 'people',
  singular: 'orang',
  statuses: PUBLISH_STATUSES,
  initialStatus: 'draft',
  sortable: true,
  titleOf: (x) => String(x.name ?? ''),
  subtitleOf: (x) => [x.expertise, x.affiliation].filter(Boolean).join(' · '),
  columns: [
    { label: 'Peran', width: '150px', render: (x) => <span className="cms-pill">{kindLabel(x.kind)}</span> },
    { label: 'Jabatan', width: '160px', render: (x) => <span className="cms-muted">{String(x.role ?? '—')}</span> },
    { label: 'Penulis blog', width: '110px', render: (x) => (x.canWrite ? <span className="cms-pill cms-pill--ok">Bisa menulis</span> : <span className="cms-muted">—</span>) },
    {
      label: 'Dipakai di',
      render: (x, ctx) => {
        // Full "Halaman · Section" labels go in the tooltip; the cell shows page names only.
        const used = findUsages(ctx.sections, x.id, SECTION_LABELS);
        const pages = [...new Set(used.map((u) => u.split(' · ')[0]))];
        return pages.length ? (
          <span className="cms-pills" title={used.join('\n')}>
            {pages.map((p) => <span key={p} className="cms-pill">{p}</span>)}
          </span>
        ) : (
          <small className="cms-muted">Belum dipakai</small>
        );
      },
    },
  ],
  filter: { label: 'Peran', options: () => PERSON_KINDS, match: (x, v) => x.kind === v || (v !== 'both' && x.kind === 'both') },
  defaults: () => ({ name: '', kind: 'mentor', role: '', affiliation: '', badge: '', expertise: '', metric: '', bio: '', photo: '', scholarUrl: '', linkedinUrl: '', instagramUrl: '', email: '', topics: [], canWrite: false }),
  fields: [
    { key: 'name', label: 'Nama lengkap & gelar', type: 'text', required: true, max: 60, wide: true },
    { key: 'kind', label: 'Peran', type: 'select', required: true, options: PERSON_KINDS, help: 'Untuk filter. Halaman yang menampilkan orang ini diatur di editor halamannya.' },
    { key: 'role', label: 'Jabatan', type: 'text', max: 40, placeholder: 'mis. Lead Mentor' },
    { key: 'badge', label: 'Label kartu', type: 'text', max: 24, help: 'Teks pendek di atas foto, mis. "Reviewer Q1".' },
    { key: 'affiliation', label: 'Afiliasi', type: 'text', max: 80 },
    { key: 'expertise', label: 'Bidang keahlian', type: 'text', max: 60, help: 'Satu baris di bawah nama, mis. "Public Health · Q2 Editor".' },
    { key: 'metric', label: 'Metrik', type: 'text', max: 24, placeholder: 'mis. h-index 11' },
    { key: 'bio', label: 'Bio singkat', type: 'textarea', max: 240, rows: 3 },
    { key: 'topics', label: 'Topik yang bisa didampingi', type: 'tags', max: 6, help: 'Tampil di detail profil mentor (Our Mentors).' },
    { key: 'photo', label: 'Foto', type: 'image', wide: true, help: 'URL gambar persegi. Kosongkan untuk memakai inisial.' },
    { type: 'heading', key: 'h-links', label: 'Tautan profil', help: 'Tampil sebagai ikon di kartu Our Team dan di detail profil mentor.' },
    { key: 'scholarUrl', label: 'Google Scholar', type: 'url', placeholder: 'https://scholar.google.com/…' },
    { key: 'linkedinUrl', label: 'LinkedIn', type: 'url', placeholder: 'https://linkedin.com/in/…' },
    { key: 'instagramUrl', label: 'Instagram', type: 'url', placeholder: 'https://instagram.com/…' },
    { key: 'email', label: 'Email', type: 'text', max: 80, placeholder: 'nama@copublika.id' },
    { type: 'heading', key: 'h-writer', label: 'Akses penulis blog', help: 'Penulis menulis di Ruang Penulis (/akun/tulisan) dan mengajukan naskah; tim editor meninjau dan menerbitkannya dari Artikel Blog.' },
    { key: 'canWrite', label: 'Boleh menulis artikel blog', type: 'toggle', wide: true, onLabel: 'Aktif', help: 'Saat backend tersambung, orang ini masuk dengan akun anggota yang emailnya sama dengan email di atas.' },
  ],
};
