"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BadgeCheck, CalendarDays, Check, CircleAlert, Lock, MailCheck, ShieldCheck, UserRound } from "lucide-react";
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
  type MemberPlanKey,
  type ProgramKey,
} from "@/lib/data/programs";
import { passwordProblem } from "@/lib/password";
import { addSignup } from "@/lib/cms/signups";
import { PasswordFields } from "./PasswordFields";
import { PolicyDialog, type PolicyTab } from "./PolicyDialog";
import { disciplineLabel, fieldLabel } from "@/lib/data/disciplines";
import { memberPlans, monthsText, perUnit, usePublicProgramPrices, usePublicSettings } from "@/lib/cms/registration-settings";
import { EMPTY_PROFILE, MEMBER_ROLES, MemberProfileFields, maskId, scholarId, validateProfile, type MemberProfile } from "./MemberProfileFields";

/** What can be registered: member activation alone, or a program. */
export type RegKey = ProgramKey | "member";

/** `was` is the normal price of an item given free (membership bundled with a program). */
export type OrderItem = { label: string; detail?: string; amount: number; was?: number };

export type Order = {
  code: string;
  program: RegKey;
  detail: string;
  items: OrderItem[];
  /** Member registration only; the identity number is kept masked. */
  profile?: { role: string; institution: string; id: string; discipline?: string; scholar: string | null };
  name: string;
  email: string;
  whatsapp: string;
  total: number;
  newAccount: boolean;
  createdAt: string;
};

export const ORDER_KEY = "cp-last-order";
/** Last six base-36 digits of the time, for a short order code. */
const orderStamp = () => Date.now().toString(36).toUpperCase().slice(-6);

type Props = { program: RegKey; plan?: MemberPlanKey; mentor?: string; month?: string; batch?: string };

/**
 * Registration for member activation or one program. A guest gets a member account in the
 * same step, and activation (one year) is added to the order unless the member is active.
 */
