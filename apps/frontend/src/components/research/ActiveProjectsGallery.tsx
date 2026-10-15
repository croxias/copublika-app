"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookOpen, Calendar, Lock, Search, Users, X } from "lucide-react";
import { Reveal } from "@/components/about/motion";
import { ACTIVE_PROJECTS, type ActiveProject } from "@/lib/data/active-projects";
import { PHASES, STATUS_ID, formatMonth, initials, personPhoto, phaseIndex, teamSize } from "@/lib/content/research";
import { Pager } from "./Pager";
import { onResearchFocus } from "./events";
import { authClient } from "@/lib/auth-client";

/** Section text; also the admin seed for "Halaman Riset → Galeri proyek". */
export const GALLERY_COPY = {
  tag: "Proyek aktif",
  heading: "Sedang berjalan",
  headingAccent: "di komunitas.",
  sub: "Setiap proyek dipimpin anggota dan terbuka untuk kolaborator. Pilih yang sesuai bidang Anda, lalu buka detailnya untuk melihat metodologi dan target jurnal.",
};

const FILTERS = [
  { id: "all", label: "Semua" },
  { id: "recruiting", label: STATUS_ID.recruiting },
  { id: "writing", label: STATUS_ID.writing },
  { id: "review", label: STATUS_ID.review },
  { id: "submitted", label: STATUS_ID.submitted },
] as const;

const SORTS = [
  { id: "new", label: "Terbaru dimulai" },
  { id: "old", label: "Terlama dimulai" },
  { id: "title", label: "Judul A–Z" },
] as const;
type SortId = (typeof SORTS)[number]["id"];

const PER_PAGE = 3;
const LOCKED_TEASER = "Desain penelitian, populasi dan sampel, instrumen, serta teknik analisis data tersedia lengkap untuk anggota.";
const EASE = [0.22, 1, 0.36, 1] as const;

export function ActiveProjectsGallery() {
  const reduce = useReducedMotion();
  const { data: session } = authClient.useSession();
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<string>("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortId>("new");
  const [page, setPage] = useState(1);

  useEffect(
    () =>
      onResearchFocus((d) => {
        if (d.target !== "projects") return;
        setStatus(d.status);
        setQ("");
        setPage(1);
      }),
    [],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = ACTIVE_PROJECTS.filter((p) => status === "all" || p.status === status).filter(
      (p) => !needle || `${p.title} ${p.cluster} ${p.lead} ${p.tags.join(" ")}`.toLowerCase().includes(needle),
    );
    return [...list].sort((a, b) =>
      sort === "title" ? a.title.localeCompare(b.title) : sort === "new" ? b.startedAt.localeCompare(a.startedAt) : a.startedAt.localeCompare(b.startedAt),
    );
  }, [status, q, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const goTo = (n: number) => {
    setPage(n);
    sectionRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };
  const reset = () => {
    setStatus("all");
    setQ("");
    setPage(1);
  };

  return (
    <section ref={sectionRef} className="cp-ab-sec cp-rg" id="proyek">
      <div className="cp-rg__bg" aria-hidden="true">
        <span className="cp-rg__grid-bg" />
        <span className="cp-rg__blob cp-rg__blob--a" />
        <span className="cp-rg__blob cp-rg__blob--b" />
      </div>
      <div className="cp-ab-wrap">
        <Reveal className="cp-ab-headcol">
          <div className="cp-ab-tag">
            <span className="cp-ab-tag__bar" aria-hidden="true" />
            <span>{GALLERY_COPY.tag}</span>
          </div>
          <h2 className="cp-ab-h2 cp-ab-h2--line">
            {GALLERY_COPY.heading} <span className="cp-ab-accent">{GALLERY_COPY.headingAccent}</span>
          </h2>
          <p className="cp-ab-headcol__lead">
            {GALLERY_COPY.sub}
          </p>
        </Reveal>

        <div className="cp-rg__bar">
          <div className="cp-rg__chips" role="group" aria-label="Filter status proyek">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={status === f.id}
                className={`cp-rg__chip ${status === f.id ? "is-active" : ""}`}
                onClick={() => {
                  setStatus(f.id);
                  setPage(1);
                }}
              >
                {f.id !== "all" && <i className={`cp-rg__dot cp-rg__dot--${f.id}`} aria-hidden="true" />}
                {f.label}
                <span>{f.id === "all" ? ACTIVE_PROJECTS.length : ACTIVE_PROJECTS.filter((p) => p.status === f.id).length}</span>
              </button>
            ))}
          </div>
          <div className="cp-rg__tools">
            <label className="cp-rg__search">
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari judul, cluster, peneliti…"
                aria-label="Cari proyek"
              />
            </label>
            <label className="cp-rg__sort">
              <span>Urutkan</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortId);
                  setPage(1);
                }}
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {slice.length ? (
          <motion.div layout={!reduce} className="cp-rg__grid">
            <AnimatePresence mode="popLayout" initial={false}>
              {slice.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
                  transition={{ duration: 0.45, delay: i * 0.04, ease: EASE }}
                >
                  <ProjectCard p={p} unlocked={!!session} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="cp-rg__empty">
            <Search size={28} aria-hidden="true" />
            <p>Belum ada proyek yang cocok dengan filter ini.</p>
            <button type="button" className="cp-rg__reset" onClick={reset}>
              <X size={14} /> Reset filter
            </button>
          </div>
        )}

        <Pager page={current} perPage={PER_PAGE} total={filtered.length} noun="proyek" onChange={goTo} />
      </div>
    </section>
  );
}

