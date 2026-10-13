'use client';
import { useMemo, useState } from 'react';
import { useStaging } from '@/lib/staging';
import type { LandingResearchHighlight } from '@/lib/staging';
import AdminPlaceholder from '@/components/admin/AdminPlaceholder';

const demoEnabled = process.env.NEXT_PUBLIC_COPUBLIKA_DEMO_MODE === 'true';

const EMPTY: Omit<LandingResearchHighlight, 'id'> = {
  projectId: '', title: '', field: '', leadName: '', leadInstitution: '',
  teaser: '', status: 'Draft', order: 99,
};

export default function WebsiteResearchProjectPage() {
  const s = useStaging();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<LandingResearchHighlight, 'id'>>(EMPTY);
  const [notice, setNotice] = useState('');

  const items = useMemo(
    () => [...s.landingResearch].sort((a, b) => a.order - b.order),
    [s.landingResearch],
  );

  if (!demoEnabled) {
    return <AdminPlaceholder title="Research Project (Landing)" eyebrow="Konten Website" description="Tersedia hanya pada mode staging/demo." />;
  }

  const flash = (msg: string) => { setNotice(msg); setTimeout(() => setNotice(''), 2500); };

  const startNew = () => { setEditing('new'); setForm(EMPTY); };
  const startEdit = (item: LandingResearchHighlight) => {
    setEditing(item.id);
    const { id: _id, ...rest } = item;
    setForm(rest);
  };
  const save = () => {
    if (!form.title.trim()) { flash('Judul proyek wajib diisi.'); return; }
    if (editing === 'new') { s.addLandingResearch(form); flash('Highlight ditambahkan.'); }
    else if (editing) { s.updateLandingResearch(editing, form); flash('Highlight diperbarui.'); }
    setEditing(null);
  };
  const remove = (id: string) => { s.removeLandingResearch(id); flash('Highlight dihapus.'); };

  return (
    <section className="staging-page">
      <div className="cp-pg-head">
        <div className="cp-greet">
          <div className="cp-crumb"><span>Konten Website</span><span className="cp-sep">/</span><span>Halaman Publik</span></div>
          <h1>Research <em>Project</em> — Landing</h1>
          <p>Kelola highlight proyek riset yang tampil di halaman depan (galeri teaser dengan curiosity gap).</p>
        </div>
        <button type="button" className="cp-btn cp-btn--solid" onClick={startNew}>+ Highlight baru</button>
      </div>
      <div className="staging-notice">Sandbox aman: perubahan tersimpan di localStorage browser — tanpa jaringan atau database. Item berstatus Published tampil di galeri landing preview.</div>
      {notice && <div className="wc-flash" role="status">{notice}</div>}

      {editing && (
        <div className="wc-editor" role="form" aria-label="Form highlight riset">
          <h2>{editing === 'new' ? 'Highlight baru' : 'Edit highlight'}</h2>
          <div className="wc-grid">
            <label className="wc-field">
              <span>ID proyek (referensi)</span>
              <input value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} placeholder="mis. PRO-011" />
            </label>
            <label className="wc-field">
              <span>Judul proyek</span>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </label>
            <label className="wc-field">
              <span>Bidang</span>
              <input value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} />
            </label>
            <label className="wc-field">
              <span>Ketua riset</span>
              <input value={form.leadName} onChange={(e) => setForm({ ...form, leadName: e.target.value })} />
            </label>
            <label className="wc-field">
              <span>Institusi</span>
              <input value={form.leadInstitution} onChange={(e) => setForm({ ...form, leadInstitution: e.target.value })} />
            </label>
            <label className="wc-field wc-field--wide">
              <span>Teaser (terlihat publik — sisanya ter-blur curiosity gap)</span>
              <textarea rows={3} value={form.teaser} onChange={(e) => setForm({ ...form, teaser: e.target.value })} />
            </label>
            <label className="wc-field">
              <span>Urutan</span>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </label>
            <label className="wc-field">
              <span>Status</span>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'Published' | 'Draft' })}>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
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
        {items.map((item) => (
          <article className="wc-card" key={item.id}>
            <div className="wc-card-main">
              <h3>{item.title}</h3>
              <p>{item.teaser}</p>
              <div className="wc-card-meta">
                <span className={`ac-badge ${item.status === 'Published' ? 'ac-status-ok' : 'ac-status-pending'}`}>{item.status}</span>
                <small>{item.field} · {item.leadName} ({item.leadInstitution}) · Urutan {item.order}</small>
              </div>
            </div>
            <div className="wc-card-actions">
              <button type="button" onClick={() => startEdit(item)}>Edit</button>
              <button type="button" className="wc-danger" onClick={() => remove(item.id)}>Hapus</button>
            </div>
          </article>
        ))}
        {!items.length && <div className="ac-empty"><p>Belum ada highlight. Klik &ldquo;+ Highlight baru&rdquo; untuk menambahkan.</p></div>}
      </div>
    </section>
  );
}
