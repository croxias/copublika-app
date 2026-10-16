"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, AtSign, Check, CheckCircle2, ChevronDown, Clock3, Copy, Mail, MapPin, MessageCircle, Send, Users } from "lucide-react";
import { CopublikaMark } from "@/components/brand/CopublikaMark";
import { SectionHead } from "@/components/program/shared";
import { CONTACT_COPY, type ContactTopic } from "@/lib/content/contact";
import { addMessage } from "@/lib/cms/messages";
import type { IndonesiaMap as MapData } from "@/lib/data/indonesia-map";
import { IndonesiaMap } from "./IndonesiaMap";

const EASE = [0.22, 1, 0.36, 1] as const;
const C = CONTACT_COPY;
const line = { hidden: { opacity: 0, y: "100%" }, show: { opacity: 1, y: "0%", transition: { duration: 0.9, ease: EASE } } };
const fade = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };

const ICON: Record<string, typeof Mail> = { Email: Mail, WhatsApp: MessageCircle, Instagram: AtSign, Threads: AtSign };

/** Current WIB weekday (0 = Monday) and minutes since midnight. */
function wibNow(ms: number) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date(ms));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}
const toMin = (t: string) => (t ? Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5)) : -1);

export function ContactPage({ map }: { map: MapData }) {
  const reduce = useReducedMotion();
  const [topic, setTopic] = useState(0);
  const formRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  // Keep the background map's centre level with the title, whatever the screen size.
  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    if (!hero || !title) return;
    const place = () => {
      const h = hero.getBoundingClientRect();
      const t = title.getBoundingClientRect();
      hero.style.setProperty("--map-y", `${t.top - h.top + t.height / 2}px`);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(hero);
    ro.observe(title);
    return () => ro.disconnect();
  }, []);
  const wa = C.channels.find((c) => c.label === "WhatsApp");

  const goWrite = () => formRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });

  return (
    <main className="cp-pg cp-sts cp-ct">
      {/* Hero: black; the Indonesia network map is the background, copy stacked on the left. */}
      <section ref={heroRef} className="cp-sts-hero cp-ct-hero" aria-labelledby="cp-ct-title">
        <div className="cp-ct-hero__bg" aria-hidden="true">
          {/* Plain wrapper holds the centring transform; the motion layer only fades and scales. */}
          <div className="cp-ct-hero__mapbg">
            <motion.div initial={reduce ? false : { opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, delay: 0.2, ease: EASE }}>
              <IndonesiaMap map={map} decorative />
            </motion.div>
          </div>
          <motion.span className="cp-ct-hero__mark" initial={reduce ? false : { opacity: 0, rotate: -12 }} animate={{ opacity: 1, rotate: 0 }} transition={{ duration: 1.4, ease: EASE }}>
            <CopublikaMark />
          </motion.span>
          <span className="cp-ct-hero__fade" />
        </div>
        <div className="cp-ab-wrap cp-ct-hero__wrap">
          <motion.div className="cp-ct-hero__copy" initial={reduce ? false : "hidden"} animate="show" variants={{ show: { transition: { staggerChildren: 0.09 } } }}>
            <motion.span className="cp-sts-pill" variants={fade}><i aria-hidden="true" /> {C.hero.badge}</motion.span>
            <h1 ref={titleRef} id="cp-ct-title" className="cp-sts-hero__title">
              <span className="cp-sts-mask"><motion.span variants={line} className="cp-ct-hero__one">{C.hero.title} <span className="is-accent">{C.hero.accent}</span></motion.span></span>
            </h1>
            <motion.p className="cp-sts-hero__lead" variants={fade}>{C.hero.lead}</motion.p>
            <motion.div className="cp-ct-hero__ctas" variants={fade}>
              <button type="button" className="cp-ab-btn cp-ab-btn--primary" onClick={goWrite}>{C.hero.cta} <ArrowRight size={16} aria-hidden="true" /></button>
              {wa && <a className="cp-evp-btn-ghost cp-ct-hero__wa" href={wa.href} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true" /> Chat WhatsApp</a>}
            </motion.div>
            <motion.div variants={fade}><OpenNow /></motion.div>
          </motion.div>
        </div>
      </section>

      {/* Form with channels, hours and office beside it. */}
      <section ref={formRef} id="tulis" className="cp-ab-sec cp-sts-sec cp-sts-sec--warm cp-ct-main" aria-labelledby="cp-ct-form-title">
        <div className="cp-ab-wrap cp-ct-main__grid">
          <ContactForm topic={topic} setTopic={setTopic} />
          <aside className="cp-ct-side" aria-label="Saluran langsung">
            <Channels />
            <Hours />
            <Office />
          </aside>
        </div>
      </section>

      <Faq />
    </main>
  );
}

