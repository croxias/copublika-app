"use client";

import { motion, useReducedMotion } from "framer-motion";
import { JOURNEY_KPIS, TIMELINE } from "@/lib/content/about";
import { IconBadge } from "./IconBadge";
import { Counter, DrawPath } from "./motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * "Perjalanan kami": a rising journey infographic on an ink surface. The curve draws itself,
 * milestones step upward along it, and the header shows where each number started and stands now.
 */
export function Journey() {
  const reduce = useReducedMotion();
  return (
    <section className="cp-ab-journey" aria-labelledby="cp-ab-journey-title">
      <div className="cp-ab-journey__aurora" aria-hidden="true" />
      <div className="cp-ab-journey__grid" aria-hidden="true" />
      <div className="cp-ab-wrap">
        <div className="cp-ab-journey__head">
          <div className="cp-ab-headcol cp-ab-headcol--ink">
            <div className="cp-ab-tag cp-ab-tag--ink">
              <span className="cp-ab-tag__bar" aria-hidden="true" />
              <span>Perjalanan kami</span>
            </div>
            <h2 id="cp-ab-journey-title" className="cp-ab-h2 cp-ab-h2--line">
              Singkat, <span className="cp-ab-accent">tapi berarti.</span>
            </h2>
          </div>
          <div className="cp-ab-journey__kpis">
            {JOURNEY_KPIS.map((k, i) => (
              <motion.div
                key={k.label}
                className="cp-ab-kpi"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
              >
                <span className="cp-ab-kpi__from">{k.from}</span>
                <svg className="cp-ab-kpi__arrow" viewBox="0 0 40 12" aria-hidden="true"><path d="M0 6h36M30 1l6 5-6 5" /></svg>
                <span className="cp-ab-kpi__to">
                  <Counter value={k.to} />
                  {k.accent && <em>{k.accent}</em>}
                </span>
                <span className="cp-ab-kpi__label">{k.label}</span>
                <span className="cp-ab-kpi__note">{k.note}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="cp-ab-journey__stage">
          <svg className="cp-ab-journey__curve" viewBox="0 0 1200 360" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="cp-journey-line" x1="0" x2="1">
                <stop offset="0" stopColor="#e9711c" stopOpacity=".25" />
                <stop offset=".6" stopColor="#e9711c" />
                <stop offset="1" stopColor="#ffb27a" />
              </linearGradient>
              <linearGradient id="cp-journey-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#e9711c" stopOpacity=".22" />
                <stop offset="1" stopColor="#e9711c" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0 330 C 40 322, 60 302, 84 296 S 300 220, 384 212 S 600 136, 684 127 S 900 40, 984 32 S 1150 8, 1200 4 L1200 360 L0 360 Z"
              fill="url(#cp-journey-fill)"
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, delay: 0.6 }}
            />
            <DrawPath className="cp-ab-journey__path" d="M0 330 C 40 322, 60 302, 84 296 S 300 220, 384 212 S 600 136, 684 127 S 900 40, 984 32 S 1150 8, 1200 4" />
          </svg>

          <ol className="cp-ab-journey__steps">
            {TIMELINE.map((t, i) => (
              <motion.li
                key={t.title}
                className={`cp-ab-step cp-ab-hov cp-ab-step--${i + 1} ${i === TIMELINE.length - 1 ? "is-now" : ""}`}
                initial={reduce ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.22, ease: EASE }}
              >
                <span className="cp-ab-step__node" aria-hidden="true">
                  <IconBadge icon={t.icon} tone={i === TIMELINE.length - 1 ? "solid" : "dark"} size={52} />
                </span>
                <div className="cp-ab-step__card">
                  <div className="cp-ab-step__meta">
                    <span className="cp-ab-step__date">{t.date}</span>
                    <span className="cp-ab-step__stage">{t.stage}</span>
                  </div>
                  <h3>{t.title}</h3>
                  <p>{t.text}</p>
                  <div className="cp-ab-step__metrics">
                    {t.metrics.map((m) => (
                      <span key={m.label}>
                        <b><Counter value={m.value} />{m.value.includes(".") ? "+" : ""}</b>
                        {m.label}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
