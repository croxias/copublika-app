"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MISSIONS, VISION, VISION_SHORT } from "@/lib/content/about";
import { IconBadge } from "./IconBadge";
import { IdeaNetwork } from "./IdeaNetwork";

const EASE = [0.22, 1, 0.36, 1] as const;
const C = 200;
const R = 150;
const GAP = 4;
const SEG = 360 / MISSIONS.length;

const polar = (deg: number, r = R) => {
  const a = (deg * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
};
const arc = (from: number, to: number) => {
  const a = polar(from);
  const b = polar(to);
  return `M ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y}`;
};

/**
 * Vision & mission as one picture: four mission segments around a hub where collaboration meets
 * ideas (the vision). Segments, hub and the list are linked; hovering shows a floating card.
 */
export function VisionMission() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [float, setFloat] = useState<"hub" | number | null>(null);

  useEffect(() => {
    if (paused || reduce) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % MISSIONS.length), 4000);
    return () => window.clearInterval(t);
  }, [paused, reduce]);

  const pick = (i: number) => {
    setActive(i);
    setFloat(i);
  };

  return (
    <div className="cp-vm">
      <motion.div
        className="cp-vm__vision"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <span className="cp-vm__k"><IconBadge icon="eye" tone="solid" size={44} /> <Underlined>Visi</Underlined></span>
        <blockquote>{VISION}</blockquote>
      </motion.div>

      <div className="cp-vm__body" onMouseEnter={() => setPaused(true)} onMouseLeave={() => { setPaused(false); setFloat(null); }}>
        <div className="cp-vm__wheel">
          <svg viewBox="0 0 400 400" aria-hidden="true">
            <circle className="cp-vm__track" cx={C} cy={C} r={R} />
            {MISSIONS.map((_, i) => (
              <motion.path
                key={i}
                d={arc(-90 + i * SEG + GAP, -90 + (i + 1) * SEG - GAP)}
                className={`cp-vm__seg ${i === active ? "is-active" : ""}`}
                initial={reduce ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.18, ease: EASE }}
                onMouseEnter={() => pick(i)}
                onClick={() => pick(i)}
              />
            ))}
            {MISSIONS.map((_, i) => {
              const mid = -90 + (i + 0.5) * SEG;
              const a = polar(mid, R - 30);
              const b = polar(mid, 80);
              return <line key={`l${i}`} className={`cp-vm__ray ${i === active ? "is-active" : ""}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
            })}
          </svg>

          {MISSIONS.map((mm, i) => {
            const p = polar(-90 + (i + 0.5) * SEG);
            return (
              <button
                key={mm.title}
                type="button"
                className={`cp-vm__dot cp-ab-hov ${i === active ? "is-active" : ""}`}
                style={{ left: `${(p.x / 400) * 100}%`, top: `${(p.y / 400) * 100}%` }}
                onMouseEnter={() => pick(i)}
                onFocus={() => pick(i)}
                onClick={() => pick(i)}
                aria-label={mm.title}
              >
                <IconBadge icon={mm.icon} tone={i === active ? "solid" : "dark"} size={50} />
              </button>
            );
          })}

          {/* Hub: collaboration + ideas, which is what the vision is about */}
          <button
            type="button"
            className={`cp-vm__hub ${float === "hub" ? "is-open" : ""}`}
            onMouseEnter={() => setFloat("hub")}
            onFocus={() => setFloat("hub")}
            onClick={() => setFloat(float === "hub" ? null : "hub")}
            aria-label={`Visi: ${VISION}`}
          >
            <span className="cp-vm__hub-ring" aria-hidden="true" />
            <IdeaNetwork size={128} />
          </button>

          <AnimatePresence>
            {float !== null && (
              <motion.div
                key={String(float)}
                className={`cp-vm__float ${float === "hub" ? "is-hub" : `is-seg-${float}`}`}
                initial={reduce ? false : { opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.25, ease: EASE }}
                role="tooltip"
              >
                {float === "hub" ? (
                  <>
                    <span className="cp-vm__float-k">Visi · {VISION_SHORT}</span>
                    <p>Ketika akademisi berkolaborasi dan gagasan diasah bersama, riset tumbuh menjadi publikasi bereputasi. Itulah ekosistem yang kami bangun.</p>
                  </>
                ) : (
                  <>
                    <span className="cp-vm__float-k">Misi · {MISSIONS[float].title}</span>
                    <p>{MISSIONS[float].text}</p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="cp-vm__side">
          <span className="cp-vm__k"><IconBadge icon="target" tone="solid" size={44} /> <Underlined>Misi</Underlined></span>
          <ul className="cp-vm__list">
            {MISSIONS.map((mm, i) => (
              <li key={mm.title}>
                <button type="button" className={`cp-ab-hov ${i === active ? "is-active" : ""}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} aria-pressed={i === active}>
                  <IconBadge icon={mm.icon} tone={i === active ? "solid" : "soft"} size={42} />
                  <span className="cp-vm__title">{mm.title}</span>
                  <AnimatePresence initial={false}>
                    {i === active && (
                      <motion.span
                        key="t"
                        className="cp-vm__text"
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        {mm.text}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Label with a hand-drawn orange stroke underneath that draws itself into view. */
function Underlined({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <span className="cp-ul">
      {children}
      <svg className="cp-ul__stroke" viewBox="0 0 120 16" preserveAspectRatio="none" aria-hidden="true">
        <motion.path
          d="M3 11 C 30 4, 62 3, 117 7 M10 14 C 44 9, 80 9, 104 12"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
        />
      </svg>
    </span>
  );
}
