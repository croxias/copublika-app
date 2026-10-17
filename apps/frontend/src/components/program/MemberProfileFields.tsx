"use client";

import { useId } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Atom, BookOpen, Building2, Check, ChevronDown, ExternalLink, FlaskConical, GraduationCap, IdCard, Library, Lock, PenLine, UserRound } from "lucide-react";
import { OTHER_FIELD, STREAMS, type Stream } from "@/lib/data/disciplines";
import { FieldPicker } from "./FieldPicker";

// Academic profile for member registration: profession, where they work, an identity number
// that fits the profession, their field of study (STEM / Non-STEM), and an optional Google
// Scholar profile.

export type MemberRole = "dosen" | "peneliti" | "s2" | "umum";

type IdRule = { label: string; name: string; placeholder: string; help: string; digits: boolean; min: number; max: number };

const NIK: IdRule = { label: "NIK (KTP)", name: "NIK", placeholder: "16 digit sesuai KTP", help: "16 digit Nomor Induk Kependudukan.", digits: true, min: 16, max: 16 };

export const MEMBER_ROLES: Record<MemberRole, { label: string; hint: string; icon: React.ReactNode; institution: string; institutionOptional?: boolean; id: IdRule }> = {
  dosen: {
    label: "Dosen",
    hint: "Diisi dengan NIDN",
    icon: <GraduationCap size={18} />,
    institution: "Perguruan tinggi tempat mengajar",
    id: { label: "NIDN", name: "NIDN", placeholder: "10 digit NIDN", help: "Nomor Induk Dosen Nasional, 10 digit.", digits: true, min: 10, max: 10 },
  },
  peneliti: { label: "Peneliti", hint: "Diisi dengan NIK KTP", icon: <FlaskConical size={18} />, institution: "Lembaga atau instansi riset", id: NIK },
  s2: {
    label: "Mahasiswa S2",
    hint: "Diisi dengan NIM",
    icon: <BookOpen size={18} />,
    institution: "Universitas dan program studi",
    id: { label: "NIM", name: "NIM", placeholder: "Nomor induk mahasiswa", help: "Sesuai kartu mahasiswa yang masih aktif.", digits: false, min: 5, max: 20 },
  },
  umum: { label: "Umum", hint: "Diisi dengan NIK KTP", icon: <UserRound size={18} />, institution: "Tempat bekerja atau komunitas", institutionOptional: true, id: NIK },
};

export type MemberProfile = { role: MemberRole | ""; institution: string; idNumber: string; stream: Stream | ""; field: string; fieldOther: string; scholar: string };

export const EMPTY_PROFILE: MemberProfile = { role: "", institution: "", idNumber: "", stream: "", field: "", fieldOther: "", scholar: "" };

/** Google Scholar profile id from a profile link (…citations?user=ID) or the bare id. */
export function scholarId(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  const fromUrl = /[?&]user=([\w-]{6,20})/.exec(s)?.[1];
  if (fromUrl) return fromUrl;
  return /^[\w-]{10,14}$/.test(s) ? s : null;
}

export const scholarUrl = (id: string) => `https://scholar.google.com/citations?user=${encodeURIComponent(id)}`;

/** "3273…4321": enough to recognise the number on the confirmation, never the whole of it. */
export const maskId = (v: string) => (v.length <= 6 ? v : `${v.slice(0, 4)}…${v.slice(-4)}`);

export function validateProfile(p: MemberProfile): Record<string, string> {
  const e: Record<string, string> = {};
  if (!p.role) {
    e.role = "Pilih profesi yang paling sesuai.";
    return e;
  }
  const r = MEMBER_ROLES[p.role];
  if (!r.institutionOptional && p.institution.trim().length < 3) e.institution = "Tulis nama institusi atau afiliasi Anda.";
  const id = p.idNumber.trim();
  if (r.id.digits ? !new RegExp(`^\\d{${r.id.min}}$`).test(id) : !/^[A-Za-z0-9./-]{5,20}$/.test(id)) {
    e.idNumber = r.id.digits ? `${r.id.name} harus ${r.id.min} digit angka.` : `Masukkan ${r.id.name} yang valid (5–20 karakter).`;
  }
  if (!p.stream) e.stream = "Pilih rumpun ilmu Anda.";
  else if (!p.field) e.field = "Pilih bidang ilmu.";
  else if (p.field === OTHER_FIELD && p.fieldOther.trim().length < 3) e.fieldOther = "Tulis nama bidang ilmu Anda.";
  if (p.scholar.trim() && !scholarId(p.scholar)) e.scholar = "Tempel link profil Google Scholar, mis. scholar.google.com/citations?user=…";
  return e;
}

