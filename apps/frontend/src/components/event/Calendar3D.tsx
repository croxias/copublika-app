"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, MousePointerClick } from "lucide-react";
import type { Event } from "@/types";
import { categoryOf, dayKey, when } from "./eventMeta";

const WEEK = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const pad = (n: number) => String(n).padStart(2, "0");

/** Monday-first cells for a month; null pads the first week. */
function monthCells(y: number, m: number) {
  const lead = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const cells: (string | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= days; d++) cells.push(`${y}-${pad(m + 1)}-${pad(d)}`);
  while (cells.length % 7) cells.push(null);
  return cells;
}

/**
 * Desk calendar in 3D for the event hero: it tilts toward the pointer, flips its page when the
 * month changes, and the orange days open their events in the panel at the bottom.
 */
export function Calendar3D({ events, todayKey }: { events: Event[]; todayKey: string }) {
  const reduce = useReducedMotion();
  const byDay = useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const e of events) {
      const k = dayKey(e.date);
      map.set(k, [...(map.get(k) ?? []), e]);
    }
    return map;
  }, [events]);

  // Open on the month of the next event (or this month).
  const next = events.find((e) => dayKey(e.date) >= todayKey);
  const startKey = next ? dayKey(next.date) : todayKey;
  const [view, setView] = useState({ y: Number(startKey.slice(0, 4)), m: Number(startKey.slice(5, 7)) - 1, dir: 1 });
  const [picked, setPicked] = useState<string>(next ? startKey : "");
  const [hovered, setHovered] = useState<string>("");
  const active = hovered || picked;
  const activeEvents = byDay.get(active) ?? [];

  const go = (dir: 1 | -1) =>
    setView((v) => {
      const m = v.m + dir;
      return { y: v.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12, dir };
    });
  const cells = monthCells(view.y, view.m);
  const monthCount = cells.filter((k) => k && byDay.has(k)).reduce((n, k) => n + (byDay.get(k!)?.length ?? 0), 0);

  // Tilt toward the pointer.
  const box = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [16, 4]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-22, -8]), { stiffness: 120, damping: 18 });
  const onMove = (e: React.PointerEvent) => {
    if (reduce || !box.current) return;
    const r = box.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
    setHovered("");
  };

  return (
    <div ref={box} className="cp-cal3d" onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div className="cp-cal3d__stage" style={reduce ? undefined : { rotateX: rx, rotateY: ry }}>
        <span className="cp-cal3d__sheet is-back2" aria-hidden="true" />
        <span className="cp-cal3d__sheet is-back1" aria-hidden="true" />
        <div className="cp-cal3d__rings" aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => <i key={i} />)}
        </div>

        <div className="cp-cal3d__card">
          <header className="cp-cal3d__head">
            <button type="button" onClick={() => go(-1)} aria-label="Bulan sebelumnya"><ChevronLeft size={18} /></button>
            <div className="cp-cal3d__title" aria-live="polite">
              <strong>{MONTHS[view.m]}</strong>
              <span>{view.y} · {monthCount ? `${monthCount} acara` : "belum ada acara"}</span>
            </div>
            <button type="button" onClick={() => go(1)} aria-label="Bulan berikutnya"><ChevronRight size={18} /></button>
          </header>

          <div className="cp-cal3d__page">
            <AnimatePresence mode="popLayout" initial={false} custom={view.dir}>
              <motion.div
                key={`${view.y}-${view.m}`}
                className="cp-cal3d__grid"
                custom={view.dir}
                initial={reduce ? false : { rotateX: view.dir > 0 ? -80 : 80, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={reduce ? undefined : { rotateX: view.dir > 0 ? 80 : -80, opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: view.dir > 0 ? "50% 0%" : "50% 100%" }}
              >
                {WEEK.map((d) => <span key={d} className="cp-cal3d__wd">{d}</span>)}
                {cells.map((k, i) => {
                  if (!k) return <span key={`x${i}`} />;
                  const evs = byDay.get(k);
                  const cls = [
                    "cp-cal3d__day",
                    evs ? "has-event" : "",
                    k === todayKey ? "is-today" : "",
                    k < todayKey ? "is-past" : "",
                    k === active ? "is-active" : "",
                  ].join(" ");
                  return evs ? (
                    <button
                      key={k}
                      type="button"
                      className={cls}
                      style={{ "--c": categoryOf(evs[0]).color } as React.CSSProperties}
                      onPointerEnter={() => setHovered(k)}
                      onFocus={() => setHovered(k)}
                      onBlur={() => setHovered("")}
                      onClick={() => setPicked(k)}
                      aria-label={`${Number(k.slice(8))} ${MONTHS[view.m]}: ${evs.map((e) => e.title).join(", ")}`}
                    >
                      {Number(k.slice(8))}
                      {evs.length > 1 && <sup>{evs.length}</sup>}
                    </button>
                  ) : (
                    <span key={k} className={cls}>{Number(k.slice(8))}</span>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="cp-cal3d__panel">
            <AnimatePresence mode="wait" initial={false}>
              {activeEvents.length ? (
                <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
                  {activeEvents.slice(0, 2).map((e) => {
                    const w = when(e.date);
                    const c = categoryOf(e);
                    return (
                      <Link key={e.id} href={`/event/${e.slug}`} className="cp-cal3d__event">
                        <span className="cp-cal3d__date" style={{ background: c.color }}>
                          <b>{w.day}</b>
                          <small>{w.monthShort}</small>
                        </span>
                        <span className="cp-cal3d__info">
                          <small><c.Icon size={12} aria-hidden="true" /> {c.label} · {w.time}</small>
                          <strong>{e.title}</strong>
                        </span>
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </Link>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.p key="hint" className="cp-cal3d__hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <MousePointerClick size={15} aria-hidden="true" /> Arahkan ke tanggal berwarna untuk melihat acaranya.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
