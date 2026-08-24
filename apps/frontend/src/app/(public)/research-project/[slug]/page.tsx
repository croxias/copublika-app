import { notFound } from "next/navigation";
import Link from "next/link";
import { getResearchProjectBySlug } from "@/lib/data/research";
import { ACTIVE_PROJECTS, STATUS_LABEL, type ActiveProject } from "@/lib/data/active-projects";

function initials(name: string) {
  return name
    .split(" ")
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

async function loadProject(slug: string): Promise<ActiveProject | null> {
  // 1) Try active projects first (mock IDs p01-p06 + future additions)
  const active = ACTIVE_PROJECTS.find((p) => p.id === slug);
  if (active) return active;

  // 2) Fall back to DB-backed research projects, adapting shape
  const db = await getResearchProjectBySlug(slug);
  if (!db) return null;

  return {
    id: db.id,
    title: db.title,
    cluster: db.tags[0] ?? "Research",
    status: db.status === "pending" ? "review" : "writing",
    abstract: db.abstract,
    methodology: db.methodology,
    targetJournals: [],
    requiredExpertise: db.requiredExpertise,
    timeline: "Detail timeline tersedia untuk anggota terverifikasi.",
    tags: db.tags,
    lead: db.leadName,
    leadRole: "Principal Investigator",
    affiliation: db.leadInstitution,
    collaborators: [],
    startedAt: (db.createdAt ?? "").slice(0, 7),
  };
}

export default async function ResearchPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await loadProject(slug);

  if (!project) notFound();

  return (
    <>
      {/* Hero */}
      <section className="cp-stsz-hero cp-rpv-hero">
        <div className="cp-stsz-hero__grid" aria-hidden="true" />
        <div className="cp-stsz-hero__orb-a" aria-hidden="true" />
        <div className="cp-stsz-hero__orb-b" aria-hidden="true" />

        <div className="cp-stsz-hero__inner cp-rpv-hero__inner">
          <div className="cp-rpv-tags">
            <span className="cp-rpv-cluster">{project.cluster}</span>
            <span className={`cp-rpv-status cp-rpv-status--${project.status}`}>
              {STATUS_LABEL[project.status]}
            </span>
          </div>

          <h1 className="cp-rpv-title">{project.title}</h1>

          <p className="cp-rpv-lead">{project.abstract}</p>

          <div className="cp-rpv-meta">
            <div className="cp-rpv-meta__item">
              <span className="cp-rpv-meta__l">Principal Investigator</span>
              <span className="cp-rpv-meta__v">{project.lead}</span>
              <span className="cp-rpv-meta__sub">{project.affiliation}</span>
            </div>
            <div className="cp-rpv-meta__item">
              <span className="cp-rpv-meta__l">Mulai</span>
              <span className="cp-rpv-meta__v">{formatMonth(project.startedAt)}</span>
            </div>
            <div className="cp-rpv-meta__item">
              <span className="cp-rpv-meta__l">Cluster</span>
              <span className="cp-rpv-meta__v">{project.cluster}</span>
            </div>
            <div className="cp-rpv-meta__item">
              <span className="cp-rpv-meta__l">Status</span>
              <span className="cp-rpv-meta__v">{STATUS_LABEL[project.status]}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="cp-rpv-body">
        <div className="cp-rpv-body__wrap">
          <div className="cp-rpv-grid">
            {/* Main column */}
            <div className="cp-rpv-main">
              {/* Locked methodology */}
              <article className="cp-rpv-block">
                <header className="cp-rpv-block__head">
                  <span className="cp-rpv-block__tag">M.01 · Metodologi</span>
                  <h2 className="cp-rpv-block__h">Pendekatan riset & rancangan studi</h2>
                </header>
                <div className="cp-rpv-locked">
                  <p className="cp-rpv-locked__text">{project.methodology}</p>
                  <div className="cp-rpv-locked__veil" role="status" aria-label="Konten terkunci">
                    <span className="cp-rpv-locked__icon" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    </span>
                    <div className="cp-rpv-locked__copy">
                      <strong>Metodologi penuh terkunci.</strong>
                      <span>Verifikasi Google Scholar untuk akses detail.</span>
                    </div>
                    <Link href="/register" className="cp-rpv-locked__cta">
                      Unlock Research
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>

              {/* Target journals */}
              {project.targetJournals.length > 0 ? (
                <article className="cp-rpv-block">
                  <header className="cp-rpv-block__head">
                    <span className="cp-rpv-block__tag">M.02 · Target Jurnal</span>
                    <h2 className="cp-rpv-block__h">Kandidat jurnal yang dipertimbangkan</h2>
                  </header>
                  <ul className="cp-rpv-journals">
                    {project.targetJournals.map((j, i) => (
                      <li key={j} className="cp-rpv-journal">
                        <span className="cp-rpv-journal__n">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="cp-rpv-journal__name">{j}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ) : null}

              {/* Required expertise */}
              {project.requiredExpertise.length > 0 ? (
                <article className="cp-rpv-block">
                  <header className="cp-rpv-block__head">
                    <span className="cp-rpv-block__tag">M.03 · Bidang dibutuhkan</span>
                    <h2 className="cp-rpv-block__h">
                      {project.status === "recruiting"
                        ? "Bidang yang sedang dicari"
                        : "Bidang inti tim riset"}
                    </h2>
                  </header>
                  <div className="cp-rpv-needs">
                    {project.requiredExpertise.map((r) => (
                      <span key={r} className="cp-rpv-need">
                        {r}
                      </span>
                    ))}
                  </div>
                </article>
              ) : null}
            </div>

            {/* Side rail */}
            <aside className="cp-rpv-side">
              <div className="cp-rpv-card">
                <span className="cp-rpv-card__l">Timeline</span>
                <p className="cp-rpv-card__v">{project.timeline}</p>
              </div>

              <div className="cp-rpv-card">
                <span className="cp-rpv-card__l">Tim riset</span>
                <ul className="cp-rpv-team">
                  <li className="cp-rpv-member cp-rpv-member--lead">
                    <span className="cp-rpv-avatar">{initials(project.lead)}</span>
                    <div>
                      <div className="cp-rpv-member__name">{project.lead}</div>
                      <div className="cp-rpv-member__role">{project.leadRole}</div>
                      <div className="cp-rpv-member__aff">{project.affiliation}</div>
                    </div>
                  </li>
                  {project.collaborators.length === 0 ? (
                    <li className="cp-rpv-member cp-rpv-member--locked">
                      <span className="cp-rpv-avatar cp-rpv-avatar--locked" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="5" y="11" width="14" height="9" rx="1.5" />
                          <path d="M8 11V8a4 4 0 018 0v3" />
                        </svg>
                      </span>
                      <div>
                        <div className="cp-rpv-member__name cp-rpv-member__name--locked">
                          ●●●● ●●●●●●●●
                        </div>
                        <div className="cp-rpv-member__role">Kolaborator terkunci</div>
                      </div>
                    </li>
                  ) : (
                    project.collaborators.map((c) => (
                      <li key={c.name} className="cp-rpv-member">
                        <span className="cp-rpv-avatar">{initials(c.name)}</span>
                        <div>
                          <div className="cp-rpv-member__name">{c.name}</div>
                          <div className="cp-rpv-member__role">{c.role}</div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="cp-rpv-card cp-rpv-card--cta">
                <div className="cp-rpv-card__pulse">
                  <i />
                  <span>
                    {project.status === "recruiting"
                      ? "Sedang merekrut"
                      : project.status === "writing"
                      ? "Sedang ditulis"
                      : "Dalam review"}
                  </span>
                </div>
                <h3 className="cp-rpv-card__h">
                  {project.status === "recruiting"
                    ? "Tertarik bergabung sebagai co-author?"
                    : "Akses detail penuh sebagai anggota."}
                </h3>
                <p className="cp-rpv-card__p">
                  Detail metodologi, target jurnal final, dan undangan kolaborasi
                  hanya terbuka untuk anggota komunitas terverifikasi.
                </p>
                <div className="cp-rpv-card__ctas">
                  <Link href="/register" className="cp-rpv-btn cp-rpv-btn--solid">
                    Daftar Komunitas
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  <Link href="/research" className="cp-rpv-btn cp-rpv-btn--line">
                    Proyek lain
                  </Link>
                </div>
              </div>

              <div className="cp-rpv-card">
                <span className="cp-rpv-card__l">Tag terkait</span>
                <div className="cp-rpv-tags-list">
                  {project.tags.map((t) => (
                    <span key={t} className="cp-rpv-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

const MONTH_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
function formatMonth(iso: string) {
  if (!iso || !iso.includes("-")) return iso || "—";
  const [y, m] = iso.split("-");
  return `${MONTH_ID[Math.max(0, Math.min(11, parseInt(m, 10) - 1))]} ${y}`;
}
