"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  label: string;
  value: number;
  suffix?: string;
  desc: string;
  spark: number[];
};

const STATS: Stat[] = [
  {
    label: "Anggota komunitas",
    value: 1240,
    suffix: "+",
    desc: "Akademisi dari 80+ kampus",
    spark: [0.3, 0.42, 0.55, 0.48, 0.7, 0.82, 0.78, 1],
  },
  {
    label: "Publikasi terindeks",
    value: 318,
    desc: "Scopus, Sinta, WoS",
    spark: [0.2, 0.35, 0.5, 0.62, 0.78, 0.7, 0.88, 1],
  },
  {
    label: "Mentor aktif",
    value: 47,
    desc: "Editor & reviewer jurnal Q1–Q4",
    spark: [0.4, 0.5, 0.45, 0.62, 0.7, 0.85, 0.78, 1],
  },
  {
    label: "Tingkat akseptasi",
    value: 76,
    suffix: "%",
    desc: "Untuk submission cohort 2024",
    spark: [0.5, 0.6, 0.55, 0.72, 0.78, 0.85, 0.92, 1],
  },
];

function format(n: number) {
  return new Intl.NumberFormat("id-ID").format(Math.round(n));
}

function StatCard({ stat, delay }: { stat: Stat; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 2000;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 5);
      setShown(eased * stat.value);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, stat.value]);

  return (
    <div ref={ref} className={`cp-stat ${inView ? "is-in" : ""}`} style={{ ["--d" as never]: `${delay}s` }}>
      <div className="cp-stat__label">{stat.label}</div>
      <div className="cp-stat__value">
        {format(shown)}
        {stat.suffix ? <span className="cp-stat__suffix">{stat.suffix}</span> : null}
      </div>
      <div className="cp-stat__desc">{stat.desc}</div>
      <div className="cp-stat__spark" aria-hidden="true">
        {stat.spark.map((h, i) => (
          <span key={i} style={{ ["--h" as never]: h, ["--i" as never]: i }} />
        ))}
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="cp-stats">
      <div className="cp-stats__wrap">
        <div className="cp-section-head cp-section-head--center">
          <div className="cp-sh-tag" style={{ marginBottom: 16 }}>
            <span className="cp-sh-tag__num">02</span>
            <span>Dampak</span>
          </div>
          <h2 className="cp-sh-h">Angka yang berbicara.</h2>
          <p className="cp-sh-sub">
            Dalam dua tahun terakhir, anggota CoPublika menerbitkan ratusan artikel di
            jurnal terindeks dan membangun puluhan kelompok riset baru.
          </p>
        </div>
      </div>
      <div className="cp-stats__wrap">
        <div className="cp-stats__grid">
          {STATS.map((s, i) => (
            <StatCard key={s.label} stat={s} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
