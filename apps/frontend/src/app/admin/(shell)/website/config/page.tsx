'use client';
import { useEffect, useState } from 'react';
import { useStaging } from '@/lib/staging';
import type { StagingSiteConfig } from '@/lib/staging';
import AdminPlaceholder from '@/components/admin/AdminPlaceholder';

const demoEnabled = process.env.NEXT_PUBLIC_COPUBLIKA_DEMO_MODE === 'true';

export default function WebsiteConfigPage() {
  const s = useStaging();
  const [form, setForm] = useState<StagingSiteConfig | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (s.siteConfig) setForm({ ...s.siteConfig });
  }, [s.siteConfig]);

  if (!demoEnabled) {
    return <AdminPlaceholder title="Konfigurasi Website" eyebrow="Konten Website" description="Tersedia hanya pada mode staging/demo." />;
  }
  if (!form) {
    return <AdminPlaceholder title="Konfigurasi Website" eyebrow="Konten Website" description="Konfigurasi belum tersedia di sandbox ini." />;
  }

  const flash = (msg: string) => { setNotice(msg); setTimeout(() => setNotice(''), 2500); };

  const save = () => {
    s.updateSiteConfig(form);
    flash('Konfigurasi tersimpan di sandbox.');
  };

  const field = (label: string, key: keyof StagingSiteConfig, opts?: { textarea?: boolean }) => (
    <label className="wc-field">
      <span>{label}</span>
      {opts?.textarea ? (
        <textarea rows={2} value={String(form[key] ?? '')} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
      ) : (
        <input value={String(form[key] ?? '')} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
      )}
    </label>
  );

  const toggle = (label: string, key: 'showAnnounceBar' | 'navBlogEnabled' | 'navEventEnabled' | 'navResearchEnabled') => (
    <label className="wc-toggle">
      <input type="checkbox" checked={Boolean(form[key])} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} />
      <span>{label}</span>
    </label>
  );

  return (
    <section className="staging-page">
      <div className="cp-pg-head">
        <div className="cp-greet">
          <div className="cp-crumb"><span>Konten Website</span><span className="cp-sep">/</span><span>Halaman Publik</span></div>
          <h1>Konfigurasi <em>Website</em></h1>
          <p>Identitas situs, kontak, sosial media, announce bar, dan visibilitas menu navigasi publik.</p>
        </div>
        <button type="button" className="cp-btn cp-btn--solid" onClick={save}>Simpan perubahan</button>
      </div>
      <div className="staging-notice">Sandbox aman: perubahan tersimpan di localStorage browser — tanpa jaringan atau database.</div>
      {notice && <div className="wc-flash" role="status">{notice}</div>}

      <div className="wc-editor">
        <h2>Identitas</h2>
        <div className="wc-grid">
          {field('Nama situs', 'siteName')}
          {field('Tagline', 'tagline')}
          {field('URL logo', 'logoUrl')}
        </div>
        <h2>Kontak & Sosial Media</h2>
        <div className="wc-grid">
          {field('Email kontak', 'contactEmail')}
          {field('Telepon / WhatsApp', 'contactPhone')}
          {field('Instagram', 'instagram')}
          {field('Threads', 'threads')}
          {field('LinkedIn', 'linkedin')}
        </div>
        <h2>Footer & Announce Bar</h2>
        <div className="wc-grid">
          {field('Label status batch di footer', 'footerBatchLabel')}
          {field('Teks announce bar', 'announceText', { textarea: true })}
        </div>
        <div className="wc-toggles">
          {toggle('Tampilkan announce bar', 'showAnnounceBar')}
          {toggle('Menu Blog tampil di navigasi publik', 'navBlogEnabled')}
          {toggle('Menu Event tampil di navigasi publik', 'navEventEnabled')}
          {toggle('Menu Research tampil di navigasi publik', 'navResearchEnabled')}
        </div>
      </div>
    </section>
  );
}
