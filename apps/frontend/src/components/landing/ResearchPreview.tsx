import Link from "next/link";
import type { ResearchProject } from "@/types";
import { Reveal } from "@/components/ui/Reveal";

function initials(name: string) {
  const parts = name.split(" ");
  return parts.slice(-2).map((w) => w[0]).join("");
}

function statusLabel(status: ResearchProject["status"]) {
  if (status === "published") return "Active";
  if (status === "pending") return "In Review";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function ResearchPreview({ projects }: { projects: ResearchProject[] }) {
  return (
    <section id="research" className="cp-section">
      <div className="cp-section__head">
        <div className="cp-section__eyebrow cp-mono">
          <span>§ 03</span>
          <span>Research Project · Academic Community</span>
        </div>
        <h2 className="cp-section__title">
          Active Projects.{" "}
          <span className="cp-section__title-mute">Real Collaboration.</span>
        </h2>
        <p className="cp-section__deck">
          A glimpse at studies currently moving inside the CoPublika network — led by senior academics, paired with vetted co-authors.
        </p>
      </div>
      <div className="cp-rp__grid cp-rp__grid--4">
        {projects.map((p, i) => (
          <Reveal key={p.id} className="cp-rp__card" delay={i * 80}>
            <div className="cp-rp__top">
              <span className="cp-mono cp-rp__id">{p.id.slice(0, 8).toUpperCase()}</span>
              <span className="cp-rp__status">{statusLabel(p.status)}</span>
            </div>
            <h3 className="cp-rp__title">{p.title}</h3>
            <div className="cp-rp__lead">
              <span className="cp-rp__lead-avatar">{initials(p.leadName)}</span>
              <div>
                <div className="cp-rp__lead-name">{p.leadName}</div>
                <div className="cp-rp__lead-inst">{p.leadInstitution}</div>
              </div>
            </div>
            <div className="cp-rp__tags">
              {p.tags.slice(0, 3).map((t) => (
                <span key={t} className="cp-rp__tag">{t}</span>
              ))}
            </div>
            <Link href={`/research-project/${p.id}`} style={{ display: "inline-block", marginTop: 16, fontSize: 13, fontWeight: 600 }}>
              Open preview →
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
