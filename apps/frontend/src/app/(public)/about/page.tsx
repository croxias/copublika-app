import type { Metadata } from "next";
import Link from "next/link";
import { AboutHero } from "@/components/about/AboutHero";
import { Ecosystem } from "@/components/about/Ecosystem";
import { IconBadge } from "@/components/about/IconBadge";
import { Journey } from "@/components/about/Journey";
import { VisionMission } from "@/components/about/VisionMission";
import { Reveal, Stagger, StaggerItem, TiltCard } from "@/components/about/motion";
import { ABOUT_FACTS, ABOUT_INTRO, VALUES } from "@/lib/content/about";

export const metadata: Metadata = {
  title: "About Us — CoPublika",
  description: "CoPublika adalah komunitas riset terkurasi untuk akademisi pemula di Indonesia: nilai, visi-misi, dan perjalanan kami.",
};

export default function AboutPage() {
  return (
    <main className="cp-ab">
      <AboutHero />

      {/* Tentang CoPublika */}
      <section className="cp-ab-sec">
        <div className="cp-ab-wrap">
          <Reveal className="cp-ab-headcol">
            <SectionTag label="Tentang CoPublika" />
            <h2 className="cp-ab-h2 cp-ab-h2--line">
              Satu ekosistem, <span className="cp-ab-accent">dari ide sampai terbit.</span>
            </h2>
            <p className="cp-ab-headcol__lead">{ABOUT_INTRO.lead}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <Ecosystem />
          </Reveal>

          <Stagger as="dl" className="cp-ab-facts">
            {ABOUT_FACTS.map((f) => (
              <StaggerItem key={f.label} className="cp-ab-fact cp-ab-hov">
                <IconBadge icon={f.icon} size={44} />
                <div>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="cp-ab-sec cp-ab-sec--ink cp-ab-vmsec">
        <div className="cp-ab-vm__glow" aria-hidden="true" />
        <div className="cp-ab-wrap">
          <Reveal className="cp-ab-headcol cp-ab-headcol--ink">
            <SectionTag label="Visi & Misi" ink />
            <h2 className="cp-ab-h2 cp-ab-h2--line">
              Empat misi, <span className="cp-ab-accent">satu arah.</span>
            </h2>
          </Reveal>
          <VisionMission />
        </div>
      </section>

      {/* Nilai */}
      <section className="cp-ab-sec">
        <div className="cp-ab-wrap">
          <Reveal className="cp-ab-headcol">
            <SectionTag label="Nilai CoPublika" />
            <h2 className="cp-ab-h2 cp-ab-h2--line">
              Empat prinsip <span className="cp-ab-accent">yang kami pegang.</span>
            </h2>
          </Reveal>
          <Stagger className="cp-ab-values">
            {VALUES.map((v) => {
              const [yes, no] = v.title.split(", bukan ");
              return (
                <StaggerItem key={v.title}>
                  <TiltCard className="cp-ab-value cp-ab-hov">
                    <IconBadge icon={v.icon} size={52} />
                    <h3>
                      <span className="cp-ab-value__yes">{yes}</span>
                      {no && <span className="cp-ab-value__no">bukan <s>{no}</s></span>}
                    </h3>
                    <p>{v.text}</p>
                  </TiltCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Perjalanan */}
      <Journey />

      {/* Lanjut ke tim dan mentor */}
      <section className="cp-ab-sec">
        <Stagger className="cp-ab-wrap cp-ab-next">
          <StaggerItem>
            <Link href="/about/team" className="cp-ab-next__card cp-ab-hov">
              <IconBadge icon="users" size={60} />
              <span className="cp-ab-next__k">Our Team</span>
              <strong>Pengurus yang menjalankan CoPublika</strong>
              <span className="cp-ab-next__p">Sambutan pendiri dan struktur organisasi, dari pimpinan sampai sekretariat.</span>
              <span className="cp-ab-next__go" aria-hidden="true">→</span>
            </Link>
          </StaggerItem>
          <StaggerItem>
            <Link href="/about/mentors" className="cp-ab-next__card cp-ab-next__card--ink cp-ab-hov">
              <IconBadge icon="cap" tone="solid" size={60} />
              <span className="cp-ab-next__k">Our Mentors</span>
              <strong>Peneliti aktif yang mendampingi anggota</strong>
              <span className="cp-ab-next__p">Bidang keahlian, rekam jejak, dan cara mereka membantu naskah Anda.</span>
              <span className="cp-ab-next__go" aria-hidden="true">→</span>
            </Link>
          </StaggerItem>
        </Stagger>
      </section>
    </main>
  );
}

function SectionTag({ label, ink = false }: { label: string; ink?: boolean }) {
  return (
    <div className={`cp-ab-tag ${ink ? "cp-ab-tag--ink" : ""}`}>
      <span className="cp-ab-tag__bar" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
