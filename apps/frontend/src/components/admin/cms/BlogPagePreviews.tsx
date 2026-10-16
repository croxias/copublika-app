'use client';

import { ArrowRight, Search } from 'lucide-react';
import { CopublikaMark } from '@/components/brand/CopublikaMark';
import { BLOG_CATEGORY_OPTIONS, authorName, isLivePick } from '@/lib/cms/config/blog';
import { EDITORS_PICK_MAX } from '@/lib/content/blog';
import type { CmsItem, FieldContext, Values } from '@/lib/cms/types';

// Live, clickable schematics of the /blog sections for "Halaman Blog". Parts with a group key
// open that sub-tab; dashed parts are filled from Artikel Blog and only show what is there now.

const str = (v: unknown) => (v === undefined || v === null ? '' : String(v));
const list = (v: unknown) => (Array.isArray(v) ? v : []);

type Props = { values: Values; active: string; onPick: (group: string) => void; ctx: FieldContext };

function Part({ group, active, onPick, className = '', children, label }: { group: string; active: string; onPick: (g: string) => void; className?: string; children: React.ReactNode; label: string }) {
  return (
    <button type="button" className={`cms-mini-part ${className} ${active === group ? 'is-active' : ''}`} onClick={() => onPick(group)} aria-label={`Edit ${label}`} aria-pressed={active === group}>
      {children}
    </button>
  );
}

/** Read-only part: content that comes from Artikel Blog. */
function Data({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`cms-mini-part bpp-data ${className}`}>
      <span className="bpp-data__k">Otomatis · Artikel Blog</span>
      {children}
    </div>
  );
}

const time = (x: CmsItem) => new Date(str(x.publishAt || x.updatedAt)).getTime() || 0;
const publishedOf = (ctx: FieldContext) => (ctx.collections.blog ?? []).filter((x) => x.status === 'published').sort((a, b) => time(b) - time(a));

function Head({ v, active, onPick, ink = false }: Pick<Props, 'active' | 'onPick'> & { v: Values; ink?: boolean }) {
  return (
    <Part group="h-head" active={active} onPick={onPick} className={`cms-mini-head ${ink ? 'is-ink' : ''}`} label="judul section">
      <span className="cms-mini-tag bpp-tag">{str(v.tag) || 'Label kecil'}</span>
      <span className="cms-mini-title">
        {str(v.title) || 'Judul'} <em>{str(v.accent)}</em>
      </span>
      {str(v.lead) && <span className="cms-mini-text cms-mini-text--wrap">{str(v.lead)}</span>}
    </Part>
  );
}

export function BlogHeroPreview({ values: v, active, onPick, ctx }: Props) {
  const posts = publishedOf(ctx);
  const authors = new Set(posts.map((x) => authorName(x, ctx))).size;
  const categories = new Set(posts.map((x) => x.category)).size;
  return (
    <div className="cms-mini-surface is-ink">
      <div className="bpp-hero">
        <div className="bpp-hero__copy">
          <Part group="h-text" active={active} onPick={onPick} label="teks pembuka">
            <span className="bpp-pill">{str(v.pill) || 'Label kecil'}</span>
            <span className="cms-mini-hero__h">
              {str(v.title)} <em>{str(v.accent)}</em>
            </span>
            <span className="cms-mini-text cms-mini-text--wrap">{str(v.lead)}</span>
          </Part>
          <Part group="h-search" active={active} onPick={onPick} label="pencarian dan topik">
            <span className="bpp-search"><Search size={10} aria-hidden="true" /> {str(v.searchPlaceholder) || 'Cari…'} <b>Cari</b></span>
            <span className="bpp-chips">
              {list(v.topics).map((t) => <i key={str(t)}>{str(t)}</i>)}
              {!list(v.topics).length && <small>Belum ada topik</small>}
            </span>
          </Part>
          <Data className="bpp-stats">
            <span><b>{posts.length}</b> tulisan</span>
            <span><b>{categories}</b> kategori</span>
            <span><b>{authors}</b> penulis</span>
          </Data>
        </div>
        <Data className="bpp-book">
          <span className="bpp-book__cover">
            <CopublikaMark />
            <small>No. 04</small>
          </span>
          <span className="cms-mini-text">{Math.min(posts.length, 6)} artikel terbaru di dalam buku</span>
        </Data>
      </div>
    </div>
  );
}

