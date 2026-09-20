'use client';
import { useMemo, useState } from 'react';
import { useStaging, syntheticLabel } from '@/lib/staging';
import type { StagingProject, ProjectStatus } from '@/lib/staging';

const statuses: ProjectStatus[] = ['Draft', 'Pending Review', 'Published', 'Archived'];
const nextStatus: Partial<Record<ProjectStatus, ProjectStatus>> = { Draft: 'Pending Review', 'Pending Review': 'Published', Published: 'Archived' };
type Form = Pick<StagingProject, 'title' | 'field' | 'summary' | 'requiredExpertise' | 'targetJournal' | 'methodology'>;
const blank: Form = { title: '', field: '', summary: '', requiredExpertise: '', targetJournal: '', methodology: '' };

export default function ProjectGovernance() {
  const s = useStaging();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | ProjectStatus>('all');
  const [field, setField] = useState('all');
  const [selected, setSelected] = useState<string | null>(s.projects[0]?.id ?? null);
  const [editing, setEditing] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<Form>(blank);
  const [error, setError] = useState('');
  const fields = useMemo(() => Array.from(new Set(s.projects.map(p => p.field))), [s.projects]);
  const projects = useMemo(() => s.projects.filter(p => (status === 'all' || p.status === status) && (field === 'all' || p.field === field) && (!query || `${p.title} ${p.owner} ${p.field}`.toLowerCase().includes(query.toLowerCase()))), [s.projects, status, field, query]);
  const project = projects.find(p => p.id === selected) ?? projects[0];
  const startEdit = (p: StagingProject) => { setEditing(p.id); setFormOpen(true); setForm({ title: p.title, field: p.field, summary: p.summary, requiredExpertise: p.requiredExpertise, targetJournal: p.targetJournal, methodology: p.methodology }); setError(''); };
  const save = (event: React.FormEvent) => { event.preventDefault(); if (!form.title.trim() || !form.field.trim() || !form.summary.trim() || !form.requiredExpertise.trim() || !form.targetJournal.trim() || !form.methodology.trim()) { setError('Lengkapi semua metadata governance sebelum menyimpan.'); return; } if (editing) s.updateProject(editing, form); else s.addProject({ ...form, owner: 'Staging Owner Sandbox', status: 'Draft' }); setEditing(null); setForm(blank); setError(''); setFormOpen(false); };
  const transition = (p: StagingProject) => { const next = nextStatus[p.status]; if (next) s.updateProject(p.id, { status: next }); };
  return <section className="staging-page">
    <div className="cp-pg-head"><div className="cp-greet"><div className="cp-crumb"><span>Governance</span><span className="cp-sep">/</span><span>Sandbox</span></div><h1>Project <em>Governance</em></h1><p>Review, publish, dan arsipkan proposal riset sintetis dengan jejak aktivitas.</p></div><span className="staging-label">{syntheticLabel}</span></div>
    <div className="staging-notice">Sandbox aman: seluruh proyek dan pemilik adalah label sintetis. Perubahan hanya disimpan di localStorage browser—tanpa jaringan atau database.</div>
    <div className="staging-toolbar"><input aria-label="Cari proyek" placeholder="Cari judul, owner, atau bidang…" value={query} onChange={e => setQuery(e.target.value)} /><select aria-label="Filter status proyek" value={status} onChange={e => setStatus(e.target.value as 'all' | ProjectStatus)}><option value="all">Semua status</option>{statuses.map(x => <option key={x}>{x}</option>)}</select><select aria-label="Filter bidang proyek" value={field} onChange={e => setField(e.target.value)}><option value="all">Semua bidang</option>{fields.map(x => <option key={x}>{x}</option>)}</select><button type="button" onClick={() => { setEditing(null); setFormOpen(true); setForm(blank); setError(''); }}>+ Proyek baru</button></div>
    <div className="project-workspace"><div className="staging-list" aria-label="Daftar proyek">{projects.map(p => <button type="button" className={`staging-row ${p.id === project?.id ? 'selected' : ''}`} key={p.id} onClick={() => setSelected(p.id)}><span><strong>{p.title}</strong><small>{p.owner} · {p.field} · Diperbarui {p.updatedAt}</small></span><span className="staging-status">{p.status}</span></button>)}{projects.length === 0 && <div className="staging-card"><p>Tidak ada proyek yang cocok dengan filter.</p></div>}</div>
      <div className="staging-detail project-detail"><div className="detail-heading"><div><span className="staging-status">{project?.status ?? '—'}</span><h2>{project?.title ?? 'Pilih proyek'}</h2><p>{project ? `${project.owner} · ${project.field}` : 'Pilih record untuk melihat detail.'}</p></div>{project && <button type="button" onClick={() => startEdit(project)}>Edit</button>}</div>{project && <><p className="muted-copy">{project.summary}</p><div className="metadata-grid"><div><small>Required expertise</small><strong>{project.requiredExpertise}</strong></div><div><small>Target journal</small><strong>{project.targetJournal}</strong></div><div><small>Methodology</small><strong>{project.methodology}</strong></div><div><small>Updated</small><strong>{project.updatedAt}</strong></div></div><div className="project-actions"><button type="button" disabled={!nextStatus[project.status]} onClick={() => transition(project)}>{nextStatus[project.status] ? `Pindah ke ${nextStatus[project.status]}` : 'Status final'}</button>{project.status !== 'Archived' && <button type="button" onClick={() => s.updateProject(project.id, { status: 'Archived' })}>Archive</button>}</div></>}</div></div>
    {formOpen && <form className="staging-card project-form" onSubmit={save}><h2>{editing ? 'Edit proyek' : 'Proyek baru'}</h2>{(['title', 'field', 'summary', 'requiredExpertise', 'targetJournal', 'methodology'] as const).map(key => <label key={key}>{key === 'title' ? 'Judul' : key === 'field' ? 'Bidang' : key === 'summary' ? 'Ringkasan' : key === 'requiredExpertise' ? 'Required expertise' : key === 'targetJournal' ? 'Target journal' : 'Methodology'}{key === 'summary' || key === 'methodology' ? <textarea required value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} /> : <input required value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />}</label>)}{error && <p role="alert" className="form-error">{error}</p>}<div><button type="submit">Simpan lokal</button><button type="button" onClick={() => { setEditing(null); setForm(blank); setError(''); setFormOpen(false); }}>Batal</button></div></form>}
    <div className="staging-card"><h2>Aktivitas governance</h2>{s.activity.filter(a => a.entity === 'projects').slice(0, 8).map(a => <p className="activity-item" key={a.id}><b>{a.action}</b> · {a.detail}</p>)}</div>
  </section>;
}

export type { Form as ProjectForm };
