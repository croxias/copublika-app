import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, MonitorPlay } from "lucide-react";
import { Reveal } from "@/components/about/motion";
import { BtmBento } from "@/components/program/bootcamp/BtmBento";
import { BtmHero } from "@/components/program/bootcamp/BtmHero";
import { BtmPlan } from "@/components/program/bootcamp/BtmPlan";
import { FitFaq } from "@/components/program/FitFaq";
import { SectionHead } from "@/components/program/shared";
import { BTM_COPY } from "@/lib/content/programs";
import { BOOTCAMP_BATCHES, PROGRAMS, formatDate, formatRupiah, webinarDates } from "@/lib/data/programs";

const program = PROGRAMS["bootcamp-menulis"];

export const metadata = {
  title: "Bootcamp 30 Hari Menulis — CoPublika",
  description: "Tiga puluh hari menulis bersama satu angkatan: webinar mingguan, tools penulisan, pelacak progres, dan review gratis oleh mentor.",
};

const register = (id: string) => `/daftar?program=bootcamp-menulis&angkatan=${id}`;

export default function BootcampMenulisPage() {
  const next = BOOTCAMP_BATCHES[0];

  return (
    <main className="cp-pg cp-sts cp-btm">
      <BtmHero batch={next} registerHref={register(next.id)} />

      <section className="cp-ab-sec cp-sts-sec cp-sts-sec--warm">
        <div className="cp-sts-sec__glow" aria-hidden="true" />
        <div className="cp-ab-wrap">
          <SectionHead {...BTM_COPY.benefits} />
          <BtmBento batch={next} />
        </div>
      </section>

      <section className="cp-ab-sec cp-sts-sec cp-sts-sec--dark" id="rencana">
        <div className="cp-sts-sec__stars" aria-hidden="true" />
        <div className="cp-ab-wrap">
          <SectionHead ink {...BTM_COPY.plan} />
          <BtmPlan batch={next} />
        </div>
      </section>

      <section className="cp-ab-sec cp-sts-sec cp-sts-sec--grid" id="angkatan">
        <div className="cp-ab-wrap">
          <SectionHead {...BTM_COPY.batches} />
          <div className="cp-btm-batches">
            {BOOTCAMP_BATCHES.map((b, i) => (
              <Reveal key={b.id} className={`cp-btm-batch ${i === 0 ? "is-next" : ""}`} delay={i * 0.08}>
                <div className="cp-btm-batch__top">
                  <span className="cp-btm-batch__name">{b.name}</span>
                  <span className="cp-btm-batch__badge">{i === 0 ? "Pendaftaran dibuka" : "Segera dibuka"}</span>
                </div>
                <strong className="cp-btm-batch__dates">{formatDate(b.start, false)} – {formatDate(b.end)}</strong>
                <ul>
                  <li><Clock3 size={15} aria-hidden="true" /> Daftar sampai {formatDate(b.closes)}</li>
                  <li><MonitorPlay size={15} aria-hidden="true" /> {b.webinar}</li>
                </ul>
                <div className="cp-btm-batch__webinars" aria-label="Tanggal webinar">
                  {webinarDates(b).map((d, k) => (
                    <span key={d}><small>W{k + 1}</small>{formatDate(d, false)}</span>
                  ))}
                </div>
                <div className="cp-btm-batch__foot">
                  <strong>{formatRupiah(program.price)}</strong>
                  <Link href={register(b.id)} className="cp-btm-batch__btn">
                    <CalendarDays size={15} aria-hidden="true" /> Daftar {b.name} <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cp-sts-ffsec">
        <div className="cp-ab-wrap">
          <FitFaq faq={BTM_COPY.faq} variant="bootcamp" />
        </div>
      </section>

      <section className="cp-sts-final">
        <div className="cp-sts-final__rings" aria-hidden="true" />
        <div className="cp-ab-wrap cp-sts-final__wrap">
          <Reveal className="cp-sts-final__copy">
            <span className="cp-sts-final__tag">{next.name} · mulai {formatDate(next.start)}</span>
            <h2>{BTM_COPY.final.title}</h2>
            <p>Pendaftaran ditutup {formatDate(next.closes)}. Daftar sekarang, akun member CoPublika dibuat sekaligus.</p>
          </Reveal>
          <Reveal className="cp-sts-final__buy" delay={0.1}>
            <span>{program.name}</span>
            <strong>{formatRupiah(program.price)}</strong>
            <small>{BTM_COPY.final.includes}</small>
            <Link href={register(next.id)} className="cp-sts-final__btn">
              Daftar {next.name} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
