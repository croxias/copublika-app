import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/about/motion";
import { MentorPicker } from "@/components/program/MentorPicker";
import { SectionHead } from "@/components/program/shared";
import { StsBento } from "@/components/program/sts/StsBento";
import { FitFaq } from "@/components/program/FitFaq";
import { StsFlow } from "@/components/program/sts/StsFlow";
import { StsHero } from "@/components/program/sts/StsHero";
import { STS_COPY } from "@/lib/content/programs";
import { PROGRAMS, SEATS_PER_MENTOR, STS_MENTORS, seatMonths, seatsLeft } from "@/lib/data/programs";
import { ProgramPrice } from "@/components/program/ProgramPrice";

const program = PROGRAMS["siap-tembus-scopus"];

export const metadata = {
  title: "Siap Tembus Scopus 1-on-1 — CoPublika",
  description: "Pendampingan 1-on-1 dengan mentor: 1 sesi online 90 menit dan 4 kali review artikel. Maksimal 4 peserta per mentor setiap bulan.",
};

export default function SiapTembusScopusPage() {
  const month = seatMonths()[0];
  const total = STS_MENTORS.length * SEATS_PER_MENTOR;
  const openNow = STS_MENTORS.reduce((n, m) => n + seatsLeft(m.id, 0), 0);

  return (
    <main className="cp-pg cp-sts">
      <StsHero seatsOpen={openNow} seatsTotal={total} monthLabel={month.label} />

      <section className="cp-ab-sec cp-sts-sec cp-sts-sec--warm">
        <div className="cp-sts-sec__glow" aria-hidden="true" />
        <div className="cp-ab-wrap">
          <SectionHead {...STS_COPY.benefits} />
          <StsBento />
        </div>
      </section>

      <section className="cp-ab-sec cp-sts-sec cp-sts-sec--dark" id="alur">
        <div className="cp-sts-sec__stars" aria-hidden="true" />
        <div className="cp-ab-wrap">
          <SectionHead ink {...STS_COPY.flow} />
          <StsFlow />
        </div>
      </section>

      <section className="cp-ab-sec cp-sts-sec cp-sts-sec--grid" id="mentor">
        <div className="cp-ab-wrap">
          <SectionHead {...STS_COPY.mentors} />
          <MentorPicker />
        </div>
      </section>

      <section className="cp-sts-ffsec">
        <div className="cp-ab-wrap">
          <FitFaq faq={STS_COPY.faq} variant="sts" />
        </div>
      </section>

      <section className="cp-sts-final">
        <div className="cp-sts-final__rings" aria-hidden="true" />
        <div className="cp-ab-wrap cp-sts-final__wrap">
          <Reveal className="cp-sts-final__copy">
            <span className="cp-sts-final__tag">{openNow} kursi tersisa · {month.label}</span>
            <h2>{STS_COPY.final.title}</h2>
            <p>{STS_COPY.final.text}</p>
          </Reveal>
          <Reveal className="cp-sts-final__buy" delay={0.1}>
            <span>{program.name}</span>
            <strong><ProgramPrice program="siap-tembus-scopus" /></strong>
            <small>{STS_COPY.final.includes}</small>
            <Link href="#mentor" className="cp-sts-final__btn">
              {STS_COPY.final.cta} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
