"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, CalendarPlus, Check, CheckCircle2, Clock3, Copy, Globe2, Languages, Link2, Lock, MessageCircle, Sparkles, Ticket, Users, X,
} from "lucide-react";
import type { Event } from "@/types";
import { CopublikaMark, MARK_DOT, MARK_RING_PATH, MARK_VIEWBOX } from "@/components/brand/CopublikaMark";
import { formatRupiah } from "@/lib/data/programs";
import { EVENT_COPY } from "@/lib/content/event";
import { addRegistration } from "@/lib/cms/registrations";
import { categoryOf, downloadIcs, seatsLeft, when } from "./eventMeta";

const EASE = [0.22, 1, 0.36, 1] as const;
const NON_MEMBER_PRICE = EVENT_COPY.detail.nonMemberPrice;

const initials = (name = "") => name.replace(/^(dr|prof)\.?\s+/i, "").split(/[\s,]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

/** The live countdown parts; "--" until the browser clock takes over (no hydration mismatch). */
function useCountdown(iso: string) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  const left = now === null ? 0 : Math.max(0, new Date(iso).getTime() - now);
  return {
    ready: now !== null,
    started: now !== null && left === 0,
    parts: [
      { n: Math.floor(left / 86_400_000), l: "Hari" },
      { n: Math.floor((left / 3_600_000) % 24), l: "Jam" },
      { n: Math.floor((left / 60_000) % 60), l: "Menit" },
      { n: Math.floor((left / 1000) % 60), l: "Detik" },
    ],
  };
}

