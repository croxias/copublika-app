"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CalendarCheck2, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import type { Event } from "@/types";
import { CATEGORIES, categoryOf, dayKey, when } from "./eventMeta";

const WEEK = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const pad = (n: number) => String(n).padStart(2, "0");

function monthCells(y: number, m: number) {
  const lead = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const prevDays = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: { key: string; day: number; out: boolean }[] = [];
  for (let i = lead; i > 0; i--) cells.push({ key: `p${i}`, day: prevDays - i + 1, out: true });
  for (let d = 1; d <= days; d++) cells.push({ key: `${y}-${pad(m + 1)}-${pad(d)}`, day: d, out: false });
  let n = 1;
  while (cells.length % 7) cells.push({ key: `n${n}`, day: n++, out: true });
  return cells;
}

/** Month view: event chips in the grid and the picked day's events in a side panel. */
export function EventMonth({ events, todayKey }: { events: Event[]; todayKey: string }) {
  const byDay = useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const e of events) map.set(dayKey(e.date), [...(map.get(dayKey(e.date)) ?? []), e]);
    return map;
  }, [events]);
  const next = events.find((e) => dayKey(e.date) >= todayKey);
  const start = next ? dayKey(next.date) : todayKey;
  const [view, setView] = useState({ y: Number(start.slice(0, 4)), m: Number(start.slice(5, 7)) - 1 });
  const [picked, setPicked] = useState(next ? start : todayKey);

  const go = (dir: number) =>
    setView((v) => {
      const m = v.m + dir;
      return { y: v.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
    });
  const goToday = () => {
    setView({ y: Number(todayKey.slice(0, 4)), m: Number(todayKey.slice(5, 7)) - 1 });
    setPicked(todayKey);
  };

  const cells = monthCells(view.y, view.m);
  const prefix = `${view.y}-${pad(view.m + 1)}`;
  const monthEvents = events.filter((e) => dayKey(e.date).startsWith(prefix));
  const pickedEvents = byDay.get(picked) ?? [];
  const pickedInView = picked.startsWith(prefix);
  const sideEvents = pickedInView && pickedEvents.length ? pickedEvents : monthEvents;
  const sideTitle = pickedInView && pickedEvents.length
    ? `${Number(picked.slice(8))} ${MONTHS[view.m]}`
    : `Semua acara ${MONTHS[view.m]}`;

  return (
    <div className="cp-evp-month">
      <div className="cp-evp-month__main">
        <header className="cp-evp-month__head">
          <div>
            <strong>{MONTHS[view.m]} <span>{view.y}</span></strong>
            <small>{monthEvents.length ? `${monthEvents.length} acara bulan ini` : "Belum ada acara bulan ini"}</small>
          </div>
          <div className="cp-evp-month__nav">
            <button type="button" className="is-today" onClick={goToday}>Hari ini</button>
            <button type="button" onClick={() => go(-1)} aria-label="Bulan sebelumnya"><ChevronLeft size={17} /></button>
            <button type="button" onClick={() => go(1)} aria-label="Bulan berikutnya"><ChevronRight size={17} /></button>
          </div>
        </header>
        <div className="cp-evp-month__week">{WEEK.map((d) => <span key={d}><b>{d.slice(0, 3)}</b><i>{d}</i></span>)}</div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={prefix} className="cp-evp-month__grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28 }}>
            {cells.map((c) => {
              if (c.out) return <span key={c.key} className="cp-evp-cell is-out"><em>{c.day}</em></span>;
              const evs = byDay.get(c.key) ?? [];
              const cls = ["cp-evp-cell", evs.length ? "has-event" : "", c.key === todayKey ? "is-today" : "", c.key === picked ? "is-picked" : "", c.key < todayKey ? "is-past" : ""].join(" ");
              return (
                <button key={c.key} type="button" className={cls} onClick={() => setPicked(c.key)} aria-pressed={c.key === picked} aria-label={`${c.day} ${MONTHS[view.m]}${evs.length ? `, ${evs.length} acara` : ""}`}>
                  <em>{c.day}</em>
                  {evs.slice(0, 2).map((e) => {
                    const cat = categoryOf(e);
                    return (
                      <span key={e.id} className="cp-evp-chip" style={{ "--c": cat.color } as React.CSSProperties}>
                        <small>{when(e.date).time.replace(" WIB", "")}</small> {e.title}
                      </span>
                    );
                  })}
                  {evs.length > 2 && <span className="cp-evp-more">+{evs.length - 2} lagi</span>}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
        <div className="cp-evp-legend">
          {CATEGORIES.map((c) => <span key={c.id}><i style={{ background: c.color }} aria-hidden="true" /> {c.label}</span>)}
        </div>
      </div>

      <aside className="cp-evp-month__side" aria-label="Acara pada tanggal terpilih">
        <span className="cp-evp-month__k"><CalendarCheck2 size={15} aria-hidden="true" /> {sideTitle}</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul key={`${prefix}-${picked}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
            {sideEvents.length ? (
              sideEvents.map((e) => {
                const w = when(e.date);
                const cat = categoryOf(e);
                return (
                  <li key={e.id}>
                    <Link href={`/event/${e.slug}`} className="cp-evp-side-ev" style={{ "--c": cat.color } as React.CSSProperties}>
                      <span className="cp-evp-side-ev__date"><b>{w.day}</b><small>{w.monthShort}</small></span>
                      <span className="cp-evp-side-ev__body">
                        <small><cat.Icon size={12} aria-hidden="true" /> {cat.label} · {w.time}</small>
                        <strong>{e.title}</strong>
                        <em><MapPin size={12} aria-hidden="true" /> {e.location}</em>
                      </span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  </li>
                );
              })
            ) : (
              <li className="cp-evp-side-empty">Tidak ada acara di bulan ini. Gunakan panah untuk melihat bulan lain.</li>
            )}
          </motion.ul>
        </AnimatePresence>
      </aside>
    </div>
  );
}
