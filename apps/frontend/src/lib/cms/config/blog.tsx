import { BLOG_CATEGORIES } from '@/lib/data/blog-articles';
import type { CmsItem, CollectionConfig } from '../types';
import { SCHEDULED_STATUSES } from './status';
import { formatDate } from '@/components/admin/cms/ui';
import { wordCount } from '@/components/admin/cms/validate';

export const BLOG_CATEGORY_OPTIONS = BLOG_CATEGORIES.filter((c) => c.id !== 'all').map((c) => ({ value: c.id, label: c.label }));

const categoryLabel = (v: unknown) => BLOG_CATEGORY_OPTIONS.find((c) => c.value === v)?.label ?? '—';

const time = (x: CmsItem) => new Date(String(x.publishAt || x.updatedAt)).getTime() || 0;

/** Blog articles: /blog, /blog/[slug] and the landing BlogFeatured section. */
export const blogConfig: CollectionConfig = {
  key: 'blog',
  singular: 'artikel',
  statuses: SCHEDULED_STATUSES,
  initialStatus: 'draft',
  drawer: 'lg',
  sortBy: (a, b) => time(b) - time(a),
  titleOf: (x) => String(x.title ?? ''),
  subtitleOf: (x) => `/blog/${x.slug ?? ''} · ${x.status === 'scheduled' ? 'dijadwalkan ' : ''}${formatDate(String(x.publishAt ?? ''))}`,
  publicHref: (x) => (x.slug ? `/blog/${x.slug}` : null),
  columns: [
    { label: 'Kategori', width: '130px', render: (x) => <span className="cms-pill">{categoryLabel(x.category)}</span> },
    { label: 'Penulis', width: '170px', render: (x) => <span className="cms-nowrap">{String(x.author ?? '—')}</span> },
    { label: 'Utama', width: '90px', render: (x) => (x.featured ? <span className="cms-star" title="Artikel utama di beranda & blog">★ Utama</span> : <span className="cms-muted">—</span>) },
  ],
  filter: { label: 'Kategori', options: () => BLOG_CATEGORY_OPTIONS, match: (x, v) => x.category === v },
  defaults: () => ({
    title: '',
    slug: '',
    category: 'guide',
    excerpt: '',
    cover: '',
    coverAlt: '',
    author: '',
    publishAt: '',
    content: '',
    featured: false,
    metaTitle: '',
    metaDescription: '',
  }),
  fields: [
    { type: 'heading', key: 'h-info', label: 'Info artikel' },
    { key: 'title', label: 'Judul', type: 'text', required: true, max: 140, wide: true },
    { key: 'slug', label: 'Slug (alamat URL)', type: 'slug', from: 'title', required: true, help: 'Tampil sebagai copublika.id/blog/slug. Mengubah slug artikel yang sudah terbit akan mematikan link lama.' },
    { key: 'category', label: 'Kategori', type: 'select', required: true, options: BLOG_CATEGORY_OPTIONS },
    { key: 'author', label: 'Penulis', type: 'text', required: true, max: 60 },
    // Same key twice: required only while the status is Terjadwal.
    { key: 'publishAt', label: 'Jadwal terbit', type: 'datetime', required: true, visibleIf: (v) => v.status === 'scheduled', help: 'Artikel otomatis terbit pada waktu ini.' },
    { key: 'publishAt', label: 'Tanggal terbit', type: 'datetime', visibleIf: (v) => v.status !== 'scheduled', help: 'Kosongkan untuk memakai waktu saat diterbitkan.' },
    { key: 'featured', label: 'Jadikan artikel utama', type: 'toggle', wide: true, help: 'Hanya satu artikel utama. Memilih artikel ini otomatis melepas artikel utama sebelumnya.' },
    { type: 'heading', key: 'h-card', label: 'Kartu artikel', help: 'Tampil di daftar Blog dan Beranda.' },
    { key: 'excerpt', label: 'Ringkasan', type: 'textarea', required: true, max: 220, rows: 3, help: 'Muncul di kartu artikel dan hasil pencarian.' },
    { key: 'cover', label: 'Gambar sampul (URL)', type: 'image', required: true, wide: true },
    { key: 'coverAlt', label: 'Deskripsi gambar (alt)', type: 'text', max: 140, wide: true, help: 'Untuk pembaca layar dan SEO.' },
    { type: 'heading', key: 'h-content', label: 'Isi' },
    { key: 'content', label: 'Isi artikel', type: 'markdown', required: true },
    { type: 'heading', key: 'seo-heading', label: 'SEO', help: 'Kosongkan untuk memakai judul dan ringkasan.' },
    { key: 'metaTitle', label: 'Judul di Google (meta title)', type: 'text', max: 60, wide: true },
    { key: 'metaDescription', label: 'Deskripsi di Google (meta description)', type: 'textarea', max: 160, rows: 2 },
  ],
  beforeSave: (v) => {
    const words = wordCount(String(v.content ?? ''));
    const publishAt = v.publishAt || (v.status === 'published' ? new Date().toISOString().slice(0, 16) : '');
    return { ...v, publishAt, readTime: `${Math.max(1, Math.round(words / 200))} menit` };
  },
  afterSave: (saved, all) => (saved.featured ? all.map((x) => (x.id !== saved.id && x.featured ? { ...x, featured: false } : x)) : all),
};
