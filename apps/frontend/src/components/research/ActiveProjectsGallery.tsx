"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ACTIVE_PROJECTS, STATUS_LABEL } from "@/lib/data/active-projects";

const FILTERS = [
  { id: "all", label: "Semua" },
  { id: "recruiting", label: "Mencari kolaborator" },
  { id: "writing", label: "Sedang ditulis" },
  { id: "review", label: "Dalam review" },
];

const PROJECTS = ACTIVE_PROJECTS;

function truncate(text: string, max = 150) {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

export function ActiveProjectsGallery() {
  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(
    () => (active === "all" ? PROJECTS : PROJECTS.filter((p) => p.status === active)),
    [active]
  );

  return (
    <section className="cp-res-section">
      <div className="cp-res-section__wrap">
        <div className="cp-section-head cp-section-head--two">
          <div>
            <div className="cp-sh-tag">
              <span className="cp-sh-tag__bar" />
              <span className="cp-sh-tag__num">R.01</span>
              <span>Proyek aktif</span>
            </div>
            <h2 className="cp-sh-h">Sedang berjalan di komunitas.</h2>
          </div>
          <p className="cp-sh-sub">
            Detail penuh — metodologi, daftar kolaborator, dan target jurnal — terbuka
            untuk anggota komunitas yang sudah terverifikasi.
          </p>
        </div>

        <div className="cp-res-filter" role="tablist">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={active === f.id}
              className={`cp-res-chip ${active === f.id ? "is-active" : ""}`}
              onClick={() => setActive(f.id)}
            >
              {f.label}
              <span className="cp-res-chip__ct">
                {f.id === "all"
                  ? PROJECTS.length
                  : PROJECTS.filter((p) => p.status === f.id).length}
              </span>
            </button>
          ))}
        </div>

        <div className="cp-res-grid">
          {filtered.map((p) => (
            <article key={p.id} className="cp-res-proj">
              <header className="cp-res-proj__top">
                <span className="cp-res-proj__cluster">{p.cluster}</span>
                <span className={`cp-res-proj__status cp-res-proj__status--${p.status}`}>
                  {STATUS_LABEL[p.status]}
                </span>
              </header>

              <h3 className="cp-res-proj__title">{p.title}</h3>

              <p className="cp-res-proj__abs">{truncate(p.abstract, 150)}</p>

              <div className="cp-res-proj__locked" aria-hidden="true">
                <p className="cp-res-proj__locked-text">
                  {p.abstract.slice(150, 320) || "Methodology, target journal, dan daftar kolaborator hanya tampil untuk anggota terverifikasi."}
                </p>
                <div className="cp-res-proj__veil">
                  <span className="cp-res-proj__lock-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </span>
                  <Link href="/register" className="cp-res-proj__unlock">
                    Unlock Research
                  </Link>
                </div>
              </div>

              <div className="cp-res-proj__tags">
                {p.tags.map((t) => (
                  <span key={t} className="cp-res-proj__tag">
                    {t}
                  </span>
                ))}
              </div>

              <footer className="cp-res-proj__foot">
                <div className="cp-res-proj__lead">
                  <span className="cp-res-proj__lead-avatar" aria-hidden="true">
                    {p.lead
                      .split(" ")
                      .slice(-2)
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <div>
                    <div className="cp-res-proj__lead-name">{p.lead}</div>
                    <div className="cp-res-proj__lead-aff">{p.affiliation}</div>
                  </div>
                </div>
                <Link href={`/research-project/${p.id}`} className="cp-res-proj__open">
                  Preview
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
