'use client';

import { useState, type ReactNode } from 'react';
import { Atom, BookOpen, Building2, CalendarClock, CalendarRange, Check, GraduationCap, IdCard, Library, Link2, Mail, Minus, NotebookPen, Phone, Plus, ShieldCheck, Sparkles, UserRound, UserRoundPlus } from 'lucide-react';
import { CopublikaMark } from '@/components/brand/CopublikaMark';
import { RESPONDER } from '@/lib/cms/messages';
import { addMonths } from '@/lib/cms/members';
import { ID_TYPES, ROLE_LABEL } from '@/lib/cms/signups';
import type { CmsItem } from '@/lib/cms/types';
import { OTHER_FIELD, STREAMS, fieldLabel, type Stream } from '@/lib/data/disciplines';
import { FieldPicker } from '@/components/program/FieldPicker';
import { CmsSelect } from './CmsSelect';
import { DateField } from './DateField';
import { StreamBadge } from './Discipline';
import { Drawer, formatDate } from './ui';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PRESETS = [1, 3, 6, 12];
const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const newStamp = () => Date.now().toString(36);
const initials = (name: string) => name.trim().replace(/^(Dr|Prof|Ir)\.?\s+/i, '').split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');

type Form = { name: string; email: string; whatsapp: string; role: string; institution: string; idNumber: string; stream: string; field: string; fieldOther: string; scholar: string; months: number; start: string; note: string };