export function RegisterForm({ program: key, plan: planKey = "gratis", mentor: initialMentor, month: initialMonth, batch: initialBatch }: Props) {
  const router = useRouter();
  const program = key === "member" ? null : PROGRAMS[key];
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const settings = usePublicSettings();
  const prices = usePublicProgramPrices();
  const plan = memberPlans(settings)[planKey];
  const closed = key === "member" && (planKey === "gratis" ? !settings.freeOpen : !settings.yearlyOpen);
  const isFree = key === "member" && plan.price === 0;
  // A new member describes themselves first; a signed-in member renewing already has a profile.
  const showProfile = key === "member" && !user;
  const accountStep = key === "member" ? (showProfile ? 2 : 1) : 2;

  const months = useMemo(() => seatMonths(), []);
  const [monthIdx, setMonthIdx] = useState(Math.max(0, months.findIndex((m) => m.key === initialMonth)));
  const [mentor, setMentor] = useState(initialMentor ?? "");
  const [batch, setBatch] = useState(initialBatch && BOOTCAMP_BATCHES.some((b) => b.id === initialBatch) ? initialBatch : (BOOTCAMP_BATCHES.find((b) => batchSeatsLeft(b) > 0) ?? BOOTCAMP_BATCHES[0]).id);

  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", address: "", institution: "", password: "", confirm: "", agree: false, news: false });
  const [policy, setPolicy] = useState<{ open: boolean; tab: PolicyTab }>({ open: false, tab: "privasi" });
  const [profile, setProfile] = useState<MemberProfile>(EMPTY_PROFILE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const chosenMentor = STS_MENTORS.find((m) => m.id === mentor);
  const chosenBatch = BOOTCAMP_BATCHES.find((b) => b.id === batch)!;
  const mentorFull = chosenMentor ? seatsLeft(chosenMentor.id, monthIdx) === 0 : false;

  const programDetail = key === "siap-tembus-scopus" ? `${chosenMentor?.name ?? "Mentor belum dipilih"} · ${months[monthIdx].label}` : key === "bootcamp-menulis" ? `${chosenBatch.name} · ${formatDate(chosenBatch.start)} – ${formatDate(chosenBatch.end)}` : "";
  const items: OrderItem[] = program
    ? [
        { label: program.name, detail: programDetail, amount: prices[key as keyof typeof prices]?.price ?? program.price },
        ...(settings.programBonusMonths ? [{ label: `Member CoPublika ${monthsText(settings.programBonusMonths)}`, detail: "Bonus peserta program", amount: 0, was: settings.yearlyPrice }] : []),
      ]
    : [{ label: plan.name, detail: plan.price ? `Masa aktif ${monthsText(plan.months)}` : `Masa aktif ${plan.months === 1 ? "bulan pertama" : `${monthsText(plan.months)} pertama`}`, amount: plan.price }];
  const total = items.reduce((n, x) => n + x.amount, 0);

  const validate = () => {
    const e: Record<string, string> = {};
    if (key === "siap-tembus-scopus" && (!chosenMentor || mentorFull)) e.mentor = "Pilih mentor yang masih punya kursi di bulan ini.";
    if (key === "bootcamp-menulis" && batchSeatsLeft(chosenBatch) === 0) e.mentor = "Kursi angkatan ini sudah penuh. Pilih angkatan lain.";
    if (!user) {
      if (form.name.trim().length < 3) e.name = "Tulis nama lengkap Anda.";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Masukkan email yang valid.";
      const pw = passwordProblem(form.password);
      if (pw) e.password = pw;
      if (!form.confirm) e.confirm = "Ulangi password Anda.";
      else if (form.confirm !== form.password) e.confirm = "Password tidak sama.";
    }
    if (!/^(\+62|62|0)8\d{7,12}$/.test(form.whatsapp.replace(/[\s-]/g, ""))) e.whatsapp = "Masukkan nomor WhatsApp aktif, mis. 0812xxxxxxx.";
    if (!form.agree) e.agree = "Setujui Kebijakan Privasi dan Syarat Keanggotaan untuk melanjutkan.";
    return showProfile ? { ...validateProfile(profile), ...e } : e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (closed) return;
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
      code: `CP-${key === "siap-tembus-scopus" ? "STS" : key === "bootcamp-menulis" ? "BTM" : "MBR"}-${orderStamp()}`,
      program: key,
      detail: program ? programDetail : plan.price ? `Aktif ${plan.months} bulan sejak pembayaran dikonfirmasi` : `Masa aktif ${monthsText(plan.months)} pertama, gratis`,
      items,
      ...(showProfile && profile.role
        ? { profile: { role: MEMBER_ROLES[profile.role].label, institution: profile.institution.trim(), id: `${MEMBER_ROLES[profile.role].id.name} ${maskId(profile.idNumber)}`, discipline: disciplineLabel(profile.stream, fieldLabel(profile.field, profile.fieldOther)), scholar: scholarId(profile.scholar) } }
        : {}),
      name: user?.name ?? form.name.trim(),
      email: user?.email ?? form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      total,
      newAccount,
      createdAt: new Date().toISOString(),
    };
    // Staging: the registration also lands in the admin queue (Keanggotaan → Pendaftaran).
    addSignup({
      code: order.code,
      kind: key === "member" ? planKey : key,
      name: order.name,
      email: order.email,
      whatsapp: order.whatsapp,
      address: form.address.trim(),
      role: showProfile ? profile.role : "",
      institution: showProfile ? profile.institution.trim() : form.institution.trim(),
      idNumber: showProfile ? profile.idNumber.trim() : "",
      stream: showProfile ? profile.stream : "",
      field: showProfile ? fieldLabel(profile.field, profile.fieldOther) : "",
      scholar: showProfile ? scholarId(profile.scholar) ?? "" : "",
      detail: order.detail,
      total,
    });
    try {
      sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
    } catch {
      // Storage blocked: the confirmation page falls back to a generic message.
    }
    router.push("/daftar/selesai");
  };

  const loginHref = `/login?next=${encodeURIComponent(`/daftar?program=${key}${key === "member" ? `&paket=${planKey}` : ""}${mentor ? `&mentor=${mentor}` : ""}${key === "siap-tembus-scopus" ? `&bulan=${months[monthIdx].key}` : key === "bootcamp-menulis" ? `&angkatan=${batch}` : ""}`)}`;


  return (
    <div className="cp-reg">
      <form className="cp-reg__form" onSubmit={submit} noValidate>
        {closed && (
          <p className="cp-reg__closed" role="status">
            <CircleAlert size={18} aria-hidden="true" />
            <span><strong>{plan.name} sedang ditutup sementara.</strong> Silakan cek kembali nanti atau hubungi Tim CoPublika via WhatsApp {settings.confirmWhatsapp}.</span>
          </p>
        )}
        {/* 1. Program choice */}
        {key !== "member" && (
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
        )}

        {/* 1. Academic profile (new members) */}
        {showProfile && (
          <fieldset className="cp-reg__step">
            <legend><span>1</span> Profil akademik</legend>
            <p className="cp-reg__hint">Ceritakan siapa Anda. Data ini membantu kami menyiapkan keanggotaan yang sesuai. <span className="cp-reg__reqnote"><span className="cp-reg__req" title="Wajib diisi">*<span className="sr-only"> (wajib)</span></span> wajib diisi</span></p>
            <MemberProfileFields value={profile} onChange={setProfile} errors={errors} />
          </fieldset>
        )}

        {/* 2. Account and contact */}
        <fieldset className="cp-reg__step">
          <legend><span>{accountStep}</span> {key === "member" ? "Akun & kontak" : "Data diri & akun member"}</legend>

          {isPending ? (
            <p className="cp-reg__muted">Memeriksa sesi…</p>
          ) : user ? (
            <div className="cp-reg__member">
              <UserRound size={18} aria-hidden="true" />
              <span>
                Mendaftar sebagai <strong>{user.name}</strong> ({user.email}). {key === "member" ? (plan.price ? `Keanggotaan Anda diaktifkan ${monthsText(plan.months)} setelah pembayaran.` : `Masa aktif member Anda ditambah ${monthsText(plan.months)}.`) : (settings.programBonusMonths ? `Program dan keanggotaan ${monthsText(settings.programBonusMonths)} ditambahkan ke akun Anda.` : "Program ditambahkan ke akun Anda.")}
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
                <Field label="Nama lengkap" required error={errors.name}>
                  <input value={form.name} onChange={set("name")} autoComplete="name" aria-invalid={!!errors.name} placeholder="Dr. Nama Lengkap" />
                </Field>
                <Field label="Email" required error={errors.email}>
                  <input type="email" value={form.email} onChange={set("email")} autoComplete="email" aria-invalid={!!errors.email} placeholder="nama@institusi.ac.id" />
                </Field>
              </>
            )}
            <Field label="Nomor WhatsApp" required error={errors.whatsapp} hint={key === "member" ? "Untuk konfirmasi pendaftaran." : "Untuk konfirmasi jadwal dan pembayaran."}>
              <input type="tel" inputMode="tel" value={form.whatsapp} onChange={set("whatsapp")} autoComplete="tel" aria-invalid={!!errors.whatsapp} placeholder="0812 3456 7890" />
            </Field>
            <Field label="Alamat" optional hint="Jalan, kota, dan provinsi.">
              <input value={form.address} onChange={set("address")} autoComplete="street-address" placeholder="Jl. Merdeka No. 10, Bandung, Jawa Barat" />
            </Field>
            {key !== "member" && (
              <Field label="Institusi" optional wide>
                <input value={form.institution} onChange={set("institution")} autoComplete="organization" placeholder="Universitas / lembaga" />
              </Field>
            )}
            {!user && (
              <PasswordFields
                password={form.password}
                confirm={form.confirm}
                onPassword={(v) => setForm((f) => ({ ...f, password: v }))}
                onConfirm={(v) => setForm((f) => ({ ...f, confirm: v }))}
                errors={{ password: errors.password, confirm: errors.confirm }}
              />
            )}
          </div>

          <div className="cp-reg__consent">
            <label className={`cp-reg__agree ${errors.agree ? "has-error" : ""}`}>
              <input type="checkbox" checked={form.agree} onChange={set("agree")} aria-invalid={!!errors.agree} />
              <span className="cp-reg__box" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
              <span>
                Saya telah membaca dan menyetujui{" "}
                <button type="button" className="cp-reg__doc" onClick={(e) => { e.preventDefault(); setPolicy({ open: true, tab: "syarat" }); }}>Syarat Keanggotaan</button>{" "}
                dan{" "}
                <button type="button" className="cp-reg__doc" onClick={(e) => { e.preventDefault(); setPolicy({ open: true, tab: "privasi" }); }}>Kebijakan Privasi</button>{" "}
                CoPublika, serta mengizinkan data saya diproses untuk {key === "member" ? "pendaftaran" : "pendaftaran program dan"} keanggotaan. <span className="cp-reg__req" title="Wajib diisi">*<span className="sr-only"> (wajib)</span></span>
              </span>
            </label>
            {errors.agree && <p className="cp-reg__err">{errors.agree}</p>}
            <label className="cp-reg__agree is-optional">
              <input type="checkbox" checked={form.news} onChange={set("news")} />
              <span className="cp-reg__box" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
              <span>Kirimi saya info batch, event, dan program baru lewat email. <em>Opsional</em></span>
            </label>
          </div>
        </fieldset>

        {submitError && (
          <p className="cp-reg__submit-err" role="alert">
            {submitError} {submitError.includes("Masuk") && <Link href={loginHref}>Masuk sekarang</Link>}
          </p>
        )}

        {showProfile && (
          <aside className="cp-reg__next" aria-label="Langkah selanjutnya">
            <span className="cp-reg__next-ico" aria-hidden="true"><MailCheck size={20} /></span>
            <div>
              <strong>Langkah selanjutnya</strong>
              <p>Setelah pendaftaran disetujui admin, <b>link aktivasi akun</b> kami kirim ke {form.email.trim() ? <b>{form.email.trim()}</b> : "email Anda"} dalam {settings.reviewHours} jam.</p>
            </div>
          </aside>
        )}

        <button type="submit" className="cp-ab-btn cp-ab-btn--primary cp-reg__submit" disabled={busy || !form.agree || closed} aria-describedby={form.agree ? undefined : "cp-reg-lock"}>
          {busy ? "Memproses…" : <>{isFree ? "Daftar member gratis" : "Daftar & lanjut ke pembayaran"} <ArrowRight size={16} aria-hidden="true" /></>}
        </button>
        {!form.agree && <p className="cp-reg__lock" id="cp-reg-lock"><Lock size={13} aria-hidden="true" /> Centang persetujuan Syarat Keanggotaan dan Kebijakan Privasi untuk mengaktifkan tombol.</p>}
      </form>

      <PolicyDialog
        open={policy.open}
        tab={policy.tab}
        onTab={(tab) => setPolicy((p) => ({ ...p, tab }))}
        onOpenChange={(open) => setPolicy((p) => ({ ...p, open }))}
        onAgree={() => setForm((f) => ({ ...f, agree: true }))}
      />

      {/* Order summary */}
      <aside className="cp-reg__summary" aria-label="Ringkasan pesanan">
        <span className="cp-reg__k">Ringkasan pesanan</span>
        <h2>{program ? program.name : plan.name}</h2>
        <dl>
          {key === "siap-tembus-scopus" ? (
            <>
              <div><dt>Mentor</dt><dd>{chosenMentor?.name ?? "Belum dipilih"}</dd></div>
              <div><dt>Bulan</dt><dd>{monthLabel(months[monthIdx].key)}</dd></div>
              <div><dt>Termasuk</dt><dd>1 sesi online 90 menit + 4 review</dd></div>
            </>
          ) : key === "bootcamp-menulis" ? (
            <>
              <div><dt>Angkatan</dt><dd>{chosenBatch.name}</dd></div>
              <div><dt>Jadwal</dt><dd>{formatDate(chosenBatch.start)} – {formatDate(chosenBatch.end)}</dd></div>
              <div><dt>Webinar</dt><dd>{chosenBatch.webinar}</dd></div>
            </>
          ) : (
            <>
              {showProfile && (
                <>
                  <div><dt>Profesi</dt><dd>{profile.role ? MEMBER_ROLES[profile.role].label : "Belum dipilih"}</dd></div>
                  <div><dt>Afiliasi</dt><dd>{profile.institution.trim() || "—"}</dd></div>
                  <div><dt>Bidang ilmu</dt><dd>{profile.stream ? disciplineLabel(profile.stream, fieldLabel(profile.field, profile.fieldOther)) : "Belum dipilih"}</dd></div>
                  <div><dt>Google Scholar</dt><dd>{scholarId(profile.scholar) ? "Terhubung" : "Belum ditambahkan"}</dd></div>
                </>
              )}
              <div><dt>Masa aktif</dt><dd>{monthsText(plan.months)}</dd></div>
              <div><dt>Biaya</dt><dd>{plan.price ? `${formatRupiah(plan.price)} ${perUnit(plan.months)}` : "Gratis"}</dd></div>
            </>
          )}
        </dl>
        <ul className="cp-reg__lines">
          {items.map((x) => (
            <li key={x.label}>
              <span>{x.label}{x.detail && <small>{x.detail}</small>}</span>
              <b>{x.was ? <><s>{formatRupiah(x.was)}</s> Gratis</> : x.amount ? formatRupiah(x.amount) : "Gratis"}</b>
            </li>
          ))}
        </ul>
        <div className="cp-reg__total">
          <span>Total</span>
          <strong>{total ? formatRupiah(total) : "Gratis"}</strong>
        </div>
        <ul className="cp-reg__perks">
          <li><BadgeCheck size={15} aria-hidden="true" /> {program ? (settings.programBonusMonths ? `Member ${monthsText(settings.programBonusMonths)} tanpa biaya aktivasi` : "Akses program sesuai jadwal") : `Member aktif ${monthsText(plan.months)}`}</li>
          <li><ShieldCheck size={15} aria-hidden="true" /> Akun member CoPublika dibuat otomatis</li>
          {total > 0 && <li><Lock size={15} aria-hidden="true" /> Pembayaran dikonfirmasi tim setelah pendaftaran</li>}
        </ul>
        <Link href={program ? program.href : "/daftar"} className="cp-reg__change">{program ? "Lihat detail program" : "Lihat semua program"}</Link>
      </aside>
    </div>
  );
}

function Field({ label, error, hint, optional, required, wide, children }: { label: string; error?: string; hint?: string; optional?: boolean; required?: boolean; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={`cp-reg__field ${wide ? "is-wide" : ""} ${error ? "has-error" : ""}`}>
      <span className="cp-reg__label">
        {label} {required && <span className="cp-reg__req" title="Wajib diisi">*<span className="sr-only"> (wajib)</span></span>} {optional && <em>opsional</em>}
      </span>
      {children}
      {error ? <span className="cp-reg__err">{error}</span> : hint ? <span className="cp-reg__fhint">{hint}</span> : null}
    </label>
  );
}
