import Link from "next/link";
import type { CSSProperties } from "react";

const WEEKS = 12;

const DETAILS = [
  { l: "Mulai", v: "15 Sep 2025" },
  { l: "Durasi", v: "12 minggu" },
  { l: "Format", v: "Hybrid" },
  { l: "Kuota", v: "24 peserta" },
];

// Each module spans a range of the 12 weeks; the timeline draws it as a bar.
const CURRICULUM = [
  { t: "Pemilihan topik & jurnal target", from: 1, to: 2 },
  { t: "Tinjauan pustaka sistematis", from: 3, to: 4 },
  { t: "Metodologi & analisis data", from: 5, to: 6 },
  { t: "Penulisan akademik bahasa Inggris", from: 7, to: 8 },
  { t: "Klinik naskah & peer review", from: 9, to: 10 },
  { t: "Submission & strategi revisi", from: 11, to: 12 },
];

export function ProgramHighlight() {
  return (
    <section className="cp-feature">
      <div className="cp-feature__wrap">
        <div className="cp-section-head" data-reveal>
          <div>
            <div className="cp-sh-tag">
              <span className="cp-sh-tag__bar" />
              <span>Program unggulan</span>
            </div>
            <h2 className="cp-sh-h cp-sh-h--line">
              Siap Tembus Scopus, <span className="cp-sh-h-accent">sampai terbit.</span>
            </h2>
          </div>
        </div>

        <div className="cp-prog">
          {/* Curriculum as a 12-week timeline */}
          <div className="cp-prog__plan" data-reveal>
            <div className="cp-prog__plan-head">
              <p className="cp-prog__eyebrow">Kurikulum</p>
              <div className="cp-prog__weeks" aria-hidden="true">
                {Array.from({ length: WEEKS }, (_, i) => (
                  <span key={i}>{i === 0 || (i + 1) % 4 === 0 ? `M${i + 1}` : ""}</span>
                ))}
              </div>
            </div>
            <ol className="cp-prog__rows">
              {CURRICULUM.map((c, i) => (
                <li key={c.t} className="cp-prog__row" style={{ "--i": i } as CSSProperties}>
                  <span className="cp-prog__module">{c.t}</span>
                  <span className="cp-prog__lane" aria-label={`Minggu ${c.from}–${c.to}`}>
                    <span
                      className="cp-prog__bar"
                      style={{ "--from": c.from - 1, "--span": c.to - c.from + 1 } as CSSProperties}
                    />
                  </span>
                  <span className="cp-prog__when">
                    M{c.from}–{c.to}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Admission pass */}
          <aside className="cp-ticket" data-reveal aria-label="Pendaftaran Batch 7">
            <div className="cp-ticket__top">
              <p className="cp-ticket__status">
                <span aria-hidden="true" /> Pendaftaran dibuka
              </p>
              <p className="cp-ticket__batch">Batch 7</p>
              <h3 className="cp-ticket__title">Siap Tembus Scopus</h3>
              <p className="cp-ticket__note">Kursi terbatas agar setiap peserta mendapat pendampingan penuh.</p>
            </div>
            <div className="cp-ticket__tear" aria-hidden="true" />
            <dl className="cp-ticket__details">
              {DETAILS.map((d) => (
                <div key={d.l}>
                  <dt>{d.l}</dt>
                  <dd>{d.v}</dd>
                </div>
              ))}
            </dl>
            <div className="cp-ticket__ctas">
              <Link href="/siap-tembus-scopus" className="cp-ticket__btn cp-ticket__btn--accent">
                Daftar sekarang <span aria-hidden="true">→</span>
              </Link>
              <Link href="/siap-tembus-scopus" className="cp-ticket__btn cp-ticket__btn--line">
                Unduh silabus
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
