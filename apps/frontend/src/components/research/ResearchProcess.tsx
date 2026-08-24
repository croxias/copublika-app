"use client";

import { useEffect, useRef, useState } from "react";

type Step = {
  n: string;
  phase: string;
  title: string;
  desc: string;
  output: string;
  duration: string;
  Icon: () => React.ReactElement;
};

const ICONS = {
  Cluster: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="6.5" r="2.5" />
      <circle cx="6.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M8.5 7.5l2 3M15.5 7.5l-2 3M8.5 16.5l2-3M15.5 16.5l-2-3" />
    </svg>
  ),
  Discover: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  Write: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3l5 5-12 12H4v-5z" />
      <path d="M14 5l5 5" />
      <path d="M4 21h16" />
    </svg>
  ),
  Submit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l4 4L19 6" />
      <path d="M22 12a10 10 0 11-3.5-7.6" />
    </svg>
  ),
};

const STEPS: Step[] = [
  {
    n: "01",
    phase: "Onboarding",
    title: "Pilih Cluster",
    desc: "Bergabung ke 1–2 cluster, bertemu cluster lead, dan kenali rekan riset di bidang yang sama.",
    output: "Profil cluster aktif",
    duration: "Minggu 1",
    Icon: ICONS.Cluster,
  },
  {
    n: "02",
    phase: "Discover",
    title: "Bangun Ide",
    desc: "Workshop ide, scoping, dan validasi research question. Output: 1-page concept note yang siap di-pitch.",
    output: "1-page Concept Note",
    duration: "Minggu 2–3",
    Icon: ICONS.Discover,
  },
  {
    n: "03",
    phase: "Write",
    title: "Tulis Bersama",
    desc: "Sprint penulisan dengan klinik manuskrip mingguan dan peer-review internal sebelum submission.",
    output: "Full Manuscript",
    duration: "Minggu 4–10",
    Icon: ICONS.Write,
  },
  {
    n: "04",
    phase: "Submit",
    title: "Kirim & Revisi",
    desc: "Strategi pemilihan jurnal, submission portal, dan pendampingan revision letter pasca peer-review.",
    output: "Submission + Revisi",
    duration: "Minggu 11–12",
    Icon: ICONS.Submit,
  },
];

export function ResearchProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // Auto-cycle the highlighted step when in view
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => {
      setActiveStep((p) => (p + 1) % STEPS.length);
    }, 3200);
    return () => clearInterval(t);
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      className={`cp-rpx ${inView ? "is-in" : ""}`}
      aria-label="Cara kerja riset CoPublika"
    >
      {/* Animated background layers */}
      <div className="cp-rpx-bg" aria-hidden="true">
        <div className="cp-rpx-bg__grid" />
        <div className="cp-rpx-bg__orb cp-rpx-bg__orb--a" />
        <div className="cp-rpx-bg__orb cp-rpx-bg__orb--b" />
        <div className="cp-rpx-bg__orb cp-rpx-bg__orb--c" />
        <div className="cp-rpx-bg__scan" />
        <svg className="cp-rpx-bg__particles" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => {
            const x = (i * 5.3 + 7) % 100;
            const y = (i * 7.1 + 11) % 100;
            const d = 6 + (i % 5);
            return (
              <circle key={i} cx={x} cy={y} r="0.22" fill={i % 4 === 0 ? "#E9711C" : "rgba(255,255,255,0.45)"} opacity={i % 3 === 0 ? 0.75 : 0.45}>
                <animate attributeName="cy" values={`${y};${(y + 6) % 100};${y}`} dur={`${d}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.9;0.2" dur={`${d * 0.7}s`} repeatCount="indefinite" />
              </circle>
            );
          })}
        </svg>
      </div>

      <div className="cp-rpx-wrap">
        <div className="cp-rpx-head">
          <div className="cp-sh-tag cp-rpx-tag">
            <span className="cp-sh-tag__bar" />
            <span className="cp-sh-tag__num">R.02</span>
            <span>Cara kerja</span>
          </div>
          <h2 className="cp-rpx-h">
            Empat tahap.{" "}
            <span className="cp-rpx-h__accent">Satu naskah yang siap submit.</span>
          </h2>
          <p className="cp-rpx-sub">
            Tidak ada fase yang dilewati — setiap tahap memiliki output konkret dan
            checkpoint yang terdokumentasi. Klik tiap node untuk mendalami.
          </p>
        </div>

        {/* Journey */}
        <div className="cp-rpx-journey" role="list">
          {/* Connecting line + animated progress */}
          <svg className="cp-rpx-line" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="rpxGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#E9711C" stopOpacity="0" />
                <stop offset="50%" stopColor="#E9711C" stopOpacity="1" />
                <stop offset="100%" stopColor="#E9711C" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" y1="30" x2="1000" y2="30" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <line
              className="cp-rpx-line__draw"
              x1="0" y1="30" x2="1000" y2="30"
              stroke="url(#rpxGrad)" strokeWidth="2" strokeDasharray="1000" strokeDashoffset="1000"
            />
          </svg>

          {STEPS.map((s, i) => (
            <button
              key={s.n}
              type="button"
              role="listitem"
              className={`cp-rpx-station ${activeStep === i ? "is-active" : ""}`}
              style={{ ["--i" as never]: i }}
              onClick={() => setActiveStep(i)}
              onMouseEnter={() => setActiveStep(i)}
              aria-label={`Tahap ${s.n}: ${s.title}`}
            >
              {/* Node ring */}
              <div className="cp-rpx-node">
                <svg className="cp-rpx-ring" viewBox="0 0 56 56" aria-hidden="true">
                  <circle cx="28" cy="28" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <circle
                    className="cp-rpx-ring__progress"
                    cx="28" cy="28" r="26"
                    fill="none" stroke="#E9711C" strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    strokeDashoffset={`${2 * Math.PI * 26}`}
                    transform="rotate(-90 28 28)"
                  />
                </svg>
                <span className="cp-rpx-node__num">{s.n}</span>
                <span className="cp-rpx-node__icon" aria-hidden="true">
                  <s.Icon />
                </span>
                <span className="cp-rpx-node__pulse" aria-hidden="true" />
              </div>

              {/* Card */}
              <div className="cp-rpx-card">
                <div className="cp-rpx-card__phase">
                  <span className="cp-rpx-card__dot" />
                  {s.phase}
                </div>
                <h3 className="cp-rpx-card__title">{s.title}</h3>
                <p className="cp-rpx-card__desc">{s.desc}</p>
                <div className="cp-rpx-card__foot">
                  <div className="cp-rpx-card__chip">
                    <span className="cp-rpx-card__chip-l">Output</span>
                    <span className="cp-rpx-card__chip-v">{s.output}</span>
                  </div>
                  <div className="cp-rpx-card__chip">
                    <span className="cp-rpx-card__chip-l">Waktu</span>
                    <span className="cp-rpx-card__chip-v">{s.duration}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Step indicator (mobile + desktop) */}
        <div className="cp-rpx-indicator" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span
              key={s.n}
              className={`cp-rpx-indicator__dot ${activeStep === i ? "is-active" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
