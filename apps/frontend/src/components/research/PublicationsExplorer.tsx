"use client";

import { useMemo, useState } from "react";

type Quartile = "q1" | "q2" | "q3" | "sinta";

type Pub = {
  title: string;
  authors: string;
  journal: string;
  quartile: Quartile;
  qLabel: string;
  /** ISO yyyy-mm format — day intentionally omitted */
  date: string;
  cluster: string;
};

const PUBS: Pub[] = [
  { title: "Generative AI Adoption in Indonesian Higher Education: A National Survey of 12 Universities", authors: "Putranto, A., Kartika, L., Nugroho, B.", journal: "Journal of Educational Research", quartile: "q1", qLabel: "Scopus Q1", date: "2025-05", cluster: "EdTech" },
  { title: "Digital Health Literacy Among Rural Indonesian Communities Post-COVID", authors: "Rahmawati, M., Hidayat, A., Sari, D.", journal: "Health Promotion International", quartile: "q2", qLabel: "Scopus Q2", date: "2025-04", cluster: "Public Health" },
  { title: "Circular Economy Practices in Central Java's Textile MSMEs: A Multi-Case Analysis", authors: "Setiawan, B., Nirmala, D.", journal: "Sustainability", quartile: "q1", qLabel: "Scopus Q1", date: "2025-03", cluster: "Sustainability" },
  { title: "Anchor Sentences as a Heuristic for L2 Academic Writing: A Quasi-Experimental Study", authors: "Nurhaliza, S., Kartika, L.", journal: "Studies in Higher Education", quartile: "q2", qLabel: "Scopus Q2", date: "2025-02", cluster: "Linguistics" },
  { title: "Reading Comprehension Strategies in English-Medium Instruction: Indonesian Polytechnics", authors: "Puspita, R., Ramadhan, F.", journal: "TEFLIN Journal", quartile: "q3", qLabel: "Scopus Q3", date: "2025-01", cluster: "Linguistics" },
  { title: "Reviewer Comment Framing and Author Response: A Discourse Analysis of 240 Revision Letters", authors: "Suryanto, H., Putranto, A.", journal: "Learned Publishing", quartile: "q3", qLabel: "Scopus Q3", date: "2024-12", cluster: "Publishing" },
  { title: "Pemanfaatan ChatGPT dalam Pembelajaran Sastra Indonesia di SMA: Studi Pendahuluan", authors: "Putri, A. S., Wibowo, T.", journal: "Litera", quartile: "sinta", qLabel: "Sinta 2", date: "2024-11", cluster: "EdTech" },
  { title: "Network Effects in Early-Career Academic Writing Communities: A Social Capital Perspective", authors: "Hidayat, A., Putranto, A., Rahmawati, M.", journal: "Higher Education", quartile: "q2", qLabel: "Scopus Q2", date: "2024-10", cluster: "Sociology" },
  { title: "Microbiome Profiling in Indonesian Fermented Foods: A Multi-Province Survey", authors: "Wijaya, B., Setiawan, R.", journal: "Food Microbiology", quartile: "q1", qLabel: "Scopus Q1", date: "2024-09", cluster: "Biotech" },
  { title: "Flipped Classroom in Engineering Programs: A 3-Year Longitudinal Study", authors: "Ramadhan, F., Kurnia, A.", journal: "IEEE Trans. on Education", quartile: "q2", qLabel: "Scopus Q2", date: "2024-08", cluster: "EdTech" },
  { title: "SME Resilience and Digital Payment Adoption in Post-Pandemic Jakarta", authors: "Lestari, W., Mbete, Y.", journal: "Asian Economic Papers", quartile: "q3", qLabel: "Scopus Q3", date: "2024-07", cluster: "Economics" },
  { title: "Mapping Stakeholder Networks in Indonesian Climate Policy 2018–2024", authors: "Bayu, S., Andika, H.", journal: "Climate Policy", quartile: "q1", qLabel: "Scopus Q1", date: "2024-06", cluster: "Public Policy" },
  { title: "AI Literacy Curriculum Design for Indonesian Polytechnics", authors: "Kartika, L., Putri, A.", journal: "Computers & Education", quartile: "q1", qLabel: "Scopus Q1", date: "2024-05", cluster: "EdTech" },
  { title: "Maternal Health Service Utilization in Eastern Indonesia", authors: "Rahmawati, M., Sari, D.", journal: "BMC Public Health", quartile: "q2", qLabel: "Scopus Q2", date: "2024-04", cluster: "Public Health" },
  { title: "Strategi Penulisan Cover Letter Berbasis Editor Persona", authors: "Suryanto, H., Ramadhan, F.", journal: "Jurnal Komunikasi Ikatan Sarjana", quartile: "sinta", qLabel: "Sinta 1", date: "2024-03", cluster: "Publishing" },
  { title: "Co-Authorship Network Among Indonesian Early-Career Researchers", authors: "Nirmala, D., Putranto, A.", journal: "Scientometrics", quartile: "q1", qLabel: "Scopus Q1", date: "2024-02", cluster: "Sociology" },
  { title: "Plastic Waste Management Behavior in Coastal MSMEs", authors: "Setiawan, B., Bayu, S.", journal: "Resources, Conservation & Recycling", quartile: "q1", qLabel: "Scopus Q1", date: "2024-01", cluster: "Sustainability" },
  { title: "Validasi Skala Self-Regulated Learning untuk Konteks Indonesia", authors: "Lestari, W., Wibowo, T.", journal: "Jurnal Psikologi", quartile: "sinta", qLabel: "Sinta 2", date: "2023-12", cluster: "Education" },
  { title: "Mobile Money Adoption Among Indonesian Rural Households", authors: "Mbete, Y., Lestari, W.", journal: "Telecommunications Policy", quartile: "q2", qLabel: "Scopus Q2", date: "2023-11", cluster: "Economics" },
  { title: "Curriculum Mapping for AI Ethics in Indonesian Universities", authors: "Putranto, A., Ramadhan, F.", journal: "Asia Pacific Journal of Education", quartile: "q3", qLabel: "Scopus Q3", date: "2023-10", cluster: "EdTech" },
];

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
  return `${MONTH_ID[parseInt(m, 10) - 1]} ${y}`;
}

