import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Check, Clock, Layers, Lock, Sparkles, Target, Users } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getResearchProjectBySlug } from "@/lib/data/research";
import { ACTIVE_PROJECTS, type ActiveProject } from "@/lib/data/active-projects";
import { PHASES, RESEARCH_PREVIEW_OPEN, STATUS_ID, formatMonth, initials, personPhoto, phaseIndex, teamSize } from "@/lib/content/research";
import { BackButton } from "@/components/research/BackButton";
import { ProjectCard } from "@/components/research/ActiveProjectsGallery";
import { Reveal } from "@/components/about/motion";

async function loadProject(slug: string): Promise<ActiveProject | null> {
  // 1) Active projects first (p01-p06 + future additions)
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
    leadRole: "Author",
    affiliation: db.leadInstitution,
    collaborators: [],
    startedAt: (db.createdAt ?? "").slice(0, 7),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = ACTIVE_PROJECTS.find((x) => x.id === slug);
  return { title: p ? `${p.title} — CoPublika` : "Proyek riset — CoPublika", description: p?.abstract.slice(0, 160) };
}

function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const photo = personPhoto(name);
  return (
    <span className="cp-rd-avatar" style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {photo ? <img src={photo} alt="" /> : initials(name)}
    </span>
  );
}

export default async function ResearchPreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // The proxy already redirects guests; this is the real check.
  if (!(await getSession())) redirect(`/login?next=${encodeURIComponent(`/research-project/${slug}`)}&reason=research`);
  const project = await loadProject(slug);
  if (!project) notFound();

  const phase = phaseIndex(project.status);
  const open = RESEARCH_PREVIEW_OPEN;
  const related = ACTIVE_PROJECTS.filter((p) => p.id !== project.id)
    .sort((a, b) => Number(b.cluster === project.cluster) - Number(a.cluster === project.cluster))
    .slice(0, 3);

  return (
    <main className="cp-rd">
      {/* Hero */}
      <section className="cp-rd-hero">
        <div className="cp-ab-hero__bg" aria-hidden="true" />
        <div className="cp-rd-hero__glow" aria-hidden="true" />
        <div className="cp-ab-wrap">
          <div className="cp-rd-hero__nav">
            <BackButton fallback="/research" label="Kembali ke Riset" />
            <nav className="cp-rd-crumb" aria-label="Lokasi">
              <Link href="/research">Riset</Link>
              <span aria-hidden="true">/</span>
              <span>{project.cluster}</span>
            </nav>
          </div>

          <div className="cp-rd-hero__grid">
            <Reveal className="cp-rd-hero__head">
              <div className="cp-rd-hero__pills">
                <span className="cp-rd-pill"><Layers size={13} /> {project.cluster}</span>
                <span className={`cp-rp-status cp-rp-status--${project.status}`}>{STATUS_ID[project.status]}</span>
              </div>
              <h1 className="cp-rd-hero__title">{project.title}</h1>
              <p className="cp-rd-hero__abs">{project.abstract}</p>

              <div className="cp-rd-authors">
                <div className="cp-rd-authors__stack" aria-hidden="true">
                  <Avatar name={project.lead} size={46} />
                  {project.collaborators.slice(0, 3).map((c) => (
                    <Avatar key={c.name} name={c.name} size={46} />
                  ))}
                  {project.collaborators.length > 3 && <span className="cp-rd-avatar cp-rd-authors__more">+{project.collaborators.length - 3}</span>}
                </div>
                <span className="cp-rd-authors__text">
                  <small>{project.leadRole}</small>
                  <strong>{project.lead}</strong>
                  <em>
                    {project.affiliation}
                    {project.collaborators.length > 0 && ` · bersama ${project.collaborators.length} co-author`}
                  </em>
                </span>
              </div>

              <div className="cp-rd-hero__ctas">
                <a href="#tim" className="cp-ab-btn cp-ab-btn--primary">
                  {project.status === "recruiting" ? "Gabung sebagai co-author" : "Lihat tim riset"} <ArrowRight size={16} />
                </a>
                <Link href="/contact" className="cp-ab-btn cp-ab-btn--line">Tanya tim</Link>
              </div>
            </Reveal>

            <Reveal className="cp-rd-progress" delay={0.15}>
              <div className="cp-rd-progress__head">
                <span>Progres riset</span>
                <strong>Tahap {phase + 1}<small>/{PHASES.length}</small></strong>
              </div>
              <div className="cp-rd-progress__bar" aria-hidden="true">
                <i style={{ width: `${((phase + 0.5) / PHASES.length) * 100}%` }} />
              </div>
              <ol className="cp-rd-track">
                {PHASES.map((ph, i) => (
                  <li key={ph.key} className={`cp-rd-track__step ${i < phase ? "is-done" : i === phase ? "is-now" : ""}`} aria-current={i === phase ? "step" : undefined}>
                    <span className="cp-rd-track__dot">{i < phase ? <Check size={13} strokeWidth={3} /> : i + 1}</span>
                    <span className="cp-rd-track__label">{ph.label}</span>
                    <span className="cp-rd-track__state">{i < phase ? "Selesai" : i === phase ? "Berjalan" : i === PHASES.length - 1 ? "Tujuan akhir" : "Berikutnya"}</span>
                  </li>
                ))}
              </ol>
              <dl className="cp-rd-progress__facts">
                <div><dt><Calendar size={14} /> Mulai</dt><dd>{formatMonth(project.startedAt)}</dd></div>
                <div><dt><Users size={14} /> Tim</dt><dd>{teamSize(project)} orang</dd></div>
                <div><dt><Target size={14} /> Target jurnal</dt><dd>{project.targetJournals.length || "—"} kandidat</dd></div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="cp-rd-body">
        <div className="cp-ab-wrap cp-rd-grid">
          <div className="cp-rd-main">
            <Reveal className="cp-rd-block">
              <h2 className="cp-rd-block__h"><span className="cp-rd-ico"><Sparkles size={17} /></span> Ringkasan riset</h2>
              <p className="cp-rd-lead">{project.abstract}</p>
            </Reveal>

            <Reveal className="cp-rd-block">
              <h2 className="cp-rd-block__h"><span className="cp-rd-ico"><BookOpen size={17} /></span> Metodologi</h2>
              {open ? (
                <p className="cp-rd-text">{project.methodology}</p>
              ) : (
                <div className="cp-rd-locked">
                  <p>{project.methodology}</p>
                  <div className="cp-rd-locked__veil">
                    <Lock size={20} />
                    <strong>Metodologi penuh terbuka untuk anggota.</strong>
                    <Link href="/daftar?program=member&paket=gratis" className="cp-ab-btn cp-ab-btn--primary">Gabung komunitas</Link>
                  </div>
                </div>
              )}
            </Reveal>

            {project.targetJournals.length > 0 && (
              <Reveal className="cp-rd-block">
                <h2 className="cp-rd-block__h"><span className="cp-rd-ico"><Target size={17} /></span> Kandidat jurnal</h2>
                <ul className="cp-rd-journals">
                  {project.targetJournals.map((j, i) => (
                    <li key={j}>
                      <span className={`cp-rd-journal__rank ${i === 0 ? "is-first" : ""}`}>{i === 0 ? "Prioritas" : "Alternatif"}</span>
                      <strong>{j}</strong>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {project.requiredExpertise.length > 0 && (
              <Reveal className="cp-rd-block">
                <h2 className="cp-rd-block__h">
                  <span className="cp-rd-ico"><Users size={17} /></span>
                  {project.status === "recruiting" ? "Keahlian yang sedang dicari" : "Keahlian inti tim"}
                </h2>
                <div className="cp-rd-needs">
                  {project.requiredExpertise.map((r) => (
                    <span key={r}><Check size={14} strokeWidth={3} /> {r}</span>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal className="cp-rd-block">
              <h2 className="cp-rd-block__h"><span className="cp-rd-ico"><Clock size={17} /></span> Linimasa</h2>
              <p className="cp-rd-text">{project.timeline}</p>
            </Reveal>
          </div>

          <aside className="cp-rd-side">
            <Reveal className="cp-rd-card cp-rd-card--team">
              <p className="cp-rd-card__k" id="tim">Tim riset</p>
              <ul className="cp-rd-team">
                <li className="is-lead">
                  <Avatar name={project.lead} />
                  <span><strong>{project.lead}</strong><small>{project.leadRole}</small></span>
                </li>
                {open || project.collaborators.length === 0
                  ? project.collaborators.map((c) => (
                      <li key={c.name}>
                        <Avatar name={c.name} />
                        <span><strong>{c.name}</strong><small>{c.role}</small></span>
                      </li>
                    ))
                  : (
                      <li className="is-locked"><span className="cp-rd-avatar"><Lock size={14} /></span><span><strong>{project.collaborators.length} kolaborator</strong><small>Terbuka untuk anggota</small></span></li>
                    )}
              </ul>
            </Reveal>

            <Reveal className="cp-rd-card cp-rd-card--cta" delay={0.1}>
              <span className="cp-rd-card__pulse"><i /> {STATUS_ID[project.status]}</span>
              <h3>{project.status === "recruiting" ? "Tertarik bergabung sebagai co-author?" : "Ingin ikut proyek seperti ini?"}</h3>
              <p>Gabung komunitas, pilih cluster yang sesuai, dan kenali tim riset yang sedang berjalan.</p>
              <div className="cp-rd-card__ctas">
                <Link href="/daftar?program=member&paket=gratis" className="cp-ab-btn cp-ab-btn--primary">Gabung komunitas <span className="cp-ab-btn__arr" aria-hidden="true">→</span></Link>
                <Link href="/contact" className="cp-ab-btn cp-ab-btn--line">Tanya tim</Link>
              </div>
            </Reveal>

            <Reveal className="cp-rd-card" delay={0.15}>
              <p className="cp-rd-card__k">Topik</p>
              <div className="cp-rd-tags">
                {project.tags.map((t) => (
                  <span key={t}>#{t}</span>
                ))}
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="cp-ab-sec cp-rd-related">
          <div className="cp-ab-wrap">
            <Reveal className="cp-ab-headcol">
              <div className="cp-ab-tag">
                <span className="cp-ab-tag__bar" aria-hidden="true" />
                <span>Proyek lain</span>
              </div>
              <h2 className="cp-ab-h2 cp-ab-h2--line">
                Mungkin juga <span className="cp-ab-accent">menarik untuk Anda.</span>
              </h2>
            </Reveal>
            <div className="cp-rg__grid">
              {related.map((p) => (
                <ProjectCard key={p.id} p={p} unlocked />
              ))}
            </div>
            <div className="cp-rd-related__more">
              <Link href="/research#proyek" className="cp-ab-btn cp-ab-btn--primary">Lihat semua proyek <span className="cp-ab-btn__arr" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
