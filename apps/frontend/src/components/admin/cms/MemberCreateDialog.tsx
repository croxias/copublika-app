'use client';

import { useState } from 'react';
import { CalendarClock, Check, UserRoundPlus } from 'lucide-react';
import { RESPONDER } from '@/lib/cms/messages';
import { addMonths } from '@/lib/cms/members';
import { ID_TYPES, ROLE_LABEL } from '@/lib/cms/signups';
import type { CmsItem } from '@/lib/cms/types';
import { CmsSelect } from './CmsSelect';
import { Drawer, formatDate } from './ui';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PRESETS = [1, 3, 6, 12];

type Form = { name: string; email: string; whatsapp: string; role: string; institution: string; idNumber: string; scholar: string; months: number; start: string; note: string };

/** Admin registers a member by hand: active at once, for the period the admin sets. */
export function MemberCreateDialog({ members, onClose, onCreate }: { members: CmsItem[]; onClose: () => void; onCreate: (m: CmsItem) => void }) {
  const [f, setF] = useState<Form>(() => ({ name: '', email: '', whatsapp: '', role: '', institution: '', idNumber: '', scholar: '', months: 12, start: new Date().toISOString().slice(0, 10), note: '' }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [custom, setCustom] = useState(false);
  const clear = (k: string) => setErrors((x) => {
    if (!x[k]) return x;
    const next = { ...x };
    delete next[k];
    return next;
  });
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    clear(k);
    setF((x) => ({ ...x, [k]: k === 'months' ? Number(e.target.value) : e.target.value }));
  };
  const rule = ID_TYPES[f.role];
  const startIso = new Date(`${f.start}T00:00:00`).toISOString();
  const endIso = f.months > 0 ? addMonths(startIso, f.months) : '';

  const validate = () => {
    const e: Record<string, string> = {};
    if (f.name.trim().length < 3) e.name = 'Tulis nama lengkap.';
    if (!EMAIL_RE.test(f.email.trim())) e.email = 'Masukkan email yang valid.';
    else if (members.some((m) => String(m.email).toLowerCase() === f.email.trim().toLowerCase() && m.status !== 'inactive')) e.email = 'Email ini sudah terdaftar sebagai member.';
    if (!f.role) e.role = 'Pilih kategori.';
    if (rule && f.idNumber.trim()) {
      const ok = rule.digits ? new RegExp(`^\\d{${rule.digits}}$`).test(f.idNumber.trim()) : /^[A-Za-z0-9./-]{5,20}$/.test(f.idNumber.trim());
      if (!ok) e.idNumber = rule.digits ? `${rule.label} harus ${rule.digits} digit angka.` : `${rule.label} 5–20 karakter.`;
    }
    if (!Number.isFinite(f.months) || f.months < 1 || f.months > 60) e.months = 'Masa aktif 1–60 bulan.';
    if (!f.start) e.start = 'Pilih tanggal mulai.';
    return e;
  };

  const save = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const now = new Date().toISOString();
    onCreate({
      id: `mbr-${Date.now().toString(36)}`,
      code: `MB-${Date.now().toString(36).slice(-4).toUpperCase()}`,
      name: f.name.trim(),
      email: f.email.trim(),
      whatsapp: f.whatsapp.trim(),
      address: '',
      role: f.role,
      institution: f.institution.trim(),
      idNumber: f.idNumber.trim(),
      scholar: f.scholar.trim(),
      source: 'manual',
      program: '',
      months: f.months,
      signupId: '',
      signupCode: '',
      joinedAt: now,
      activatedAt: startIso,
      expiresAt: endIso,
      status: 'active',
      note: f.note.trim(),
      order: 0,
      updatedAt: now,
      events: [
        { at: now, by: RESPONDER, action: 'joined', detail: 'Didaftarkan manual oleh admin' },
        { at: now, by: RESPONDER, action: 'activated', detail: `${f.months} bulan, mulai ${formatDate(startIso)}` },
      ],
    });
  };

  return (
    <Drawer
      open
      size="center"
      title="Tambah member"
      subtitle="Member langsung aktif. Masa aktif diatur di bawah."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="cms-btn cms-btn--ghost" onClick={onClose}>Batal</button>
          <div className="cms-drawer-foot-right">
            <button type="button" className="cms-btn cms-btn--solid" onClick={save}><UserRoundPlus size={15} /> Simpan & aktifkan</button>
          </div>
        </>
      }
    >
      <div className="mbc">
        <section className="mbc-card">
          <span className="rvd-k">Data member</span>
          <div className="mbc-grid">
            <Field label="Nama lengkap" required error={errors.name}><input value={f.name} onChange={set('name')} placeholder="Dr. Nama Lengkap" /></Field>
            <Field label="Email" required error={errors.email}><input type="email" value={f.email} onChange={set('email')} placeholder="nama@kampus.ac.id" /></Field>
            <Field label="WhatsApp"><input type="tel" value={f.whatsapp} onChange={set('whatsapp')} placeholder="0812 3456 7890" /></Field>
            <Field label="Kategori" required error={errors.role}>
              <CmsSelect aria-label="Kategori" value={f.role} onChange={(v) => { clear('role'); clear('idNumber'); setF((x) => ({ ...x, role: v, idNumber: '' })); }} placeholder="Pilih kategori" options={Object.entries(ROLE_LABEL).map(([value, label]) => ({ value, label, hint: `Identitas: ${ID_TYPES[value]?.label}` }))} invalid={!!errors.role} />
            </Field>
            <Field label="Institusi / afiliasi"><input value={f.institution} onChange={set('institution')} placeholder="Universitas / lembaga" /></Field>
            <Field label={rule?.label ?? 'Nomor identitas'} error={errors.idNumber} hint={rule ? (rule.digits ? `${rule.digits} digit` : '5–20 karakter') : 'Pilih kategori dulu'}>
              <input value={f.idNumber} onChange={set('idNumber')} inputMode={rule?.digits ? 'numeric' : 'text'} disabled={!rule} placeholder={rule?.label ?? '—'} />
            </Field>
            <Field label="Google Scholar" wide><input value={f.scholar} onChange={set('scholar')} placeholder="ID profil, opsional" /></Field>
          </div>
        </section>

        <section className="mbc-card">
          <span className="rvd-k"><CalendarClock size={13} aria-hidden="true" /> Masa aktif</span>
          <div className="mbc-presets" role="radiogroup" aria-label="Masa aktif">
            {PRESETS.map((m) => (
              <button type="button" role="radio" key={m} aria-checked={!custom && f.months === m} onClick={() => { setCustom(false); setF((x) => ({ ...x, months: m })); }}>
                {!custom && f.months === m && <Check size={13} aria-hidden="true" />} {m} bulan
              </button>
            ))}
            <button type="button" role="radio" aria-checked={custom} onClick={() => setCustom(true)}>{custom && <Check size={13} aria-hidden="true" />} Atur sendiri</button>
          </div>
          <div className="mbc-grid">
            {custom && (
              <Field label="Jumlah bulan" required error={errors.months}>
                <input type="number" min={1} max={60} value={f.months} onChange={set('months')} />
              </Field>
            )}
            <Field label="Mulai aktif" required error={errors.start}><input type="date" value={f.start} onChange={set('start')} /></Field>
          </div>
          <p className="mbc-summary">
            Aktif <b>{f.months} bulan</b>, dari <b>{f.start ? formatDate(startIso) : '—'}</b> sampai <b>{endIso ? formatDate(endIso) : '—'}</b>.
          </p>
          <Field label="Catatan internal" wide><textarea rows={2} value={f.note} onChange={set('note')} placeholder="Mis. didaftarkan saat workshop kampus." /></Field>
        </section>
      </div>
    </Drawer>
  );
}

function Field({ label, required, error, hint, wide, children }: { label: string; required?: boolean; error?: string; hint?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={`mbc-field ${wide ? 'is-wide' : ''} ${error ? 'has-error' : ''}`}>
      <span className="mbc-label">{label}{required && <i aria-hidden="true"> *</i>}</span>
      {children}
      {error ? <span className="mbc-err">{error}</span> : hint ? <span className="mbc-hint">{hint}</span> : null}
    </label>
  );
}
