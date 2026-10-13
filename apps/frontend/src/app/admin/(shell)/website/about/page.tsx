'use client';
import { useMemo, useState } from 'react';
import { useStaging } from '@/lib/staging';
import type { StagingAboutSection } from '@/lib/staging';
import AdminPlaceholder from '@/components/admin/AdminPlaceholder';

const demoEnabled = process.env.NEXT_PUBLIC_COPUBLIKA_DEMO_MODE === 'true';

const EMPTY: Omit<StagingAboutSection, 'id'> = {
  key: 'profil', title: '', body: '', status: 'Draft', order: 99,
};

export default function WebsiteAboutPage() {
  const s = useStaging();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<StagingAboutSection, 'id'>>(EMPTY);
  const [notice, setNotice] = useState('');

  const sections = useMemo(
    () => [...s.aboutSections].sort((a, b) => a.order - b.order),
    [s.aboutSections],
  );

  if (!demoEnabled) {
    return <AdminPlaceholder title="Halaman About" eyebrow="Konten Website" description="Tersedia hanya pada mode staging/demo." />;
  }

  const flash = (msg: string) => { setNotice(msg); setTimeout(() => setNotice(''), 2500); };

  const startNew = () => { setEditing('new'); setForm(EMPTY); };
  const startEdit = (sec: StagingAboutSection) => {
    setEditing(sec.id);
    const { id: _id, ...rest } = sec;
    setForm(rest);
  };
  const save = () => {
    if (!form.title.trim()) { flash('Judul section wajib diisi.'); return; }
    if (editing === 'new') { s.addAboutSection(form); flash('Section ditambahkan.'); }
    else if (editing) { s.updateAboutSection(editing, form); flash('Section diperbarui.'); }
    setEditing(null);
  };
  const remove = (id: string) => { s.removeAboutSection(id); flash('Section dihapus.'); };

  return (
    <section className="staging-page">
      <div className="cp-pg-head">
        <div className="cp-greet">
          <div className="cp-crumb"><span>Konten Website</span><span className="cp-sep">/</span><span>Halaman About</span></div>
          <h1>Halaman <em>About</em></h1>
          <p>Kelola section konten halaman About: visi, misi, nilai, dan profil.</p>
        </div>
        <button type="button" className="cp-btn cp-btn--solid" onClick={startNew}>+ Section baru</button>
      </div>
      <div className="staging-notice">Sandbox aman: perubahan tersimpan di localStorage browser — tanpa jaringan atau database.</div>
      {notice && <div className="wc-flash" role="status">{notice}</div>}

      {editing && (
        <div className="wc-editor" role="form" aria-label="Form section about">
          <h2>{editing === 'new' ? 'Section baru' : 'Edit section'}</h2>
          <div className="wc-grid">
            <label className="wc-field">
              <span>Kategori section</span>
              <select value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value as typeof form.key })}>
                <option value="visi">Visi</option>
                <option value="misi">Misi</option>
                <option value="nilai">Nilai</option>
                <option value="profil">Profil</option>
              </select>
            </label>
            <label className="wc-field">
              <span>Judul</span>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </label>
            <label className="wc-field wc-field--wide">
              <span>Isi konten</span>
              <textarea rows={5} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
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
        {sections.map((sec) => (
          <article className="wc-card" key={sec.id}>
            <div className="wc-card-main">
              <h3>{sec.title}</h3>
              <p>{sec.body}</p>
              <div className="wc-card-meta">
                <span className={`ac-badge ${sec.status === 'Published' ? 'ac-status-ok' : 'ac-status-pending'}`}>{sec.status}</span>
                <small>Kategori: {sec.key} · Urutan {sec.order}</small>
              </div>
            </div>
            <div className="wc-card-actions">
              <button type="button" onClick={() => startEdit(sec)}>Edit</button>
              <button type="button" className="wc-danger" onClick={() => remove(sec.id)}>Hapus</button>
            </div>
          </article>
        ))}
        {!sections.length && <div className="ac-empty"><p>Belum ada section. Klik "+ Section baru" untuk menambahkan.</p></div>}
      </div>
    </section>
  );
}
