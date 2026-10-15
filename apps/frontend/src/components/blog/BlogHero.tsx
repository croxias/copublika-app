"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  PenTool,
  GraduationCap,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { BLOG_ARTICLES, getFeaturedArticle } from "@/lib/data/blog-articles";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const MONTH_ID = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

function formatDate(iso: string) {
  const [y, m] = iso.split("-");
  return `${MONTH_ID[Math.max(0, Math.min(11, parseInt(m, 10) - 1))]} ${y}`;
}

/* ------------------------------------------------------------------ */
/*  Motion variants                                                   */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { y: 28, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const cardEntrance = {
  hidden: { opacity: 0, x: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.85, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function BlogHero() {
  const total = BLOG_ARTICLES.length;
  const spotlight = getFeaturedArticle();
  const sideStack = BLOG_ARTICLES.filter((a) => a.slug !== spotlight.slug).slice(0, 2);

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden border-b border-white/5 text-white"
      style={{
        minHeight: "64vh",
        background:
          "linear-gradient(135deg, #0c0d12 0%, #050608 50%, #120803 100%)",
        fontFamily: "var(--sans)",
      }}
    >
      {/* ───────── Decorative glow orbs ───────── */}
      <motion.div
        className="pointer-events-none absolute -left-24 -top-24 z-0 h-[420px] w-[420px] rounded-full bg-orange-600/[0.08]"
        style={{ filter: "blur(100px)" }}
        animate={{ x: [0, 50, -30, 0], y: [0, -40, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-32 -right-24 z-0 h-[520px] w-[520px] rounded-full bg-[#1d2747]/20"
        style={{ filter: "blur(120px)" }}
        animate={{ x: [0, -40, 50, 0], y: [0, 30, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/3 z-0 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-orange-500/[0.04]"
        style={{ filter: "blur(90px)" }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ───────── Paper texture overlay ───────── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 28px)",
        }}
      />

      {/* ───────── Content grid ───────── */}
      <div className="relative z-10 cp-wrap mx-auto w-full max-w-[var(--max)] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:gap-16">
          {/* ═══════ LEFT COLUMN — Masthead ═══════ */}
          <motion.div
            className="flex flex-col lg:col-span-7"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Masthead label */}
            <motion.div
              variants={fadeUp}
              className="mb-8 flex flex-wrap items-center gap-4"
            >
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                <BookOpen className="h-3 w-3 text-white/30" />
                CoPublika · Vol. 02
              </span>
              <span className="h-px w-10 bg-white/15" />
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-orange-400">
                <Sparkles className="h-3 w-3" />
                {total} tulisan
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="mb-8 font-display text-5xl font-extrabold tracking-[-0.035em] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
              style={{ lineHeight: 1.0, letterSpacing: "-0.03em" }}
            >
              <span className="block">Cerita, panduan,</span>
              <span className="mt-1 block">
                <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300 bg-clip-text font-light text-transparent">
                  &amp; esai
                </span>{" "}
                riset.
              </span>
            </motion.h1>

            {/* Lead paragraph */}
            <motion.p
              variants={fadeUp}
              className="mb-10 max-w-xl text-base leading-[1.75] text-gray-400 sm:text-lg sm:leading-[1.8]"
            >
              Panduan praktis dan cerita panjang dari mentor, editor, dan alumni
              CoPublika tentang siklus riset, publikasi Scopus, dan karir
              akademik yang berkelanjutan.
            </motion.p>

            {/* Quick topic pills */}
            <motion.div
              variants={fadeUp}
              className="mb-10 flex flex-wrap items-center gap-2.5"
            >
              {[
                { icon: PenTool, label: "Panduan" },
                { icon: GraduationCap, label: "Studi Kasus" },
                { icon: TrendingUp, label: "Esai Riset" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] tracking-wide text-white/50 backdrop-blur-sm"
                >
                  <Icon className="h-3 w-3 text-orange-400/70" />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* Editorial meta strip */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/[0.08] pt-6 text-xs"
            >
              {[
                { label: "Edisi", value: formatDate(spotlight.date) },
                { label: "Editor", value: "Dewan Mentor CoPublika" },
                { label: "Terbit", value: "Setiap Jumat" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="font-mono uppercase tracking-wider text-orange-400/80">
                    {label}
                  </span>
                  <span className="font-medium text-white/80">{value}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ═══════ RIGHT COLUMN — Editorial card ═══════ */}
          <motion.div
            className="relative lg:col-span-5"
            variants={cardEntrance}
            initial="hidden"
            animate="visible"
          >
            {/* Card glow */}
            <div className="pointer-events-none absolute -inset-4 z-0 rounded-[2rem] bg-gradient-to-tr from-orange-500/10 via-transparent to-blue-500/[0.04] blur-2xl" />

            <div className="relative z-10 flex flex-col gap-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-xl">
              {/* Card header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] px-7 py-5">
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(233,113,28,0.6)]" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-300">
                    Edisi terbaru
                  </span>
                </div>
                <span className="font-mono text-[10px] tracking-wider text-white/35">
                  #{String(total).padStart(2, "0")}
                </span>
              </div>

              {/* Spotlight article */}
              <Link
                href={`/blog/${spotlight.slug}`}
                className="group block px-7 pb-6 pt-6"
              >
                {/* Meta row */}
                <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
                  <span className="font-bold text-orange-400">SOROTAN</span>
                  <span className="h-1 w-1 rounded-full bg-white/25" />
                  <span className="text-white/45">{spotlight.categoryLabel}</span>
                  <span className="h-1 w-1 rounded-full bg-white/25" />
                  <span className="text-white/45">{spotlight.readTime} read</span>
                </div>

                {/* Title */}
                <h3 className="mb-3 line-clamp-3 font-display text-xl font-bold leading-snug tracking-tight text-white transition-colors group-hover:text-orange-300 sm:text-[22px]">
                  {spotlight.title}
                </h3>

                {/* Author & CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/50">
                    oleh{" "}
                    <span className="text-white/80">
                      {spotlight.author.replace("Dr. ", "")}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-orange-300 transition-all group-hover:gap-2">
                    Baca
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>

              {/* Divider with label */}
              <div className="relative mx-7">
                <div className="h-px bg-white/[0.07]" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0b0b10] px-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                  Juga di edisi ini
                </span>
              </div>

              {/* Side stack — 2 more articles */}
              <ul className="flex flex-col gap-1 px-7 pb-7 pt-5">
                {sideStack.map((a, i) => (
                  <li key={a.slug}>
                    <Link
                      href={`/blog/${a.slug}`}
                      className="group flex items-start gap-3 rounded-lg px-1 py-2.5 transition-colors hover:bg-white/[0.03]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center font-mono text-[10px] tracking-wider text-orange-400/70">
                        {String(i + 2).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-white/35">
                          <span>{a.categoryLabel}</span>
                          <span className="text-white/20">·</span>
                          <span>{a.readTime}</span>
                        </div>
                        <p className="line-clamp-2 text-[13px] font-medium leading-snug text-white/80 transition-colors group-hover:text-orange-300">
                          {a.title}
                        </p>
                      </div>
                      <ArrowRight className="mt-1 h-3 w-3 flex-shrink-0 text-white/20 transition-colors group-hover:text-orange-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
