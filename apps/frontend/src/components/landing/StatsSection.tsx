import type { CSSProperties } from "react";

// "Metode kami": the CoPublika journey as one diagram. A curved path runs
// through three stations; it draws in when revealed and a spark keeps
// travelling along it. Hovering a station lights it and its caption.

const STAGES = [
  {
    label: "Temukan",
    title: "Rekan riset yang tepat",
    text: "Cari akademisi berdasarkan bidang keahlian, bukan sekadar koneksi.",
    tag: "Pencarian berbasis kepakaran",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
  },
  {
    label: "Terhubung",
    title: "Kolaborasi lintas disiplin",
    text: "Bentuk tim dari kampus dan bidang berbeda, dengan umpan balik yang menajamkan gagasan.",
    tag: "Tim lintas kampus",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <circle cx="12" cy="18" r="2.5" />
        <path d="M8 7.5 10.8 16M16 7.5 13.2 16M8.5 6h7" />
      </svg>
    ),
  },
  {
    label: "Terbitkan",
    title: "Naskah sampai terbit",
    text: "Mentor, klinik naskah, dan ritme kerja yang jelas sampai ke jurnal bereputasi.",
    tag: "Pendampingan hingga terbit",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5M9 14l2 2 4-4" />
      </svg>
    ),
  },
];

// The journey path in a 1200x200 box: through the three stations at
// x = 200, 600, 1000 on alternating heights.
// Station heights on that path; nodes sit on these so the line runs through them.
const STATION_Y = [70, 130, 70];
const PATH = "M0 150 C 100 150, 120 70, 200 70 S 420 150, 600 130 S 840 60, 1000 70 S 1150 150, 1200 140";

export function StatsSection() {
  return (
    <section className="cp-proof" aria-labelledby="cp-proof-title">
      <div className="cp-proof__inner">
        <header className="cp-proof__head cp-proof__head--single" data-reveal>
          <div>
            <div className="cp-sh-tag">
              <span className="cp-sh-tag__bar" />
              <span>Metode kami</span>
            </div>
            <h2 id="cp-proof-title" className="cp-sh-h cp-sh-h--line">
              Dari pertanyaan, <span className="cp-sh-h-accent">menuju kontribusi.</span>
            </h2>
          </div>
        </header>

        <div className="cp-journey" data-reveal>
          <svg className="cp-journey__path" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="cp-journey-grad" x1="0" x2="1">
                <stop offset="0" stopColor="#E9711C" stopOpacity="0.15" />
                <stop offset="0.5" stopColor="#E9711C" />
                <stop offset="1" stopColor="#E9711C" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            <path className="cp-journey__track" d={PATH} pathLength={1} vectorEffect="non-scaling-stroke" />
            <path className="cp-journey__line" d={PATH} pathLength={1} stroke="url(#cp-journey-grad)" vectorEffect="non-scaling-stroke" />
            <circle className="cp-journey__spark" r="5">
              <animateMotion dur="7s" repeatCount="indefinite" path={PATH} />
            </circle>
          </svg>

          <ol className="cp-journey__stations">
            {STAGES.map((s, i) => (
              <li key={s.label} className="cp-journey__station" style={{ "--i": i, "--y": `${STATION_Y[i]}px` } as CSSProperties}>
                <span className="cp-journey__node" aria-hidden="true">
                  <span className="cp-journey__ring" />
                  {s.icon}
                </span>
                <div className="cp-journey__body">
                  <p className="cp-journey__label">{s.label}</p>
                  <h3 className="cp-journey__title">{s.title}</h3>
                  <p className="cp-journey__text">{s.text}</p>
                  <span className="cp-journey__tag">{s.tag}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
