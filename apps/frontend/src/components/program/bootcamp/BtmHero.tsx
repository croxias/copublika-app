"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowRight, BadgeCheck, ChartNoAxesColumn, MonitorPlay, Users } from "lucide-react";
import { Counter } from "@/components/about/motion";
import { BTM_COPY } from "@/lib/content/programs";
import { MARK_DOT, MARK_RING_PATH, MARK_VIEWBOX } from "@/components/brand/CopublikaMark";
import { formatDate, webinarDates, type BootcampBatch } from "@/lib/data/programs";

const EASE = [0.22, 1, 0.36, 1] as const;
const line = { hidden: { opacity: 0, y: "100%" }, show: { opacity: 1, y: "0%", transition: { duration: 0.9, ease: EASE } } };
const fade = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };

/** Days of a batch as ISO dates, plus the Monday-first offset of the first day. */
function batchDays(batch: BootcampBatch) {
  const [y, m, d] = batch.start.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, d));
  const days = Array.from({ length: 30 }, (_, i) => {
    const x = new Date(first);
    x.setUTCDate(first.getUTCDate() + i);
    return x.toISOString().slice(0, 10);
  });
  return { days, offset: (first.getUTCDay() + 6) % 7 };
}

export function BtmHero({ batch, registerHref }: { batch: BootcampBatch; registerHref: string }) {
  const reduce = useReducedMotion();

  return (
    <section className="cp-sts-hero cp-btm-hero" aria-labelledby="cp-btm-title">
      {/* Brand background: column rules, the open "C" of the mark, an outlined 30. */}
      <div className="cp-sts-hero__bg" aria-hidden="true">
        <span className="cp-sts-hero__cols"><i /><i /><i /><i /><i /></span>
        <motion.svg
          className="cp-btm-hero__ring"
          viewBox={MARK_VIEWBOX}
          initial={reduce ? false : { rotate: 40, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <path d={MARK_RING_PATH} />
          <circle cx={MARK_DOT.x} cy={MARK_DOT.y} r={MARK_DOT.r} />
        </motion.svg>
        <span className="cp-btm-hero__num">30</span>
        <span className="cp-sts-hero__grain" />
      </div>

      <div className="cp-sts-hero__wrap">
        <motion.div className="cp-sts-hero__copy" initial={reduce ? false : "hidden"} animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
          <motion.span className="cp-sts-pill" variants={fade}>
            <i aria-hidden="true" /> {batch.name} · mulai {formatDate(batch.start)}
          </motion.span>

          <h1 id="cp-btm-title" className="cp-sts-hero__title">
            <span className="cp-sts-mask"><motion.span variants={line}>{BTM_COPY.hero.title}</motion.span></span>
            <span className="cp-sts-mask"><motion.span variants={line} className="is-accent">{BTM_COPY.hero.accent}</motion.span></span>
          </h1>

          <motion.p className="cp-sts-hero__lead" variants={fade}>
            {BTM_COPY.hero.lead}
          </motion.p>

          <motion.div className="cp-sts-buy" variants={fade}>
            <div className="cp-sts-buy__price">
              <span>{BTM_COPY.hero.priceLabel}</span>
              <strong>Rp. <Counter value="450.000" /></strong>
            </div>
            <div className="cp-btm-buy__meta">
              <span>Termasuk</span>
              <strong>{BTM_COPY.hero.includesValue}</strong>
              <small>{BTM_COPY.hero.includesNote}</small>
            </div>
          </motion.div>

          <motion.div className="cp-sts-hero__ctas" variants={fade}>
            <Link href={registerHref} className="cp-ab-btn cp-ab-btn--primary">
              Daftar {batch.name} <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="#rencana" className="cp-ab-btn cp-ab-btn--line">{BTM_COPY.hero.ctaSecondary}</Link>
          </motion.div>

          <motion.ul className="cp-sts-hero__trust" variants={fade}>
            <li><Users size={16} aria-hidden="true" /> {BTM_COPY.hero.trust[0]}</li>
            <li><BadgeCheck size={16} aria-hidden="true" /> {BTM_COPY.hero.trust[1]}</li>
          </motion.ul>
        </motion.div>

        <motion.div
          className="cp-sts-hero__visual"
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
        >
          <CalendarCard batch={batch} reduce={!!reduce} />
        </motion.div>
      </div>
    </section>
  );
}

/** Batch calendar that tilts toward the pointer: countdown, 30 days filling in, webinar days marked. */
function CalendarCard({ batch, reduce }: { batch: BootcampBatch; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 140, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 140, damping: 18 });

  const { days, offset } = useMemo(() => batchDays(batch), [batch]);
  const webinars = useMemo(() => new Set(webinarDates(batch)), [batch]);
  const [filled, setFilled] = useState(reduce ? 30 : 0);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => setFilled((f) => (f >= 34 ? 0 : f + 1)), 110);
    return () => window.clearInterval(t);
  }, [reduce]);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const t = window.setInterval(tick, 30_000);
    return () => window.clearInterval(t);
  }, []);

  const closes = new Date(`${batch.closes}T23:59:00+07:00`).getTime();
  const left = now === null ? null : Math.max(0, closes - now);
  const parts = left === null ? null : [Math.floor(left / 86_400_000), Math.floor(left / 3_600_000) % 24, Math.floor(left / 60_000) % 60];
  const shown = Math.min(filled, 30);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div className="cp-sts-card-stage" ref={ref} onPointerMove={onMove} onPointerLeave={() => { mx.set(0); my.set(0); }}>
      <motion.div className="cp-sts-card cp-btm-cal" style={{ rotateX: rx, rotateY: ry }}>
        <div className="cp-btm-cal__count" role="timer" aria-label={`Pendaftaran ${batch.name} ditutup ${formatDate(batch.closes)}`}>
          <span className="cp-sts-card__k">Pendaftaran ditutup dalam</span>
          <div>
            {["hari", "jam", "menit"].map((label, i) => (
              <span key={label}>
                <strong>{parts ? String(parts[i]).padStart(2, "0") : "--"}</strong>
                <small>{label}</small>
              </span>
            ))}
          </div>
        </div>

        <div className="cp-btm-cal__body" aria-hidden="true">
          <div className="cp-btm-cal__head">
            <span>{formatDate(batch.start, false)} – {formatDate(batch.end)}</span>
            <strong>Hari {shown}/30</strong>
          </div>
          <div className="cp-btm-cal__dow">{["S", "S", "R", "K", "J", "S", "M"].map((d, i) => <span key={i}>{d}</span>)}</div>
          <div className="cp-btm-cal__grid">
            {Array.from({ length: offset }, (_, i) => <span key={`b${i}`} className="is-blank" />)}
            {days.map((d, i) => (
              <span key={d} className={`${i < shown ? "is-done" : ""} ${webinars.has(d) ? "is-webinar" : ""} ${i === shown - 1 ? "is-today" : ""}`}>
                {Number(d.slice(8))}
              </span>
            ))}
          </div>
          <div className="cp-btm-cal__legend">
            <span><i className="is-done" /> Hari menulis</span>
            <span><i className="is-webinar" /> Webinar</span>
          </div>
        </div>

        <motion.span className="cp-sts-float cp-sts-float--a" animate={reduce ? undefined : { y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
          <MonitorPlay size={14} /> {batch.webinar.replace(/^Setiap /, "")}
        </motion.span>
        <motion.span className="cp-sts-float cp-sts-float--b" animate={reduce ? undefined : { y: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
          <ChartNoAxesColumn size={14} /> {BTM_COPY.hero.floatB}
        </motion.span>
      </motion.div>
    </div>
  );
}
