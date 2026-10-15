"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ABOUT_HERO, ABOUT_STATS } from "@/lib/content/about";
import { HeroVideo } from "./HeroVideo";
import { Counter } from "./motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const line = { hidden: { opacity: 0, y: "60%" }, show: { opacity: 1, y: "0%", transition: { duration: 0.9, ease: EASE } } };

/**
 * About Us hero: a static statement (no slider), a cinematic YouTube video frame, and numbers
 * that count up.
 */
export function AboutHero() {
  const reduce = useReducedMotion();
  return (
    <section
      className="cp-ab-hero"
      aria-labelledby="cp-ab-hero-title"
    >
      <div className="cp-ab-hero__bg" aria-hidden="true" />
      <div className="cp-ab-hero__beam" aria-hidden="true" />
      <div className="cp-ab-hero__wrap">
        <motion.div className="cp-ab-hero__copy" initial={reduce ? false : "hidden"} animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
          <motion.span className="cp-ab-eyebrow" variants={line}>
            <span className="cp-ab-eyebrow__dot" aria-hidden="true" />
            {ABOUT_HERO.eyebrow}
          </motion.span>
          <h1 id="cp-ab-hero-title" className="cp-ab-hero__h">
            <span className="cp-ab-hero__mask"><motion.span className="cp-ab-hero__line" variants={line}>{ABOUT_HERO.line1}</motion.span></span>
            <span className="cp-ab-hero__mask"><motion.span className="cp-ab-hero__line cp-ab-hero__accent" variants={line}>{ABOUT_HERO.accent}</motion.span></span>
            <span className="cp-ab-hero__mask"><motion.span className="cp-ab-hero__line" variants={line}>{ABOUT_HERO.line2}</motion.span></span>
          </h1>
          <motion.p className="cp-ab-hero__lead" variants={line}>{ABOUT_HERO.lead}</motion.p>
          <motion.div className="cp-ab-hero__ctas" variants={line}>
            <Link href={ABOUT_HERO.primary.href} className="cp-ab-btn cp-ab-btn--primary">
              {ABOUT_HERO.primary.label} <span className="cp-ab-btn__arr" aria-hidden="true">→</span>
            </Link>
            <Link href={ABOUT_HERO.secondary.href} className="cp-ab-btn cp-ab-btn--line">
              {ABOUT_HERO.secondary.label}
            </Link>
          </motion.div>
        </motion.div>

        <HeroVideo url={ABOUT_HERO.video.url} poster={ABOUT_HERO.video.poster} title={ABOUT_HERO.video.title} caption={ABOUT_HERO.video.caption} />
      </div>

      <div className="cp-ab-hero__stats">
        {ABOUT_STATS.map((s, i) => (
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

/** Shorter hero for Our Team and Our Mentors: same surface, title, lead and a few numbers. */
export function AboutPageHero({ eyebrow, title, accent, lead, stats }: { eyebrow: string; title: string; accent: string; lead?: string; stats: { value: string; label: string }[] }) {
  const reduce = useReducedMotion();
  return (
    <section className="cp-ab-hero cp-ab-hero--page">
      <div className="cp-ab-hero__bg" aria-hidden="true" />
      <div className="cp-ab-hero__beam" aria-hidden="true" />
      <div className="cp-ab-hero__wrap cp-ab-hero__wrap--page">
        <motion.div className="cp-ab-hero__copy" initial={reduce ? false : "hidden"} animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
          <motion.span className="cp-ab-eyebrow" variants={line}>
            <span className="cp-ab-eyebrow__dot" aria-hidden="true" />
            {eyebrow}
          </motion.span>
          <h1 className="cp-ab-hero__h cp-ab-hero__h--page">
            <span className="cp-ab-hero__mask"><motion.span className="cp-ab-hero__line" variants={line}>{title}</motion.span></span>
            <span className="cp-ab-hero__mask"><motion.span className="cp-ab-hero__line cp-ab-hero__accent" variants={line}>{accent}</motion.span></span>
          </h1>
          {lead && <motion.p className="cp-ab-hero__lead" variants={line}>{lead}</motion.p>}
        </motion.div>
        <motion.dl className="cp-ab-hero__mini-stats" initial={reduce ? false : { opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.8, ease: EASE }}>
          {stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd><Counter value={s.value} /></dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
