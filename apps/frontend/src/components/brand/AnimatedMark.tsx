"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MARK_CENTER, MARK_DOT, MARK_PARTS, MARK_VIEWBOX } from "./CopublikaMark";

const EASE = [0.22, 1, 0.36, 1] as const;
const origin = `${MARK_CENTER.x}px ${MARK_CENTER.y}px`;

/**
 * The CoPublika mark assembling itself: the two ring arcs sweep into place, the disc opens
 * from the centre, then the dot lands and keeps a slow pulse.
 */
/** viewBox that puts the ring's centre in the middle, for placing the mark inside circles. */
export const MARK_RING_VIEWBOX = `${MARK_CENTER.x - 320} 0 640 640`;

export function AnimatedMark({ className, delay = 0, viewBox = MARK_VIEWBOX }: { className?: string; delay?: number; viewBox?: string }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <svg viewBox={viewBox} className={className} aria-hidden="true" fill="currentColor" overflow="visible">
        <path d={MARK_PARTS.ringTop} />
        <path d={MARK_PARTS.ringBottom} />
        <path d={MARK_PARTS.disc} />
        <circle cx={MARK_DOT.x} cy={MARK_DOT.y} r={MARK_DOT.r} />
      </svg>
    );
  }
  return (
    <svg viewBox={viewBox} className={className} aria-hidden="true" fill="currentColor" overflow="visible">
      <motion.path d={MARK_PARTS.ringTop} style={{ transformOrigin: origin }} initial={{ rotate: -120, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.9, ease: EASE, delay }} />
      <motion.path d={MARK_PARTS.ringBottom} style={{ transformOrigin: origin }} initial={{ rotate: 120, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.9, ease: EASE, delay: delay + 0.08 }} />
      <motion.path d={MARK_PARTS.disc} style={{ transformOrigin: origin }} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 180, damping: 16, delay: delay + 0.45 }} />
      <motion.g style={{ transformOrigin: `${MARK_DOT.x}px ${MARK_DOT.y}px` }} initial={{ x: -140, opacity: 0, scale: 0 }} animate={{ x: 0, opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14, delay: delay + 0.75 }}>
        <motion.circle
          cx={MARK_DOT.x}
          cy={MARK_DOT.y}
          r={MARK_DOT.r}
          style={{ transformOrigin: `${MARK_DOT.x}px ${MARK_DOT.y}px` }}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: delay + 1.8, repeat: Infinity, repeatDelay: 2.6 }}
        />
      </motion.g>
    </svg>
  );
}
