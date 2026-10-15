"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Nodes inside the bulb: people (outer) linked into one idea (centre). */
const NODES = [
  { x: 60, y: 30 },
  { x: 40, y: 44 },
  { x: 80, y: 44 },
  { x: 46, y: 66 },
  { x: 74, y: 66 },
];
const CORE = { x: 60, y: 50 };
const LINKS: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [1, 2]];

/**
 * Illustration for the centre of the mission wheel: a light bulb whose filament is a small
 * network of people around one idea. Links light up in turn and the core glows.
 */
export function IdeaNetwork({ size = 120 }: { size?: number }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true" className="cp-idea">
      <defs>
        <radialGradient id="cp-idea-glow" cx="50%" cy="42%" r="50%">
          <stop offset="0" stopColor="#ffb27a" stopOpacity=".55" />
          <stop offset="1" stopColor="#e9711c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cp-idea-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".16" />
          <stop offset="1" stopColor="#ffffff" stopOpacity=".03" />
        </linearGradient>
      </defs>

      <motion.circle cx="60" cy="48" r="44" fill="url(#cp-idea-glow)" animate={reduce ? undefined : { opacity: [0.55, 1, 0.55], scale: [0.96, 1.04, 0.96] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "60px 48px" }} />

      {/* Bulb glass and base */}
      <path d="M60 12c-19 0-33 14.5-33 32.5 0 11 5.4 18.6 11 24.6 3.4 3.6 5 7.4 5 11.4V84h34v-3.5c0-4 1.6-7.8 5-11.4 5.6-6 11-13.6 11-24.6C93 26.5 79 12 60 12Z" fill="url(#cp-idea-glass)" stroke="#e9711c" strokeWidth="2.4" strokeLinejoin="round" />
      <rect x="45" y="88" width="30" height="6" rx="3" fill="#e9711c" />
      <rect x="48" y="97" width="24" height="6" rx="3" fill="#c25a12" />
      <path d="M54 106h12" stroke="#c25a12" strokeWidth="4" strokeLinecap="round" />

      {/* Rays */}
      {[[-1, 0], [1, 0], [-0.75, -0.75], [0.75, -0.75], [0, -1]].map(([dx, dy], i) => (
        <motion.line
          key={i}
          x1={60 + dx * 50}
          y1={46 + dy * 42}
          x2={60 + dx * 58}
          y2={46 + dy * 50}
          stroke="#ffb27a"
          strokeWidth="2.6"
          strokeLinecap="round"
          animate={reduce ? undefined : { opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
        />
      ))}

      {/* Network filament */}
      {LINKS.map(([a, b], i) => (
        <motion.line
          key={`l${i}`}
          x1={NODES[a].x}
          y1={NODES[a].y}
          x2={NODES[b].x}
          y2={NODES[b].y}
          stroke="#ffb27a"
          strokeWidth="1.6"
          animate={reduce ? undefined : { opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.33, ease: "easeInOut" }}
        />
      ))}
      {NODES.map((n, i) => (
        <line key={`c${i}`} x1={n.x} y1={n.y} x2={CORE.x} y2={CORE.y} stroke="rgba(255,178,122,.4)" strokeWidth="1.2" strokeDasharray="2 3" />
      ))}
      {NODES.map((n, i) => (
        <motion.circle
          key={`n${i}`}
          cx={n.x}
          cy={n.y}
          r="4.2"
          fill="#fff"
          stroke="#e9711c"
          strokeWidth="2"
          animate={reduce ? undefined : { r: [4.2, 5.4, 4.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
        />
      ))}
      <motion.circle cx={CORE.x} cy={CORE.y} r="7" fill="#e9711c" animate={reduce ? undefined : { r: [6.5, 8.5, 6.5] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
      <circle cx={CORE.x} cy={CORE.y} r="3" fill="#fff" />
    </svg>
  );
}