export function BlogPicksPreview({ values: v, active, onPick, ctx }: Props) {
  const picks = (ctx.collections.blog ?? []).filter((x) => isLivePick(x) && x.status === 'published');
  return (
    <div className="cms-mini-surface bpp-warm">
      <Head v={v} active={active} onPick={onPick} />
      <Data className="bpp-picks">
        <ol className="bpp-picks__rail">
          {Array.from({ length: EDITORS_PICK_MAX }, (_, i) => (
            <li key={i} className={picks[i] ? '' : 'is-empty'}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              {picks[i] ? str(picks[i].title) : 'Slot kosong'}
            </li>
          ))}
        </ol>
        <span className="bpp-picks__stack" aria-hidden="true">
          {picks.slice(0, 3).map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={p.id} src={str(p.cover)} alt="" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </span>
      </Data>
      <p className="bpp-note">{picks.length}/{EDITORS_PICK_MAX} slot terisi. Atur di Artikel Blog → tombol Pilihan editor di tiap artikel.</p>
    </div>
  );
}

export function BlogArchivePreview({ values: v, active, onPick, ctx }: Props) {
  const posts = publishedOf(ctx);
  const [lead, ...rest] = posts;
  return (
    <div className="cms-mini-surface is-ink">
      <Head v={v} active={active} onPick={onPick} ink />
      <Data className="bpp-archive">
        <span className="bpp-chips is-dark">
          <i className="is-on">Semua {posts.length}</i>
          {BLOG_CATEGORY_OPTIONS.map((c) => <i key={c.value}>{c.label} {posts.filter((x) => x.category === c.value).length}</i>)}
        </span>
        {lead && (
          <span className="bpp-lead">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={str(lead.cover)} alt="" />
            <span><small>Terbaru</small>{str(lead.title)}</span>
          </span>
        )}
        <span className="bpp-cards">
          {rest.slice(0, 3).map((p) => (
            <span key={p.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={str(p.cover)} alt="" />
              <b>{str(p.title)}</b>
            </span>
          ))}
        </span>
        <span className="cms-mini-text">6 artikel per halaman · {Math.max(1, Math.ceil(rest.length / 6))} halaman</span>
      </Data>
    </div>
  );
}

export function BlogWritePreview({ values: v, active, onPick }: Props) {
  const steps = list(v.steps) as Values[];
  return (
    <div className="cms-mini-surface is-ink bpp-write">
      <div className="bpp-write__grid">
        <div className="bpp-write__copy">
          <Part group="h-copy" active={active} onPick={onPick} label="teks">
            <span className="cms-mini-tag bpp-tag">{str(v.tag)}</span>
            <span className="cms-mini-hero__h">
              {str(v.title)} <em>{str(v.accent)}</em>
            </span>
            <span className="cms-mini-text cms-mini-text--wrap">{str(v.lead)}</span>
            <span className="bpp-wanted">
              {list(v.wanted).map((w) => <i key={str(w)}>✓ {str(w)}</i>)}
            </span>
          </Part>
          <Part group="h-cta" active={active} onPick={onPick} className="cms-mini-ctas" label="tombol">
            <span className="is-primary">{str(v.ctaPrimary) || 'Tombol utama'}</span>
            {str(v.ctaSecondary) && <span>{str(v.ctaSecondary)}</span>}
          </Part>
        </div>
        <Part group="h-steps" active={active} onPick={onPick} className="bpp-steps" label="tahapan">
          {steps.map((s, i) => (
            <span key={i}>
              <b>{String(i + 1).padStart(2, '0')}</b>
              <span>
                <strong>{str(s.title)}</strong>
                <small>{str(s.text)}</small>
              </span>
            </span>
          ))}
        </Part>
      </div>
    </div>
  );
}

export function BlogDetailPreview({ values: v, active, onPick, ctx }: Props) {
  const sample = publishedOf(ctx)[0];
  const name = sample ? authorName(sample, ctx).split(',')[0] : 'Dr. Ade Putranto';
  return (
    <div className="cms-mini-surface bpp-detail">
      <Data className="bpp-article">
        <span className="bpp-article__hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {sample && <img src={str(sample.cover)} alt="" />}
          <b>{sample ? str(sample.title) : 'Judul artikel'}</b>
        </span>
        <span className="bpp-lines" aria-hidden="true"><i /><i /><i /></span>
      </Data>
      <Part group="h-author" active={active} onPick={onPick} className="bpp-cta" label="ajakan di kartu penulis">
        <span className="bpp-cta__mark" aria-hidden="true"><CopublikaMark /></span>
        <span>
          <strong>{str(v.ctaTitle).replace('{penulis}', name) || 'Judul ajakan'}</strong>
          <small>{str(v.ctaText)}</small>
        </span>
        <i>{str(v.ctaButton) || 'Tombol'} <ArrowRight size={10} aria-hidden="true" /></i>
      </Part>
      <Part group="h-more" active={active} onPick={onPick} className="cms-mini-head" label="bacaan lanjutan">
        <span className="cms-mini-tag bpp-tag">{str(v.moreTag)}</span>
        <span className="cms-mini-title">
          {str(v.moreTitle)} <em>{str(v.moreAccent)}</em>
        </span>
      </Part>
      <div className="bpp-pn">
        <span className="bpp-pn__prev">
          <small>Sebelumnya</small>
          <b>Artikel sebelumnya</b>
        </span>
        <Part group="h-edge" active={active} onPick={onPick} className="bpp-pn__edge" label="kartu artikel terbaru">
          <CopublikaMark className="bpp-pn__logo" />
          <small>Berikutnya</small>
          <b>{str(v.newestTitle) || 'Ini tulisan terbaru kami.'}</b>
          <span className="cms-mini-text cms-mini-text--wrap">{str(v.edgeText)}</span>
        </Part>
      </div>
    </div>
  );
}