export function PublicationsExplorer() {
  const [query, setQuery] = useState("");
  const [quartile, setQuartile] = useState<"all" | Quartile>("all");
  const [cluster, setCluster] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PUBS
      .filter((p) => (quartile === "all" ? true : p.quartile === quartile))
      .filter((p) => (cluster === "all" ? true : p.cluster === cluster))
      .filter((p) =>
        q
          ? p.title.toLowerCase().includes(q) ||
            p.authors.toLowerCase().includes(q) ||
            p.journal.toLowerCase().includes(q)
          : true
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [query, quartile, cluster]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const slice = filtered.slice(start, start + PER_PAGE);

  const reset = (setter: () => void) => {
    setter();
    setPage(1);
  };

  return (
    <section className="cp-res-section">
      <div className="cp-res-section__wrap">
        <div className="cp-section-head cp-section-head--two">
          <div>
            <div className="cp-sh-tag">
              <span className="cp-sh-tag__bar" />
              <span className="cp-sh-tag__num">R.03</span>
              <span>Publikasi alumni</span>
            </div>
            <h2 className="cp-sh-h">Karya yang sudah tayang.</h2>
          </div>
          <p className="cp-sh-sub">
            Cari berdasarkan judul, penulis, atau jurnal. Filter cepat per quartile dan
            cluster. Urut dari yang terbaru.
          </p>
        </div>

        <div className="cp-res-toolbar">
          <div className="cp-res-search">
            <span className="cp-res-search__icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </span>
            <input
              type="search"
              className="cp-res-search__input"
              placeholder="Cari judul, penulis, atau jurnal…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              aria-label="Cari publikasi"
            />
            {query ? (
              <button
                className="cp-res-search__clear"
                onClick={() => {
                  setQuery("");
                  setPage(1);
                }}
                aria-label="Hapus pencarian"
              >
                ×
              </button>
            ) : null}
          </div>

          <div className="cp-res-select">
            <label htmlFor="cluster-filter">Cluster</label>
            <select
              id="cluster-filter"
              value={cluster}
              onChange={(e) => reset(() => setCluster(e.target.value))}
            >
              <option value="all">Semua cluster</option>
              {CLUSTERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="cp-res-quartiles" role="tablist">
          {QUARTILES.map((q) => {
            const ct = q.id === "all" ? PUBS.length : PUBS.filter((p) => p.quartile === q.id).length;
            return (
              <button
                key={q.id}
                type="button"
                role="tab"
                aria-selected={quartile === q.id}
                className={`cp-res-chip ${quartile === q.id ? "is-active" : ""}`}
                onClick={() => reset(() => setQuartile(q.id))}
              >
                {q.label}
                <span className="cp-res-chip__ct">{ct}</span>
              </button>
            );
          })}
        </div>

        <div className="cp-res-pubs">
          <div className="cp-res-pubs__head">
            <span className="cp-res-pubs__h cp-res-pubs__h--date">Terbit</span>
            <span className="cp-res-pubs__h">Judul &amp; Penulis</span>
            <span className="cp-res-pubs__h cp-res-pubs__h--journal">Jurnal</span>
            <span className="cp-res-pubs__h cp-res-pubs__h--q">Indeks</span>
          </div>

          {slice.length === 0 ? (
            <div className="cp-res-pubs__empty">
              <span className="cp-res-pubs__empty-icon" aria-hidden="true">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              </span>
              <p>Tidak ada publikasi yang cocok dengan filter saat ini.</p>
              <button
                type="button"
                className="cp-res-pubs__reset"
                onClick={() => {
                  setQuery("");
                  setQuartile("all");
                  setCluster("all");
                  setPage(1);
                }}
              >
                Reset filter
              </button>
            </div>
          ) : (
            <ul className="cp-res-pubs__list">
              {slice.map((p) => (
                <li key={p.title} className="cp-res-pub">
                  <div className="cp-res-pub__date">{formatDate(p.date)}</div>
                  <div className="cp-res-pub__main">
                    <h4 className="cp-res-pub__title">{p.title}</h4>
                    <div className="cp-res-pub__authors">
                      {p.authors}
                      <span className="cp-res-pub__cluster">· {p.cluster}</span>
                    </div>
                  </div>
                  <div className="cp-res-pub__journal">{p.journal}</div>
                  <div className={`cp-res-pub__q cp-res-pub__q--${p.quartile}`}>{p.qLabel}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {total > 0 ? (
          <nav className="cp-res-pager" aria-label="Pagination">
            <span className="cp-res-pager__count">
              Menampilkan <strong>{start + 1}</strong>–<strong>{Math.min(start + PER_PAGE, total)}</strong>{" "}
              dari <strong>{total}</strong> publikasi
            </span>
            <div className="cp-res-pager__ctrl">
              <button
                className="cp-res-pager__btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                aria-label="Halaman sebelumnya"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Sebelumnya</span>
              </button>
              <div className="cp-res-pager__pages">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`cp-res-pager__num ${i + 1 === safePage ? "is-active" : ""}`}
                    onClick={() => setPage(i + 1)}
                    aria-label={`Halaman ${i + 1}`}
                    aria-current={i + 1 === safePage ? "page" : undefined}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                className="cp-res-pager__btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                aria-label="Halaman berikutnya"
              >
                <span>Berikutnya</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </nav>
        ) : null}
      </div>
    </section>
  );
}