type Props = { value: MemberProfile; onChange: (p: MemberProfile) => void; errors: Record<string, string> };

export function MemberProfileFields({ value: p, onChange, errors }: Props) {
  const reduce = useReducedMotion();
  const uid = useId();
  const role = p.role ? MEMBER_ROLES[p.role] : null;
  const sid = scholarId(p.scholar);
  const set = (patch: Partial<MemberProfile>) => onChange({ ...p, ...patch });

  return (
    <div className="cp-mpf">
      <div className={`cp-reg__field ${errors.role ? "has-error" : ""}`}>
        <label className="cp-reg__label" htmlFor={`${uid}-role`}>Profesi <span className="cp-reg__req" title="Wajib diisi">*<span className="sr-only"> (wajib)</span></span></label>
        <SelectPrimitive.Root value={p.role || undefined} onValueChange={(v) => set({ role: v as MemberRole, idNumber: "" })}>
          <SelectPrimitive.Trigger id={`${uid}-role`} className="cp-mpf-select" aria-invalid={!!errors.role}>
            <span className="cp-mpf-select__ico" aria-hidden="true">{role?.icon ?? <UserRound size={18} />}</span>
            <span className="cp-mpf-select__value">
              <SelectPrimitive.Value placeholder="Pilih profesi Anda" />
            </span>
            <SelectPrimitive.Icon className="cp-mpf-select__chev"><ChevronDown size={16} /></SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content className="cp-mpf-menu" position="popper" sideOffset={6} collisionPadding={12}>
              <SelectPrimitive.Viewport>
                {(Object.keys(MEMBER_ROLES) as MemberRole[]).map((k) => (
                  <SelectPrimitive.Item key={k} value={k} className="cp-mpf-option">
                    <span className="cp-mpf-option__ico" aria-hidden="true">{MEMBER_ROLES[k].icon}</span>
                    <span className="cp-mpf-option__text">
                      <SelectPrimitive.ItemText>{MEMBER_ROLES[k].label}</SelectPrimitive.ItemText>
                      <small>{MEMBER_ROLES[k].hint}</small>
                    </span>
                    <SelectPrimitive.ItemIndicator className="cp-mpf-option__check"><Check size={15} /></SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
        {errors.role ? <span className="cp-reg__err">{errors.role}</span> : <span className="cp-reg__fhint">Menentukan nomor identitas yang diminta.</span>}
      </div>

      <AnimatePresence initial={false} mode="popLayout">
        {role && (
          <motion.div
            key={p.role}
            className="cp-mpf__more"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <label className={`cp-reg__field ${errors.institution ? "has-error" : ""}`}>
              <span className="cp-reg__label">Institusi / afiliasi {role.institutionOptional ? <em>opsional</em> : <span className="cp-reg__req" title="Wajib diisi">*<span className="sr-only"> (wajib)</span></span>}</span>
              <span className="cp-mpf-input">
                <Building2 size={17} aria-hidden="true" />
                <input value={p.institution} onChange={(e) => set({ institution: e.target.value })} autoComplete="organization" placeholder={role.institution} aria-invalid={!!errors.institution} />
              </span>
              {errors.institution && <span className="cp-reg__err">{errors.institution}</span>}
            </label>

            <label className={`cp-reg__field ${errors.idNumber ? "has-error" : ""}`}>
              <span className="cp-reg__label cp-mpf__idlabel">
                <span>{role.id.label} <span className="cp-reg__req" title="Wajib diisi">*<span className="sr-only"> (wajib)</span></span></span>
                {role.id.digits && <span className={`cp-mpf__count ${p.idNumber.length === role.id.max ? "is-full" : ""}`}>{p.idNumber.length}/{role.id.max}</span>}
              </span>
              <span className="cp-mpf-input">
                <IdCard size={17} aria-hidden="true" />
                <input
                  value={p.idNumber}
                  onChange={(e) => set({ idNumber: role.id.digits ? e.target.value.replace(/\D/g, "").slice(0, role.id.max) : e.target.value.replace(/\s/g, "").slice(0, role.id.max) })}
                  inputMode={role.id.digits ? "numeric" : "text"}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={role.id.placeholder}
                  aria-invalid={!!errors.idNumber}
                />
              </span>
              {errors.idNumber ? <span className="cp-reg__err">{errors.idNumber}</span> : <span className="cp-reg__fhint">{role.id.help}</span>}
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`cp-reg__field ${errors.stream ? "has-error" : ""}`}>
        <span className="cp-reg__label" id={`${uid}-stream`}>Rumpun ilmu <span className="cp-reg__req" title="Wajib diisi">*<span className="sr-only"> (wajib)</span></span></span>
        <div className="cp-mpf-stream" role="radiogroup" aria-labelledby={`${uid}-stream`} aria-invalid={!!errors.stream || undefined}>
          {(Object.keys(STREAMS) as Stream[]).map((k) => (
            <button
              type="button"
              role="radio"
              key={k}
              aria-checked={p.stream === k}
              className={p.stream === k ? "is-on" : ""}
              onClick={() => p.stream !== k && set({ stream: k, field: "", fieldOther: "" })}
            >
              <span className="cp-mpf-stream__ico" aria-hidden="true">{k === "stem" ? <Atom size={18} /> : <Library size={18} />}</span>
              <span className="cp-mpf-stream__text">
                <strong>{STREAMS[k].label}</strong>
                <small>{STREAMS[k].hint}</small>
              </span>
              <span className="cp-mpf-stream__dot" aria-hidden="true">{p.stream === k && <Check size={13} strokeWidth={3} />}</span>
            </button>
          ))}
        </div>
        {errors.stream && <span className="cp-reg__err">{errors.stream}</span>}
      </div>

      <AnimatePresence initial={false} mode="popLayout">
        {p.stream && (
          <motion.div
            key={p.stream}
            className={`cp-mpf__more is-field ${p.field === OTHER_FIELD ? "" : "is-single"}`}
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={`cp-reg__field ${errors.field ? "has-error" : ""}`}>
              <label className="cp-reg__label" htmlFor={`${uid}-field`}>Bidang ilmu <span className="cp-reg__req" title="Wajib diisi">*<span className="sr-only"> (wajib)</span></span></label>
              <FieldPicker
                id={`${uid}-field`}
                stream={p.stream}
                value={p.field}
                invalid={!!errors.field}
                placeholder={`Cari atau pilih bidang ${STREAMS[p.stream].label}`}
                icon={p.stream === "stem" ? <FlaskConical size={17} /> : <BookOpen size={17} />}
                onChange={(field, stream, typed) => set({ stream, field, fieldOther: field === OTHER_FIELD ? (typed ?? p.fieldOther) : "" })}
              />
              {errors.field && <span className="cp-reg__err">{errors.field}</span>}
            </div>

            {p.field === OTHER_FIELD && (
              <label className={`cp-reg__field ${errors.fieldOther ? "has-error" : ""}`}>
                <span className="cp-reg__label">Nama bidang <span className="cp-reg__req" title="Wajib diisi">*<span className="sr-only"> (wajib)</span></span></span>
                <span className="cp-mpf-input">
                  <PenLine size={17} aria-hidden="true" />
                  <input value={p.fieldOther} onChange={(e) => set({ fieldOther: e.target.value })} maxLength={60} placeholder="Mis. Ilmu Perpustakaan" aria-invalid={!!errors.fieldOther} autoFocus />
                </span>
                {errors.fieldOther ? <span className="cp-reg__err">{errors.fieldOther}</span> : <span className="cp-reg__fhint">Tulis nama bidang secara lengkap.</span>}
              </label>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <label className={`cp-reg__field cp-mpf__scholar ${errors.scholar ? "has-error" : ""}`}>
        <span className="cp-reg__label">Google Scholar <em>opsional</em></span>
        <span className="cp-mpf-input">
          <GraduationCap size={17} aria-hidden="true" />
          <input value={p.scholar} onChange={(e) => set({ scholar: e.target.value })} inputMode="url" autoComplete="url" spellCheck={false} placeholder="Link profil, mis. scholar.google.com/citations?user=…" aria-invalid={!!errors.scholar} />
        </span>
        {errors.scholar ? (
          <span className="cp-reg__err">{errors.scholar}</span>
        ) : sid ? (
          <span className="cp-mpf__found">
            <Check size={14} aria-hidden="true" /> Profil terbaca: <b>{sid}</b>
            <a href={scholarUrl(sid)} target="_blank" rel="noopener noreferrer">Buka <ExternalLink size={12} aria-hidden="true" /></a>
          </span>
        ) : (
          <span className="cp-reg__fhint">Membantu anggota lain mengenal riset Anda. Bisa ditambahkan nanti.</span>
        )}
      </label>

      <p className="cp-mpf__privacy">
        <Lock size={14} aria-hidden="true" />
        Nomor identitas hanya dipakai untuk administrasi keanggotaan dan tidak ditampilkan di profil publik.
      </p>
    </div>
  );
}
