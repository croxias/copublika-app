"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Building2, Search, X } from "lucide-react";
import type { Mentor } from "@/lib/content/about";
import { Pager } from "./Pager";
import { SocialLinks } from "./SocialLinks";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Searchable, filterable, paginated grid of mentors; a card opens the full profile. */
export function MentorDirectory({ mentors, perPage = 8 }: { mentors: Mentor[]; perPage?: number }) {
  const reduce = useReducedMotion();
  const [field, setField] = useState("Semua");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<Mentor | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const fields = useMemo(() => ["Semua", ...Array.from(new Set(mentors.map((m) => m.field))).sort((a, b) => (a === "Lainnya" ? 1 : b === "Lainnya" ? -1 : a.localeCompare(b)))], [mentors]);
  const filtered = mentors.filter((m) => (field === "Semua" || m.field === field) && (!q || `${m.name} ${m.expertise} ${m.affiliation ?? ""} ${(m.topics ?? []).join(" ")}`.toLowerCase().includes(q.toLowerCase())));
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pages - 1);
  const shown = filtered.slice(safePage * perPage, safePage * perPage + perPage);

  const goPage = (p: number) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="cp-ab-dir" ref={topRef}>
      <div className="cp-ab-dir__bar">
        <div className="cp-ab-dir__chips" role="tablist" aria-label="Bidang">
          {fields.map((f) => (
            <button key={f} type="button" role="tab" aria-selected={field === f} className={`cp-ab-chip ${field === f ? "is-active" : ""}`} onClick={() => { setField(f); setPage(0); }}>
              {f}
              <span>{f === "Semua" ? mentors.length : mentors.filter((m) => m.field === f).length}</span>
            </button>
          ))}
        </div>
        <label className="cp-ab-dir__search">
          <Search size={15} aria-hidden="true" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Cari nama, kampus, atau topik…" aria-label="Cari mentor" />
        </label>
      </div>

      <motion.div layout={!reduce} className="cp-ab-dir__grid">
        <AnimatePresence mode="popLayout">
          {shown.map((m, i) => (
            <motion.button
              type="button"
              key={m.name}
              layout={!reduce}
              className="cp-ab-mentor"
              onClick={() => setOpen(m)}
              initial={reduce ? false : { opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.45, delay: i * 0.04, ease: EASE }}
              whileHover={reduce ? undefined : { y: -6 }}
              aria-label={`Lihat profil ${m.name}`}
            >
              <div className="cp-ab-mentor__ph">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.photo} alt="" loading="lazy" />
                <span className="cp-ab-mentor__badge">{m.badge}</span>
                <span className="cp-ab-mentor__view">Lihat profil →</span>
              </div>
              <div className="cp-ab-mentor__body">
                <span className="cp-ab-mentor__field">{m.field}</span>
                <h3 className="cp-ab-mentor__name">{m.name}</h3>
                {m.affiliation && <p className="cp-ab-mentor__aff"><Building2 size={13} /> {m.affiliation}</p>}
                {m.metric && <span className="cp-ab-mentor__metric">{m.metric}</span>}
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>
      {!filtered.length && <p className="cp-ab-dir__empty">Belum ada mentor yang cocok. Coba bidang atau kata kunci lain.</p>}

      <Pager page={safePage} pages={pages} onPage={goPage} label="Halaman mentor" />

      <MentorProfile mentor={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function MentorProfile({ mentor, onClose }: { mentor: Mentor | null; onClose: () => void }) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!mentor) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mentor, onClose]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {mentor && (
        <motion.div className="cp-mp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="cp-mp__backdrop" onClick={onClose} aria-hidden="true" />
          <motion.div
            className="cp-mp__card"
            role="dialog"
            aria-modal="true"
            aria-label={`Profil ${mentor.name}`}
            initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <button ref={closeRef} type="button" className="cp-mp__close" onClick={onClose} aria-label="Tutup profil"><X size={18} /></button>
            <div className="cp-mp__photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mentor.photo} alt={`Foto ${mentor.name}`} />
              <span className="cp-mp__badge">{mentor.badge}</span>
            </div>
            <div className="cp-mp__body">
              <span className="cp-mp__field">{mentor.field}</span>
              <h2>{mentor.name}</h2>
              {mentor.affiliation && <p className="cp-mp__aff"><Building2 size={15} /> {mentor.affiliation}</p>}
              <dl className="cp-mp__facts">
                {mentor.expertise && (
                  <div>
                    <dt>Keahlian</dt>
                    <dd>{mentor.expertise}</dd>
                  </div>
                )}
                {mentor.metric && (
                  <div>
                    <dt>Rekam jejak</dt>
                    <dd>{mentor.metric}</dd>
                  </div>
                )}
                <div>
                  <dt>Peran di CoPublika</dt>
                  <dd>{mentor.role}</dd>
                </div>
              </dl>
              {mentor.bio && <p className="cp-mp__bio">{mentor.bio}</p>}
              {!!mentor.topics?.length && (
                <div className="cp-mp__topics">
                  <p>Bisa mendampingi</p>
                  <ul>
                    {mentor.topics.map((t) => (
                      <li key={t}><BadgeCheck size={14} /> {t}</li>
                    ))}
                  </ul>
                </div>
              )}
              <SocialLinks name={mentor.name} linkedin={mentor.linkedinUrl} instagram={mentor.instagramUrl} email={mentor.email} size={40} className="cp-mp__social" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
