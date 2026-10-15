"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Check, FileStack, MessageSquareText, MonitorPlay } from "lucide-react";
import { formatDate, webinarDates, type BootcampBatch } from "@/lib/data/programs";
import { BTM_COPY } from "@/lib/content/programs";

const EASE = [0.22, 1, 0.36, 1] as const;
const WEEKS = BTM_COPY.weeks;
const IMRAD = BTM_COPY.imrad;
const JOURNAL_CHECKS = BTM_COPY.journalChecks;
const PARAGRAPH = BTM_COPY.paragraph;
const PINS = BTM_COPY.review.pins;

export function BtmBento({ batch }: { batch: BootcampBatch }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const reduce = useReducedMotion();
  const dates = webinarDates(batch);
  const [week, setWeek] = useState(0);
  const [tool, setTool] = useState(0);
  const [checked, setChecked] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [pin, setPin] = useState(0);

  return (
    <div className="cp-sts-bento" ref={ref}>
      {/* Weekly webinars */}
      <article className="cp-sts-tile cp-sts-tile--agenda">
        <header>
          <span className="cp-sts-tile__ico"><MonitorPlay size={20} aria-hidden="true" /></span>
          <div>
            <h3>Webinar setiap minggu</h3>
            <p>{batch.webinar}. Klik tiap minggu.</p>
          </div>
        </header>
        <div className="cp-btm-weeks" role="tablist" aria-label="Webinar mingguan">
          {WEEKS.map((w, i) => (
            <motion.button
              key={w.week}
              type="button"
              role="tab"
              aria-selected={week === i}
              className={week === i ? "is-active" : ""}
              onClick={() => setWeek(i)}
              onMouseEnter={() => setWeek(i)}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, delay: 0.1 * i, ease: EASE }}
            >
              <small>{w.week}</small>
              <strong>Sab, {formatDate(dates[i], false)}</strong>
            </motion.button>
          ))}
        </div>
        <motion.div key={week} className="cp-sts-agenda__detail" role="tabpanel" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
          <span>Webinar {week + 1} · {batch.webinar.replace(/^Setiap Sabtu, /, "")}</span>
          <strong>{WEEKS[week].title}</strong>
          <p>{WEEKS[week].text}</p>
        </motion.div>
      </article>

      {/* Writing tools */}
      <article className="cp-sts-tile cp-sts-tile--rounds cp-btm-tools">
        <header>
          <span className="cp-sts-tile__ico"><FileStack size={20} aria-hidden="true" /></span>
          <div>
            <h3>Tools penulisan</h3>
            <p>Siap pakai sejak hari pertama.</p>
          </div>
        </header>
        <div className="cp-btm-tabs" role="tablist" aria-label="Tools">
          {["Template IMRaD", "Checklist jurnal", "Kerangka paragraf"].map((t, i) => (
            <button key={t} type="button" role="tab" aria-selected={tool === i} className={tool === i ? "is-active" : ""} onClick={() => setTool(i)}>{t}</button>
          ))}
        </div>
        <motion.div key={tool} className="cp-btm-tool" role="tabpanel" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
          {tool === 0 && (
            <>
              <span className="cp-sts-rounds__k">Porsi kata per bagian · contoh</span>
              <div className="cp-btm-imrad">
                {IMRAD.map((s, i) => (
                  <div key={s.label}>
                    <span>{s.label}</span>
                    <i><motion.b initial={reduce ? false : { width: 0 }} animate={{ width: `${s.share * 3}%` }} transition={{ duration: 0.6, delay: 0.08 * i, ease: EASE }} /></i>
                    <em>{s.share}%</em>
                  </div>
                ))}
              </div>
            </>
          )}
          {tool === 1 && (
            <>
              <span className="cp-sts-rounds__k">Sebelum memilih jurnal</span>
              <ul className="cp-btm-checks">
                {JOURNAL_CHECKS.map((c, i) => (
                  <li key={c}>
                    <label className={checked[i] ? "is-on" : ""}>
                      <input type="checkbox" checked={!!checked[i]} onChange={(e) => setChecked((s) => ({ ...s, [i]: e.target.checked }))} />
                      <span aria-hidden="true"><Check size={12} strokeWidth={3} /></span>
                      {c}
                    </label>
                  </li>
                ))}
              </ul>
              <p className="cp-btm-tool__foot">{Object.values(checked).filter(Boolean).length}/{JOURNAL_CHECKS.length} terpenuhi</p>
            </>
          )}
          {tool === 2 && (
            <>
              <span className="cp-sts-rounds__k">Satu paragraf, tiga bagian</span>
              <ol className="cp-btm-para">
                {PARAGRAPH.map((p, i) => (
                  <motion.li key={p.k} initial={reduce ? false : { opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: 0.1 * i, ease: EASE }}>
                    <strong>{p.k}</strong>
                    <span>{p.t}</span>
                  </motion.li>
                ))}
              </ol>
            </>
          )}
        </motion.div>
      </article>

      {/* Free mentor review */}
      <article className="cp-sts-tile cp-sts-tile--kit cp-btm-review">
        <div className="cp-sts-kit__copy">
          <span className="cp-sts-kit__k">{BTM_COPY.review.tag}</span>
          <h3>{BTM_COPY.review.title}</h3>
          <p className="cp-btm-review__lead">{BTM_COPY.review.lead}</p>
          <div className="cp-btm-review__note" aria-live="polite">
            <MessageSquareText size={16} aria-hidden="true" />
            <span><strong>Catatan {pin + 1}</strong> {PINS[pin].text}</span>
          </div>
        </div>
        <div className="cp-btm-page" aria-label="Contoh naskah dengan catatan mentor">
          <span className="cp-btm-page__title" aria-hidden="true" />
          {Array.from({ length: 11 }, (_, i) => <span key={i} className={`cp-btm-page__line ${[2, 5, 9].includes(i) ? "is-marked" : ""}`} aria-hidden="true" />)}
          {PINS.map((p, i) => (
            <button
              key={i}
              type="button"
              className={`cp-btm-pin ${pin === i ? "is-active" : ""}`}
              style={{ top: `${p.top}%`, left: `${p.left}%` }}
              onClick={() => setPin(i)}
              onMouseEnter={() => setPin(i)}
              aria-label={`Catatan ${i + 1}`}
              aria-pressed={pin === i}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </article>
    </div>
  );
}
