"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpenText, ChevronDown, ChevronUp, Clock3, FileSearch, Lightbulb, MessagesSquare, Pause, Play, Sparkles, type LucideIcon } from "lucide-react";
import { formatMonth, initials, personPhoto } from "@/lib/content/research";
import { BLOG_ARTICLES, type BlogCategory } from "@/lib/data/blog-articles";

const PICKS = BLOG_ARTICLES.filter((a) => a.editorsPick);
const ICON: Record<BlogCategory, LucideIcon> = { guide: BookOpenText, interview: MessagesSquare, essay: Lightbulb, news: Sparkles, case: FileSearch };
const INTERVAL = 4500;
const ITEM = 64;

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * Editor's picks: a rolling column of titles on the orange panel and a stack of cover cards.
 * Plays on its own, pauses on hover or with the pause button, and every chip is clickable.
 */
export function BlogEditorsPick() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const n = PICKS.length;
  const current = ((step % n) + n) % n;

  const next = useCallback(() => setStep((s) => s + 1), []);
  const prev = () => setStep((s) => s - 1);
  const goTo = (i: number) => setStep((s) => s + (((i - current) % n) + n) % n);

  const running = !paused && !held && !reduce;
  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(next, INTERVAL);
    return () => window.clearInterval(t);
  }, [running, next]);

  const status = (i: number) => {
    let d = i - current;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d === 0 ? "active" : d === -1 ? "prev" : d === 1 ? "next" : "hidden";
  };
  const pick = PICKS[current];
  const photo = personPhoto(pick.author);

  return (
    <div className="cp-ep" onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)}>
      {/* Rolling titles */}
      <div className="cp-ep__rail">
        <div className="cp-ep__rail-head">
          <span>Pilihan editor</span>
          <span>{String(current + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
        </div>
        <div className="cp-ep__chips" role="tablist" aria-label="Artikel pilihan editor">
          {PICKS.map((a, i) => {
            const Icon = ICON[a.category];
            const d = wrap(-n / 2, n / 2, i - current);
            const active = i === current;
            return (
              <motion.div
                key={a.slug}
                className="cp-ep__chip-row"
                style={{ height: ITEM }}
                animate={{ y: d * ITEM, opacity: Math.max(0, 1 - Math.abs(d) * 0.28), scale: active ? 1 : 0.94 }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 20 }}
              >
                <button type="button" role="tab" aria-selected={active} className={`cp-ep__chip ${active ? "is-active" : ""}`} onClick={() => goTo(i)} tabIndex={Math.abs(d) > 2 ? -1 : 0}>
                  <Icon size={17} aria-hidden="true" />
                  <span>{a.title}</span>
                </button>
              </motion.div>
            );
          })}
        </div>
        <div className="cp-ep__controls">
          <button type="button" onClick={prev} aria-label="Pilihan sebelumnya"><ChevronUp size={18} /></button>
          <button type="button" onClick={next} aria-label="Pilihan berikutnya"><ChevronDown size={18} /></button>
          <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Putar otomatis" : "Jeda"} aria-pressed={paused}>
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <span className="cp-ep__timer" aria-hidden="true">
            <motion.i key={`${current}-${running}`} initial={{ width: "0%" }} animate={{ width: running ? "100%" : "0%" }} transition={{ duration: running ? INTERVAL / 1000 : 0.2, ease: "linear" }} />
          </span>
        </div>
      </div>

      {/* Cover stack */}
      <div className="cp-ep__stage">
        <div className="cp-ep__cards">
          {PICKS.map((a, i) => {
            const st = status(i);
            const active = st === "active";
            return (
              <motion.div
                key={a.slug}
                className="cp-ep__card"
                initial={false}
                animate={{
                  x: active ? 0 : st === "prev" ? -54 : st === "next" ? 54 : 0,
                  scale: active ? 1 : st === "hidden" ? 0.7 : 0.85,
                  opacity: active ? 1 : st === "hidden" ? 0 : 0.45,
                  rotate: st === "prev" ? -4 : st === "next" ? 4 : 0,
                  zIndex: active ? 20 : st === "hidden" ? 0 : 10,
                }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 26, mass: 0.8 }}
                style={{ pointerEvents: active ? "auto" : "none" }}
                aria-hidden={!active}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.cover} alt="" className={active ? "" : "is-muted"} />
                <span className="cp-ep__badge"><i /> {a.categoryLabel}</span>
                <span className="cp-ep__time"><Clock3 size={12} aria-hidden="true" /> {a.readTime}</span>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={pick.slug}
            className="cp-ep__info"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            aria-live="polite"
          >
            <span className="cp-ep__why">Kenapa dipilih</span>
            <p className="cp-ep__note">{pick.editorNote}</p>
            <h3><Link href={`/blog/${pick.slug}`}>{pick.title}</Link></h3>
            <div className="cp-ep__foot">
              <span className="cp-ep__author">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {photo ? <img src={photo} alt="" /> : <b>{initials(pick.author) || "CP"}</b>}
                <span>
                  <strong>{pick.author}</strong>
                  <small>{formatMonth(pick.date)} · {pick.readTime} baca</small>
                </span>
              </span>
              <Link href={`/blog/${pick.slug}`} className="cp-ep__read">
                Baca artikel <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