export function EventDetail({ event, related }: { event: Event; related: Event[] }) {
  const reduce = useReducedMotion();
  const w = when(event.date);
  const c = categoryOf(event);
  const left = seatsLeft(event);
  const share = event.capacity ? Math.min(1, event.registrantsCount / event.capacity) : 0;
  const cd = useCountdown(event.date);
  const [registering, setRegistering] = useState(false);

  const about = (event.blocks ?? []).filter((b) => b.paragraphs?.length);
  const gains = (event.blocks ?? []).flatMap((b) => b.checkmarks ?? []);


  const register = () => setRegistering(true);
  const addToCalendar = () => downloadIcs(event, window.location.origin);
  const full = left === 0;

  return (
    <main className="cp-pg cp-evd" style={{ "--c": c.color } as React.CSSProperties}>
      {/* Hero: warm paper, copy on the left, a ticket with date and countdown on the right. */}
      <section className="cp-evd-hero">
        <div className="cp-evd-hero__bg" aria-hidden="true">
          <span className="cp-evd-hero__mark"><CopublikaMark /></span>
          <svg className="cp-evd-hero__ring" viewBox={MARK_VIEWBOX}><path d={MARK_RING_PATH} /><circle cx={MARK_DOT.x} cy={MARK_DOT.y} r={MARK_DOT.r} /></svg>
        </div>
        <div className="cp-ab-wrap">
          <div className="cp-evd-hero__bar">
            <Link href="/event" className="cp-evd-back"><span aria-hidden="true"><ArrowLeft size={16} /></span> Kembali ke agenda</Link>
            <nav className="cp-evd-crumb" aria-label="Lokasi"><Link href="/event">Agenda</Link><span aria-hidden="true">/</span><span>{c.label}</span></nav>
          </div>
          <div className="cp-evd-hero__grid">
            <motion.div className="cp-evd-hero__copy" initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
              <div className="cp-evd-pills">
                <span className="cp-evp-pill"><c.Icon size={13} aria-hidden="true" /> {c.label}</span>
                <span className="cp-evd-pill">{event.memberOnly ? "Khusus anggota" : event.isPaid ? "Berbayar" : "Gratis untuk anggota"}</span>
                {event.duration && <span className="cp-evd-pill"><Clock3 size={13} aria-hidden="true" /> {event.duration}</span>}
                <span className="cp-evd-pill"><Sparkles size={13} aria-hidden="true" /> Sertifikat</span>
              </div>
              <h1>{event.title}</h1>
              <p className="cp-evd-lead">{event.description}</p>
              {event.speaker && (
                <div className="cp-evd-host">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {event.speaker.avatar ? <img src={event.speaker.avatar} alt="" /> : <i>{initials(event.speaker.name)}</i>}
                  <span><small>Bersama</small><strong>{event.speaker.name}</strong></span>
                </div>
              )}
              <div className="cp-evd-ctas">
                <PrimaryCta event={event} full={full} onRegister={register} />
                <button type="button" className="cp-evp-btn-ghost" onClick={addToCalendar}><CalendarPlus size={16} aria-hidden="true" /> Tambah ke kalender</button>
              </div>
            </motion.div>

            <motion.div className="cp-evd-ticket" initial={reduce ? false : { opacity: 0, y: 30, rotate: 3 }} animate={{ opacity: 1, y: 0, rotate: -2 }} transition={{ duration: 1, delay: 0.15, ease: EASE }}>
              <div className="cp-evd-ticket__top">
                <span className="cp-evd-ticket__k">{w.weekday}</span>
                <b>{w.day}</b>
                <span className="cp-evd-ticket__my">{w.month} {w.year}</span>
                <span className="cp-evd-ticket__time"><Clock3 size={13} aria-hidden="true" /> {event.time ? `${event.time} WIB` : w.time}</span>
              </div>
              <div className="cp-evd-ticket__cut" aria-hidden="true" />
              <div className="cp-evd-ticket__bottom">
                <span className="cp-evd-ticket__k">{cd.started ? "Acara sudah dimulai" : "Dimulai dalam"}</span>
                <div className="cp-evd-count">
                  {cd.parts.map((p) => (
                    <div key={p.l}><b>{cd.ready ? String(p.n).padStart(2, "0") : "--"}</b><small>{p.l}</small></div>
                  ))}
                </div>
                <div className="cp-evd-ticket__seats">
                  <span>{event.registrantsCount} terdaftar</span>
                  <span className={full ? "is-full" : ""}>{full ? "Kuota penuh" : `${left} kursi tersisa`}</span>
                </div>
                <span className="cp-evd-meter" aria-hidden="true"><motion.i initial={{ width: 0 }} animate={{ width: `${share * 100}%` }} transition={{ duration: 1.2, delay: 0.5, ease: EASE }} /></span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key facts, overlapping the hero edge. */}
      <div className="cp-ab-wrap">
        <dl className="cp-evd-facts">
          {[
            { Icon: CalendarDays, l: "Tanggal", v: `${w.day} ${w.month} ${w.year}`, s: w.weekday },
            { Icon: Clock3, l: "Waktu", v: event.time ?? w.time.replace(" WIB", ""), s: `WIB${event.duration ? ` · ${event.duration}` : ""}` },
            { Icon: Globe2, l: "Format", v: event.format ?? event.location, s: event.location.includes("·") ? "Link dikirim 24 jam sebelum" : event.location },
            { Icon: Languages, l: "Bahasa", v: event.language ?? "Indonesia", s: "Materi bilingual" },
          ].map((f, i) => (
            <motion.div key={f.l} initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease: EASE }}>
              <span className="cp-evd-facts__ico" aria-hidden="true"><f.Icon size={18} /></span>
              <dt>{f.l}</dt>
              <dd><strong>{f.v}</strong><small>{f.s}</small></dd>
            </motion.div>
          ))}
        </dl>
      </div>


      <div className="cp-ab-wrap cp-evd-body">
        <div className="cp-evd-main">
          {about.length > 0 && (
            <section id="tentang" className="cp-evd-sec">
              <SecHead k="Tentang acara" title={about[0].heading} />
              {about.flatMap((b) => b.paragraphs ?? []).map((p, i) => <p key={i} className="cp-evd-p">{p}</p>)}
            </section>
          )}

          {gains.length > 0 && (
            <section id="manfaat" className="cp-evd-sec">
              <SecHead k="Yang Anda dapatkan" title={`${gains.length} hal yang Anda bawa pulang`} />
              <ul className="cp-evd-gains">
                {gains.map((g, i) => (
                  <motion.li key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}>
                    <span aria-hidden="true"><Check size={16} strokeWidth={3} /></span>
                    {g}
                  </motion.li>
                ))}
              </ul>
            </section>
          )}

          {event.schedule && event.schedule.length > 0 && (
            <section id="susunan" className="cp-evd-sec">
              <SecHead k="Susunan acara" title={event.time ? `${event.time} WIB` : "Alur sesi"} />
              <ol className="cp-evd-timeline">
                {event.schedule.map((s, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}>
                    <span className="cp-evd-timeline__dot" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <div className="cp-evd-timeline__card">
                      <span className="cp-evd-timeline__time">{s.time}</span>
                      <h3>{s.title}</h3>
                      <p>{s.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </section>
          )}

          {event.speaker && (
            <section id="pembicara" className="cp-evd-sec">
              <SecHead k="Pembicara" title="Belajar langsung dari praktisi" />
              <div className="cp-evd-speaker">
                <span className="cp-evd-speaker__mark" aria-hidden="true"><CopublikaMark /></span>
                <div className="cp-evd-speaker__photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {event.speaker.avatar ? <img src={event.speaker.avatar} alt={event.speaker.name} /> : <i>{initials(event.speaker.name)}</i>}
                </div>
                <div>
                  <small>Pembicara utama</small>
                  <h3>{event.speaker.name}</h3>
                  <p>{event.speaker.role}</p>
                  {event.speaker.badges?.length > 0 && <ul>{event.speaker.badges.map((b) => <li key={b}>{b}</li>)}</ul>}
                </div>
              </div>
            </section>
          )}

          {event.targetAudience && event.targetAudience.length > 0 && (
            <section id="untuk-siapa" className="cp-evd-sec">
              <SecHead k="Untuk siapa" title="Sesi ini paling cocok untuk" />
              <ul className="cp-evd-audience">
                {event.targetAudience.map((a, i) => (
                  <li key={i}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>{a}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Registration card */}
        <aside className="cp-evd-aside" id="daftar" aria-label="Pendaftaran">
          <div className="cp-evd-reg">
            <div className="cp-evd-reg__head">
              <span className="cp-evd-reg__k"><Ticket size={14} aria-hidden="true" /> Biaya</span>
              <strong>{event.isPaid ? formatRupiah(NON_MEMBER_PRICE) : "Gratis"}</strong>
              <small>{event.memberOnly ? "Khusus anggota CoPublika" : event.isPaid ? "Per peserta · anggota mendapat potongan" : `Untuk anggota · umum ${formatRupiah(NON_MEMBER_PRICE)}`}</small>
            </div>
            <div className="cp-evd-reg__seats">
              <svg viewBox="0 0 44 44" aria-hidden="true">
                <circle cx="22" cy="22" r="18" />
                <motion.circle cx="22" cy="22" r="18" pathLength={1} initial={{ pathLength: 0 }} whileInView={{ pathLength: share }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }} />
              </svg>
              <div>
                <strong>{full ? "Penuh" : `${left} kursi`}</strong>
                <small>{event.registrantsCount} dari {event.capacity} terisi</small>
              </div>
            </div>
            <PrimaryCta event={event} full={full} onRegister={register} className="cp-evd-reg__cta" />
            <button type="button" className="cp-evd-reg__cal" onClick={addToCalendar}><CalendarPlus size={15} aria-hidden="true" /> Simpan ke kalender</button>
            {event.memberOnly && (
              <p className="cp-evd-reg__note">Belum menjadi anggota? <Link href="/join-batch">Gabung batch</Link> untuk mengikuti acara khusus anggota.</p>
            )}
            {event.benefits && event.benefits.length > 0 && (
              <ul className="cp-evd-reg__list">
                {event.benefits.map((b) => <li key={b}><CheckCircle2 size={15} aria-hidden="true" /> {b}</li>)}
              </ul>
            )}
            <ShareRow title={event.title} />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="cp-evd-more" aria-labelledby="cp-evd-more-title">
          <div className="cp-ab-wrap">
            <div className="cp-evd-more__head">
              <div>
                <span className="cp-evd-sec__k">{EVENT_COPY.detail.moreTag}</span>
                <h2 id="cp-evd-more-title">{EVENT_COPY.detail.moreTitle} <span>{EVENT_COPY.detail.moreAccent}</span></h2>
              </div>
              <Link href="/event#agenda" className="cp-evd-more__all">Semua agenda <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
            <div className="cp-evd-more__grid">
              {related.map((e, i) => {
                const rw = when(e.date);
                const rc = categoryOf(e);
                const rl = seatsLeft(e);
                return (
                  <motion.div key={e.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}>
                    <Link href={`/event/${e.slug}`} className="cp-evd-card" style={{ "--c": rc.color } as React.CSSProperties}>
                      <span className="cp-evd-card__date"><b>{rw.day}</b><small>{rw.monthShort} {rw.year}</small></span>
                      <span className="cp-evp-pill"><rc.Icon size={13} aria-hidden="true" /> {rc.label}</span>
                      <strong>{e.title}</strong>
                      <span className="cp-evd-card__foot">
                        <span>{e.location} · {rl === 0 ? "Penuh" : `${rl} kursi`}</span>
                        <span className="cp-evd-card__go" aria-hidden="true"><ArrowUpRight size={16} /></span>
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Phone: registration stays one tap away. */}
      <div className="cp-evd-dock">
        <span><strong>{w.day} {w.monthShort} · {event.time ? event.time.split(/\s*[—-]\s*/)[0] : w.time}</strong><small>{full ? "Kuota penuh" : `${left} kursi tersisa`}</small></span>
        <PrimaryCta event={event} full={full} onRegister={register} className="cp-evd-dock__cta" />
      </div>

      <AnimatePresence>{registering && <RegisterDialog event={event} onClose={() => setRegistering(false)} onCalendar={addToCalendar} />}</AnimatePresence>
    </main>
  );
}

/** Register button, or a sign-in link for member-only events. */
function PrimaryCta({ event, full, onRegister, className = "" }: { event: Event; full: boolean; onRegister: () => void; className?: string }) {
  if (event.memberOnly) {
    return (
      <Link href={`/login?next=${encodeURIComponent(`/event/${event.slug}`)}`} className={`cp-ab-btn cp-ab-btn--primary ${className}`}>
        <Lock size={16} aria-hidden="true" /> Masuk untuk daftar
      </Link>
    );
  }
  return (
    <button type="button" className={`cp-ab-btn cp-ab-btn--primary ${className}`} onClick={onRegister} disabled={full}>
      {full ? "Kuota penuh" : event.isPaid ? "Daftar sekarang" : "Daftar gratis"} {!full && <ArrowRight size={16} aria-hidden="true" />}
    </button>
  );
}

function SecHead({ k, title }: { k: string; title: string }) {
  return (
    <header className="cp-evd-sec__head">
      <span className="cp-evd-sec__k">{k}</span>
      <h2>{title}</h2>
    </header>
  );
}

function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");
  useEffect(() => {
    const t = window.setTimeout(() => setUrl(window.location.href), 0);
    return () => window.clearTimeout(t);
  }, []);
  const text = encodeURIComponent(title);
  const u = encodeURIComponent(url);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked; nothing else to do.
    }
  };
  return (
    <div className="cp-evd-share">
      <span>Bagikan</span>
      <a href={`https://wa.me/?text=${text}%20${u}`} target="_blank" rel="noopener noreferrer" aria-label="Bagikan ke WhatsApp"><MessageCircle size={15} /></a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noopener noreferrer" aria-label="Bagikan ke LinkedIn"><Link2 size={15} /></a>
      <a href={`https://twitter.com/intent/tweet?text=${text}&url=${u}`} target="_blank" rel="noopener noreferrer" aria-label="Bagikan ke X"><X size={15} /></a>
      <button type="button" onClick={copy} aria-label="Salin tautan">{copied ? <Check size={15} /> : <Copy size={15} />}</button>
    </div>
  );
}

function RegisterDialog({ event, onClose, onCalendar }: { event: Event; onClose: () => void; onCalendar: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", org: "", question: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 3) errs.name = "Isi nama lengkap Anda.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = "Email belum valid.";
    if (!form.org.trim()) errs.org = "Isi institusi atau kampus Anda.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    // Staging: the admin's Agenda Event → Pendaftar tab reads it from this browser.
    addRegistration({ eventId: event.id, eventTitle: event.title, name: form.name.trim(), email: form.email.trim(), org: form.org.trim(), question: form.question.trim(), paid: event.isPaid });
    setDone(true);
  };
  const field = (key: keyof typeof form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className={`cp-evd-field ${errors[key] ? "has-error" : ""}`}>
      <span>{label}</span>
      <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} {...props} />
      {errors[key] && <small>{errors[key]}</small>}
    </label>
  );

  return (
    <motion.div className="cp-evd-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="cp-evd-modal__backdrop" onClick={onClose} aria-hidden="true" />
      <motion.div className="cp-evd-modal__card" role="dialog" aria-modal="true" aria-label="Daftar acara" initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.35, ease: EASE }}>
        <button type="button" className="cp-evd-modal__close" onClick={onClose} aria-label="Tutup"><X size={18} /></button>
        {done ? (
          <div className="cp-evd-done">
            <span className="cp-evd-done__ico" aria-hidden="true"><CheckCircle2 size={34} /></span>
            <h3>{EVENT_COPY.detail.doneTitle}</h3>
            <p>Terima kasih, {form.name.split(" ")[0]}. Tautan dan materi dikirim ke <b>{form.email}</b> 24 jam sebelum acara.</p>
            <div className="cp-evd-done__ctas">
              <button type="button" className="cp-ab-btn cp-ab-btn--primary" onClick={onCalendar}><CalendarPlus size={16} aria-hidden="true" /> Simpan ke kalender</button>
              <button type="button" className="cp-evp-btn-ghost" onClick={onClose}>Selesai</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <span className="cp-evd-sec__k">Daftar acara</span>
            <h3>{event.title}</h3>
            <p className="cp-evd-modal__sub"><Users size={14} aria-hidden="true" /> {seatsLeft(event)} kursi tersisa · {when(event.date).day} {when(event.date).month}</p>
            {field("name", "Nama lengkap", { autoComplete: "name", placeholder: "Nama sesuai sertifikat", autoFocus: true })}
            {field("email", "Email", { type: "email", autoComplete: "email", placeholder: "nama@kampus.ac.id" })}
            {field("org", "Institusi", { autoComplete: "organization", placeholder: "Universitas / lembaga" })}
            <label className="cp-evd-field">
              <span>Pertanyaan untuk pembicara <em>(opsional)</em></span>
              <textarea rows={3} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Pertanyaan yang dikirim lebih awal akan diprioritaskan." />
            </label>
            <button type="submit" className="cp-ab-btn cp-ab-btn--primary cp-evd-modal__submit">Kirim pendaftaran <ArrowRight size={16} aria-hidden="true" /></button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
