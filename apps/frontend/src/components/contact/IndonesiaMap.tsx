"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { IndonesiaMap as MapData } from "@/lib/data/indonesia-map";

const STAGGER = 0.35;
const DRAW = 1.6;

/**
 * Dotted Indonesia with arcs from the Bandung office to member cities. Arcs draw in turn and
 * loop; every city is a pin you can hover or tap to see who is there.
 */
export function IndonesiaMap({ map, decorative = false }: { map: MapData; decorative?: boolean }) {
  const reduce = useReducedMotion();
  const hq = map.cities.find((c) => c.hq) ?? map.cities[0];
  const others = map.cities.filter((c) => c !== hq);
  const [active, setActive] = useState<string>("");
  const shown = map.cities.find((c) => c.name === active);
  const cycle = others.length * STAGGER + DRAW + 2;

  // Arc bends upward between the two pins, more for longer routes.
  const arc = (x: number, y: number) => {
    const mx = (hq.x + x) / 2;
    const my = Math.min(hq.y, y) - Math.max(6, Math.abs(x - hq.x) * 0.22);
    return `M ${hq.x} ${hq.y} Q ${mx} ${my} ${x} ${y}`;
  };

  return (
    <div className={`cp-idmap ${decorative ? "is-bg" : ""}`}>
      <svg viewBox={`-4 -8 ${map.width + 8} ${map.height + 14}`} className="cp-idmap__svg" {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": "Peta jangkauan anggota CoPublika di Indonesia" })}>
        <defs>
          <linearGradient id="cp-idmap-line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#e9711c" stopOpacity="0" />
            <stop offset=".15" stopColor="#e9711c" />
            <stop offset=".85" stopColor="#ffb27a" />
            <stop offset="1" stopColor="#ffb27a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="cp-idmap__dots">
          {map.dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={0.34} />)}
        </g>

        {others.map((c, i) => {
          const d = arc(c.x, c.y);
          const start = (i * STAGGER) / cycle;
          const end = (i * STAGGER + DRAW) / cycle;
          const hold = (others.length * STAGGER + DRAW) / cycle;
          return (
            <g key={c.name} className={active && active !== c.name && active !== hq.name ? "is-dim" : ""}>
              <motion.path
                d={d}
                className="cp-idmap__arc"
                stroke="url(#cp-idmap-line)"
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={reduce ? { pathLength: 1 } : { pathLength: [0, 0, 1, 1, 0] }}
                transition={reduce ? undefined : { duration: cycle, times: [0, start, end, hold, 1], ease: "easeInOut", repeat: Infinity }}
              />
              {!reduce && (
                <motion.circle
                  r={0.7}
                  className="cp-idmap__spark"
                  style={{ offsetPath: `path('${d}')` }}
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{ offsetDistance: ["0%", "0%", "100%", "100%", "100%"], opacity: [0, 0, 1, 0, 0] }}
                  transition={{ duration: cycle, times: [0, start, end, hold, 1], ease: "easeInOut", repeat: Infinity }}
                />
              )}
            </g>
          );
        })}

        {map.cities.map((c) => (
          <g
            key={c.name}
            className={`cp-idmap__pin ${c.hq ? "is-hq" : ""} ${active === c.name ? "is-on" : ""}`}
            transform={`translate(${c.x} ${c.y})`}
            tabIndex={0}
            role="button"
            aria-label={`${c.name}: ${c.note}`}
            onPointerEnter={() => setActive(c.name)}
            onPointerLeave={() => setActive("")}
            onFocus={() => setActive(c.name)}
            onBlur={() => setActive("")}
            onClick={() => setActive(active === c.name ? "" : c.name)}
          >
            <circle className="cp-idmap__hit" r={4} />
            {!reduce && <circle className="cp-idmap__pulse" r={c.hq ? 1.6 : 1} />}
            <circle className="cp-idmap__dot" r={c.hq ? 1.6 : 1} />
            {(c.hq || active === c.name) && (
              <g className="cp-idmap__label" transform={`translate(0 ${c.hq || c.y < 10 ? 6.2 : -3.6})`}>
                <rect x={-(c.name.length * 1.05 + 2.4)} y={-2.4} width={c.name.length * 2.1 + 4.8} height={4.2} rx={2.1} />
                <text y={0.55} textAnchor="middle">{c.name}</text>
              </g>
            )}
          </g>
        ))}
      </svg>

      {!decorative && <AnimatePresence mode="wait">
        <motion.div key={shown?.name ?? "hint"} className="cp-idmap__card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
          {shown ? (
            <>
              <small>{shown.hq ? "Kantor pusat" : "Komunitas"}</small>
              <strong>{shown.name}</strong>
              <span>{shown.note}</span>
            </>
          ) : (
            <>
              <small>Jangkauan</small>
              <strong>{map.cities.length} kota</strong>
              <span>Arahkan ke titik untuk melihat komunitas di tiap kota.</span>
            </>
          )}
        </motion.div>
      </AnimatePresence>}
    </div>
  );
}
