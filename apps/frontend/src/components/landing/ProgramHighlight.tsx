import Link from "next/link";

const META = [
  { l: "Durasi", v: "12 Minggu" },
  { l: "Format", v: "Hybrid" },
  { l: "Mulai", v: "15 Sep 2025" },
  { l: "Kuota", v: "24" },
];

const CURRICULUM = [
  { n: "01", t: "Pemilihan Topik & Jurnal Target", w: "W 1–2" },
  { n: "02", t: "Tinjauan Pustaka Sistematis", w: "W 3–4" },
  { n: "03", t: "Metodologi & Analisis Data", w: "W 5–6" },
  { n: "04", t: "Penulisan Akademik Bahasa Inggris", w: "W 7–8" },
  { n: "05", t: "Klinik Manuskrip & Peer Review", w: "W 9–10" },
  { n: "06", t: "Submission & Strategi Revisi", w: "W 11–12" },
];

export function ProgramHighlight() {
  return (
    <section className="cp-feature">
      <div className="cp-feature__wrap">
        <div className="cp-section-head cp-section-head--center">
          <div className="cp-sh-tag" style={{ marginBottom: 16 }}>
            <span className="cp-sh-tag__num">04</span>
            <span>Program unggulan</span>
          </div>
          <h2 className="cp-sh-h">Siap Tembus Scopus.</h2>
          <p className="cp-sh-sub">
            Bootcamp 12 minggu untuk mendampingi anda menerbitkan satu artikel di jurnal
            terindeks Scopus — dari draft hingga acceptance letter.
          </p>
        </div>

        <div className="cp-pf">
          <div className="cp-pf__left">
            <div className="cp-pf__tag">
              <span className="cp-pf__tag-dot" />
              <span>Cohort #07 — Pendaftaran Dibuka</span>
            </div>
            <h2 className="cp-pf__h">Dari ide ke acceptance letter dalam 12 minggu.</h2>
            <p className="cp-pf__lead">
              Modul terstruktur, mentor 1-on-1 dengan rekam jejak Scopus, klinik manuskrip
              mingguan, dan akses ke editor tamu dari jurnal Q1–Q3.
            </p>
            <div className="cp-pf__meta">
              {META.map((m) => (
                <div key={m.l}>
                  <span className="cp-pf__meta-l">{m.l}</span>
                  <span className="cp-pf__meta-v">{m.v}</span>
                </div>
              ))}
            </div>
            <div className="cp-pf__ctas">
              <Link href="/siap-tembus-scopus" className="cp-pf__btn cp-pf__btn--accent">
                Daftar Sekarang <span className="cp-pf__arr">→</span>
              </Link>
              <Link href="/siap-tembus-scopus" className="cp-pf__btn cp-pf__btn--line">
                Unduh Silabus
              </Link>
            </div>
          </div>
          <div className="cp-pf__right">
            <div className="cp-pf__tag" style={{ marginBottom: 24 }}>
              <span>Modul</span>
              <span style={{ color: "#666" }}>/ 12 Weeks</span>
            </div>
            <div className="cp-pf__curri">
              {CURRICULUM.map((c) => (
                <div key={c.n} className="cp-pf__curri-item">
                  <span className="cp-pf__curri-n">{c.n}</span>
                  <span className="cp-pf__curri-t">{c.t}</span>
                  <span className="cp-pf__curri-d">{c.w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
