"use client";

import { ArrowRight, FileSearch, PenLine, Send, UsersRound, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/about/motion";
import { ACTIVE_PROJECTS, type ActiveProjectStatus } from "@/lib/data/active-projects";
import { PHASES } from "@/lib/content/research";
import { focusResearch } from "./events";

type Step = {
  n: string;
  /** Matches the phase shown on project cards (PHASES). */
  status: ActiveProjectStatus;
  phase: string;
  title: string;
  desc: string;
  output: string;
  Icon: LucideIcon;
};

const label = (key: Step["status"]) => PHASES.find((p) => p.key === key)!.label;

export const STEPS: Step[] = [
  {
    n: "01",
    status: "recruiting",
    phase: label("recruiting"),
    title: "Bentuk tim & ide",
    desc: "Pilih cluster sesuai bidang, gabung proyek yang sedang mencari kolaborator atau ajukan ide sendiri. Tim menyepakati research question dan pembagian peran.",
    output: "Concept note 1 halaman",
    Icon: UsersRound,
  },
  {
    n: "02",
    status: "writing",
    phase: label("writing"),
    title: "Tulis bersama",
    desc: "Sprint penulisan dengan klinik manuskrip mingguan bersama mentor. Setiap author dan co-author menulis bagian sesuai perannya.",
    output: "Draf naskah lengkap",
    Icon: PenLine,
  },
  {
    n: "03",
    status: "review",
    phase: label("review"),
    title: "Review artikel",
    desc: "Draf dibaca ulang lewat peer-review internal dan klinik manuskrip. Tim merevisi sampai naskah siap dikirim.",
    output: "Naskah final",
    Icon: FileSearch,
  },
  {
    n: "04",
    status: "submitted",
    phase: label("submitted"),
    title: "Submit ke jurnal",
    desc: "Pilih jurnal target, siapkan cover letter, lalu kirim naskah. Mentor tetap mendampingi bila jurnal meminta revisi.",
    output: "Naskah terkirim",
    Icon: Send,
  },
];

/** Section text; also the admin seed for "Halaman Riset → Cara kerja". */
export const PROCESS_COPY = {
  tag: "Cara kerja",
  heading: "Empat tahap,",
  headingAccent: "dari ide sampai submit.",
  sub: "Tahap ini sama dengan yang tertera di setiap kartu proyek, jadi Anda bisa langsung melihat proyek mana yang sedang berada di tahap tersebut.",
};

export function ResearchProcess() {
  return (
    <section className="cp-rw" aria-labelledby="cp-rw-title">
      <div className="cp-rw__bg" aria-hidden="true">
        <span className="cp-rw__spot" />
        <span className="cp-rw__floor" />
        <span className="cp-rw__grain" />
      </div>
      <div className="cp-ab-wrap">
        <Reveal className="cp-ab-headcol cp-ab-headcol--ink">
          <div className="cp-ab-tag cp-ab-tag--ink">
            <span className="cp-ab-tag__bar" aria-hidden="true" />
            <span>{PROCESS_COPY.tag}</span>
          </div>
          <h2 id="cp-rw-title" className="cp-ab-h2 cp-ab-h2--line">
            {PROCESS_COPY.heading} <span className="cp-ab-accent">{PROCESS_COPY.headingAccent}</span>
          </h2>
          <p className="cp-ab-headcol__lead">
            {PROCESS_COPY.sub}
          </p>
        </Reveal>

        <ol className="cp-rw__steps">
          {STEPS.map((s, i) => {
            const count = ACTIVE_PROJECTS.filter((p) => p.status === s.status).length;
            return (
              <Reveal key={s.n} as="li" className={`cp-rw__step cp-rw__step--${s.status}`} delay={i * 0.08}>
                <div className="cp-rw__rail" aria-hidden="true">
                  <span className="cp-rw__node"><s.Icon size={20} strokeWidth={1.8} /></span>
                </div>
                <div className="cp-rw__card">
                  <div className="cp-rw__meta">
                    <span className="cp-rw__n">{s.n}</span>
                    <span className="cp-rw__phase">{s.phase}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <dl className="cp-rw__facts">
                    <div><dt>Output</dt><dd>{s.output}</dd></div>
                  </dl>
                  <button
                    type="button"
                    className="cp-rw__go"
                    onClick={() =>
                      count === 0
                        ? focusResearch({ target: "publications", cluster: "all" })
                        : focusResearch({ target: "projects", status: s.status })
                    }
                  >
                    {count === 0 ? "Lihat publikasi anggota" : `Lihat ${count} proyek di tahap ini`}
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
