import { Reveal } from "@/components/ui/Reveal";

type Testimonial = {
  name: string;
  role: string;
  institution: string;
  quote: string;
};

function initials(name: string) {
  return name.split(" ").slice(-2).map((w) => w[0]).join("");
}

export function Reviews({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="cp-section">
      <div className="cp-section__head">
        <div className="cp-section__eyebrow cp-mono">
          <span>§ 05</span>
          <span>Review Member</span>
        </div>
        <h2 className="cp-section__title">
          Said quietly,{" "}
          <span className="cp-section__title-mute">where it counts.</span>
        </h2>
      </div>
      <div className="cp-rev__rail">
        {testimonials.map((q, i) => (
          <Reveal key={`${q.name}-${q.institution}`} className="cp-rev__card" delay={i * 80}>
            <p className="cp-rev__q">&quot;{q.quote}&quot;</p>
            <div className="cp-rev__attr">
              <span className="cp-rev__avatar">{initials(q.name)}</span>
              <div>
                <div className="cp-rev__name">{q.name}</div>
                <div className="cp-rev__inst">{q.institution}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
