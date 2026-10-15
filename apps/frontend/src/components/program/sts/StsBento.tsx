"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Check, Clock3, FileText } from "lucide-react";

import { STS_COPY } from "@/lib/content/programs";

const EASE = [0.22, 1, 0.36, 1] as const;
const AGENDA = STS_COPY.agenda;
const ROUNDS = STS_COPY.rounds;
const KIT = STS_COPY.kit.items;

export function StsBento() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const reduce = useReducedMotion();
  const [seg, setSeg] = useState(1);
  const [round, setRound] = useState(0);
  const [doc, setDoc] = useState(3);

  return (
    <div className="cp-sts-bento" ref={ref}>
      {/* Session agenda */}
      <article className="cp-sts-tile cp-sts-tile--agenda">
        <header>
          <span className="cp-sts-tile__ico"><Clock3 size={20} aria-hidden="true" /></span>
          <div>
            <h3>1 sesi online · 90 menit</h3>
            <p>Contoh alur sesi bersama mentor. Klik tiap bagian.</p>
          </div>
        </header>
        <div className="cp-sts-agenda" role="tablist" aria-label="Agenda sesi">
          {AGENDA.map((a, i) => (
            <motion.button
              key={a.title}
              type="button"
              role="tab"
              aria-selected={seg === i}
              className={seg === i ? "is-active" : ""}
              style={{ flexGrow: a.min }}
              onClick={() => setSeg(i)}
              onMouseEnter={() => setSeg(i)}
              initial={reduce ? false : { scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : undefined}
              transition={{ duration: 0.7, delay: 0.15 * i, ease: EASE }}
            >
              <span>{a.min}′</span>
            </motion.button>
          ))}
        </div>
        <div className="cp-sts-agenda__scale" aria-hidden="true"><span>0′</span><span>45′</span><span>90′</span></div>
        <motion.div key={seg} className="cp-sts-agenda__detail" role="tabpanel" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
          <span>Menit {AGENDA.slice(0, seg).reduce((n, a) => n + a.min, 0)}–{AGENDA.slice(0, seg + 1).reduce((n, a) => n + a.min, 0)}</span>
          <strong>{AGENDA[seg].title}</strong>
          <p>{AGENDA[seg].text}</p>
        </motion.div>
      </article>

      {/* Review rounds */}
      <article className="cp-sts-tile cp-sts-tile--rounds">
        <header>
          <span className="cp-sts-tile__ico"><FileText size={20} aria-hidden="true" /></span>
          <div>
            <h3>4 putaran review</h3>
            <p>Setiap putaran punya fokus berbeda.</p>
          </div>
        </header>
        <div className="cp-sts-rounds" role="tablist" aria-label="Putaran review">
          {ROUNDS.map((r, i) => (
            <button key={r.title} type="button" role="tab" aria-selected={round === i} className={`${round === i ? "is-active" : ""} ${i < round ? "is-done" : ""}`} onClick={() => setRound(i)}>
              R{i + 1}
            </button>
          ))}
        </div>
        <motion.div key={round} className="cp-sts-rounds__detail" initial={reduce ? false : { opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, ease: EASE }}>
          <span className="cp-sts-rounds__k">Fokus putaran {round + 1}</span>
          <strong>{ROUNDS[round].title}</strong>
          <p>{ROUNDS[round].text}</p>
          <ul>
            {ROUNDS[round].checks.map((c, i) => (
              <motion.li key={c} initial={reduce ? false : { opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.08 * i, ease: EASE }}>
                <Check size={13} strokeWidth={3} aria-hidden="true" /> {c}
              </motion.li>
            ))}
          </ul>
        </motion.div>
        <div className="cp-sts-ready">
          <div className="cp-sts-ready__top"><span>Kematangan naskah per putaran</span><strong>{ROUNDS[round].ready}%</strong></div>
          <div className="cp-sts-ready__chart" role="img" aria-label={ROUNDS.map((r, i) => `Putaran ${i + 1}: ${r.ready}%`).join(", ")}>
            {ROUNDS.map((r, i) => (
              <button key={r.title} type="button" tabIndex={-1} aria-hidden="true" className={`${i === round ? "is-active" : ""} ${i < round ? "is-done" : ""}`} onClick={() => setRound(i)}>
                <motion.i initial={reduce ? false : { height: 0 }} animate={{ height: inView ? `${r.ready}%` : 0 }} transition={{ duration: 0.7, delay: 0.1 * i, ease: EASE }} />
                <small>R{i + 1}</small>
              </button>
            ))}
          </div>
        </div>
      </article>

      {/* What the participant keeps */}
      <article className="cp-sts-tile cp-sts-tile--kit">
        <div className="cp-sts-kit__copy">
          <span className="cp-sts-kit__k">{STS_COPY.kit.tag}</span>
          <h3>{STS_COPY.kit.title}</h3>
          <ol className="cp-sts-kit__list">
            {KIT.map((k, i) => (
              <li key={k.title}>
                <button
                  type="button"
                  className={doc === i ? "is-active" : ""}
                  aria-pressed={doc === i}
                  onMouseEnter={() => setDoc(i)}
                  onFocus={() => setDoc(i)}
                  onClick={() => setDoc(i)}
                >
                  <span className="cp-sts-kit__n">0{i + 1}</span>
                  <span>
                    <strong>{k.title}</strong>
                    <small>{k.when}</small>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="cp-sts-kit__stack" aria-hidden="true">
          {KIT.map((k, i) => {
            const offset = i - doc;
            return (
              <motion.div
                key={k.title}
                className={`cp-sts-doc cp-sts-doc--${i} ${offset === 0 ? "is-front" : ""}`}
                animate={{
                  x: offset * 26,
                  y: Math.abs(offset) * 14,
                  rotate: offset * 5,
                  scale: offset === 0 ? 1 : 0.92,
                  zIndex: 10 - Math.abs(offset),
                  opacity: Math.abs(offset) > 2 ? 0 : 1,
                }}
                initial={false}
                transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
              >
                <span className="cp-sts-doc__tag">{k.tag}</span>
                <strong>{k.title}</strong>
                <span className="cp-sts-doc__lines"><i /><i /><i /><i /></span>
                <span className="cp-sts-doc__foot">{k.foot}</span>
              </motion.div>
            );
          })}
        </div>
      </article>
    </div>
  );
}
