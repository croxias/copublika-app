import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

const STEPS = [
  {
    title: "Apply with Google Scholar ID",
    desc: "Submit identity and academic profile. Google Scholar ID is mandatory for baseline credibility verification.",
  },
  {
    title: "Metadata verification",
    desc: "Our team validates profile consistency, publication signal, and institutional alignment.",
  },
  {
    title: "Council review",
    desc: "Curation Council evaluates fit with cohort focus, collaboration potential, and execution readiness.",
  },
  {
    title: "Decision",
    desc: "Applicants receive approved or rejected status with onboarding instructions for the selected batch.",
  },
  {
    title: "Member activation",
    desc: "Approved members are staged for program onboarding and collaboration sprint kickoff.",
  },
];

export default function CurationProcessPage() {
  return (
    <section className="py-24">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Curation Process"
          title="How batch admissions work."
          description="Selective intake ensures each cohort has strong collaboration fit and publication execution capacity."
          align="center"
        />
        <div className="mt-14 space-y-4 max-w-4xl mx-auto">
          {STEPS.map((step, index) => (
            <Card key={step.title} className="flex gap-5">
              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">{step.title}</h3>
                <p className="mt-1 text-sm leading-7 text-[var(--muted)]">{step.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
