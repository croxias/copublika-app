"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Clock3, Search, X } from "lucide-react";
import { formatMonth, initials, personPhoto } from "@/lib/content/research";
import { Pager } from "@/components/research/Pager";
import { BLOG_ARTICLES, BLOG_CATEGORIES, type BlogArticle, type BlogCategory } from "@/lib/data/blog-articles";

const EASE = [0.22, 1, 0.36, 1] as const;
const PAGE = 6;
const SORTS = [
  { id: "new", label: "Terbaru" },
  { id: "old", label: "Terlama" },
  { id: "short", label: "Bacaan singkat" },
] as const;
type Sort = (typeof SORTS)[number]["id"];

const minutes = (a: BlogArticle) => parseInt(a.readTime, 10) || 0;
const count = (c: BlogCategory | "all") => (c === "all" ? BLOG_ARTICLES.length : BLOG_ARTICLES.filter((a) => a.category === c).length);

type Props = {
  category: BlogCategory | "all";
  setCategory: (c: BlogCategory | "all") => void;
  query: string;
  setQuery: (q: string) => void;
};

export function BlogGrid({ category, setCategory, query, setQuery }: Props) {
  const reduce = useReducedMotion();
  const [sort, setSort] = useState<Sort>("new");
  const [page, setPage] = useState(1);
  const top = useRef<HTMLDivElement>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = BLOG_ARTICLES.filter((a) => category === "all" || a.category === category).filter(
      (a) => !q || `${a.title} ${a.excerpt} ${a.author} ${a.categoryLabel}`.toLowerCase().includes(q),
    );
    return [...filtered].sort((a, b) =>
      sort === "new" ? b.date.localeCompare(a.date) : sort === "old" ? a.date.localeCompare(b.date) : minutes(a) - minutes(b),
    );
  }, [category, query, sort]);

  const [lead, ...rest] = list;
  const pages = Math.max(1, Math.ceil(rest.length / PAGE));
  const current = Math.min(page, pages);
  const visible = rest.slice((current - 1) * PAGE, current * PAGE);
  const goTo = (n: number) => {
    setPage(n);
    top.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="cp-bg" ref={top}>
      <div className="cp-bg__bar">
        <div className="cp-bg__chips" role="group" aria-label="Kategori">
          {BLOG_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={category === c.id}
              className={category === c.id ? "is-active" : ""}
              onClick={() => { setCategory(c.id); setPage(1); }}
            >
              {c.label}
              <span>{count(c.id)}</span>
            </button>
          ))}
        </div>
        <div className="cp-bg__tools">
          <label className="cp-bg__search">
            <Search size={16} aria-hidden="true" />
            <input type="search" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Cari judul, penulis, topik…" aria-label="Cari tulisan" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Hapus pencarian"><X size={14} /></button>}
          </label>
          <div className="cp-bg__sort" role="group" aria-label="Urutkan">
            {SORTS.map((s) => (
              <button key={s.id} type="button" aria-pressed={sort === s.id} className={sort === s.id ? "is-active" : ""} onClick={() => { setSort(s.id); setPage(1); }}>{s.label}</button>
            ))}
          </div>
        </div>
      </div>

      <p className="cp-bg__count" aria-live="polite">
        {list.length ? <><strong>{list.length}</strong> tulisan{query && <> untuk “{query}”</>}</> : null}
      </p>

      {!lead ? (
        <div className="cp-bg__empty">
          <Search size={28} aria-hidden="true" />
          <p>Belum ada tulisan untuk “{query}”. Coba kata kunci lain atau lihat semua kategori.</p>
          <button type="button" onClick={() => { setQuery(""); setCategory("all"); }}>Tampilkan semua tulisan</button>
        </div>
      ) : (
        <>
          {current === 1 && <motion.div key={lead.slug} initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            <LeadCard a={lead} />
          </motion.div>}

          <motion.div layout={!reduce} className="cp-bg__grid">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((a, i) => (
                <motion.div
                  key={a.slug}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
                >
                  <PostCard a={a} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <Pager page={current} perPage={PAGE} total={rest.length} noun="tulisan lain" onChange={goTo} />
        </>
      )}
    </div>
  );
}

function Author({ a, size = 36 }: { a: BlogArticle; size?: number }) {
  const photo = personPhoto(a.author);
  return (
    <span className="cp-bg__author">
      <span className="cp-bg__avatar" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {photo ? <img src={photo} alt="" /> : initials(a.author) || "CP"}
      </span>
      <span>
        <strong>{a.author}</strong>
        <small>{formatMonth(a.date)}</small>
      </span>
    </span>
  );
}

function LeadCard({ a }: { a: BlogArticle }) {
  return (
    <Link href={`/blog/${a.slug}`} className="cp-bg__lead">
      <span className="cp-bg__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={a.cover} alt="" />
        <span className="cp-bg__time"><Clock3 size={12} aria-hidden="true" /> {a.readTime} baca</span>
      </span>
      <span className="cp-bg__lead-body">
        <span className="cp-bg__cat is-solid">{a.categoryLabel}</span>
        <strong className="cp-bg__lead-title">{a.title}</strong>
        <span className="cp-bg__excerpt">{a.excerpt}</span>
        <span className="cp-bg__lead-foot">
          <Author a={a} size={40} />
          <span className="cp-bg__go">Baca artikel <ArrowRight size={15} aria-hidden="true" /></span>
        </span>
      </span>
    </Link>
  );
}

function PostCard({ a }: { a: BlogArticle }) {
  return (
    <Link href={`/blog/${a.slug}`} className="cp-bg__card">
      <span className="cp-bg__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={a.cover} alt="" loading="lazy" />
        <span className="cp-bg__time"><Clock3 size={11} aria-hidden="true" /> {a.readTime}</span>
      </span>
      <span className="cp-bg__body">
        <span className="cp-bg__cat">{a.categoryLabel}</span>
        <strong className="cp-bg__title">{a.title}</strong>
        <span className="cp-bg__excerpt">{a.excerpt}</span>
      </span>
      <span className="cp-bg__foot">
        <Author a={a} size={32} />
        <span className="cp-bg__arrow" aria-hidden="true"><ArrowUpRight size={16} /></span>
      </span>
    </Link>
  );
}
