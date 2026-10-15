"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { CopublikaMark } from "@/components/brand/CopublikaMark";
import { formatMonth } from "@/lib/content/research";
import { BLOG_ARTICLES } from "@/lib/data/blog-articles";

const EASE = [0.22, 1, 0.36, 1] as const;
const LATEST = [...BLOG_ARTICLES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const EDITION = (() => {
  const [y, m] = LATEST[0].date.split("-").map(Number);
  return `Edisi ${MONTHS[m - 1]} ${y}`;
})();

/**
 * The newest articles as a 3D notebook with a white CoPublika cover. Leaves, in order: front
 * cover (inside: contents), one leaf per article (back: reading notes), and a last leaf whose
 * back is the back cover. The book sits centred while closed and opens to a two-page spread.
 * Turn pages by clicking, the arrows, the arrow keys, or dragging sideways.
 */
export function BlogBook() {
  const reduce = useReducedMotion();
  const n = LATEST.length;
  const total = n + 2;
  const [turned, setTurned] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<number | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [16, 4]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });

  const next = useCallback(() => setTurned((t) => Math.min(total, t + 1)), [total]);
  const prev = useCallback(() => setTurned((t) => Math.max(0, t - 1)), []);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onDown = (e: React.PointerEvent) => { drag.current = e.clientX; };
  const onUp = (e: React.PointerEvent) => {
    if (drag.current === null) return;
    const dx = e.clientX - drag.current;
    drag.current = null;
    if (dx < -40) next();
    else if (dx > 40) prev();
  };

  const closedFront = turned === 0;
  const closedBack = turned === total;
  /** Article on the right page, if any. */
  const article = turned >= 1 && turned <= n ? turned - 1 : null;
  const status = closedFront ? "Sampul" : closedBack ? "Sampul belakang" : article !== null ? `${String(article + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}` : "Akhir edisi";
  const hint = closedFront ? "Klik sampul untuk membuka" : closedBack ? "Klik untuk membuka lagi" : article !== null ? LATEST[article].author : "Balik untuk menutup buku";

  const leafStyle = (i: number) => {
    const flipped = i < turned;
    return { flipped, z: flipped ? 10 + i : 10 + total - i };
  };

  return (
    <div className="cp-bk">
      <div className="cp-bk__head">
        <span className="cp-bk__label">Catatan terbaru</span>
        <span className="cp-bk__count">{status}</span>
      </div>

      <div
        ref={stage}
        className="cp-bk__stage"
        tabIndex={0}
        role="region"
        aria-roledescription="buku"
        aria-label={`Artikel terbaru, ${status}. Gunakan panah kiri dan kanan untuk membalik halaman.`}
        onPointerMove={onMove}
        onPointerLeave={() => { mx.set(0); my.set(0); drag.current = null; }}
        onPointerDown={onDown}
        onPointerUp={onUp}
      >
        <motion.div className="cp-bk__book" style={{ rotateX: rx, rotateY: ry }}>
          {/* Slides so a closed book sits centred. */}
          <motion.div
            className="cp-bk__slide"
            animate={{ x: closedFront ? "-25%" : closedBack ? "25%" : "0%" }}
            transition={reduce ? { duration: 0 } : { duration: 0.9, ease: EASE }}
          >
            <div className={`cp-bk__shadow ${closedFront ? "is-right" : closedBack ? "is-left" : ""}`} aria-hidden="true" />
            {!closedFront && <div className="cp-bk__page cp-bk__page--left cp-bk__paper" aria-hidden="true" />}
            {!closedBack && <div className="cp-bk__page cp-bk__page--right cp-bk__paper" aria-hidden="true" />}
            {!closedFront && !closedBack && <div className="cp-bk__spine" aria-hidden="true" />}
            {/* Page block thickness and a ribbon bookmark. */}
            <div className={`cp-bk__edges ${closedFront ? "is-right" : closedBack ? "is-left" : ""}`} aria-hidden="true" />
            {!closedFront && !closedBack && (
              <motion.span className="cp-bk__ribbon" aria-hidden="true" initial={false} animate={{ height: article !== null ? 70 : 40 }} transition={{ duration: 0.5 }} />
            )}

            {/* Front cover; its inside is the contents page. */}
            {(() => {
              const { flipped, z } = leafStyle(0);
              return (
                <motion.div
                  className={`cp-bk__leaf cp-bk__leaf--cover ${turned === 0 ? "is-top" : ""}`}
                  style={{ zIndex: z }}
                  animate={{ rotateY: flipped ? -180 : 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 1, ease: EASE }}
                  onClick={() => (flipped ? prev() : next())}
                >
                  <div className="cp-bk__face cp-bk__face--front cp-bk__cover">
                    <span className="cp-bk__cover-no">No. {String(n).padStart(2, "0")}</span>
                    <span className="cp-bk__cover-mark"><CopublikaMark /></span>
                    <span className="cp-bk__cover-k">Jurnal CoPublika</span>
                    <strong>Catatan dari yang sudah tembus jurnal.</strong>
                    <span className="cp-bk__cover-ed">{EDITION} · {n} tulisan</span>
                    <span className="cp-bk__cover-hint">Buka <ArrowRight size={13} aria-hidden="true" /></span>
                  </div>
                  <div className="cp-bk__face cp-bk__face--back cp-bk__inside">
                    <span className="cp-bk__k">{EDITION}</span>
                    <strong>{n} tulisan terbaru dari mentor & alumni</strong>
                    <ol>
                      {LATEST.map((a, i) => (
                        <li key={a.slug} className={article === i ? "is-on" : ""}>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setTurned(i + 1); }} tabIndex={flipped ? 0 : -1}>
                            <span>0{i + 1}</span>{a.title}
                          </button>
                        </li>
                      ))}
                    </ol>
                    <small>Balik halaman untuk membaca →</small>
                  </div>
                </motion.div>
              );
            })()}

            {/* One leaf per article. */}
            {LATEST.map((a, i) => {
              const { flipped, z } = leafStyle(i + 1);
              return (
                <motion.div
                  key={a.slug}
                  className={`cp-bk__leaf ${turned === i + 1 ? "is-top" : ""}`}
                  style={{ zIndex: z }}
                  animate={{ rotateY: flipped ? -180 : 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.9, ease: EASE }}
                  onClick={() => (flipped ? prev() : next())}
                  aria-hidden={article !== i && turned !== i + 2}
                >
                  <div className="cp-bk__face cp-bk__face--front">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.cover} alt="" draggable={false} />
                    <span className="cp-bk__meta">{a.categoryLabel} · <Clock3 size={11} aria-hidden="true" /> {a.readTime}</span>
                    <strong className="cp-bk__title">{a.title}</strong>
                    <span className="cp-bk__by">{a.author} · {formatMonth(a.date)}</span>
                    <span className="cp-bk__curl" aria-hidden="true" />
                  </div>
                  <div className="cp-bk__face cp-bk__face--back">
                    <span className="cp-bk__k">Catatan · {a.categoryLabel}</span>
                    <p className="cp-bk__notes">{a.excerpt}</p>
                    <Link href={`/blog/${a.slug}`} className="cp-bk__read" onClick={(e) => e.stopPropagation()} tabIndex={turned === i + 2 ? 0 : -1}>
                      Baca artikel <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                    <span className="cp-bk__pageno">{i * 2 + 2}</span>
                  </div>
                </motion.div>
              );
            })}

            {/* Last leaf: end page, then the back cover. */}
            {(() => {
              const { flipped, z } = leafStyle(total - 1);
              return (
                <motion.div
                  className={`cp-bk__leaf cp-bk__leaf--cover ${turned === total - 1 ? "is-top" : ""}`}
                  style={{ zIndex: z }}
                  animate={{ rotateY: flipped ? -180 : 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 1, ease: EASE }}
                  onClick={() => (flipped ? setTurned(0) : next())}
                >
                  <div className="cp-bk__face cp-bk__face--front cp-bk__end">
                    <span className="cp-bk__k">Akhir edisi</span>
                    <strong>Masih ada {BLOG_ARTICLES.length - n} tulisan lain di arsip.</strong>
                    <a href="#semua" onClick={(e) => e.stopPropagation()} tabIndex={turned === total - 1 ? 0 : -1}>Buka arsip <ArrowRight size={14} aria-hidden="true" /></a>
                    <small>Balik untuk menutup buku</small>
                  </div>
                  <div className="cp-bk__face cp-bk__face--back cp-bk__cover cp-bk__cover--back">
                    <span className="cp-bk__cover-mark"><CopublikaMark /></span>
                    <span className="cp-bk__cover-k">CoPublika</span>
                    <strong>Riset yang ditulis bersama.</strong>
                    <span className="cp-bk__cover-ed">copublika.id/blog</span>
                    <span className="cp-bk__cover-hint">Buka lagi <ArrowRight size={13} aria-hidden="true" /></span>
                  </div>
                </motion.div>
              );
            })()}
          </motion.div>
        </motion.div>
      </div>

      <div className="cp-bk__controls">
        <button type="button" onClick={prev} disabled={turned === 0} aria-label="Halaman sebelumnya"><ChevronLeft size={18} /></button>
        <div className="cp-bk__dots" role="group" aria-label="Pilih halaman">
          {LATEST.map((a, i) => (
            <button key={a.slug} type="button" className={article === i ? "is-on" : ""} onClick={() => setTurned(i + 1)} aria-label={`Halaman ${i + 1}: ${a.title}`} />
          ))}
        </div>
        <button type="button" onClick={next} disabled={turned === total} aria-label="Halaman berikutnya"><ChevronRight size={18} /></button>
        <span className="cp-bk__hint">{hint}</span>
      </div>
    </div>
  );
}
