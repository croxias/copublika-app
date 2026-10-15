"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Download, FileX2, Search, X } from "lucide-react";
import { Reveal } from "@/components/about/motion";
import { PUBS, type Quartile } from "@/lib/data/publications";
import { Pager } from "./Pager";
import { onResearchFocus } from "./events";

/** Section text; also the admin seed for "Halaman Riset → Publikasi". */
export const PUBS_COPY = {
  tag: "Publikasi anggota",
  heading: "Karya yang",
  headingAccent: "sudah tayang.",
  sub: "Artikel anggota yang sudah terbit di jurnal Scopus dan Sinta. Unduh PDF untuk membaca naskah lengkapnya.",
};

const QUARTILES: { id: "all" | Quartile; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "q1", label: "Scopus Q1" },
  { id: "q2", label: "Scopus Q2" },
  { id: "q3", label: "Scopus Q3" },
  { id: "sinta", label: "Sinta" },
];

const CLUSTERS = Array.from(new Set(PUBS.map((p) => p.cluster))).sort();

const PER_PAGE = 8;
const MONTH_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatDate(iso: string) {
  const [y, m] = iso.split("-");
  return { month: MONTH_ID[parseInt(m, 10) - 1], year: y };
}

type Order = "desc" | "asc";

export function PublicationsExplorer() {
  const sectionRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [quartile, setQuartile] = useState<"all" | Quartile>("all");
  const [cluster, setCluster] = useState<string>("all");
  const [order, setOrder] = useState<Order>("desc");
  const [page, setPage] = useState(1);

  useEffect(
    () =>
      onResearchFocus((d) => {
        if (d.target !== "publications") return;
        setCluster(d.cluster);
        setQuartile("all");
        setQuery("");
        setPage(1);
      }),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PUBS.filter((p) => quartile === "all" || p.quartile === quartile)
      .filter((p) => cluster === "all" || p.cluster === cluster)
      .filter((p) => !q || `${p.title} ${p.authors} ${p.journal}`.toLowerCase().includes(q))
      .sort((a, b) => (order === "desc" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
  }, [query, quartile, cluster, order]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const filtering = query !== "" || quartile !== "all" || cluster !== "all";

  const resetAll = () => {
    setQuery("");
    setQuartile("all");
    setCluster("all");
    setPage(1);
  };
  const goTo = (n: number) => {
    setPage(n);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const toggleOrder = () => {
    setOrder((o) => (o === "desc" ? "asc" : "desc"));
    setPage(1);
  };

  return (
    <section ref={sectionRef} className="cp-ab-sec cp-pb" id="publikasi">
      <div className="cp-ab-wrap">
        <Reveal className="cp-ab-headcol">
          <div className="cp-ab-tag">
            <span className="cp-ab-tag__bar" aria-hidden="true" />
            <span>{PUBS_COPY.tag}</span>
          </div>
          <h2 className="cp-ab-h2 cp-ab-h2--line">
            {PUBS_COPY.heading} <span className="cp-ab-accent">{PUBS_COPY.headingAccent}</span>
          </h2>
          <p className="cp-ab-headcol__lead">
            {PUBS_COPY.sub}
          </p>
        </Reveal>

        <div className="cp-pb__panel">
          <div className="cp-pb__toolbar">
            <label className="cp-rg__search cp-pb__search">
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                placeholder="Cari judul, penulis, atau jurnal…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                aria-label="Cari publikasi"
              />
            </label>
            <label className="cp-rg__sort">
              <span>Cluster</span>
              <select
                value={cluster}
                onChange={(e) => {
                  setCluster(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">Semua cluster</option>
                {CLUSTERS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="cp-rg__sort">
              <span>Urutkan</span>
              <select
                value={order}
                onChange={(e) => {
                  setOrder(e.target.value as Order);
                  setPage(1);
                }}
              >
                <option value="desc">Terbaru dulu</option>
                <option value="asc">Terlama dulu</option>
              </select>
            </label>
          </div>

          <div className="cp-pb__filters">
            <div className="cp-rg__chips" role="group" aria-label="Filter indeks jurnal">
              {QUARTILES.map((q) => {
                const ct = q.id === "all" ? PUBS.length : PUBS.filter((p) => p.quartile === q.id).length;
                return (
                  <button
                    key={q.id}
                    type="button"
                    aria-pressed={quartile === q.id}
                    className={`cp-rg__chip ${quartile === q.id ? "is-active" : ""}`}
                    onClick={() => {
                      setQuartile(q.id);
                      setPage(1);
                    }}
                  >
                    {q.id !== "all" && <i className={`cp-pb__qdot cp-pb__qdot--${q.id}`} aria-hidden="true" />}
                    {q.label}
                    <span>{ct}</span>
                  </button>
                );
              })}
            </div>
            {filtering && (
              <button type="button" className="cp-rg__reset" onClick={resetAll}>
                <X size={14} /> Reset filter
              </button>
            )}
          </div>

          {slice.length ? (
            <div className="cp-pb__scroll">
              <table className="cp-pb__table">
                <caption className="sr-only">Daftar publikasi anggota CoPublika</caption>
                <thead>
                  <tr>
                    <th scope="col" aria-sort={order === "desc" ? "descending" : "ascending"} className="cp-pb__th-date">
                      <button type="button" className="cp-pb__sort" onClick={toggleOrder} title="Urutkan berdasarkan tanggal terbit">
                        Terbit {order === "desc" ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
                      </button>
                    </th>
                    <th scope="col" className="cp-pb__th-main">Judul &amp; penulis</th>
                    <th scope="col">Jurnal</th>
                    <th scope="col">Indeks</th>
                    <th scope="col" className="cp-pb__th-pdf">PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {slice.map((p) => {
                    const d = formatDate(p.date);
                    return (
                      <tr key={p.title}>
                        <td className="cp-pb__date">
                          <span className="cp-pb__chip">
                            <span>{d.month}</span>
                            <strong>{d.year}</strong>
                          </span>
                        </td>
                        <td className="cp-pb__main">
                          <span className="cp-pb__title">{p.title}</span>
                          <span className="cp-pb__authors">
                            {p.authors} <em>{p.cluster}</em>
                          </span>
                        </td>
                        <td className="cp-pb__journal">{p.journal}</td>
                        <td>
                          <span className={`cp-pb__q cp-pb__q--${p.quartile}`}>{p.qLabel}</span>
                        </td>
                        <td className="cp-pb__pdf">
                          {p.pdf ? (
                            <a href={p.pdf} className="cp-pb__dl" download target="_blank" rel="noopener noreferrer" aria-label={`Unduh PDF: ${p.title}`}>
                              <Download size={15} aria-hidden="true" /> Unduh PDF
                            </a>
                          ) : (
                            <span className="cp-pb__dl is-off" title="PDF belum diunggah">
                              <FileX2 size={15} aria-hidden="true" /> Belum tersedia
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="cp-rg__empty">
              <Search size={28} aria-hidden="true" />
              <p>Tidak ada publikasi yang cocok dengan filter saat ini.</p>
              <button type="button" className="cp-rg__reset" onClick={resetAll}>
                <X size={14} /> Reset filter
              </button>
            </div>
          )}
        </div>

        <Pager page={current} perPage={PER_PAGE} total={filtered.length} noun="publikasi" onChange={goTo} />
      </div>
    </section>
  );
}
