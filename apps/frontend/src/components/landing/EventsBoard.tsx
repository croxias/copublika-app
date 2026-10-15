"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";

export type LandingEvent = {
  /** yyyy-mm-dd, read as a calendar date (no time zone). */
  date: string;
  title: string;
  sub: string;
  where: string;
  status: string;
};

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const parse = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: m - 1, d };
};

/** Day cells for a Monday-first month grid; null pads the leading weekdays. */
function monthGrid(y: number, m: number): (number | null)[] {
  const lead = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  return [...Array<null>(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
}

export function EventsBoard({ events }: { events: LandingEvent[] }) {
  const [active, setActive] = useState(0);
  const current = parse(events[active].date);
  const cells = monthGrid(current.y, current.m);
  // Days in the shown month that have an event, mapped to that event's index.
  const marked = new Map<number, number>();
  events.forEach((e, i) => {
    const p = parse(e.date);
    if (p.y === current.y && p.m === current.m) marked.set(p.d, i);
  });

  const months = Array.from(new Set(events.map((e) => e.date.slice(0, 7))));
  const monthIdx = months.indexOf(events[active].date.slice(0, 7));
  const jumpMonth = (dir: 1 | -1) => {
    const target = months[monthIdx + dir];
    if (target) setActive(events.findIndex((e) => e.date.startsWith(target)));
  };

  return (
    <div className="cp-evb">
      <aside className="cp-cal" aria-label="Kalender acara" data-reveal>
        <div className="cp-cal__head">
          <p className="cp-cal__month">
            {MONTHS[current.m]} <span>{current.y}</span>
          </p>
          <div className="cp-cal__nav">
            <button type="button" onClick={() => jumpMonth(-1)} disabled={monthIdx <= 0} aria-label="Bulan sebelumnya">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button type="button" onClick={() => jumpMonth(1)} disabled={monthIdx >= months.length - 1} aria-label="Bulan berikutnya">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
        <div className="cp-cal__grid" key={`${current.y}-${current.m}`}>
          {WEEKDAYS.map((w) => (
            <span key={w} className="cp-cal__wd">
              {w}
            </span>
          ))}
          {cells.map((d, i) =>
            d === null ? (
              <span key={`pad-${i}`} />
            ) : marked.has(d) ? (
              <button
                key={d}
                type="button"
                className="cp-cal__day cp-cal__day--event"
                data-active={marked.get(d) === active}
                onClick={() => setActive(marked.get(d)!)}
                aria-label={`${d} ${MONTHS[current.m]}: ${events[marked.get(d)!].title}`}
              >
                {d}
              </button>
            ) : (
              <span key={d} className="cp-cal__day">
                {d}
              </span>
            ),
          )}
        </div>
        <div className="cp-cal__foot">
          <span className="cp-cal__dot" aria-hidden="true" />
          <span>{events.length} acara terjadwal</span>
        </div>
      </aside>

      <ol className="cp-evlist">
        {events.map((e, i) => {
          const p = parse(e.date);
          return (
            <li key={e.title} data-reveal style={{ "--i": i } as CSSProperties}>
              <Link
                href="/event"
                className="cp-ev"
                data-active={i === active}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className="cp-ev__leaf" aria-hidden="true">
                  <span className="cp-ev__leaf-m">{MONTHS[p.m].slice(0, 3)}</span>
                  <span className="cp-ev__leaf-d">{p.d}</span>
                </span>
                <span className="cp-ev__info">
                  <span className="cp-ev__status" data-soon={e.status === "Segera"}>
                    {e.status}
                  </span>
                  <span className="cp-ev__title">{e.title}</span>
                  <span className="cp-ev__sub">{e.sub}</span>
                </span>
                <span className="cp-ev__where">{e.where}</span>
                <span className="cp-ev__go" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
