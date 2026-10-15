"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MonitorPlay, PenLine } from "lucide-react";
import { formatDate, webinarDates, type BootcampBatch } from "@/lib/data/programs";
import { BTM_COPY } from "@/lib/content/programs";

const EASE = [0.22, 1, 0.36, 1] as const;
/** Example daily target used to show the running word count. */
const DAILY = BTM_COPY.dailyWords;
const BOOTCAMP_WEEKS = BTM_COPY.weeks;
const weekOf = (day: number) => (day <= 7 ? 0 : day <= 14 ? 1 : day <= 21 ? 2 : 3);

/** Scrub through the 30 days: which week, what to write, webinar days, and the running word count. */
export function BtmPlan({ batch }: { batch: BootcampBatch }) {
  const reduce = useReducedMotion();
  const [day, setDay] = useState(9);

  const days = useMemo(() => {
    const [y, m, d] = batch.start.split("-").map(Number);
    return Array.from({ length: 30 }, (_, i) => new Date(Date.UTC(y, m - 1, d + i)).toISOString().slice(0, 10));
  }, [batch.start]);
  const webinars = useMemo(() => new Set(webinarDates(batch)), [batch]);

  const w = weekOf(day);
  const date = days[day - 1];
  const isWebinar = webinars.has(date);

  return (
    <div className="cp-btm-plan">
      <div className="cp-btm-plan__top">
        <motion.div key={day} className="cp-btm-plan__day" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
          <span>Hari</span>
          <strong>{String(day).padStart(2, "0")}</strong>
          <small>{formatDate(date)}</small>
        </motion.div>
        <div className="cp-btm-plan__info">
          <span className="cp-sts-flow__step">{BOOTCAMP_WEEKS[w].week} · {BOOTCAMP_WEEKS[w].title}</span>
          <p>{BOOTCAMP_WEEKS[w].text}</p>
          <div className="cp-btm-plan__chips">
            <span className={isWebinar ? "is-on" : ""}><MonitorPlay size={14} aria-hidden="true" /> {isWebinar ? "Hari webinar" : "Hari menulis mandiri"}</span>
            <span><PenLine size={14} aria-hidden="true" /> ±{(day * DAILY).toLocaleString("id-ID")} kata terkumpul*</span>
          </div>
        </div>
      </div>

      <div className="cp-btm-plan__track">
        <div className="cp-btm-plan__cells">
          {days.map((d, i) => (
            <button
              key={d}
              type="button"
              className={`wk-${weekOf(i + 1)} ${i + 1 <= day ? "is-past" : ""} ${i + 1 === day ? "is-now" : ""} ${webinars.has(d) ? "is-webinar" : ""}`}
              onClick={() => setDay(i + 1)}
              aria-label={`Hari ${i + 1}, ${formatDate(d)}${webinars.has(d) ? ", webinar" : ""}`}
              aria-pressed={i + 1 === day}
            />
          ))}
        </div>
        <input
          type="range"
          min={1}
          max={30}
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
          aria-label="Geser hari bootcamp"
          className="cp-btm-plan__range"
        />
        <div className="cp-btm-plan__scale" aria-hidden="true"><span>Hari 1</span><span>Hari 15</span><span>Hari 30</span></div>
      </div>

      <ol className="cp-btm-plan__weeks">
        {BOOTCAMP_WEEKS.map((wk, i) => (
          <li key={wk.week} className={i === w ? "is-active" : i < w ? "is-done" : ""}>
            <button type="button" onClick={() => setDay([1, 8, 15, 22][i])}>
              <span className="cp-sts-flow__n">{wk.week}</span>
              <strong>{wk.title}</strong>
            </button>
          </li>
        ))}
      </ol>
      <p className="cp-btm-plan__note">*Dengan contoh target {DAILY} kata per hari. Target Anda bisa diatur sendiri di pelacak menulis.</p>
    </div>
  );
}
