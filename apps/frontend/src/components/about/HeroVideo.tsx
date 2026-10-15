"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Play, X } from "lucide-react";
import { Counter } from "./motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** YouTube id from watch, youtu.be, embed or shorts links (or a bare id). */
export function youtubeId(url: string): string | null {
  const s = url.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/**
 * Hero video: a cinematic frame (animated gradient border, viewfinder corners, caption bar)
 * around a poster. Play swaps the poster for the YouTube player in the same frame.
 */
export function HeroVideo({ url, poster, title, caption }: { url: string; poster?: string; title: string; caption: string }) {
  const reduce = useReducedMotion();
  const id = youtubeId(url);
  const [playing, setPlaying] = useState(false);
  const cover = poster || (id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : "");

  // Gentle tilt toward the pointer while the poster is showing.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), { stiffness: 120, damping: 18 });

  return (
    <motion.div
      className="cp-hv"
      initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.3, ease: EASE }}
    >
      <div className="cp-hv__halo" aria-hidden="true" />
      <motion.div
        className={`cp-hv__frame ${playing ? "is-playing" : ""}`}
        style={reduce || playing ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
      >
        <div className="cp-hv__screen">
          <AnimatePresence mode="wait" initial={false}>
            {playing && id ? (
              <motion.div key="player" className="cp-hv__player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </motion.div>
            ) : (
              <motion.button
                key="poster"
                type="button"
                className="cp-hv__poster"
                onClick={() => id && setPlaying(true)}
                disabled={!id}
                aria-label={id ? `Putar video: ${title}` : "Video segera tersedia"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {cover && <img src={cover} alt="" />}
                <span className="cp-hv__shade" aria-hidden="true" />
                <span className="cp-hv__grain" aria-hidden="true" />
                {["tl", "tr", "bl", "br"].map((c) => <span key={c} className={`cp-hv__corner cp-hv__corner--${c}`} aria-hidden="true" />)}
                <span className="cp-hv__tag">
                  <span className="cp-hv__rec" aria-hidden="true" />
                  {id ? "Cerita CoPublika" : "Segera tayang"}
                </span>
                <span className="cp-hv__play" aria-hidden="true">
                  <span className="cp-hv__ring" />
                  <span className="cp-hv__ring cp-hv__ring--2" />
                  <span className="cp-hv__btn"><Play size={30} fill="currentColor" strokeWidth={0} /></span>
                </span>
                <span className="cp-hv__caption">
                  <strong>{title}</strong>
                  <span>{caption}</span>
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        {playing && (
          <button type="button" className="cp-hv__close" onClick={() => setPlaying(false)} aria-label="Tutup video">
            <X size={18} />
          </button>
        )}
      </motion.div>

      <motion.div className="cp-hv__chip cp-hv__chip--a" initial={reduce ? false : { opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.6, ease: EASE }} aria-hidden="true">
        <b><Counter value="318" /></b>
        <span>publikasi<br />terindeks</span>
      </motion.div>
      <motion.div className="cp-hv__chip cp-hv__chip--b" initial={reduce ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 0.6, ease: EASE }} aria-hidden="true">
        <span className="cp-hv__live" />
        <span><b className="cp-hv__chip-n"><Counter value="47" /></b> mentor aktif</span>
      </motion.div>
    </motion.div>
  );
}
