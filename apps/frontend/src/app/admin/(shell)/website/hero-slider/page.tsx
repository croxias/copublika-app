'use client';
import { useMemo, useState } from 'react';
import { useStaging } from '@/lib/staging';
import type { StagingHeroSlide, SlideStatus } from '@/lib/staging';
import AdminPlaceholder from '@/components/admin/AdminPlaceholder';

const demoEnabled = process.env.NEXT_PUBLIC_COPUBLIKA_DEMO_MODE === 'true';

const EMPTY: Omit<StagingHeroSlide, 'id'> = {
  eyebrow: '', title: '', titleAccent: '', dek: '',
  ctaLabel: 'Mulai berkolaborasi', ctaHref: '/register',
  secondaryLabel: '', secondaryHref: '',
  note: '', status: 'Draft', order: 99,
};

export default function WebsiteHeroSliderPage() {
  const s = useStaging();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<StagingHeroSlide, 'id'>>(EMPTY);
  const [notice, setNotice] = useState('');

  const slides = useMemo(
    () => [...s.heroSlides].sort((a, b) => a.order - b.order),
    [s.heroSlides],
  );

  if (!demoEnabled) {
    return <AdminPlaceholder title="Hero Slider" eyebrow="Konten Website" description="Tersedia hanya pada mode staging/demo." />;
  }

  const flash = (msg: string) => { setNotice(msg); setTimeout(() => setNotice(''), 2500); };

  const startNew = () => { setEditing('new'); setForm(EMPTY); };
  const startEdit = (slide: StagingHeroSlide) => {
    setEditing(slide.id);
    const { id: _id, ...rest } = slide;
    setForm(rest);
  };
  const save = () => {
    if (!form.title.trim()) { flash('Judul wajib diisi.'); return; }
    if (editing === 'new') { s.addHeroSlide(form); flash('Slide ditambahkan.'); }
    else if (editing) { s.updateHeroSlide(editing, form); flash('Slide diperbarui.'); }
    setEditing(null);
  };
  const remove = (id: string) => { s.removeHeroSlide(id); flash('Slide dihapus.'); };
  const move = (id: string, dir: -1 | 1) => {
    const idx = slides.findIndex((x) => x.id === id);
    const swap = slides[idx + dir];
    if (!swap) return;
    s.updateHeroSlide(id, { order: swap.order });
    s.updateHeroSlide(swap.id, { order: slides[idx].order });
  };

  const field = (label: string, key: keyof typeof form, opts?: { textarea?: boolean; type?: string }) => (
    <label className="wc-field">
      <span>{label}</span>
      {opts?.textarea ? (
        <textarea rows={3} value={String(form[key] ?? '')} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
      ) : (
        <input type={opts?.type ?? 'text'} value={String(form[key] ?? '')} onChange={(e) => setForm({ ...form, [key]: opts?.type === 'number' ? Number(e.target.value) : e.target.value })} />
      )}
    </label>
  );

  return (
    <section className="staging-page">
      <div className="cp-pg-head">
        <div className="cp-greet">
          <div className="cp-crumb"><span>Konten Website</span><span className="cp-sep">/</span><span>Halaman Publik</span></div>
          <h1>Hero <em>Slider</em></h1>
          <p>Kelola slide hero landing page: headline, CTA, dan urutan tampil.</p>
        </div>
        <button type="button" className="cp-btn cp-btn--solid" onClick={startNew}>+ Slide baru</button>
      </div>
      <div className="staging-notice">Sandbox aman: perubahan tersimpan di localStorage browser — tanpa jaringan atau database. Slide berstatus Published tampil di landing page preview.</div>
      {notice && <div className="wc-flash" role="status">{notice}</div>}

      {editing && (
        <div className="wc-editor" role="form" aria-label="Form slide">
          <h2>{editing === 'new' ? 'Slide baru' : 'Edit slide'}</h2>
          <div className="wc-grid">
            {field('Eyebrow', 'eyebrow')}
            {field('Judul (teks utama)', 'title')}
            {field('Judul (bagian beraksen / em)', 'titleAccent')}
            {field('Deskripsi', 'dek', { textarea: true })}
            {field('Label CTA utama', 'ctaLabel')}
            {field('Href CTA utama', 'ctaHref')}
            {field('Label link sekunder', 'secondaryLabel')}
            {field('Href link sekunder', 'secondaryHref')}
            {field('Catatan kecil', 'note')}
            {field('Urutan', 'order', { type: 'number' })}
            <label className="wc-field">
              <span>Status</span>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as SlideStatus })}>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </label>
          </div>
          <div className="wc-actions">
            <button type="button" className="cp-btn cp-btn--solid" onClick={save}>Simpan</button>
            <button type="button" className="cp-btn" onClick={() => setEditing(null)}>Batal</button>
          </div>
        </div>
      )}

      <div className="wc-list">
        {slides.map((slide, idx) => (
          <article className="wc-card" key={slide.id}>
            <div className="wc-card-main">
              <div className="wc-card-eyebrow">{slide.eyebrow}</div>
              <h3>{slide.title} <em>{slide.titleAccent}</em></h3>
              <p>{slide.dek}</p>
              <div className="wc-card-meta">
                <span className={`ac-badge ${slide.status === 'Published' ? 'ac-status-ok' : slide.status === 'Draft' ? 'ac-status-pending' : 'ac-status-archived'}`}>{slide.status}</span>
                <small>Urutan {slide.order} · CTA: {slide.ctaLabel} → {slide.ctaHref}</small>
              </div>
            </div>
            <div className="wc-card-actions">
              <button type="button" aria-label="Naikkan urutan" onClick={() => move(slide.id, -1)} disabled={idx === 0}>↑</button>
              <button type="button" aria-label="Turunkan urutan" onClick={() => move(slide.id, 1)} disabled={idx === slides.length - 1}>↓</button>
              <button type="button" onClick={() => startEdit(slide)}>Edit</button>
              <button type="button" className="wc-danger" onClick={() => remove(slide.id)}>Hapus</button>
            </div>
          </article>
        ))}
        {!slides.length && <div className="ac-empty"><p>Belum ada slide. Klik "+ Slide baru" untuk menambahkan.</p></div>}
      </div>
    </section>
  );
}
