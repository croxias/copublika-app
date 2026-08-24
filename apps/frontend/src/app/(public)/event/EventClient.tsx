"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import type { Event } from "@/types";

interface EventClientProps {
  events: Event[];
}

const DAYS_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const PAGE_SIZE = 5;

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: DAYS_ID[d.getDay()],
    date: d.getDate(),
    month: MONTHS_ID[d.getMonth()],
    year: d.getFullYear(),
    time: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" }),
  };
}

function TypeBadge({ type }: { type?: string }) {
  const cls = type || "all";
  const label = cls.charAt(0).toUpperCase() + cls.slice(1);
  return <span className={`td-type ${cls}`}>{label}</span>;
}

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: active ? 1 : 0.3 }}>
      {dir === "asc" ? (
        <path d="M5 2L8 6H2L5 2Z" fill="currentColor" />
      ) : (
        <path d="M5 8L2 4H8L5 8Z" fill="currentColor" />
      )}
    </svg>
  );
}

function EventTable({ events }: { events: Event[] }) {
  const [sortKey, setSortKey] = useState<"date" | "title" | "location">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    return [...events].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "date") {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortKey === "title") {
        cmp = a.title.localeCompare(b.title);
      } else {
        cmp = a.location.localeCompare(b.location);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [events, sortKey, sortDir]);

  function handleSort(key: "date" | "title" | "location") {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div className="cp-ev-table-wrap">
      <table className="cp-ev-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("date")}>
              Tanggal & Waktu
              <SortIcon active={sortKey === "date"} dir={sortDir} />
            </th>
            <th>Jenis</th>
            <th onClick={() => handleSort("title")}>
              Acara
              <SortIcon active={sortKey === "title"} dir={sortDir} />
            </th>
            <th onClick={() => handleSort("location")}>
              Lokasi
              <SortIcon active={sortKey === "location"} dir={sortDir} />
            </th>
            <th style={{ width: "80px", textAlign: "center" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "48px", color: "var(--mute)" }}>
                Tidak ada acara ditemukan.
              </td>
            </tr>
          ) : (
            sorted.map((event) => {
              const { day, date, month, year, time } = formatEventDate(event.date);
              return (
                <tr key={event.id} style={{ cursor: "pointer" }}>
                  <td>
                    <div className="td-when">
                      <span className="day">{day}, {date} {month} {year}</span>
                      {time}
                    </div>
                  </td>
                  <td><TypeBadge type={event.type} /></td>
                  <td>
                    <span className="td-title">{event.title}</span>
                    <span className="td-sub">{event.speaker?.name || ""}</span>
                  </td>
                  <td>
                    <span className="td-loc">{event.location}</span>
                  </td>
                  <td className="td-action">
                    <Link
                      href={`/event/${event.slug}`}
                      aria-label={`Lihat ${event.title}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function Pagination({ total, page, onChange }: { total: number; page: number; onChange: (p: number) => void }) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="cp-ev-pag">
      <button onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="cp-ev-pag__dots">…</span>
        ) : (
          <button
            key={p}
            className={p === page ? "active" : ""}
            onClick={() => onChange(p as number)}
          >
            {p}
          </button>
        )
      )}
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages} aria-label="Next">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

function FeaturedEvent({ event }: { event: Event }) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(event.date).getTime();
    function tick() {
      const diff = Math.max(0, target - Date.now());
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [event.date]);

  const { date, month, year, time } = formatEventDate(event.date);
  const filled = event.capacity > 0 ? Math.round((event.registrantsCount / event.capacity) * 100) : 0;

  return (
    <Reveal className="cp-ev-featured">
      <div className="cp-ev-featured__left">
        <div className="cp-ev-featured__tag">Acara berikutnya · Pendaftaran dibuka</div>
        <h2>{event.title}</h2>
        <p className="cp-ev-featured__lead">{event.description}</p>
        <div className="cp-ev-featured__meta">
          <div><span className="l">Tanggal</span><span className="v">{date} {month} {year}</span></div>
          <div><span className="l">Waktu</span><span className="v">{time || "19.30 WIB"}</span></div>
          <div><span className="l">Format</span><span className="v">{event.format || event.location}</span></div>
          <div><span className="l">Biaya</span><span className="v">{event.isPaid ? " Berbayar" : "Gratis untuk anggota"}</span></div>
        </div>
        <div className="cp-ev-featured__ctas">
          <Link href={`/event/${event.slug}`} className="cp-ev-featured__btn--detail">
            Lihat Detail
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <span className="cp-ev-featured__btn--cal" role="button" tabIndex={0}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Tambah ke Kalender
          </span>
        </div>
      </div>
      <div className="cp-ev-featured__right">
        <div>
          <div className="cp-ev-featured__tag" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", marginBottom: "16px" }}>
            Hitung mundur
          </div>
          <div className="cp-ev-countdown">
            {[
              { n: String(countdown.days).padStart(2, "0"), l: "Hari" },
              { n: String(countdown.hours).padStart(2, "0"), l: "Jam" },
              { n: String(countdown.minutes).padStart(2, "0"), l: "Menit" },
              { n: String(countdown.seconds).padStart(2, "0"), l: "Detik" },
            ].map(({ n, l }) => (
              <div className="cp-ev-cd" key={l}>
                <div className="n">{n}</div>
                <div className="l">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="cp-ev-stats">
            <div><strong>{event.registrantsCount}</strong><span>Terdaftar</span></div>
            <div><strong>{event.capacity - event.registrantsCount}</strong><span>Tersisa</span></div>
            <div><strong>{filled}%</strong><span>Kapasitas</span></div>
          </div>
          <div className="cp-ev-capbar">
            <div className="cp-ev-capbar__fill" style={{ width: `${filled}%` }} />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function EventClient({ events }: EventClientProps) {
  const [mode, setMode] = useState<"list" | "cal">("list");
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const upcomingEvents = events.filter((e) => e.status !== "ended");
  const featured = upcomingEvents[0];
  const restEvents = upcomingEvents.slice(1);

  const filtered = restEvents.filter((e) => {
    const matchCat = filter === "all" || e.category === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      (e.speaker?.name || "").toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const counts: Record<string, number> = { all: restEvents.length };
  restEvents.forEach((e) => {
    const c = e.category || "all";
    counts[c] = (counts[c] || 0) + 1;
  });

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      {featured && <FeaturedEvent event={featured} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <Reveal>
          <div className="cp-section__eyebrow">
            <span className="cp-mono" style={{ color: "var(--scopus)" }}>E.01</span>
            <span className="cp-mono">{restEvents.length} acara mendatang.</span>
          </div>
          <h2 className="cp-section__title">
            Agenda <span className="cp-section__title-mute">berkelanjutan.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="cp-ev-mode-tabs">
            {(["list", "cal"] as const).map((m) => (
              <button
                key={m}
                className={`cp-ev-mode-tab${mode === m ? " active" : ""}`}
                onClick={() => setMode(m)}
              >
                {m === "list" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                )}
                {m === "list" ? "Daftar" : "Kalender"}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {mode === "list" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div className="cp-ev-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Cari acara, pembicara, topik..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Cari acara"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mute)", padding: 0, display: "flex" }}
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            <div className="cp-ev-filter">
              {(["all", "webinar", "workshop", "clinic", "forum"] as const).map((cat) => (
                <button
                  key={cat}
                  className={`cp-ev-chip${filter === cat ? " active" : ""}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat === "all" ? "Semua" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  <span className="ct">{counts[cat] || 0}</span>
                </button>
              ))}
            </div>
          </div>

          <Reveal>
            <EventTable events={paged} />
          </Reveal>

          {filtered.length > PAGE_SIZE && (
            <Pagination total={filtered.length} page={page} onChange={setPage} />
          )}
        </>
      )}

      {mode === "cal" && (
        <EventCalendar events={upcomingEvents} />
      )}
    </>
  );
}

