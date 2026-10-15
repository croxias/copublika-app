import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function KpiBento({ kpis }: { kpis: { label: string; value: string }[] }) {
  return (
    <section className="py-20">
      <div className="cp-wrap w-full max-w-[var(--max)] mx-auto">
        <SectionHeader
          eyebrow="Proof of momentum"
          title="A research engine built for measurable output."
          description="Every cohort is designed around accountable progress: verified scholars, active projects, and publication-oriented execution."
          align="center"
        />
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="text-center">
              <div className="text-4xl font-bold tracking-tight text-[var(--foreground)]">{kpi.value}</div>
              <div className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{kpi.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
