'use client';

import { useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Copy, Eye, EyeOff, ImageOff, PencilLine, Plus, Trash2 } from 'lucide-react';
import { useCms } from '@/lib/cms/store';
import { HERO_MAX_SLIDES, heroSlidesConfig as config } from '@/lib/cms/config/hero-slides';
import type { CmsItem, Values } from '@/lib/cms/types';
import { RecordEditor, editingFor, type Editing } from './RecordEditor';
import { ConfirmDialog, StatusBadge } from './ui';

const str = (v: unknown) => (v === undefined || v === null ? '' : String(v));

/**
 * Hero tab of the Beranda editor. Slides are records of their own: each one is opened with
 * "Detail", edited in a drawer with a live preview and saved on its own.
 */
export function HeroSlidesPanel() {
  const cms = useCms();
  const slides = [...cms.collections.heroSlides].sort((a, b) => a.order - b.order);
  const live = slides.filter((s) => s.status === 'published').length;
  const full = slides.length >= HERO_MAX_SLIDES;
  const [editing, setEditing] = useState<(Editing & { nonce: number }) | null>(null);
  const [confirm, setConfirm] = useState<null | { kind: 'delete' | 'toggle'; slide: CmsItem }>(null);

  const open = (slide?: CmsItem, duplicate = false) => setEditing({ ...editingFor(config, slide, duplicate), nonce: Date.now() });

  const commit = (next: CmsItem[], message: string) => {
    const before = cms.collections.heroSlides;
    cms.setCollection('heroSlides', next);
    cms.toast(message, 'ok', { label: 'Urungkan', run: () => cms.setCollection('heroSlides', before) });
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...slides];
    [next[index], next[index + dir]] = [next[index + dir], next[index]];
    commit(next.map((s, i) => ({ ...s, order: i + 1 })), 'Urutan slide diperbarui.');
  };

  const onConfirm = () => {
    if (!confirm) return;
    const { slide } = confirm;
    if (confirm.kind === 'delete') {
      commit(slides.filter((s) => s.id !== slide.id).map((s, i) => ({ ...s, order: i + 1 })), 'Slide dihapus.');
    } else {
      const status = slide.status === 'published' ? 'draft' : 'published';
      commit(slides.map((s) => (s.id === slide.id ? { ...s, status, updatedAt: new Date().toISOString() } : s)), status === 'published' ? 'Slide ditampilkan.' : 'Slide disembunyikan.');
    }
    setConfirm(null);
  };

  return (
    <div className="cms-slides">
      <div className="cms-slides-bar">
        <p>
          <strong>{slides.length} slide</strong>
          <span>{live} tampil · maks {HERO_MAX_SLIDES}</span>
        </p>
        <button type="button" className="cms-btn cms-btn--solid cms-btn--sm" disabled={full} title={full ? `Maksimal ${HERO_MAX_SLIDES} slide` : undefined} onClick={() => open()}>
          <Plus size={14} /> Tambah slide
        </button>
      </div>

      {live === 0 && slides.length > 0 && <p className="cms-warn">Belum ada slide berstatus Tampil, jadi hero di beranda akan kosong.</p>}

      {slides.length ? (
        <ol className="cms-slide-list">
          {slides.map((s, i) => {
            const shown = s.status === 'published';
            return (
              <li key={s.id} className={`cms-slide ${shown ? '' : 'is-draft'}`}>
                <button type="button" className="cms-slide-thumb" onClick={() => open(s)} aria-label={`Buka detail slide ${i + 1}`}>
                  {str(s.imageSrc) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={str(s.imageSrc)} alt="" loading="lazy" />
                  ) : (
                    <span className="cms-slide-noimg"><ImageOff size={18} /></span>
                  )}
                  <span className="cms-slide-num">{String(i + 1).padStart(2, '0')}</span>
                </button>

                <div className="cms-slide-body">
                  <div className="cms-slide-meta">
                    <span className="cms-slide-kicker">{str(s.kicker) || 'Tanpa label'}</span>
                    <StatusBadge status={s.status} options={config.statuses} />
                  </div>
                  <h3>
                    {str(s.title)} {str(s.titleAccent) && <em>{str(s.titleAccent)}</em>}
                  </h3>
                  <p>{str(s.dek)}</p>
                  {str(s.ctaLabel) && (
                    <span className="cms-slide-cta">
                      {str(s.ctaLabel)} <ArrowRight size={12} /> <code>{str(s.ctaHref)}</code>
                    </span>
                  )}
                </div>

                <div className="cms-slide-actions">
                  <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" onClick={() => open(s)}>
                    <PencilLine size={13} /> Detail
                  </button>
                  <div className="cms-icon-group" role="group" aria-label="Aksi slide">
                    <button type="button" className="cms-tip" data-tip="Naikkan" aria-label="Naikkan" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp size={14} /></button>
                    <button type="button" className="cms-tip" data-tip="Turunkan" aria-label="Turunkan" disabled={i === slides.length - 1} onClick={() => move(i, 1)}><ArrowDown size={14} /></button>
                    <button type="button" className="cms-tip" data-tip={shown ? 'Sembunyikan' : 'Tampilkan'} aria-label={shown ? 'Sembunyikan slide' : 'Tampilkan slide'} onClick={() => setConfirm({ kind: 'toggle', slide: s })}>
                      {shown ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button type="button" className="cms-tip" data-tip="Duplikat" aria-label="Duplikat" disabled={full} onClick={() => open(s, true)}><Copy size={14} /></button>
                    <button type="button" className="cms-tip is-danger" data-tip="Hapus" aria-label="Hapus slide" onClick={() => setConfirm({ kind: 'delete', slide: s })}><Trash2 size={14} /></button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="cms-empty">
          <p>Belum ada slide. Hero di beranda akan disembunyikan sampai ada slide berstatus Tampil.</p>
          <button type="button" className="cms-btn cms-btn--solid" onClick={() => open()}><Plus size={15} /> Tambah slide pertama</button>
        </div>
      )}

      {editing && <RecordEditor key={editing.nonce} config={config} editing={editing} onClose={() => setEditing(null)} preview={(v) => <HeroPreview values={v} />} previewOpen />}

      <ConfirmDialog
        open={!!confirm}
        danger={confirm?.kind === 'delete' || confirm?.slide.status === 'published'}
        title={confirm?.kind === 'delete' ? 'Hapus slide?' : confirm?.slide.status === 'published' ? 'Sembunyikan slide?' : 'Tampilkan slide?'}
        confirmLabel={confirm?.kind === 'delete' ? 'Hapus' : confirm?.slide.status === 'published' ? 'Sembunyikan' : 'Tampilkan'}
        body={
          confirm && (
            <p>
              <strong>{config.titleOf(confirm.slide)}</strong>{' '}
              {confirm.kind === 'delete'
                ? 'akan dihapus dari slider. Kamu masih bisa mengurungkannya dari notifikasi.'
                : confirm.slide.status === 'published'
                  ? 'tidak lagi muncul di beranda. Isinya tetap tersimpan sebagai Draft.'
                  : 'akan muncul di slider beranda sesuai urutannya.'}
            </p>
          )
        }
        onConfirm={onConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

/** Small-scale rendering of a slide as the hero shows it, so copy length and contrast can be judged while typing. */
export function HeroPreview({ values: v }: { values: Values }) {
  return (
    <div className="cms-hero-preview">
      <p className="cms-hero-preview-label">Pratinjau</p>
      <div className="cms-hero-preview-frame">
        {str(v.imageSrc) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={str(v.imageSrc)} alt="" />
        )}
        <div className="cms-hero-preview-copy">
          <span className="cms-hero-preview-kicker">{str(v.kicker) || 'Label kecil'}</span>
          <h4>
            {str(v.title) || 'Judul slide'} {str(v.titleAccent) && <em>{str(v.titleAccent)}</em>}
          </h4>
          <p>{str(v.dek) || 'Deskripsi singkat slide.'}</p>
          <div className="cms-hero-preview-ctas">
            <span className="is-primary">{str(v.ctaLabel) || 'Tombol utama'} →</span>
            {str(v.secondaryLabel) && <span>{str(v.secondaryLabel)}</span>}
          </div>
        </div>
      </div>
      <p className="cms-help">Perkiraan tampilan di layar desktop. Teks yang terlalu panjang akan terlihat padat di sini.</p>
    </div>
  );
}
