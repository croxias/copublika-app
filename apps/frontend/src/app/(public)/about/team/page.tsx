import type { Metadata } from "next";
import { AboutPageHero } from "@/components/about/AboutHero";
import { JoinSection } from "@/components/about/JoinSection";
import { OrgTree } from "@/components/about/OrgTree";
import { SocialLinks } from "@/components/about/SocialLinks";
import { TeamDirectory } from "@/components/about/TeamDirectory";
import { Reveal } from "@/components/about/motion";
import { CEO_WELCOME, JOIN_TEAM, ORG, TEAM_HERO, TEAM_SECTION } from "@/lib/content/about";

export const metadata: Metadata = {
  title: "Our Team — CoPublika",
  description: "Sambutan pendiri dan struktur pengurus CoPublika: pimpinan eksekutif, kepala divisi, dan sekretariat.",
};

export default function TeamPage() {
  const members = ORG.flatMap((u) => u.members);
  const filled = members.filter((m) => m.person).length;
  const open = members.filter((m) => !m.person);
  const ceo = CEO_WELCOME.person;
  return (
    <main className="cp-ab">
      <AboutPageHero
        eyebrow={TEAM_HERO.eyebrow}
        title={TEAM_HERO.title}
        accent={TEAM_HERO.accent}
        stats={[
          { value: String(filled), label: "Pengurus inti" },
          { value: String(ORG.length), label: "Unit organisasi" },
          { value: String(open.length), label: "Posisi terbuka" },
        ]}
      />

      {/* Sambutan CEO */}
      <section className="cp-ab-sec">
        <div className="cp-ab-wrap cp-ab-ceo">
          <Reveal className="cp-ab-ceo__photo-wrap">
            <figure className="cp-ab-ceo__photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ceo.photo} alt={`Foto ${ceo.name}`} />
              <figcaption>
                <strong>{ceo.name}</strong>
                <span>{CEO_WELCOME.title}</span>
              </figcaption>
            </figure>
          </Reveal>
          <div className="cp-ab-ceo__letter">
            <Reveal>
              <div className="cp-ab-tag">
                <span className="cp-ab-tag__bar" aria-hidden="true" />
                <span>Sambutan Founder &amp; CEO</span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <svg className="cp-ab-ceo__mark" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M9 7H5C5 4.5 6 3 8 3l1-2C6 1 3 4 3 8v8h6V7zm10 0h-4c0-2.5 1-4 3-4l1-2c-3 0-6 3-6 7v8h6V7z" />
              </svg>
              <h2 className="cp-ab-h2">{CEO_WELCOME.heading}</h2>
            </Reveal>
            {CEO_WELCOME.paragraphs.map((p, i) => (
              <Reveal key={p.slice(0, 24)} delay={0.1 + i * 0.06}>
                <p>{p}</p>
              </Reveal>
            ))}
            <Reveal className="cp-ab-ceo__sign" delay={0.2}>
              <span>{CEO_WELCOME.signoff}</span>
              <strong>{ceo.name}</strong>
              <em>{CEO_WELCOME.title}</em>
              <SocialLinks name={ceo.name} linkedin={ceo.linkedinUrl} instagram={ceo.instagramUrl} email={ceo.email} className="cp-ab-ceo__social" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Struktur organisasi & pengurus */}
      <section className="cp-ab-sec cp-ab-sec--warm">
        <div className="cp-ab-wrap">
          <Reveal className="cp-ab-headcol">
            <div className="cp-ab-tag">
              <span className="cp-ab-tag__bar" aria-hidden="true" />
              <span>{TEAM_SECTION.tag}</span>
            </div>
            <h2 className="cp-ab-h2 cp-ab-h2--line">
              {TEAM_SECTION.title} <span className="cp-ab-accent">{TEAM_SECTION.accent}</span>
            </h2>
          </Reveal>
          <OrgTree units={ORG} />
          <TeamDirectory units={ORG} />
        </div>
      </section>

      <JoinSection id="gabung" {...JOIN_TEAM} listTitle={`${open.length} posisi sedang dibuka`} list={open.map((m) => `${m.roleId} (${m.role})`)} />
    </main>
  );
}