/** `unlocked` shows the methodology; guests see it blurred, and the card takes them to login. */
export function ProjectCard({ p, unlocked }: { p: ActiveProject; unlocked: boolean }) {
  const phase = phaseIndex(p.status);
  const photo = personPhoto(p.lead);
  const recruiting = p.status === "recruiting";
  return (
    <Link href={`/research-project/${p.id}`} className={`cp-rp cp-rp--${p.status}`}>
      <div className="cp-rp__top">
        <span className={`cp-rp-status cp-rp-status--${p.status}`}>{STATUS_ID[p.status]}</span>
        <span className="cp-rp__go" aria-hidden="true"><ArrowUpRight size={17} /></span>
      </div>

      <div className="cp-rp__body">
        <span className="cp-rp__cluster">{p.cluster}</span>
        <h3 className="cp-rp__title">{p.title}</h3>
        <p className="cp-rp__abs">{p.abstract}</p>
      </div>

      {unlocked ? (
        <div className="cp-rp__method">
          <span className="cp-rp__k"><BookOpen size={13} aria-hidden="true" /> Metodologi</span>
          <p>{p.methodology}</p>
        </div>
      ) : (
        <div className="cp-rp__method is-locked">
          <span className="cp-rp__k"><BookOpen size={13} aria-hidden="true" /> Metodologi</span>
          {/* Placeholder only: the real methodology never reaches a guest's browser. */}
          <p aria-hidden="true">{LOCKED_TEASER}</p>
          <span className="cp-rp__unlock">
            <Lock size={14} aria-hidden="true" /> Masuk untuk membuka
          </span>
        </div>
      )}

      {p.requiredExpertise.length > 0 && (
        <div className={`cp-rp__needs ${recruiting ? "is-open" : ""}`}>
          <span className="cp-rp__k">{recruiting ? "Dibutuhkan" : "Keahlian tim"}</span>
          <div>
            {p.requiredExpertise.slice(0, 3).map((r) => (
              <span key={r}>{r}</span>
            ))}
            {p.requiredExpertise.length > 3 && <span className="is-more">+{p.requiredExpertise.length - 3}</span>}
          </div>
        </div>
      )}

      <div className="cp-rp__phase" role="img" aria-label={`Tahap ${phase + 1} dari ${PHASES.length}: ${PHASES[phase].label}`}>
        <div className="cp-rp__phase-row">
          <span className="cp-rp__k">Tahap {phase + 1}/{PHASES.length}</span>
          <strong>{PHASES[phase].label}</strong>
        </div>
        <div className="cp-rp__phase-bar">
          {PHASES.map((ph, i) => (
            <span key={ph.key} className={i < phase ? "is-done" : i === phase ? "is-now" : ""} />
          ))}
        </div>
      </div>

      <div className="cp-rp__foot">
        <div className="cp-rp__lead">
          <span className="cp-rp__avatar">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {photo ? <img src={photo} alt="" /> : initials(p.lead)}
          </span>
          <span>
            <strong>{p.lead}</strong>
            <small>{p.affiliation}</small>
          </span>
        </div>
        <div className="cp-rp__facts">
          <span title="Anggota tim"><Users size={13} aria-hidden="true" /> {teamSize(p)}</span>
          <span title="Mulai"><Calendar size={13} aria-hidden="true" /> {formatMonth(p.startedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