function OpenNow() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 60_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  if (now === null) return <span className="cp-ct-open">Jam layanan Senin–Jumat · WIB</span>;
  const w = wibNow(now);
  const d = C.hours.days[w.day];
  const open = d?.open && w.minutes >= toMin(d.open) && w.minutes < toMin(d.close);
  return (
    <span className={`cp-ct-open ${open ? "is-open" : ""}`}>
      <i aria-hidden="true" /> {open ? `Buka sekarang · sampai ${d.close} WIB` : "Sedang di luar jam layanan · pesan dibalas hari kerja berikutnya"}
    </span>
  );
}

function ContactForm({ topic, setTopic }: { topic: number; setTopic: (i: number) => void }) {
  const [form, setForm] = useState({ name: "", org: "", email: "", whatsapp: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<{ code: string; topic: ContactTopic } | null>(null);
  const t = C.topics[topic];
  const max = 1200;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 3) errs.name = "Isi nama lengkap Anda.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = "Email belum valid.";
    if (form.whatsapp && !/^[+\d][\d\s-]{7,}$/.test(form.whatsapp.trim())) errs.whatsapp = "Nomor WhatsApp belum valid.";
    if (form.message.trim().length < 20) errs.message = "Ceritakan sedikit lebih detail (minimal 20 karakter).";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const code = addMessage({ topic: t.label, name: form.name.trim(), org: form.org.trim(), email: form.email.trim(), whatsapp: form.whatsapp.trim(), message: form.message.trim() });
    setSent({ code, topic: t });
  };

  const field = (key: keyof typeof form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, optional = false) => (
    <label className={`cp-evd-field ${errors[key] ? "has-error" : ""}`}>
      <span>{label} {optional && <em>(opsional)</em>}</span>
      <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} {...props} />
      {errors[key] && <small>{errors[key]}</small>}
    </label>
  );

  return (
    <div className="cp-ct-form">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div key="done" className="cp-ct-done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: EASE }}>
            <span className="cp-ct-done__ico" aria-hidden="true"><CheckCircle2 size={34} /></span>
            <h2 id="cp-ct-form-title">{C.form.successTitle}</h2>
            <p>{C.form.successText}</p>
            <dl className="cp-ct-done__meta">
              <div><dt>Nomor referensi</dt><dd>{sent.code}</dd></div>
              <div><dt>Diteruskan ke</dt><dd>{sent.topic.team}</dd></div>
              <div><dt>Perkiraan balasan</dt><dd>{sent.topic.reply}</dd></div>
            </dl>
            <button type="button" className="cp-evp-btn-ghost" onClick={() => { setSent(null); setForm({ name: "", org: "", email: "", whatsapp: "", message: "" }); }}>Kirim pesan lain</button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <header className="cp-ct-form__head">
              <span className="cp-evd-sec__k">{C.form.tag}</span>
              <h2 id="cp-ct-form-title">{C.form.title} <span>{C.form.accent}</span></h2>
              <p>{C.form.lead}</p>
            </header>
            <fieldset className="cp-ct-topics">
              <legend>Topik</legend>
              {C.topics.map((x, i) => (
                <button key={x.label} type="button" className={topic === i ? "is-on" : ""} aria-pressed={topic === i} onClick={() => setTopic(i)}>
                  {topic === i && <Check size={14} aria-hidden="true" />} {x.label}
                </button>
              ))}
            </fieldset>
            <p className="cp-ct-route"><Users size={14} aria-hidden="true" /> Diteruskan ke <b>{t.team}</b> · balasan {t.reply}</p>
            <div className="cp-ct-grid">
              {field("name", "Nama lengkap", { autoComplete: "name", placeholder: "Dr. Ahmad Rifai" })}
              {field("org", "Institusi", { autoComplete: "organization", placeholder: "Universitas / lembaga" }, true)}
              {field("email", "Email", { type: "email", autoComplete: "email", placeholder: "nama@kampus.ac.id" })}
              {field("whatsapp", "WhatsApp", { type: "tel", autoComplete: "tel", placeholder: "+62 8__ ____ ____" }, true)}
            </div>
            <label className={`cp-evd-field ${errors.message ? "has-error" : ""}`}>
              <span>Pesan <em className="cp-ct-count">{form.message.length}/{max}</em></span>
              <textarea rows={6} maxLength={max} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t.hint} />
              {errors.message && <small>{errors.message}</small>}
            </label>
            <p className="cp-ct-consent">{C.form.consent}</p>
            <button type="submit" className="cp-ab-btn cp-ab-btn--primary cp-ct-submit">{C.form.submit} <Send size={16} aria-hidden="true" /></button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Channels() {
  const [copied, setCopied] = useState("");
  const copy = async (v: string) => {
    try {
      await navigator.clipboard.writeText(v);
      setCopied(v);
      window.setTimeout(() => setCopied(""), 1600);
    } catch {
      // Clipboard blocked.
    }
  };
  return (
    <section className="cp-ct-card is-dark">
      <span className="cp-ct-card__k">Saluran langsung</span>
      <ul className="cp-ct-channels">
        {C.channels.map((c) => {
          const Icon = ICON[c.label] ?? AtSign;
          return (
            <li key={c.label}>
              <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                <span className="cp-ct-channels__ico" aria-hidden="true"><Icon size={17} /></span>
                <span><small>{c.label}</small><strong>{c.value}</strong></span>
              </a>
              <button type="button" onClick={() => copy(c.value)} aria-label={`Salin ${c.label}`}>{copied === c.value ? <Check size={14} /> : <Copy size={14} />}</button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Hours() {
  const [today, setToday] = useState(-1);
  useEffect(() => {
    const t = window.setTimeout(() => setToday(wibNow(Date.now()).day), 0);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <section className="cp-ct-card">
      <span className="cp-ct-card__k"><Clock3 size={14} aria-hidden="true" /> Jam layanan · WIB</span>
      <ul className="cp-ct-hours">
        {C.hours.days.map((d, i) => (
          <li key={d.day} className={`${i === today ? "is-today" : ""} ${d.open ? "" : "is-closed"}`}>
            <span>{d.day}{i === today && <em>Hari ini</em>}</span>
            <b>{d.open ? `${d.open}–${d.close}` : "Tutup"}</b>
          </li>
        ))}
      </ul>
      <p>{C.hours.note}</p>
    </section>
  );
}

function Office() {
  const q = encodeURIComponent(C.location.mapQuery);
  return (
    <section className="cp-ct-card cp-ct-office">
      <span className="cp-ct-card__k"><MapPin size={14} aria-hidden="true" /> {C.location.label}</span>
      <p className="cp-ct-office__addr">{C.location.address}</p>
      <div className="cp-ct-office__map">
        <iframe title="Peta kantor CoPublika" src={`https://www.google.com/maps?q=${q}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
      <Link href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer" className="cp-ct-office__go">Buka di Google Maps <ArrowRight size={14} aria-hidden="true" /></Link>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="cp-ab-sec cp-ct-faq" aria-labelledby="cp-ct-faq-title">
      <div className="cp-ab-wrap cp-ct-faq__wrap">
        <SectionHead tag={C.faq.tag} title={C.faq.title} accent={C.faq.accent} />
        <div className="cp-ct-faq__list">
          {C.faq.items.map((f, i) => (
            <div key={f.q} className={`cp-ct-qa ${open === i ? "is-open" : ""}`}>
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="cp-ct-qa__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="cp-ct-qa__q" id={`cp-ct-q${i}`}>{f.q}</span>
                <ChevronDown size={18} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div className="cp-ct-qa__a" role="region" aria-labelledby={`cp-ct-q${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
