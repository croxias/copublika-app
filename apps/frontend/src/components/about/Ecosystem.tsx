"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ECOSYSTEM } from "@/lib/content/about";
import { IconBadge } from "./IconBadge";

const EASE = [0.22, 1, 0.36, 1] as const;
const C = 250;
const R = 172;
/** Node positions around the centre, starting at the top and going clockwise. */
const POS = ECOSYSTEM.map((_, i) => {
  const a = (-90 + (360 / ECOSYSTEM.length) * i) * (Math.PI / 180);
  return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) };
});

/**
 * Interactive ecosystem map: the member sits in the middle, the five things CoPublika provides
 * sit around them. Hover or click a node to read about it; without interaction it cycles.
 */
export function Ecosystem() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const node = ECOSYSTEM[active];

  useEffect(() => {
    if (paused || reduce) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % ECOSYSTEM.length), 3800);
    return () => window.clearInterval(t);
  }, [paused, reduce]);

  return (
    <div className="cp-eco" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="cp-eco__map">
        <svg className="cp-eco__svg" viewBox="0 0 500 500" aria-hidden="true">
          <circle className="cp-eco__ring" cx={C} cy={C} r={R} />
          <circle className="cp-eco__ring cp-eco__ring--inner" cx={C} cy={C} r={92} />
          {POS.map((p, i) => (
            <g key={i}>
              <line className={`cp-eco__spoke ${i === active ? "is-active" : ""}`} x1={C} y1={C} x2={p.x} y2={p.y} />
              {i === active && !reduce && (
                <motion.circle
                  key={`pulse-${active}`}
                  r={5}
                  className="cp-eco__pulse"
                  initial={{ cx: C, cy: C, opacity: 0 }}
                  animate={{ cx: [C, p.x], cy: [C, p.y], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </g>
          ))}
          <motion.circle
            className="cp-eco__orbit"
            cx={C}
            cy={C}
            r={R}
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: EASE }}
          />
        </svg>

        <div className="cp-eco__core">
          <span className="cp-eco__core-wave" aria-hidden="true" />
          <span className="cp-eco__core-wave cp-eco__core-wave--2" aria-hidden="true" />
          <strong>Anda</strong>
          <small>anggota</small>
        </div>

        {ECOSYSTEM.map((n, i) => (
          <motion.button
            key={n.key}
            type="button"
            className={`cp-eco__node cp-ab-hov ${i === active ? "is-active" : ""}`}
            style={{ left: `${(POS[i].x / 500) * 100}%`, top: `${(POS[i].y / 500) * 100}%` }}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: EASE }}
          >
            <IconBadge icon={n.icon} tone={i === active ? "solid" : "soft"} size={52} />
            <span className="cp-eco__label">{n.title}</span>
          </motion.button>
        ))}
      </div>

      <div className="cp-eco__panel" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={node.key}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="cp-eco__detail"
          >
            <IconBadge icon={node.icon} tone="solid" size={56} />
            <h3>{node.title}</h3>
            <p className="cp-eco__stat">
              <b>{node.stat}</b>
              <span>{node.statLabel}</span>
            </p>
            <p className="cp-eco__text">{node.text}</p>
          </motion.div>
        </AnimatePresence>
        <div className="cp-eco__steps" role="tablist" aria-label="Bagian ekosistem">
          {ECOSYSTEM.map((n, i) => (
            <button key={n.key} type="button" role="tab" aria-selected={i === active} aria-label={n.title} className={i === active ? "is-active" : ""} onClick={() => setActive(i)}>
              {i === active && !paused && !reduce && <motion.span key={`bar-${active}`} className="cp-eco__steps-fill" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 3.8, ease: "linear" }} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
