"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import { Counter } from "@/components/about/motion";
import { RESEARCH_STATS } from "@/lib/content/research";
import { FieldGlobe } from "./FieldGlobe";

/** Hero text; also the admin seed for "Halaman Riset → Hero". */
export const HERO_COPY = {
  eyebrow: "Riset kolaboratif lintas disiplin",
  title: "Riset yang berdampak.",
  titleAccent: "Dikerjakan bersama.",
  lead: "Lihat proyek yang sedang berjalan, temukan rekan sebidang, dan ikut menulis naskah berikutnya di jurnal bereputasi.",
  ctaPrimary: "Jelajahi proyek",
  ctaSecondary: "Cari publikasi",
};

/** Kept for the admin seed (research.hero stats). */
export const STATS = RESEARCH_STATS.map((s) => ({ v: `${s.value}${s.accent}`, l: s.label }));

const EASE = [0.22, 1, 0.36, 1] as const;
const line = { hidden: { opacity: 0, y: "60%" }, show: { opacity: 1, y: "0%", transition: { duration: 0.9, ease: EASE } } };

/** Research hero: statement on the left, an interactive 3D globe of research fields on the right. */
export function ResearchHero() {
  const reduce = useReducedMotion();

  return (
    <section className="cp-rh" aria-labelledby="cp-rh-title">
      <div className="cp-ab-hero__bg" aria-hidden="true" />
      <div className="cp-ab-hero__beam" aria-hidden="true" />
      <div className="cp-rh__wrap">
        <motion.div className="cp-rh__copy" initial={reduce ? false : "hidden"} animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
          <motion.span className="cp-ab-eyebrow" variants={line}>
            <span className="cp-ab-eyebrow__dot" aria-hidden="true" />
            {HERO_COPY.eyebrow}
          </motion.span>
          <h1 id="cp-rh-title" className="cp-ab-hero__h">
            <span className="cp-ab-hero__mask"><motion.span className="cp-ab-hero__line" variants={line}>{HERO_COPY.title}</motion.span></span>
            <span className="cp-ab-hero__mask"><motion.span className="cp-ab-hero__line cp-ab-hero__accent" variants={line}>{HERO_COPY.titleAccent}</motion.span></span>
          </h1>
          <motion.p className="cp-ab-hero__lead" variants={line}>
            {HERO_COPY.lead}
          </motion.p>
          <motion.div className="cp-ab-hero__ctas" variants={line}>
            <a href="#proyek" className="cp-ab-btn cp-ab-btn--primary">
              {HERO_COPY.ctaPrimary} <span className="cp-ab-btn__arr" aria-hidden="true">→</span>
            </a>
            <a href="#publikasi" className="cp-ab-btn cp-ab-btn--line">
              <Search size={16} /> {HERO_COPY.ctaSecondary}
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="cp-rh__visual"
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
        >
          <FieldGlobe />
        </motion.div>
      </div>

      <div className="cp-ab-hero__stats">
        {RESEARCH_STATS.map((s, i) => (
          <motion.div key={s.label} className="cp-ab-hero__stat" initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1, duration: 0.7, ease: EASE }}>
            <span className="cp-ab-hero__stat-v">
              <Counter value={s.value} />
              {s.accent && <em>{s.accent}</em>}
            </span>
            <span className="cp-ab-hero__stat-l">{s.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
