"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownToLine, ArrowUpFromLine, FilePenLine, MessagesSquare, Send, UserRoundCheck } from "lucide-react";
import { STS_COPY } from "@/lib/content/programs";

const EASE = [0.22, 1, 0.36, 1] as const;
const ICONS = [UserRoundCheck, MessagesSquare, FilePenLine, Send];
const STEPS = STS_COPY.steps.map((s, i) => ({ ...s, Icon: ICONS[i % ICONS.length] }));

export function StsFlow() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <div className="cp-sts-flow">
      <div className="cp-sts-flow__rail" role="tablist" aria-label="Alur program">
        <span className="cp-sts-flow__line" aria-hidden="true">
          <motion.i animate={{ width: `${(active / (STEPS.length - 1)) * 100}%` }} transition={{ duration: reduce ? 0 : 0.6, ease: EASE }} />
        </span>
        {STEPS.map((s, i) => (
          <button
            key={s.title}
            type="button"
            role="tab"
            aria-selected={active === i}
            className={`${active === i ? "is-active" : ""} ${i < active ? "is-done" : ""}`}
            onClick={() => setActive(i)}
          >
            <span className="cp-sts-flow__node"><s.Icon size={20} aria-hidden="true" /></span>
            <span className="cp-sts-flow__n">0{i + 1}</span>
            <span className="cp-sts-flow__short">{s.short}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="cp-sts-flow__panel"
          role="tabpanel"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div className="cp-sts-flow__main">
            <span className="cp-sts-flow__step">Langkah {active + 1} dari {STEPS.length}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            <div className="cp-sts-flow__nav">
              <button type="button" disabled={active === 0} onClick={() => setActive(active - 1)}>Sebelumnya</button>
              <button type="button" className="is-next" disabled={active === STEPS.length - 1} onClick={() => setActive(active + 1)}>Langkah berikutnya</button>
            </div>
          </div>
          <dl className="cp-sts-flow__io">
            <div>
              <dt><ArrowUpFromLine size={15} aria-hidden="true" /> Anda lakukan</dt>
              <dd>{step.give}</dd>
            </div>
            <div className="is-get">
              <dt><ArrowDownToLine size={15} aria-hidden="true" /> Anda dapatkan</dt>
              <dd>{step.get}</dd>
            </div>
          </dl>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
