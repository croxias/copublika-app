import { Reveal } from "@/components/about/motion";

/** Centered section heading in the About design system: orange tag, title with accent, lead. */
export function SectionHead({ tag, title, accent, lead, ink }: { tag: string; title: string; accent?: string; lead?: string; ink?: boolean }) {
  return (
    <Reveal className={`cp-ab-headcol ${ink ? "cp-ab-headcol--ink" : ""}`}>
      <div className={`cp-ab-tag ${ink ? "cp-ab-tag--ink" : ""}`}>
        <span className="cp-ab-tag__bar" aria-hidden="true" />
        <span>{tag}</span>
      </div>
      <h2 className="cp-ab-h2">
        {title} {accent && <span className="cp-ab-accent">{accent}</span>}
      </h2>
      {lead && <p className="cp-ab-headcol__lead">{lead}</p>}
    </Reveal>
  );
}
