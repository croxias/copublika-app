import { BLOG_CATEGORIES } from '@/lib/data/blog-articles';
import { EDITORS_PICK_MAX } from '@/lib/content/blog';
import type { CmsItem, CollectionConfig, FieldContext, Values } from '../types';
import { inAdminTable } from '../review';
import { SCHEDULED_STATUSES } from './status';
import { formatDate } from '@/components/admin/cms/ui';
import { wordCount } from '@/components/admin/cms/validate';

export const BLOG_CATEGORY_OPTIONS = BLOG_CATEGORIES.filter((c) => c.id !== 'all').map((c) => ({ value: c.id, label: c.label }));

export const categoryLabel = (v: unknown) => BLOG_CATEGORY_OPTIONS.find((c) => c.value === v)?.label ?? '—';

const time = (x: CmsItem) => new Date(String(x.publishAt || x.updatedAt)).getTime() || 0;

/** Articles that take a "Pilihan editor" slot: picked and not in draft. */
export const isLivePick = (x: Values) => !!x.editorsPick && (x.status === 'published' || x.status === 'scheduled');

/** Display name of an article's author: the linked person, or the guest name. */
export function authorName(x: Values, ctx?: FieldContext): string {
  if (!x.guestAuthor && x.authorId && ctx) {
    const person = ctx.collections.people?.find((p) => p.id === x.authorId);
    if (person) return String(person.name ?? '');
  }
  return String(x.author ?? '');
}

