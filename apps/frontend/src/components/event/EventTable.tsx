"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, ArrowUpDown, ArrowUpRight, ChevronLeft, ChevronRight, Globe, MapPin, MonitorSmartphone } from "lucide-react";
import type { Event } from "@/types";
import { categoryOf, seatsLeft, when } from "./eventMeta";

const PAGE = 4;
type Sort = { key: "date" | "title" | "seats"; dir: 1 | -1 };

const initials = (name = "") => name.replace(/^(dr|prof)\.?\s+/i, "").split(/[\s,]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

function placeOf(e: Event) {
  const l = `${e.format ?? ""} ${e.location}`.toLowerCase();
  if (l.includes("hybrid")) return { Icon: MonitorSmartphone, kind: "Hybrid" };
  if (l.includes("daring") || l.includes("zoom") || l.includes("webinar") || l.includes("online")) return { Icon: Globe, kind: "Daring" };
  return { Icon: MapPin, kind: "Luring" };
}

/** Header cell; sortable when it has a key. */
function Th({ k, sort, onSort, children, className = "" }: { k?: Sort["key"]; sort: Sort; onSort: (k: Sort["key"]) => void; children: React.ReactNode; className?: string }) {
  if (!k) return <th className={className}>{children}</th>;
  return (
    <th className={className} aria-sort={sort.key === k ? (sort.dir > 0 ? "ascending" : "descending") : "none"}>
      <button type="button" onClick={() => onSort(k)}>
        {children}
        {sort.key === k ? (sort.dir > 0 ? <ArrowUp size={13} /> : <ArrowDown size={13} />) : <ArrowUpDown size={13} className="is-idle" />}
      </button>
    </th>
  );
}

/** Upcoming events as a table: date tile, event and speaker, type, place, seats, and a link. */
export function EventTable({ events }: { events: Event[] }) {
  const [sort, setSort] = useState<Sort>({ key: "date", dir: 1 });
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const v = (e: Event) => (sort.key === "date" ? new Date(e.date).getTime() : sort.key === "seats" ? seatsLeft(e) : e.title.toLowerCase());
    return [...events].sort((a, b) => (v(a) > v(b) ? 1 : v(a) < v(b) ? -1 : 0) * sort.dir);
  }, [events, sort]);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const current = Math.min(page, pages);
  const shown = rows.slice((current - 1) * PAGE, current * PAGE);

  const sortBy = (key: Sort["key"]) => {
    setSort((s) => ({ key, dir: s.key === key ? ((s.dir * -1) as 1 | -1) : 1 }));
    setPage(1);
  };
  return (
    <div className="cp-evp-table">
      <table>
        <thead>
          <tr>
            <Th sort={sort} onSort={sortBy} k="date" className="is-date">Tanggal</Th>
            <Th sort={sort} onSort={sortBy} k="title">Acara</Th>
            <Th sort={sort} onSort={sortBy} className="is-type">Jenis</Th>
            <Th sort={sort} onSort={sortBy} className="is-place">Tempat</Th>
            <Th sort={sort} onSort={sortBy} k="seats" className="is-seats">Kuota</Th>
            <Th sort={sort} onSort={sortBy} className="is-go"><span className="cp-sr">Buka</span></Th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false} mode="popLayout">
            {shown.map((e, i) => {
              const w = when(e.date);
              const c = categoryOf(e);
              const p = placeOf(e);
              const left = seatsLeft(e);
              const share = e.capacity ? Math.min(1, e.registrantsCount / e.capacity) : 0;
              return (
                <motion.tr key={e.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }} style={{ "--c": c.color } as React.CSSProperties}>
                  <td className="is-date">
                    <span className="cp-evp-dt">
                      <b>{w.day}</b>
                      <span><strong>{w.monthShort} {w.year}</strong><small>{w.weekdayShort} · {e.time ? e.time.split(/\s*[—-]\s*/)[0] : w.time.replace(" WIB", "")} WIB</small></span>
                    </span>
                  </td>
                  <td className="is-title">
                    <Link href={`/event/${e.slug}`} className="cp-evp-row-link">{e.title}</Link>
                    {e.speaker?.name && (
                      <span className="cp-evp-speaker"><i aria-hidden="true">{initials(e.speaker.name)}</i>{e.speaker.name}</span>
                    )}
                  </td>
                  <td className="is-type"><span className="cp-evp-pill"><c.Icon size={13} aria-hidden="true" /> {c.label}</span></td>
                  <td className="is-place">
                    <span className="cp-evp-place"><p.Icon size={15} aria-hidden="true" /><span><strong>{p.kind}</strong><small>{e.location.replace(/^(Daring|Luring|Hybrid)\s*·\s*/i, "")}</small></span></span>
                  </td>
                  <td className="is-seats">
                    <span className={`cp-evp-quota ${left === 0 ? "is-full" : left <= 10 ? "is-low" : ""}`}>
                      <span>{left === 0 ? "Penuh" : `${left} tersisa`}</span>
                      <i aria-hidden="true"><b style={{ width: `${share * 100}%` }} /></i>
                    </span>
                  </td>
                  <td className="is-go"><span className="cp-evp-go" aria-hidden="true"><ArrowUpRight size={17} /></span></td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
      {!rows.length && <p className="cp-evp-empty">Tidak ada acara yang cocok. Coba kata kunci atau jenis acara lain.</p>}
      {rows.length > 0 && (
        <div className="cp-evp-table__foot">
          <span>Menampilkan {(current - 1) * PAGE + 1}–{(current - 1) * PAGE + shown.length} dari {rows.length} acara</span>
          {(
            <nav className="cp-evp-pager" aria-label="Halaman agenda">
              <button type="button" disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="Sebelumnya"><ChevronLeft size={16} /></button>
              {Array.from({ length: pages }, (_, n) => (
                <button type="button" key={n} aria-current={current === n + 1 ? "page" : undefined} onClick={() => setPage(n + 1)}>{n + 1}</button>
              ))}
              <button type="button" disabled={current === pages} onClick={() => setPage(current + 1)} aria-label="Berikutnya"><ChevronRight size={16} /></button>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