/** Admin registers a member by hand: active at once, for the period the admin sets. */
export function MemberCreateDialog({ members, onClose, onCreate }: { members: CmsItem[]; onClose: () => void; onCreate: (m: CmsItem) => void }) {
  const [f, setF] = useState<Form>(() => ({ name: '', email: '', whatsapp: '', role: '', institution: '', idNumber: '', stream: '', field: '', fieldOther: '', scholar: '', months: 12, start: todayIso(), note: '' }));
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
  const setMonths = (m: number) => { clear('months'); setF((x) => ({ ...x, months: Math.min(60, Math.max(1, Math.round(m) || 1)) })); };
  const rule = ID_TYPES[f.role];
  const startIso = f.start ? new Date(`${f.start}T00:00:00`).toISOString() : '';
  const endIso = startIso && f.months > 0 ? addMonths(startIso, f.months) : '';
  const fieldText = f.stream ? fieldLabel(f.field, f.fieldOther) : '';
  // A start date after today makes the member scheduled (Terjadwal) until that day.
  const scheduled = !!f.start && f.start > todayIso();

  const validate = () => {
    const e: Record<string, string> = {};
    if (f.name.trim().length < 3) e.name = 'Tulis nama lengkap.';
    if (!EMAIL_RE.test(f.email.trim())) e.email = 'Masukkan email yang valid.';
    else if (members.some((m) => String(m.email).toLowerCase() === f.email.trim().toLowerCase() && m.status !== 'inactive')) e.email = 'Email ini sudah terdaftar sebagai member.';
    if (!f.role) e.role = 'Pilih profesi.';
    if (f.field === OTHER_FIELD && f.fieldOther.trim().length < 3) e.fieldOther = 'Tulis nama bidang ilmu.';
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
    const stamp = newStamp();
    onCreate({
      id: `mbr-${stamp}`,
      code: `MB-${stamp.slice(-4).toUpperCase()}`,
      name: f.name.trim(),
      email: f.email.trim(),
      whatsapp: f.whatsapp.trim(),
      address: '',
      role: f.role,
      institution: f.institution.trim(),
      idNumber: f.idNumber.trim(),
      stream: f.stream,
      field: fieldText,
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

  const presetEnd = (m: number) => (startIso ? formatDate(addMonths(startIso, m)) : '—');

  return (
    <Drawer
      open
      size="center"
      title="Tambah member"
      subtitle="Daftarkan member secara manual. Member aktif mulai tanggal yang dipilih."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="cms-btn cms-btn--ghost" onClick={onClose}>Batal</button>
          <div className="cms-drawer-foot-right">
            {Object.keys(errors).length > 0 && <span className="mbc-foot-err">Periksa {Object.keys(errors).length} isian yang belum sesuai.</span>}
            <button type="button" className="cms-btn cms-btn--solid" onClick={save}><UserRoundPlus size={15} /> {scheduled ? 'Simpan & jadwalkan' : 'Simpan & aktifkan'}</button>
          </div>
        </>
      }
    >
      <div className="mbc">
        <div className="mbc-main">
          <Step n={1} icon={<UserRound size={16} />} title="Identitas" hint="Kontak yang dipakai untuk login dan pemberitahuan.">
            <div className="mbc-grid">
              <Field label="Nama lengkap" required error={errors.name} icon={<UserRound size={16} />} wide><input value={f.name} onChange={set('name')} placeholder="Dr. Nama Lengkap" /></Field>
              <Field label="Email" required error={errors.email} icon={<Mail size={16} />}><input type="email" value={f.email} onChange={set('email')} placeholder="nama@kampus.ac.id" /></Field>
              <Field label="WhatsApp" icon={<Phone size={16} />} optional><input type="tel" value={f.whatsapp} onChange={set('whatsapp')} placeholder="0812 3456 7890" /></Field>
            </div>
          </Step>

          <Step n={2} icon={<GraduationCap size={16} />} title="Profil akademik" hint="Profesi menentukan nomor identitas yang diminta.">
            <div className="mbc-grid">
              <Field label="Profesi" required error={errors.role} plain>
                <CmsSelect aria-label="Profesi" value={f.role} onChange={(v) => { clear('role'); clear('idNumber'); setF((x) => ({ ...x, role: v, idNumber: '' })); }} placeholder="Pilih profesi" options={Object.entries(ROLE_LABEL).map(([value, label]) => ({ value, label, hint: `Identitas: ${ID_TYPES[value]?.label}` }))} invalid={!!errors.role} />
              </Field>
              <Field label="Institusi / afiliasi" icon={<Building2 size={16} />} optional><input value={f.institution} onChange={set('institution')} placeholder="Universitas / lembaga" /></Field>
              <Field label={rule?.label ?? 'Nomor identitas'} error={errors.idNumber} icon={<IdCard size={16} />} hint={rule ? (rule.digits ? `${rule.digits} digit angka` : '5–20 karakter') : 'Pilih profesi dulu'} optional>
                <input value={f.idNumber} onChange={set('idNumber')} inputMode={rule?.digits ? 'numeric' : 'text'} disabled={!rule} placeholder={rule?.label ?? '—'} className="is-mono" />
              </Field>
              <Field label="Google Scholar" icon={<Link2 size={16} />} optional><input value={f.scholar} onChange={set('scholar')} placeholder="ID profil" /></Field>

              <div className="mbc-field is-wide">
                <span className="mbc-label" id="mbc-stream">Rumpun ilmu <em>opsional</em></span>
                <div className="mbc-streams" role="radiogroup" aria-labelledby="mbc-stream">
                  {(Object.keys(STREAMS) as Stream[]).map((k) => (
                    <button
                      type="button"
                      role="radio"
                      key={k}
                      aria-checked={f.stream === k}
                      onClick={() => { clear('fieldOther'); setF((x) => (x.stream === k ? { ...x, stream: '', field: '', fieldOther: '' } : { ...x, stream: k, field: '', fieldOther: '' })); }}
                    >
                      <span className="mbc-streams__ico" aria-hidden="true">{k === 'stem' ? <Atom size={17} /> : <Library size={17} />}</span>
                      <span className="mbc-streams__text"><b>{STREAMS[k].label}</b><small>{STREAMS[k].hint}</small></span>
                      <span className="mbc-streams__dot" aria-hidden="true">{f.stream === k && <Check size={12} strokeWidth={3} />}</span>
                    </button>
                  ))}
                </div>
              </div>
              {f.stream && (
                <Field label="Bidang ilmu" plain wide={f.field !== OTHER_FIELD}>
                  <FieldPicker variant="admin" aria-label="Bidang ilmu" stream={f.stream as Stream} value={f.field} placeholder="Cari atau pilih bidang" onChange={(field, stream, typed) => { clear('fieldOther'); setF((x) => ({ ...x, stream, field, fieldOther: field === OTHER_FIELD ? (typed ?? x.fieldOther) : '' })); }} />
                </Field>
              )}
              {f.field === OTHER_FIELD && (
                <Field label="Nama bidang" required error={errors.fieldOther} icon={<BookOpen size={16} />}><input value={f.fieldOther} onChange={set('fieldOther')} maxLength={60} placeholder="Mis. Ilmu Perpustakaan" /></Field>
              )}
            </div>
          </Step>

          <Step n={3} icon={<CalendarClock size={16} />} title="Masa aktif" hint="Mulai hari ini, atau pilih tanggal nanti agar member terjadwal.">
            <div className="mbc-presets" role="radiogroup" aria-label="Masa aktif">
              {PRESETS.map((m) => (
                <button type="button" role="radio" key={m} aria-checked={!custom && f.months === m} onClick={() => { setCustom(false); setMonths(m); }}>
                  <b>{m}<span> bulan</span></b>
                  <small>s.d. {presetEnd(m)}</small>
                  {m === 12 && <i className="mbc-presets__tag">Tahunan</i>}
                </button>
              ))}
              <button type="button" role="radio" aria-checked={custom} onClick={() => setCustom(true)} className="is-custom">
                <b><Sparkles size={15} aria-hidden="true" /> Atur</b>
                <small>1–60 bulan</small>
              </button>
            </div>
            <div className="mbc-grid">
              {custom && (
                <div className={`mbc-field ${errors.months ? 'has-error' : ''}`}>
                  <span className="mbc-label">Jumlah bulan <i aria-hidden="true">*</i></span>
                  <div className="mbc-stepper">
                    <button type="button" onClick={() => setMonths(f.months - 1)} disabled={f.months <= 1} aria-label="Kurangi satu bulan"><Minus size={15} /></button>
                    <input type="number" min={1} max={60} value={f.months} onChange={(e) => setMonths(Number(e.target.value))} aria-label="Jumlah bulan" />
                    <span>bulan</span>
                    <button type="button" onClick={() => setMonths(f.months + 1)} disabled={f.months >= 60} aria-label="Tambah satu bulan"><Plus size={15} /></button>
                  </div>
                  {errors.months && <span className="mbc-err">{errors.months}</span>}
                </div>
              )}
              <div className={`mbc-field ${errors.start ? 'has-error' : ''}`}>
                <label className="mbc-label" htmlFor="mbc-start">Mulai aktif <i aria-hidden="true">*</i></label>
                <DateField id="mbc-start" value={f.start} onChange={(v) => { clear('start'); setF((x) => ({ ...x, start: v })); }} invalid={!!errors.start} hint={!errors.start} />
                {errors.start && <span className="mbc-err">{errors.start}</span>}
              </div>
            </div>
            <Field label="Catatan internal" icon={<NotebookPen size={16} />} optional wide area>
              <textarea rows={2} value={f.note} onChange={set('note')} placeholder="Mis. didaftarkan saat workshop kampus." />
            </Field>
          </Step>
        </div>

        <aside className="mbc-side" aria-label="Pratinjau member">
          <div className="mbc-preview">
            <CopublikaMark className="mbc-preview__mark" />
            <span className="mbc-preview__k">Pratinjau member</span>
            <div className="mbc-preview__who">
              <span className="mbc-preview__av" aria-hidden="true">{initials(f.name) || <UserRound size={20} />}</span>
              <div>
                <b>{f.name.trim() || 'Nama member'}</b>
                <small>{f.email.trim() || 'email@domain.ac.id'}</small>
              </div>
            </div>
            <div className="mbc-preview__tags">
              <span className={`mbc-chip is-state ${scheduled ? 'is-scheduled' : ''}`}>{scheduled ? 'Terjadwal' : 'Aktif'}</span>
              <span className="mbc-chip is-solid"><ShieldCheck size={12} aria-hidden="true" /> Didaftarkan admin</span>
              {f.role && <span className="mbc-chip">{ROLE_LABEL[f.role]}</span>}
              {f.stream && <StreamBadge stream={f.stream} />}
            </div>
            <dl className="mbc-preview__facts">
              <div><dt>Institusi</dt><dd>{f.institution.trim() || '—'}</dd></div>
              <div><dt>Bidang ilmu</dt><dd>{fieldText || '—'}</dd></div>
            </dl>
            <div className="mbc-period">
              <span className="mbc-period__k"><CalendarRange size={13} aria-hidden="true" /> Masa aktif {f.months} bulan</span>
              <div className="mbc-period__line" aria-hidden="true"><i /><span /><i /></div>
              <div className="mbc-period__dates">
                <span><small>Mulai</small>{startIso ? formatDate(startIso) : '—'}</span>
                <span><small>Berakhir</small>{endIso ? formatDate(endIso) : '—'}</span>
              </div>
            </div>
          </div>
          <p className="mbc-side__note"><ShieldCheck size={14} aria-hidden="true" /><span>{scheduled ? <>Mulai aktif <b>{formatDate(startIso)}</b>. Sampai tanggal itu member berstatus <b>Terjadwal</b>.</> : <>Member manual langsung berstatus <b>Aktif</b>.</>} Tercatat di Riwayat sebagai &ldquo;Didaftarkan admin&rdquo;.</span></p>
        </aside>
      </div>
    </Drawer>
  );
}

function Step({ n, icon, title, hint, children }: { n: number; icon: ReactNode; title: string; hint: string; children: ReactNode }) {
  return (
    <section className="mbc-step">
      <header>
        <span className="mbc-step__n" aria-hidden="true">{n}</span>
        <div>
          <h3><span aria-hidden="true">{icon}</span>{title}</h3>
          <p>{hint}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

function Field({ label, required, optional, error, hint, wide, icon, plain, area, children }: { label: string; required?: boolean; optional?: boolean; error?: string; hint?: string; wide?: boolean; icon?: ReactNode; plain?: boolean; area?: boolean; children: ReactNode }) {
  return (
    <label className={`mbc-field ${wide ? 'is-wide' : ''} ${error ? 'has-error' : ''}`}>
      <span className="mbc-label">{label}{required && <i aria-hidden="true"> *</i>}{optional && <em>opsional</em>}</span>
      {plain ? children : <span className={`mbc-control ${area ? 'is-area' : ''}`}>{icon && <span className="mbc-control__ico" aria-hidden="true">{icon}</span>}{children}</span>}
      {error ? <span className="mbc-err">{error}</span> : hint ? <span className="mbc-hint">{hint}</span> : null}
    </label>
  );
}
