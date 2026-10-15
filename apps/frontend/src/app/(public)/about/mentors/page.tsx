import type { Metadata } from "next";
import { AboutPageHero } from "@/components/about/AboutHero";
import { IconBadge } from "@/components/about/IconBadge";
import { JoinSection } from "@/components/about/JoinSection";
import { MentorDirectory } from "@/components/about/MentorDirectory";
import { Stagger, StaggerItem, TiltCard } from "@/components/about/motion";
import { JOIN_MENTOR, MENTOR_HOW, MENTORS, MENTORS_HERO, MENTORS_PER_PAGE, TOTAL_MENTORS } from "@/lib/content/about";

export const metadata: Metadata = {
  title: "Our Mentors — CoPublika",
  description: "Mentor CoPublika adalah peneliti aktif dan reviewer jurnal bereputasi yang mendampingi anggota sampai naskah terbit.",
};

export default function MentorsPage() {
  const fields = new Set(MENTORS.map((m) => m.field)).size;
  return (
    <main className="cp-ab">
      <AboutPageHero
        eyebrow={MENTORS_HERO.eyebrow}
        title={MENTORS_HERO.title}
        accent={MENTORS_HERO.accent}
        lead={MENTORS_HERO.lead}
        stats={[
          { value: String(TOTAL_MENTORS), label: "Mentor aktif" },
          { value: String(fields), label: "Bidang keahlian" },
          { value: "Q1–Q3", label: "Rekam jejak jurnal" },
        ]}
      />

      <section className="cp-ab-sec">
        <div className="cp-ab-wrap">
          <Stagger as="ul" className="cp-ab-how">
            {MENTOR_HOW.map((h) => (
              <StaggerItem as="li" key={h.title}>
                <TiltCard className="cp-ab-how__card cp-ab-hov" max={5}>
                  <IconBadge icon={h.icon} size={52} />
                  <div>
                    <strong>{h.title}</strong>
                    <span>{h.text}</span>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
          <MentorDirectory mentors={MENTORS} perPage={MENTORS_PER_PAGE} />
        </div>
      </section>

      <JoinSection {...JOIN_MENTOR} />
    </main>
  );
}
