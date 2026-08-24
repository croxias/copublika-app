"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import {
  BLOG_CATEGORIES,
  countByCategory,
  getNonFeaturedArticles,
  type BlogArticle,
  type BlogCategory,
} from "@/lib/data/blog-articles";

/* ─── constants ─── */
const PER_PAGE = 6;
const MONTH_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatDate(iso: string) {
  const [y, m] = iso.split("-");
  return `${MONTH_ID[Math.max(0, Math.min(11, parseInt(m, 10) - 1))]} ${y}`;
}

const ARTICLES = getNonFeaturedArticles();

const POPULAR_TOPICS = [
  "Scopus Q1",
  "Reviewer Comments",
  "Abstract",
  "Cover Letter",
  "AI Riset",
  "Beasiswa",
];

/* ─── motion variants ─── */
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

/* ─── ArticleCard ─── */
function ArticleCard({ article }: { article: BlogArticle }) {
  return (
    <motion.div
      variants={cardVariants}
      layout
      whileHover="hover"
      initial="hidden"
      animate="show"
      exit="exit"
      className="flex"
    >
      <Link
        href={`/blog/${article.slug}`}
        className="group relative flex flex-col justify-between w-full bg-white dark:bg-[#111115]/40 backdrop-filter backdrop-blur-md border border-[var(--hair)] rounded-[24px] overflow-hidden hover:border-[var(--ink)] hover:shadow-xl transition-all duration-300"
      >
        <div>
          {/* Card Thumb */}
          <div className="h-48 w-full relative overflow-hidden bg-[var(--bone)] border-b border-[var(--hair)]">
            <span
              className={`absolute top-4 left-4 z-10 px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-full tracking-wider shadow-sm ${
                article.category === "case" || article.category === "interview"
                  ? "bg-[var(--scopus)] text-white"
                  : "bg-white/95 dark:bg-black/90 text-[var(--ink)] backdrop-filter backdrop-blur-sm"
              }`}
            >
              {article.categoryLabel}
            </span>
            <motion.img
              src={article.cover}
              alt={article.title}
              loading="lazy"
              variants={{
                hover: { scale: 1.05 },
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              className="w-full h-full object-cover filter grayscale-[15%] group-hover:grayscale-0 transition-all duration-300"
            />
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--mute)] uppercase tracking-wider">
              <span>{article.readTime} read</span>
              <span className="text-[var(--hair-strong)]">•</span>
              <span>{formatDate(article.date)}</span>
            </div>

            <h3 className="text-lg font-bold text-[var(--ink)] group-hover:text-[var(--scopus)] transition-colors duration-200 line-clamp-2 leading-snug font-display tracking-tight">
              {article.title}
            </h3>

            <p className="text-xs text-[var(--mute)] leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 pb-6 pt-0 mt-auto">
          <div className="flex items-center gap-2.5 border-t border-[var(--hair)] pt-4 mt-auto">
            <span className="w-7 h-7 rounded-full bg-[var(--bone)] border border-[var(--hair-strong)] flex items-center justify-center font-bold text-[10px] uppercase text-[var(--ink)] shadow-inner">
              {article.authorInitials}
            </span>
            <span className="text-xs font-semibold text-[var(--ink)]">{article.author}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── BlogExplorer ─── */
interface BlogExplorerProps {
  category: BlogCategory | "all";
  setCategory: (c: BlogCategory | "all") => void;
  query: string;
  setQuery: (q: string) => void;
}

export function BlogExplorer({ category, setCategory, query, setQuery }: BlogExplorerProps) {
  const [page, setPage] = useState(1);

  /* Filtered articles */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTICLES
      .filter((a) => (category === "all" ? true : a.category === category))
      .filter((a) =>
        q
          ? a.title.toLowerCase().includes(q) ||
            a.excerpt.toLowerCase().includes(q) ||
            a.author.toLowerCase().includes(q)
          : true
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [category, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const safePage = Math.min(page, totalPages);

  /* Derived paginated list */
  const paginated = useMemo(() => {
    const start = (safePage - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, safePage]);

  const rangeStart = total === 0 ? 0 : (safePage - 1) * PER_PAGE + 1;
  const rangeEnd = Math.min(safePage * PER_PAGE, total);

  const activeCategoryLabel = BLOG_CATEGORIES.find((c) => c.id === category)?.label;

  return (
    <section className="cp-blog-section bg-[var(--paper)] py-12">
      <div className="cp-blog-section__wrap space-y-8">
        {/* ── Section header ── */}
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-mono text-[var(--scopus)] uppercase tracking-widest font-bold mb-2">
              Semua Tulisan
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--ink)] font-display tracking-tight">
              Eksplor seluruh arsip
            </h3>
          </div>
          <div className="text-sm text-[var(--mute)] font-mono">
            <span className="font-bold text-[var(--ink)]">{total}</span>{" "}
            {query ? "hasil" : activeCategoryLabel === "Semua" ? "tulisan" : "di kategori"}{" "}
            {!query && activeCategoryLabel && activeCategoryLabel !== "Semua" && (
              <span className="font-bold text-[var(--ink)]">{activeCategoryLabel}</span>
            )}
            {query && (
              <>
                {" untuk "}
                <span className="font-bold text-[var(--ink)]">&ldquo;{query}&rdquo;</span>
              </>
            )}
          </div>
        </div>

        {/* ── Filter tabs + search ── */}
        <div className="border-b border-[var(--hair)] pb-6 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          <div className="cp-blog-tabs flex-1 min-w-0" role="tablist" aria-label="Kategori">
            {BLOG_CATEGORIES.map((c) => {
              const isActive = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`cp-blog-tab relative overflow-hidden transition-colors duration-200 ${
                    isActive ? "text-[var(--paper)] border-transparent" : "text-[var(--ink)]"
                  }`}
                  onClick={() => setCategory(c.id)}
                  style={{ background: "transparent" }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeCategoryBg"
                      className="absolute inset-0 bg-[var(--ink)] -z-10 rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {c.label}
                    <span
                      className={`cp-blog-tab__ct transition-colors duration-200 ${
                        isActive ? "bg-white/20 text-white" : ""
                      }`}
                    >
                      {countByCategory(c.id)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search input */}
          <div className="relative flex items-center bg-white border border-[var(--hair-strong)] rounded-full pl-4 pr-2 py-1.5 lg:w-72 lg:flex-shrink-0 focus-within:border-[var(--ink)] focus-within:shadow-[0_0_0_4px_rgba(233,113,28,0.08)] transition-all">
            <Search className="w-4 h-4 text-[var(--mute)] mr-2 flex-shrink-0" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari topik atau penulis…"
              aria-label="Cari tulisan"
              className="flex-1 min-w-0 bg-transparent border-0 outline-none text-sm text-[var(--ink)] placeholder:text-[var(--mute)] py-1"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Hapus pencarian"
                className="ml-1 w-7 h-7 rounded-full flex items-center justify-center text-[var(--mute)] hover:text-[var(--ink)] hover:bg-[var(--bone)] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── Grid / Empty ── */}
        <AnimatePresence mode="popLayout">
          {total === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center gap-5 py-20 px-6 text-center bg-white border border-dashed border-[var(--hair-strong)] rounded-[28px]"
            >
              <div className="w-14 h-14 rounded-full bg-[var(--bone)] flex items-center justify-center text-[var(--mute)]">
                <Search className="w-7 h-7" strokeWidth={1.6} />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-bold text-[var(--ink)] font-display">
                  Tidak ada tulisan yang cocok
                </h4>
                <p className="text-sm text-[var(--mute)] max-w-md">
                  Coba kata kunci lain, ganti kategori, atau pilih topik populer berikut.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                {POPULAR_TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setQuery(t);
                      setCategory("all");
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-full border border-[var(--hair-strong)] text-[var(--ink)] hover:border-[var(--scopus)] hover:text-[var(--scopus)] transition-colors cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-full bg-[var(--ink)] text-white hover:bg-[var(--scopus)] transition-colors cursor-pointer"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
              >
                Reset semua filter
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${category}-${query}-${safePage}`}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -20, transition: { duration: 0.25 } }}
              variants={gridVariants}
              className="cp-blog-grid"
            >
              {paginated.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pagination ── */}
        {total > PER_PAGE && (
          <div className="cp-blog-pager">
            <div className="cp-blog-pager__count">
              Menampilkan <strong>{rangeStart}–{rangeEnd}</strong> dari <strong>{total}</strong> tulisan
            </div>

            <div className="cp-blog-pager__ctrl">
              <button
                type="button"
                className="cp-blog-pager__btn"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <div className="cp-blog-pager__pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`cp-blog-pager__num ${n === safePage ? "is-active" : ""}`}
                    onClick={() => setPage(n)}
                    aria-label={`Halaman ${n}`}
                    aria-current={n === safePage ? "page" : undefined}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="cp-blog-pager__btn"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Halaman berikutnya"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
