"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowRight, BadgeCheck, CalendarClock, FileCheck2, MessagesSquare, Sparkles } from "lucide-react";
import { Counter } from "@/components/about/motion";
import { STS_COPY } from "@/lib/content/programs";

const EASE = [0.22, 1, 0.36, 1] as const;
const line = { hidden: { opacity: 0, y: "100%" }, show: { opacity: 1, y: "0%", transition: { duration: 0.9, ease: EASE } } };
const fade = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };

type Props = { seatsOpen: number; seatsTotal: number; monthLabel: string };

/**
 * Siap Tembus Scopus hero: masked headline, counting price, and a tilting "program card"
 * whose four review rounds light up one after another.
 */
export function StsHero({ seatsOpen, seatsTotal, monthLabel }: Props) {
  const reduce = useReducedMotion();

  return (
    <section className="cp-sts-hero" aria-labelledby="cp-sts-title">
      {/* Background built from the brand: editorial column rules, the CoPublika three-quarter disc, an outlined wordmark. */}
      <div className="cp-sts-hero__bg" aria-hidden="true">
        <span className="cp-sts-hero__cols"><i /><i /><i /><i /><i /></span>
        <motion.svg
          className="cp-sts-hero__disc"
          viewBox="0 0 200 200"
          initial={reduce ? false : { rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <path d="M100 100 L200 100 A100 100 0 1 0 100 200 Z" />
        </motion.svg>
        <span className="cp-sts-hero__word">SCOPUS</span>
        <span className="cp-sts-hero__grain" />
      </div>

      <div className="cp-sts-hero__wrap">
        <motion.div className="cp-sts-hero__copy" initial={reduce ? false : "hidden"} animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
          <motion.span className="cp-sts-pill" variants={fade}>
            <i aria-hidden="true" /> {STS_COPY.hero.pill}
          </motion.span>

          <h1 id="cp-sts-title" className="cp-sts-hero__title">
            <span className="cp-sts-mask"><motion.span variants={line}>{STS_COPY.hero.title}</motion.span></span>
            <span className="cp-sts-mask"><motion.span variants={line} className="is-accent">{STS_COPY.hero.accent}<em>{STS_COPY.hero.badge}</em></motion.span></span>
          </h1>

          <motion.p className="cp-sts-hero__lead" variants={fade}>
            {STS_COPY.hero.lead}
          </motion.p>

          <motion.div className="cp-sts-buy" variants={fade}>
            <div className="cp-sts-buy__price">
              <span>{STS_COPY.hero.priceLabel}</span>
              <strong>Rp. <Counter value="600.000" /></strong>
            </div>
            <div className="cp-sts-buy__seats">
              <span>{monthLabel}</span>
              <strong>{seatsOpen}<small>/{seatsTotal} kursi</small></strong>
              <i style={{ ["--fill" as never]: `${(seatsOpen / seatsTotal) * 100}%` }} aria-hidden="true" />
            </div>
          </motion.div>

          <motion.div className="cp-sts-hero__ctas" variants={fade}>
            <Link href="#mentor" className="cp-ab-btn cp-ab-btn--primary">
              {STS_COPY.hero.ctaPrimary} <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="#alur" className="cp-ab-btn cp-ab-btn--line">{STS_COPY.hero.ctaSecondary}</Link>
          </motion.div>

          <motion.ul className="cp-sts-hero__trust" variants={fade}>
            <li><BadgeCheck size={16} aria-hidden="true" /> {STS_COPY.hero.trust[0]}</li>
            <li><CalendarClock size={16} aria-hidden="true" /> {STS_COPY.hero.trust[1]}</li>
          </motion.ul>
        </motion.div>

        <motion.div
          className="cp-sts-hero__visual"
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
        >
          <ProgramCard reduce={!!reduce} />
        </motion.div>
      </div>
    </section>
  );
}

/** The program as one card that tilts toward the pointer; review rounds light up in turn. */
function ProgramCard({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 140, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 140, damping: 18 });
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => setRound((r) => (r + 1) % 5), 1600);
    return () => window.clearInterval(t);
  }, [reduce]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const done = reduce ? 4 : round;

  return (
    <div className="cp-sts-card-stage" ref={ref} onPointerMove={onMove} onPointerLeave={reset} aria-hidden="true">
      <motion.div className="cp-sts-card" style={{ rotateX: rx, rotateY: ry }}>
        <div className="cp-sts-card__session">
          <div>
            <span className="cp-sts-card__k">Sesi 1-on-1 · online</span>
            <strong>90 menit</strong>
            <span className="cp-sts-card__meta"><MessagesSquare size={14} /> Bedah naskah & strategi jurnal</span>
          </div>
          <svg viewBox="0 0 64 64" className="cp-sts-card__clock">
            <circle cx="32" cy="32" r="26" />
            <motion.circle
              cx="32" cy="32" r="26" pathLength={1}
              initial={{ pathLength: reduce ? 0.75 : 0 }}
              animate={{ pathLength: 0.75 }}
              transition={{ duration: 1.6, delay: 0.8, ease: EASE }}
            />
          </svg>
        </div>

        <div className="cp-sts-card__rounds">
          <div className="cp-sts-card__rhead">
            <span>Putaran review</span>
            <strong>{Math.min(done, 4)}/4</strong>
          </div>
          <div className="cp-sts-card__bar"><i style={{ width: `${(Math.min(done, 4) / 4) * 100}%` }} /></div>
          <ol>
            {[1, 2, 3, 4].map((n) => (
              <li key={n} className={n <= done ? "is-done" : n === done + 1 ? "is-now" : ""}>
                <span className="cp-sts-card__doc"><i /><i /><i /></span>
                <span>
                  <strong>Review {n}</strong>
                  <small>{n === 4 ? "Naskah siap submit" : "Catatan revisi tertulis"}</small>
                </span>
                <FileCheck2 size={16} />
              </li>
            ))}
          </ol>
        </div>

        <motion.span className="cp-sts-float cp-sts-float--a" animate={reduce ? undefined : { y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
          <Sparkles size={14} /> {STS_COPY.hero.floatA}
        </motion.span>
        <motion.span className="cp-sts-float cp-sts-float--b" animate={reduce ? undefined : { y: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
          <BadgeCheck size={14} /> {STS_COPY.hero.floatB}
        </motion.span>
      </motion.div>
    </div>
  );
}
