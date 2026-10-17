'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { FieldPicker } from '@/components/program/FieldPicker';
import { OTHER_FIELD, STREAMS, fieldLabel, type Stream } from '@/lib/data/disciplines';
import { CmsSelect } from './CmsSelect';

// Field of study in the admin: the STEM / Non-STEM badge for tables, the "Rumpun" filter options,
// and an inline editor for the registration and member dialogs.

export const isStream = (v: unknown): v is Stream => v === 'stem' || v === 'nonstem';

export function StreamBadge({ stream }: { stream: unknown }) {
  if (!isStream(stream)) return <span className="cms-muted">—</span>;
  return <span className={`dsc-badge is-${stream}`}>{STREAMS[stream].label}</span>;
}

export const STREAM_FILTER = [
  { value: 'all', label: 'Semua' },
  { value: 'stem', label: 'STEM' },
  { value: 'nonstem', label: 'Non-STEM' },
  { value: 'none', label: 'Belum diisi' },
];

export const matchStream = (stream: unknown, filter: string) => filter === 'all' || (filter === 'none' ? !isStream(stream) : stream === filter);

/** Facts row: shows "STEM · Fisika" with an edit button; editing picks the stream and the field. */
export function DisciplineEditor({ stream, field, onSave }: { stream: unknown; field: unknown; onSave: (stream: Stream, field: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [s, setS] = useState<Stream | ''>(isStream(stream) ? stream : '');
  const [f, setF] = useState(String(field ?? ''));
  const [other, setOther] = useState('');
  const value = fieldLabel(f, other).trim();
  const ok = !!s && !!value && (f !== OTHER_FIELD || other.trim().length >= 3);

  if (!editing) {
    return (
      <div className="dsc-view">
        <StreamBadge stream={stream} />
        <span>{String(field ?? '').trim() || <span className="cms-muted">Belum diisi</span>}</span>
        <button type="button" className="dsc-edit" onClick={() => setEditing(true)} aria-label="Ubah bidang ilmu"><Pencil size={13} /> Ubah</button>
      </div>
    );
  }
  return (
    <div className="dsc-form">
      <CmsSelect size="sm" aria-label="Rumpun ilmu" value={s} placeholder="Rumpun" onChange={(v) => { setS(v as Stream); setF(''); setOther(''); }} options={(Object.keys(STREAMS) as Stream[]).map((k) => ({ value: k, label: STREAMS[k].label }))} />
      <FieldPicker variant="admin" aria-label="Bidang ilmu" stream={s || 'stem'} value={f} disabled={!s} placeholder="Cari bidang" onChange={(nf, ns, typed) => { setS(ns); setF(nf); setOther(nf === OTHER_FIELD ? typed ?? other : ''); }} />
      {f === OTHER_FIELD && <input className="dsc-other" value={other} onChange={(e) => setOther(e.target.value)} maxLength={60} placeholder="Nama bidang" aria-label="Nama bidang" />}
      <div className="dsc-actions">
        <button type="button" className="cms-btn cms-btn--ghost cms-btn--sm" onClick={() => { setEditing(false); setS(isStream(stream) ? stream : ''); setF(String(field ?? '')); setOther(''); }}>Batal</button>
        <button type="button" className="cms-btn cms-btn--solid cms-btn--sm" disabled={!ok} onClick={() => { if (s) onSave(s, value); setEditing(false); }}>Simpan</button>
      </div>
    </div>
  );
}
