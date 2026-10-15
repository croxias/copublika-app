"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Check, Lock, ShieldCheck, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  BOOTCAMP_BATCHES,
  batchSeatsLeft,
  PROGRAMS,
  STS_MENTORS,
  formatDate,
  formatRupiah,
  monthLabel,
  seatMonths,
  seatsLeft,
  type ProgramKey,
} from "@/lib/data/programs";

export type Order = {
  code: string;
  program: ProgramKey;
  detail: string;
  name: string;
  email: string;
  whatsapp: string;
  total: number;
  newAccount: boolean;
  createdAt: string;
};

export const ORDER_KEY = "cp-last-order";

type Props = { program: ProgramKey; mentor?: string; month?: string; batch?: string };

/** Registration for one program. A guest also gets a member account in the same step. */
export function RegisterForm({ program: key, mentor: initialMentor, month: initialMonth, batch: initialBatch }: Props) {
  const router = useRouter();
  const program = PROGRAMS[key];
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const months = useMemo(() => seatMonths(), []);
  const [monthIdx, setMonthIdx] = useState(Math.max(0, months.findIndex((m) => m.key === initialMonth)));
  const [mentor, setMentor] = useState(initialMentor ?? "");
  const [batch, setBatch] = useState(initialBatch && BOOTCAMP_BATCHES.some((b) => b.id === initialBatch) ? initialBatch : (BOOTCAMP_BATCHES.find((b) => batchSeatsLeft(b) > 0) ?? BOOTCAMP_BATCHES[0]).id);

  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", institution: "", password: "", confirm: "", agree: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const chosenMentor = STS_MENTORS.find((m) => m.id === mentor);
  const chosenBatch = BOOTCAMP_BATCHES.find((b) => b.id === batch)!;
  const mentorFull = chosenMentor ? seatsLeft(chosenMentor.id, monthIdx) === 0 : false;

  const validate = () => {
    const e: Record<string, string> = {};
    if (key === "siap-tembus-scopus" && (!chosenMentor || mentorFull)) e.mentor = "Pilih mentor yang masih punya kursi di bulan ini.";
    if (key === "bootcamp-menulis" && batchSeatsLeft(chosenBatch) === 0) e.mentor = "Kursi angkatan ini sudah penuh. Pilih angkatan lain.";
    if (!user) {
      if (form.name.trim().length < 3) e.name = "Tulis nama lengkap Anda.";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Masukkan email yang valid.";
      if (form.password.length < 8) e.password = "Password minimal 8 karakter.";
      if (form.confirm !== form.password) e.confirm = "Password tidak sama.";
    }
    if (!/^(\+62|62|0)8\d{7,12}$/.test(form.whatsapp.replace(/[\s-]/g, ""))) e.whatsapp = "Masukkan nomor WhatsApp aktif, mis. 0812xxxxxxx.";
    if (!form.agree) e.agree = "Centang persetujuan untuk melanjutkan.";
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitError("");
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>(".cp-reg [aria-invalid='true']")?.focus());
      return;
    }
    setBusy(true);
    let newAccount = false;
    if (!user) {
      const { error } = await authClient.signUp.email({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      if (error) {
        setBusy(false);
        setSubmitError(
          error.code === "USER_ALREADY_EXISTS" || error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
            ? "Email ini sudah terdaftar sebagai member. Masuk dulu, lalu lanjutkan pendaftaran."
            : error.message ?? "Akun belum bisa dibuat. Coba lagi.",
        );
        return;
      }
      newAccount = true;
    }
    // Front-end phase: the order is kept in this browser until the backend stores it.
    const order: Order = {
      code: `CP-${key === "siap-tembus-scopus" ? "STS" : "BTM"}-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      program: key,
      detail: key === "siap-tembus-scopus" ? `${chosenMentor!.name} · ${months[monthIdx].label}` : `${chosenBatch.name} · ${formatDate(chosenBatch.start)} – ${formatDate(chosenBatch.end)}`,
      name: user?.name ?? form.name.trim(),
      email: user?.email ?? form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      total: program.price,
      newAccount,
      createdAt: new Date().toISOString(),
    };
    try {
      sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
    } catch {
      // Storage blocked: the confirmation page falls back to a generic message.
    }
    router.push("/daftar/selesai");
  };

  const loginHref = `/login?next=${encodeURIComponent(`/daftar?program=${key}${mentor ? `&mentor=${mentor}` : ""}${key === "siap-tembus-scopus" ? `&bulan=${months[monthIdx].key}` : `&angkatan=${batch}`}`)}`;

  return (
    <div className="cp-reg">
      <form className="cp-reg__form" onSubmit={submit} noValidate>
        {/* 1. Program choice */}
        <fieldset className="cp-reg__step">
          <legend><span>1</span> {key === "siap-tembus-scopus" ? "Mentor & bulan" : "Angkatan"}</legend>

          {key === "siap-tembus-scopus" ? (
            <>
              <div className="cp-reg__months" role="radiogroup" aria-label="Bulan pendampingan">
                {months.map((m, i) => (
                  <label key={m.key} className={monthIdx === i ? "is-on" : ""}>
                    <input type="radio" name="bulan" checked={monthIdx === i} onChange={() => setMonthIdx(i)} />
                    <CalendarDays size={15} aria-hidden="true" /> {m.label}
                  </label>
                ))}
              </div>
              <div className="cp-reg__choices" role="radiogroup" aria-label="Mentor" aria-invalid={!!errors.mentor}>
                {STS_MENTORS.map((m) => {
                  const left = seatsLeft(m.id, monthIdx);
                  return (
                    <label key={m.id} className={`cp-reg__choice ${mentor === m.id ? "is-on" : ""} ${left === 0 ? "is-off" : ""}`}>
                      <input type="radio" name="mentor" value={m.id} checked={mentor === m.id} disabled={left === 0} onChange={() => setMentor(m.id)} />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.photo} alt="" />
                      <span>
                        <strong>{m.name}</strong>
                        <small>{m.expertise}</small>
                      </span>
                      <em>{left === 0 ? "Penuh" : `${left} kursi`}</em>
                    </label>
                  );
                })}
              </div>
              {errors.mentor && <p className="cp-reg__err">{errors.mentor}</p>}
            </>
          ) : (
            <div className="cp-reg__choices" role="radiogroup" aria-label="Angkatan">
              {BOOTCAMP_BATCHES.map((b) => (
                <label key={b.id} className={`cp-reg__choice ${batch === b.id ? "is-on" : ""} ${batchSeatsLeft(b) === 0 ? "is-off" : ""}`}>
                  <input type="radio" name="angkatan" value={b.id} checked={batch === b.id} disabled={batchSeatsLeft(b) === 0} onChange={() => setBatch(b.id)} />
                  <span className="cp-reg__batch-ico" aria-hidden="true"><CalendarDays size={18} /></span>
                  <span>
                    <strong>{b.name}</strong>
                    <small>{formatDate(b.start)} – {formatDate(b.end)} · daftar s.d. {formatDate(b.closes)}</small>
                  </span>
                  <em>{batchSeatsLeft(b) === 0 ? "Penuh" : `${batchSeatsLeft(b)} kursi`}</em>
                </label>
              ))}
            </div>
          )}
          {key === "bootcamp-menulis" && errors.mentor && <p className="cp-reg__err">{errors.mentor}</p>}
        </fieldset>

        {/* 2. Account and contact */}
        <fieldset className="cp-reg__step">
          <legend><span>2</span> Data diri & akun member</legend>

          {isPending ? (
            <p className="cp-reg__muted">Memeriksa sesi…</p>
          ) : user ? (
            <div className="cp-reg__member">
              <UserRound size={18} aria-hidden="true" />
              <span>
                Mendaftar sebagai <strong>{user.name}</strong> ({user.email}). Program akan ditambahkan ke akun member Anda.
              </span>
            </div>
          ) : (
            <p className="cp-reg__hint">
              Akun member CoPublika dibuat otomatis dari data ini. Sudah punya akun? <Link href={loginHref}>Masuk dulu</Link>.
            </p>
          )}

          <div className="cp-reg__grid">
            {!user && (
              <>
                <Field label="Nama lengkap" error={errors.name}>
                  <input value={form.name} onChange={set("name")} autoComplete="name" aria-invalid={!!errors.name} placeholder="Dr. Nama Lengkap" />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input type="email" value={form.email} onChange={set("email")} autoComplete="email" aria-invalid={!!errors.email} placeholder="nama@institusi.ac.id" />
                </Field>
              </>
            )}
            <Field label="Nomor WhatsApp" error={errors.whatsapp} hint="Untuk konfirmasi jadwal dan pembayaran.">
              <input type="tel" inputMode="tel" value={form.whatsapp} onChange={set("whatsapp")} autoComplete="tel" aria-invalid={!!errors.whatsapp} placeholder="0812 3456 7890" />
            </Field>
            <Field label="Institusi" optional>
              <input value={form.institution} onChange={set("institution")} autoComplete="organization" placeholder="Universitas / lembaga" />
            </Field>
            {!user && (
              <>
                <Field label="Buat password" error={errors.password} hint="Minimal 8 karakter.">
                  <input type="password" value={form.password} onChange={set("password")} autoComplete="new-password" aria-invalid={!!errors.password} />
                </Field>
                <Field label="Ulangi password" error={errors.confirm}>
                  <input type="password" value={form.confirm} onChange={set("confirm")} autoComplete="new-password" aria-invalid={!!errors.confirm} />
                </Field>
              </>
            )}
          </div>

          <label className={`cp-reg__agree ${errors.agree ? "has-error" : ""}`}>
            <input type="checkbox" checked={form.agree} onChange={set("agree")} aria-invalid={!!errors.agree} />
            <span className="cp-reg__box" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
            <span>Saya setuju data ini dipakai untuk pendaftaran program dan akun member CoPublika.</span>
          </label>
          {errors.agree && <p className="cp-reg__err">{errors.agree}</p>}
        </fieldset>

        {submitError && (
          <p className="cp-reg__submit-err" role="alert">
            {submitError} {submitError.includes("Masuk") && <Link href={loginHref}>Masuk sekarang</Link>}
          </p>
        )}

        <button type="submit" className="cp-ab-btn cp-ab-btn--primary cp-reg__submit" disabled={busy}>
          {busy ? "Memproses…" : <>Daftar & lanjut ke pembayaran <ArrowRight size={16} aria-hidden="true" /></>}
        </button>
      </form>

      {/* Order summary */}
      <aside className="cp-reg__summary" aria-label="Ringkasan pesanan">
        <span className="cp-reg__k">Ringkasan pesanan</span>
        <h2>{program.name}</h2>
        <dl>
          {key === "siap-tembus-scopus" ? (
            <>
              <div><dt>Mentor</dt><dd>{chosenMentor?.name ?? "Belum dipilih"}</dd></div>
              <div><dt>Bulan</dt><dd>{monthLabel(months[monthIdx].key)}</dd></div>
              <div><dt>Termasuk</dt><dd>1 sesi online 90 menit + 4 review</dd></div>
            </>
          ) : (
            <>
              <div><dt>Angkatan</dt><dd>{chosenBatch.name}</dd></div>
              <div><dt>Jadwal</dt><dd>{formatDate(chosenBatch.start)} – {formatDate(chosenBatch.end)}</dd></div>
              <div><dt>Webinar</dt><dd>{chosenBatch.webinar}</dd></div>
            </>
          )}
        </dl>
        <div className="cp-reg__total">
          <span>Total</span>
          <strong>{formatRupiah(program.price)}</strong>
        </div>
        <ul className="cp-reg__perks">
          <li><ShieldCheck size={15} aria-hidden="true" /> Akun member CoPublika aktif otomatis</li>
          <li><Lock size={15} aria-hidden="true" /> Pembayaran dikonfirmasi tim setelah pendaftaran</li>
        </ul>
        <Link href={program.href} className="cp-reg__change">Lihat detail program</Link>
      </aside>
    </div>
  );
}

function Field({ label, error, hint, optional, children }: { label: string; error?: string; hint?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <label className={`cp-reg__field ${error ? "has-error" : ""}`}>
      <span className="cp-reg__label">
        {label} {optional && <em>opsional</em>}
      </span>
      {children}
      {error ? <span className="cp-reg__err">{error}</span> : hint ? <span className="cp-reg__fhint">{hint}</span> : null}
    </label>
  );
}