function EventCalendar({ events }: { events: Event[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const today = new Date();

  const eventMap: Record<string, Event[]> = {};
  events.forEach((e) => {
    const d = new Date(e.date);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!eventMap[key]) eventMap[key] = [];
    eventMap[key].push(e);
  });

  const cells: { day: number; out: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, out: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, out: false });
  const trailing = (7 - (cells.length % 7)) % 7;
  for (let i = 1; i <= trailing; i++) cells.push({ day: i, out: true });

  return (
    <div>
      <div className="cp-ev-cal-head">
        <div className="cp-ev-cal-month">
          {MONTHS_ID[month]} <span className="yr">{year}</span>
        </div>
        <div className="cp-ev-cal-nav">
          <button onClick={() => setCurrentDate((p) => new Date(p.getFullYear(), p.getMonth() - 1, 1))} aria-label="Previous month">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={() => setCurrentDate((p) => new Date(p.getFullYear(), p.getMonth() + 1, 1))} aria-label="Next month">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <div className="cp-ev-cal-grid">
        {DAYS_ID.map((d) => (
          <div key={d} className="cp-ev-cal-dayname">{d}</div>
        ))}
        {cells.map((cell, i) => {
          const isToday = !cell.out && today.getDate() === cell.day && today.getMonth() === month && today.getFullYear() === year;
          const dayEvents = !cell.out ? (eventMap[`${year}-${month}-${cell.day}`] || []) : [];
          return (
            <div key={i} className={`cp-ev-cal-day${cell.out ? " out" : ""}${isToday ? " today" : ""}`}>
              <div className="dnum">{cell.day}</div>
              {dayEvents.slice(0, 2).map((e) => (
                <Link key={e.id} href={`/event/${e.slug}`} className={`cp-ev-cal-dot ${e.category || ""}`}>
                  {e.title.length > 18 ? e.title.slice(0, 18) + "…" : e.title}
                </Link>
              ))}
              {dayEvents.length > 2 && <span className="cp-ev-cal-more">+{dayEvents.length - 2} lagi</span>}
            </div>
          );
        })}
      </div>
      <div className="cp-ev-cal-legend">
        <span className="item"><span className="swatch" style={{ background: "var(--scopus)" }} />Klinik / Workshop</span>
        <span className="item"><span className="swatch" style={{ background: "#075985" }} />Webinar</span>
        <span className="item"><span className="swatch" style={{ background: "#166534" }} />Forum</span>
      </div>
    </div>
  );
}
