"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, CalendarDays, CalendarPlus, LayoutList, MapPin, Search, Ticket, Users, X } from "lucide-react";
import type { Event } from "@/types";
import { CopublikaMark, MARK_DOT, MARK_RING_PATH, MARK_VIEWBOX } from "@/components/brand/CopublikaMark";
import { SectionHead } from "@/components/program/shared";
import { EVENT_COPY } from "@/lib/content/event";
import { Calendar3D } from "./Calendar3D";
import { EventTable } from "./EventTable";
import { EventMonth } from "./EventMonth";
import { CATEGORIES, categoryOf, dayKey, downloadIcs, isUpcoming, seatsLeft, when } from "./eventMeta";
import { useStagedEvents } from "@/lib/cms/public-staging";

const EASE = [0.22, 1, 0.36, 1] as const;
const line = { hidden: { opacity: 0, y: "100%" }, show: { opacity: 1, y: "0%", transition: { duration: 0.9, ease: EASE } } };
const fade = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };

export function EventsPage({ events: serverEvents }: { events: Event[] }) {
  const reduce = useReducedMotion();
  // Staging: the admin's published events (Agenda Event) replace the built-in list once saved.
  const events = useStagedEvents(serverEvents);
  // Read the clock once per mount; "upcoming" and the countdown are computed from it.
  const [now] = useState(() => Date.now());

  const sorted = useMemo(() => [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [events]);
  const upcoming = sorted.filter((e) => isUpcoming(e, now));
  const [featured, ...rest] = upcoming;
  const todayKey = dayKey(new Date(now).toISOString());

  const [mode, setMode] = useState<"list" | "cal">("list");
  const agendaRef = useRef<HTMLElement>(null);
  const openCalendar = () => {
    setMode("cal");
    requestAnimationFrame(() => agendaRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }));
  };

  const stats = [
    { value: upcoming.length, label: "acara mendatang" },
    { value: upcoming.filter((e) => !e.isPaid).length, label: "gratis" },
    { value: upcoming.reduce((n, e) => n + seatsLeft(e), 0), label: "kursi tersisa" },
  ];

  return (
    <main className="cp-pg cp-sts cp-evp">
      {/* Hero: copy on the left, the interactive 3D calendar on the right. */}
      <section className="cp-sts-hero cp-evp-hero" aria-labelledby="cp-evp-title">
        {/* Warm paper backdrop: the solid brand mark behind the calendar and its outlined ring top-left. */}
        <div className="cp-evp-hero__bg" aria-hidden="true">
          <motion.span className="cp-evp-hero__mark" initial={reduce ? false : { opacity: 0, scale: 0.9, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.4, ease: EASE }}>
            <CopublikaMark />
          </motion.span>
          <svg className="cp-evp-hero__ring" viewBox={MARK_VIEWBOX}><path d={MARK_RING_PATH} /><circle cx={MARK_DOT.x} cy={MARK_DOT.y} r={MARK_DOT.r} /></svg>
          <span className="cp-evp-hero__paper" />
        </div>
        <div className="cp-sts-hero__wrap">
          <motion.div className="cp-sts-hero__copy" initial={reduce ? false : "hidden"} animate="show" variants={{ show: { transition: { staggerChildren: 0.09 } } }}>
            <motion.span className="cp-sts-pill" variants={fade}><i aria-hidden="true" /> {EVENT_COPY.hero.pill}</motion.span>
            <h1 id="cp-evp-title" className="cp-sts-hero__title">
              <span className="cp-sts-mask"><motion.span variants={line}>{EVENT_COPY.hero.title}</motion.span></span>
              <span className="cp-sts-mask"><motion.span variants={line} className="is-accent">{EVENT_COPY.hero.accent}</motion.span></span>
            </h1>
            <motion.p className="cp-sts-hero__lead" variants={fade}>{EVENT_COPY.hero.lead}</motion.p>
            <motion.div className="cp-evp-hero__ctas" variants={fade}>
              <a href="#terdekat" className="cp-ab-btn cp-ab-btn--primary">{EVENT_COPY.hero.ctaPrimary} <ArrowRight size={16} aria-hidden="true" /></a>
              <button type="button" className="cp-evp-btn-ghost" onClick={openCalendar}><CalendarDays size={16} aria-hidden="true" /> {EVENT_COPY.hero.ctaSecondary}</button>
            </motion.div>
            <motion.dl className="cp-bl-stats" variants={fade}>
              {stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>
          <motion.div className="cp-sts-hero__visual cp-evp-hero__visual" initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.25, ease: EASE }}>
            <Calendar3D events={sorted} todayKey={todayKey} />
            <FloatingDates events={upcoming.slice(0, 4)} reduce={!!reduce} />
          </motion.div>
        </div>
      </section>

      {/* Next event: big date tile, details, live countdown and seat meter. */}
      {featured && (
        <section className="cp-ab-sec cp-sts-sec cp-sts-sec--warm cp-evp-next" id="terdekat" aria-labelledby="cp-evp-next-title">
          <div className="cp-ab-wrap">
            <SectionHead {...EVENT_COPY.next} />
            <FeaturedEvent event={featured} now={now} />
            {rest.length > 0 && (
              <div className="cp-evp-after">
                <span className="cp-evp-after__k">Setelah itu</span>
                {rest.slice(0, 3).map((e) => {
                  const w = when(e.date);
                  const c = categoryOf(e);
                  return (
                    <Link key={e.id} href={`/event/${e.slug}`} className="cp-evp-after__item">
                      <span className="cp-evp-after__date"><b>{w.day}</b><small>{w.monthShort}</small></span>
                      <span>
                        <small style={{ color: c.color }}><c.Icon size={12} aria-hidden="true" /> {c.label}</small>
                        <strong>{e.title}</strong>
                      </span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      <Agenda sectionRef={agendaRef} events={rest} all={sorted} mode={mode} setMode={setMode} todayKey={todayKey} />
    </main>
  );
}

/** Upcoming dates as small tiles drifting around the hero calendar. */
function FloatingDates({ events, reduce }: { events: Event[]; reduce: boolean }) {
  return (
    <div className="cp-evp-float" aria-hidden="true">
      {events.map((e, i) => {
        const w = when(e.date);
        const c = categoryOf(e);
        return (
          <motion.span
            key={e.id}
            className={`cp-evp-float__tile is-${i}`}
            style={{ "--c": c.color } as React.CSSProperties}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, -10, 0] }}
            transition={reduce ? undefined : { opacity: { duration: 0.6, delay: 0.6 + i * 0.12 }, y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 } }}
          >
            <b>{w.day}</b>
            <span>
              <small>{w.monthShort}</small>
              <i>{c.label}</i>
            </span>
          </motion.span>
        );
      })}
    </div>
  );
}

function FeaturedEvent({ event, now }: { event: Event; now: number }) {
  const [tick, setTick] = useState<number | null>(null);
  useEffect(() => {
    const id = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const left = Math.max(0, new Date(event.date).getTime() - (tick ?? now));
  const parts = [
    { n: Math.floor(left / 86_400_000), l: "Hari" },
    { n: Math.floor((left / 3_600_000) % 24), l: "Jam" },
    { n: Math.floor((left / 60_000) % 60), l: "Menit" },
    { n: Math.floor((left / 1000) % 60), l: "Detik" },
  ];
  const w = when(event.date);
  const c = categoryOf(event);
  const share = event.capacity ? Math.min(1, event.registrantsCount / event.capacity) : 0;
  const seats = seatsLeft(event);

  return (
    <motion.article className="cp-evp-feat cp-evp-ticket" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7, ease: EASE }}>
      <div className="cp-evp-feat__date" style={{ "--c": c.color } as React.CSSProperties}>
        <span className="cp-evp-ticket__admit">Tiket masuk</span>
        <span className="cp-evp-feat__wd">{w.weekday}</span>
        <b>{w.day}</b>
        <span className="cp-evp-feat__my">{w.month} {w.year}</span>
        <span className="cp-evp-feat__time">{event.time ? `${event.time} WIB` : w.time}</span>
        <span className="cp-evp-ticket__mark" aria-hidden="true"><CopublikaMark /></span>
      </div>
      <span className="cp-evp-ticket__perf is-a" aria-hidden="true" />
      <div className="cp-evp-feat__body">
        <span className="cp-evp-pill" style={{ "--c": c.color } as React.CSSProperties}><c.Icon size={13} aria-hidden="true" /> {c.label}{event.memberOnly ? " · khusus member" : ""}</span>
        <h3 id="cp-evp-next-title">{event.title}</h3>
        <p>{event.description}</p>
        <ul className="cp-evp-feat__facts">
          <li><MapPin size={15} aria-hidden="true" /> {event.location}</li>
          <li><Ticket size={15} aria-hidden="true" /> {event.memberOnly ? "Khusus member" : event.isPaid ? "Berbayar" : "Gratis"}</li>
          {event.speaker?.name && <li><Users size={15} aria-hidden="true" /> {event.speaker.name}</li>}
        </ul>
        <div className="cp-evp-feat__ctas">
          <Link href={`/event/${event.slug}`} className="cp-ab-btn cp-ab-btn--primary">Lihat detail & daftar <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <button type="button" className="cp-evp-btn-ghost" onClick={() => downloadIcs(event, window.location.origin)}>
            <CalendarPlus size={16} aria-hidden="true" /> Tambah ke kalender
          </button>
        </div>
      </div>
      <span className="cp-evp-ticket__perf is-b" aria-hidden="true" />
      <div className="cp-evp-feat__side">
        <span className="cp-evp-feat__k">Dimulai dalam</span>
        <div className="cp-evp-count" role="timer" aria-live="off">
          {parts.map((p) => (
            <div key={p.l}>
              <motion.b key={tick === null ? "s" : p.n} initial={{ y: -8, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
                {tick === null ? "--" : String(p.n).padStart(2, "0")}
              </motion.b>
              <small>{p.l}</small>
            </div>
          ))}
        </div>
        <div className="cp-evp-seats">
          <div className="cp-evp-seats__row">
            <span><b>{event.registrantsCount}</b> terdaftar</span>
            <span className={seats === 0 ? "is-full" : ""}>{seats === 0 ? "Kuota penuh" : `${seats} kursi tersisa`}</span>
          </div>
          <span className="cp-evp-seats__track" aria-hidden="true">
            <motion.i initial={{ width: 0 }} whileInView={{ width: `${share * 100}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE }} />
          </span>
          <small>{Math.round(share * 100)}% dari {event.capacity} kursi</small>
        </div>
        <div className="cp-evp-ticket__code" aria-hidden="true">
          <span className="cp-evp-ticket__bars">
            {Array.from({ length: 34 }, (_, i) => <i key={i} style={{ width: [1, 2, 3, 1, 2][(i * 7 + event.id.length) % 5] }} />)}
          </span>
          <small>CPB · {event.id.replace(/\D/g, "").padStart(4, "0")} · {w.day}{w.monthShort.toUpperCase()}</small>
        </div>
      </div>
    </motion.article>
  );
}

function Agenda({ sectionRef, events, all, mode, setMode, todayKey }: { sectionRef: React.RefObject<HTMLElement | null>; events: Event[]; all: Event[]; mode: "list" | "cal"; setMode: (m: "list" | "cal") => void; todayKey: string }) {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const match = (e: Event) => {
    const s = q.trim().toLowerCase();
    return (cat === "all" || categoryOf(e).id === cat) && (!s || `${e.title} ${e.description} ${e.location} ${e.speaker?.name ?? ""}`.toLowerCase().includes(s));
  };
  const count = (id: string) => events.filter((e) => id === "all" || categoryOf(e).id === id).length;

  return (
    <section ref={sectionRef} className="cp-ab-sec cp-evp-agenda" id="agenda" aria-labelledby="cp-evp-agenda-title">
      <div className="cp-ab-wrap">
        <div className="cp-evp-agenda__head">
          <SectionHead {...EVENT_COPY.agenda} />
        </div>
        <div className="cp-evp-bar">
          <label className="cp-evp-search">
            <Search size={16} aria-hidden="true" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari acara, pembicara, topik…" aria-label="Cari acara" />
            {q && <button type="button" onClick={() => setQ("")} aria-label="Hapus pencarian"><X size={14} /></button>}
          </label>
          <div className="cp-evp-chips" role="group" aria-label="Jenis acara">
            <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")}>Semua <b>{count("all")}</b></button>
            {CATEGORIES.map((c) => (
              <button type="button" key={c.id} aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
                <i style={{ background: c.color }} aria-hidden="true" /> {c.label} <b>{count(c.id)}</b>
              </button>
            ))}
          </div>
          <div className="cp-evp-mode" role="tablist" aria-label="Tampilan">
            <button type="button" role="tab" aria-selected={mode === "list"} onClick={() => setMode("list")}><LayoutList size={15} aria-hidden="true" /> Daftar</button>
            <button type="button" role="tab" aria-selected={mode === "cal"} onClick={() => setMode("cal")}><CalendarDays size={15} aria-hidden="true" /> Kalender</button>
          </div>
        </div>
        {mode === "list" ? <EventTable events={events.filter(match)} /> : <EventMonth events={all.filter(match)} todayKey={todayKey} />}
      </div>
    </section>
  );
}