/** Blog articles: /blog (archive, editor's picks) and /blog/[slug]. */
export const blogConfig: CollectionConfig = {
  key: 'blog',
  singular: 'artikel',
  statuses: SCHEDULED_STATUSES,
  initialStatus: 'draft',
  drawer: 'center',
  sortBy: (a, b) => time(b) - time(a),
  listFilter: inAdminTable,
  titleOf: (x) => String(x.title ?? ''),
  subtitleOf: (x) => `${x.status === 'scheduled' ? 'Dijadwalkan' : x.status === 'published' ? 'Terbit' : 'Tanggal terbit'} ${formatDate(String(x.publishAt ?? ''))} · ${String(x.readTime ?? '—')}`,
  thumbOf: (x) => String(x.cover ?? ''),
  publicHref: (x) => (x.slug ? `/blog/${x.slug}` : null),
  columns: [
    { label: 'Slug', width: '170px', render: (x) => <code className="cms-slug-cell" title={`/blog/${String(x.slug ?? '')}`}><span>/blog/</span>{String(x.slug ?? '') || '—'}</code> },
    { label: 'Kategori', width: '120px', render: (x) => <span className="cms-pill">{categoryLabel(x.category)}</span> },
    {
      label: 'Penulis',
      width: '180px',
      render: (x, ctx) => {
        const person = !x.guestAuthor ? ctx.collections.people?.find((p) => p.id === x.authorId) : undefined;
        const name = authorName(x, ctx) || '—';
        return (
          <span className="cms-person">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {person?.photo ? <img src={String(person.photo)} alt="" /> : <i aria-hidden="true">{name.replace(/^(dr|prof)\.?\s+/i, '').charAt(0)}</i>}
            <span>
              {name}
              {!!x.guestAuthor && <small>Penulis tamu</small>}
            </span>
          </span>
        );
      },
    },
    {
      label: 'Pilihan',
      width: '96px',
      render: (x) => (x.editorsPick ? <span className="cms-star" title={String(x.editorNote ?? '')}>★ Pilihan</span> : <span className="cms-muted">—</span>),
    },
  ],
  filter: { label: 'Kategori', options: () => BLOG_CATEGORY_OPTIONS, match: (x, v) => x.category === v },
  defaults: () => ({
    title: '',
    slug: '',
    category: 'guide',
    excerpt: '',
    cover: '',
    coverAlt: '',
    guestAuthor: false,
    authorId: '',
    author: '',
    authorAffiliation: '',
    publishAt: '',
    content: '',
    editorsPick: false,
    editorNote: '',
    metaTitle: '',
    metaDescription: '',
  }),
  fields: [
    { type: 'heading', key: 'h-info', icon: 'file', label: 'Info artikel' },
    { key: 'title', icon: 'heading', label: 'Judul', type: 'text', required: true, max: 140, wide: true },
    { key: 'slug', icon: 'link', label: 'Slug (alamat URL)', type: 'slug', from: 'title', required: true, help: 'Tampil sebagai copublika.id/blog/slug. Mengubah slug artikel yang sudah terbit akan mematikan link lama.' },
    { key: 'category', icon: 'tag', label: 'Kategori', type: 'select', required: true, options: BLOG_CATEGORY_OPTIONS },
    // Same key twice: required only while the status is Terjadwal.
    { key: 'publishAt', icon: 'calendar', label: 'Jadwal terbit', type: 'datetime', required: true, visibleIf: (v) => v.status === 'scheduled', help: 'Artikel otomatis terbit pada waktu ini.' },
    { key: 'publishAt', icon: 'calendar', label: 'Tanggal terbit', type: 'datetime', visibleIf: (v) => v.status !== 'scheduled', help: 'Kosongkan untuk memakai waktu saat diterbitkan.' },

    { type: 'heading', key: 'h-author', icon: 'user', label: 'Penulis', help: 'Foto, afiliasi, bio, dan topik di halaman artikel diambil dari profil penulis.' },
    { key: 'guestAuthor', icon: 'users', label: 'Penulis tamu', type: 'toggle', wide: true, onLabel: 'Ya, bukan tim atau mentor CoPublika', help: 'Aktifkan untuk penulis dari luar. Kartu penulisnya memakai nama dan afiliasi yang diisi di sini.' },
    { key: 'authorId', icon: 'user', label: 'Penulis', type: 'ref', collection: 'people', required: true, visibleIf: (v) => !v.guestAuthor, help: 'Dipilih dari Pustaka → Tim & Mentor.' },
    { key: 'author', icon: 'user', label: 'Nama penulis tamu', type: 'text', required: true, max: 60, visibleIf: (v) => !!v.guestAuthor },
    { key: 'authorAffiliation', icon: 'building', label: 'Afiliasi', type: 'text', max: 80, visibleIf: (v) => !!v.guestAuthor, placeholder: 'Universitas …' },

    { type: 'heading', key: 'h-card', icon: 'display', label: 'Kartu artikel', help: 'Tampil di arsip Blog dan di Bacaan lanjutan.' },
    { key: 'excerpt', icon: 'quote', label: 'Ringkasan', type: 'textarea', required: true, max: 220, rows: 3, help: 'Muncul di kartu artikel, di bawah judul halaman artikel, dan di hasil pencarian.' },
    { key: 'cover', icon: 'image', label: 'Gambar sampul', type: 'image', required: true, wide: true, aspect: '16 / 9', help: 'Juga dipakai sebagai latar hero selebar layar di halaman artikel (dibuat hitam-putih dengan nuansa oranye). Disarankan lebar minimal 1600 px.' },
    { key: 'coverAlt', icon: 'eye', label: 'Deskripsi gambar (alt)', type: 'text', max: 140, wide: true, help: 'Untuk pembaca layar dan SEO.' },

    { type: 'heading', key: 'h-pick', icon: 'star', label: 'Pilihan editor', help: `Tampil di section Pilihan editor dan buku di hero Blog. Maksimal ${EDITORS_PICK_MAX} artikel.` },
    { key: 'editorsPick', icon: 'star', label: 'Masukkan ke Pilihan editor', type: 'toggle', wide: true },
    { key: 'editorNote', icon: 'text', label: 'Kenapa dipilih', type: 'textarea', required: true, max: 120, rows: 2, visibleIf: (v) => !!v.editorsPick, help: 'Satu kalimat dari editor, tampil di bawah "Kenapa dipilih".' },

    { type: 'heading', key: 'h-content', icon: 'pen', label: 'Isi' },
    { key: 'content', icon: 'pen', label: 'Isi artikel', type: 'richtext', required: true, help: 'Tulis seperti di WordPress: pilih teks lalu klik tombol format, atau sisipkan gambar dari tombol Gambar.' },
    { type: 'heading', key: 'seo-heading', icon: 'search', label: 'SEO', help: 'Kosongkan untuk memakai judul dan ringkasan.' },
    { key: 'metaTitle', icon: 'heading', label: 'Judul di Google (meta title)', type: 'text', max: 60, wide: true },
    { key: 'metaDescription', icon: 'search', label: 'Deskripsi di Google (meta description)', type: 'textarea', max: 160, rows: 2 },
  ],
  validateRecord: (v, others): Record<string, string> => {
    if (!isLivePick(v)) return {};
    const taken = others.filter(isLivePick);
    if (taken.length < EDITORS_PICK_MAX) return {};
    const short = (t: unknown) => { const s = String(t ?? ''); return s.length > 42 ? `${s.slice(0, 40)}…` : s; };
    const names = taken.slice(0, 2).map((x) => `"${short(x.title)}"`).join(' atau ');
    return { editorsPick: `Slot Pilihan editor sudah penuh (${taken.length}/${EDITORS_PICK_MAX}). Lepas dulu salah satu, misalnya ${names}.` };
  },
  beforeSave: (v, _all, ctx) => {
    const words = wordCount(String(v.content ?? ''));
    const publishAt = v.publishAt || (v.status === 'published' ? new Date().toISOString().slice(0, 16) : '');
    const author = v.guestAuthor ? v.author : authorName(v, ctx);
    return {
      ...v,
      author,
      authorId: v.guestAuthor ? '' : v.authorId,
      authorAffiliation: v.guestAuthor ? v.authorAffiliation : '',
      editorNote: v.editorsPick ? v.editorNote : '',
      publishAt,
      readTime: `${Math.max(1, Math.round(words / 200))} menit`,
    };
  },
};
