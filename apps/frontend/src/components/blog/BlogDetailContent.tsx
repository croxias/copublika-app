"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Check,
  Clock,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import type { BlogPost } from "@/types";

interface BlogDetailContentProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

// Inline social icons (lucide-react v1 doesn't include them)
const TwitterIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const LinkedinIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
  </svg>
);

type TocItem = { id: string; text: string; level: 2 | 3 };

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function BlogDetailContent({ post, relatedPosts }: BlogDetailContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const currentUrl = `/blog/${post.slug}`;
  const encodedTitle = encodeURIComponent(post.title);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const toc: TocItem[] = useMemo(() => {
    const items: TocItem[] = [];
    if (!post.content) return items;
    const lines = post.content.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("## ")) {
        const text = trimmed.replace("## ", "");
        items.push({ id: slugify(text), text, level: 2 });
      } else if (trimmed.startsWith("### ")) {
        const text = trimmed.replace("### ", "");
        items.push({ id: slugify(text), text, level: 3 });
      }
    }
    return items;
  }, [post.content]);

  useEffect(() => {
    if (toc.length === 0) return;
    const headings = toc
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0.1 }
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [toc]);

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      const href = typeof window !== "undefined" ? window.location.href : currentUrl;
      navigator.clipboard.writeText(href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Inline markdown
  const parseInlineStyle = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**"))
        return (
          <strong key={i} className="font-bold text-[var(--ink)]">
            {part.slice(2, -2)}
          </strong>
        );
      if (part.startsWith("*") && part.endsWith("*"))
        return (
          <em key={i} className="italic">
            {part.slice(1, -1)}
          </em>
        );
      if (part.startsWith("`") && part.endsWith("`"))
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 bg-[var(--bone)] text-orange-600 rounded text-[0.9em] font-mono"
          >
            {part.slice(1, -1)}
          </code>
        );
      return <span key={i}>{part}</span>;
    });
  };

  // Magazine-style content renderer
  const renderContent = (markdownText: string) => {
    if (!markdownText) return null;
    const lines = markdownText.split("\n");
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];
    let listType: "ul" | "ol" | null = null;
    let currentTableRows: string[][] = [];
    let inTable = false;
    let firstParagraphFlag = true;
    let h2Index = 0;

    const flushList = (key: number) => {
      if (currentList.length > 0) {
        if (listType === "ol") {
          elements.push(
            <ol
              key={`list-${key}`}
              className="my-7 space-y-3 list-none counter-reset-blog"
            >
              {currentList}
            </ol>
          );
        } else {
          elements.push(
            <ul key={`list-${key}`} className="my-7 space-y-2.5 pl-0">
              {currentList}
            </ul>
          );
        }
        currentList = [];
        listType = null;
      }
    };

    const flushTable = (key: number) => {
      if (currentTableRows.length > 0) {
        elements.push(
          <div
            key={`table-${key}`}
            className="overflow-x-auto my-10 border border-[var(--hair)] rounded-lg bg-white"
          >
            <table className="min-w-full divide-y divide-[var(--hair)]">
              <tbody className="divide-y divide-[var(--hair)]">
                {currentTableRows.map((row, rIdx) => {
                  const isHeader = rIdx === 0;
                  return (
                    <tr
                      key={rIdx}
                      className={
                        isHeader
                          ? "bg-[var(--bone)] font-semibold"
                          : "hover:bg-[var(--bone)]/40 transition-colors"
                      }
                    >
                      {row.map((cell, cIdx) => {
                        const Tag = isHeader ? "th" : "td";
                        return (
                          <Tag
                            key={cIdx}
                            className="px-6 py-4 text-sm text-[var(--ink)] text-left"
                          >
                            {parseInlineStyle(cell)}
                          </Tag>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
        currentTableRows = [];
        inTable = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const line = rawLine.trim();

      const isUlItem = line.startsWith("* ") || line.startsWith("- ");
      const isOlItem = /^\d+\.\s+/.test(line);

      if (isUlItem || isOlItem) {
        flushTable(i);
        const newType = isOlItem ? "ol" : "ul";
        if (listType && listType !== newType) flushList(i);
        listType = newType;
        const text = isOlItem
          ? line.replace(/^\d+\.\s+/, "")
          : line.replace(/^[\*\-]\s+/, "");

        if (isOlItem) {
          // Numbered insight badges
          const num = currentList.length + 1;
          currentList.push(
            <li
              key={`li-${i}`}
              className="flex gap-4 items-start text-base md:text-[17px] leading-[1.7] text-[var(--ink)]"
            >
              <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--ink)] text-white font-mono text-[11px] font-bold mt-0.5">
                {num}
              </span>
              <span className="flex-1">{parseInlineStyle(text)}</span>
            </li>
          );
        } else {
          // Bullet — small orange tick
          currentList.push(
            <li
              key={`li-${i}`}
              className="flex gap-3 items-start text-base md:text-[17px] leading-[1.7] text-[var(--ink)]"
            >
              <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 mt-1 text-orange-500">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="5 12 10 17 19 8" />
                </svg>
              </span>
              <span className="flex-1">{parseInlineStyle(text)}</span>
            </li>
          );
        }
        continue;
      } else {
        flushList(i);
      }

      if (line.startsWith("|")) {
        inTable = true;
        const cells = line
          .split("|")
          .map((c) => c.trim())
          .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        if (cells.length > 0 && !cells.every((c) => c.startsWith("-"))) {
          currentTableRows.push(cells);
        }
        continue;
      } else {
        if (inTable) flushTable(i);
      }

      if (!line) continue;

      if (line.startsWith("## ")) {
        const text = line.replace("## ", "");
        const id = slugify(text);
        const roman = ROMAN[h2Index] || `${h2Index + 1}`;
        h2Index++;
        elements.push(
          <div key={i} className="mt-16 mb-8 first:mt-4">
            {/* Section roman numeral marker */}
            <div className="flex items-baseline gap-4 mb-4">
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-orange-500 font-bold">
                §&nbsp;{roman}
              </span>
              <span className="flex-1 h-px bg-[var(--hair)]" />
            </div>
            <h2
              id={id}
              className="scroll-mt-32 text-3xl md:text-[34px] font-extrabold text-[var(--ink)] tracking-[-0.025em] leading-[1.15] font-display"
            >
              {text}
            </h2>
          </div>
        );
      } else if (line.startsWith("### ")) {
        const text = line.replace("### ", "");
        const id = slugify(text);
        elements.push(
          <h3
            key={i}
            id={id}
            className="scroll-mt-32 text-xl md:text-[22px] font-bold mt-10 mb-4 text-[var(--ink)] tracking-tight font-display flex items-baseline gap-3"
          >
            <span className="text-orange-500 font-mono text-sm">→</span>
            <span>{text}</span>
          </h3>
        );
      } else if (line.startsWith("> ")) {
        const text = line.replace(/^>\s+/, "");
        elements.push(
          <figure key={i} className="my-12 relative pl-8 sm:pl-12">
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 text-[88px] sm:text-[110px] leading-none text-orange-500 font-display font-bold select-none"
              style={{ transform: "translateY(-12px)" }}
            >
              &ldquo;
            </span>
            <blockquote className="text-xl sm:text-2xl md:text-[26px] leading-[1.4] font-display italic text-[var(--ink)] tracking-tight">
              {parseInlineStyle(text)}
            </blockquote>
          </figure>
        );
      } else {
        // First substantive paragraph → drop cap + lede styling
        const isLede = firstParagraphFlag;
        firstParagraphFlag = false;

        if (isLede) {
          const text = rawLine.trim();
          const first = text.charAt(0);
          const rest = text.slice(1);
          elements.push(
            <p
              key={i}
              className="text-lg md:text-xl leading-[1.65] text-[var(--ink)] mb-7 font-sans first-letter-block"
            >
              <span
                aria-hidden="true"
                className="float-left text-[64px] sm:text-[72px] font-display font-extrabold leading-[0.85] mr-3 mt-1 text-orange-500 select-none"
              >
                {first}
              </span>
              {parseInlineStyle(rest)}
            </p>
          );
        } else {
          elements.push(
            <p
              key={i}
              className="text-base md:text-[17px] leading-[1.75] text-[var(--ink)] mb-6 font-sans"
            >
              {parseInlineStyle(rawLine.trim())}
            </p>
          );
        }
      }
    }

    flushList(lines.length);
    flushTable(lines.length);
    return elements;
  };

  const initials = post.author
    .split(" ")
    .filter((w) => /^[A-Za-z]/.test(w))
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
  });

  const isLongRead =
    post.slug.includes("anatomi") ||
    post.slug.includes("case") ||
    post.slug.includes("scholar");
  const readTime = isLongRead ? "12 min" : "6 min";

  return (
    <div ref={containerRef} className="min-h-screen relative bg-[var(--paper)]">
      {/* Top reading progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-orange-500 z-[999] origin-left shadow-[0_0_12px_rgba(233,113,28,0.5)]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* ───────── Magazine masthead ───────── */}
      <header className="relative pt-16 pb-12 overflow-hidden bg-gradient-to-b from-[var(--paper)] via-[var(--paper)] to-transparent">
        {/* Editorial bg lines */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, currentColor 0, currentColor 1px, transparent 1px, transparent 28px)",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back nav */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--mute)] hover:text-orange-500 transition-colors group mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke arsip</span>
          </Link>

          {/* Masthead line */}
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-orange-500 font-bold">
              CoPublika · {post.category}
            </span>
            <span className="h-px flex-1 bg-[var(--hair-strong)]" />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--mute)]">
              {formattedDate}
            </span>
          </div>

          {/* Title — large editorial */}
          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black tracking-[-0.035em] leading-[1.02] text-[var(--ink)] font-display max-w-[20ch]">
            {post.title}
          </h1>

          {/* Excerpt as dek */}
          <p className="mt-6 text-lg md:text-xl text-[var(--mute)] leading-[1.55] max-w-[58ch] font-light">
            {post.excerpt}
          </p>

          {/* Byline + meta */}
          <div className="mt-10 pt-6 border-t border-b border-[var(--hair)] py-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            {/* Author */}
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-[var(--ink)] text-white flex items-center justify-center font-bold text-[11px] font-mono shadow-sm">
                {initials}
              </span>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--mute)] mb-0.5">
                  oleh
                </div>
                <div className="text-sm font-bold text-[var(--ink)] leading-none">
                  {post.author}
                </div>
              </div>
            </div>

            <span className="hidden sm:block w-px h-8 bg-[var(--hair)]" />

            {/* Read time */}
            <div className="flex items-center gap-1.5 text-xs text-[var(--mute)] font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{readTime} read</span>
            </div>

            <span className="hidden sm:block w-px h-8 bg-[var(--hair)]" />

            <div className="flex items-center gap-1.5 text-xs text-[var(--mute)] font-mono">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>

            {/* Share inline */}
            <div className="ml-auto flex items-center gap-1.5">
              <span className="hidden sm:block text-[10px] font-mono uppercase tracking-wider text-[var(--mute)] mr-2">
                Bagikan
              </span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bagikan ke X / Twitter"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--mute)] hover:text-[var(--ink)] hover:bg-[var(--bone)] transition-colors"
              >
                <TwitterIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bagikan ke LinkedIn"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--mute)] hover:text-[var(--ink)] hover:bg-[var(--bone)] transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                aria-label="Salin tautan"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--mute)] hover:text-[var(--ink)] hover:bg-[var(--bone)] transition-colors"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ───────── Cover image — overflow-style ───────── */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <figure className="relative">
          <div className="relative w-full aspect-[16/8] overflow-hidden bg-[var(--bone)] rounded-2xl shadow-2xl ring-1 ring-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none rounded-2xl" />
          </div>
          <figcaption className="mt-4 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[var(--mute)]">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--scopus)]" />
              {post.category}
            </span>
            <span>Ilustrasi · Editorial CoPublika</span>
          </figcaption>
        </figure>
      </div>

      {/* ───────── Article body ───────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative">
        {/* Subtle warm background glow for article area */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[80%] h-40 bg-[var(--scopus)] opacity-[0.03] blur-[80px] rounded-full pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Article body (8 cols) */}
          <article className="lg:col-span-8">
            {renderContent(post.content)}

            {/* End-of-article ornament */}
            <div className="flex items-center justify-center gap-3 mt-16 mb-10">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="w-2 h-2 rounded-full bg-[var(--ink)]" />
              <span className="w-2 h-2 rounded-full bg-orange-500" />
            </div>

            {/* Filed under + copy */}
            <div className="pt-6 border-t border-[var(--hair)] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--mute)]">
                  Diarsipkan di
                </span>
                <Link
                  href="/blog"
                  className="text-xs font-bold text-[var(--ink)] hover:text-orange-500 transition-colors uppercase tracking-wider"
                >
                  {post.category} →
                </Link>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider uppercase text-[var(--mute)] hover:text-[var(--ink)] transition-colors"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copied ? "Tersalin" : "Salin tautan"}</span>
              </button>
            </div>

            {/* Author bio — editorial style, not boxy */}
            <div className="mt-16 pt-10 border-t-2 border-[var(--ink)]">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-orange-500 font-bold mb-6">
                ※ Tentang Penulis
              </div>
              <div className="flex items-start gap-6">
                <span className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-[var(--ink)] text-white flex items-center justify-center font-bold text-xl font-mono shadow-md flex-shrink-0">
                  {initials}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-2xl font-black text-[var(--ink)] tracking-tight font-display mb-2">
                    {post.author}
                  </h4>
                  <p className="text-[15px] text-[var(--mute)] leading-[1.7] mb-4 max-w-[60ch]">
                    Bagian dari dewan mentor & editor CoPublika. Aktif membimbing
                    publikasi alumni dan menulis tentang siklus riset, peer review,
                    dan praktik publikasi akademik di Indonesia.
                  </p>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--ink)] hover:text-orange-500 transition-colors uppercase tracking-wider"
                  >
                    <span>Lihat profil &amp; semua tulisan</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar (4 cols) — minimal sticky TOC */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {/* TOC — clean editorial */}
              {toc.length > 0 ? (
                <nav aria-label="Daftar isi">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-orange-500 font-bold mb-4">
                    ※ Daftar Isi
                  </div>
                  <ul className="space-y-2">
                    {toc.map((item, idx) => {
                      const isActive = activeId === item.id;
                      const isH2 = item.level === 2;
                      let h2Counter = 0;
                      for (let j = 0; j <= idx; j++) {
                        if (toc[j].level === 2) h2Counter++;
                      }
                      return (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className={`flex items-start gap-3 py-1.5 group transition-colors ${
                              item.level === 3 ? "pl-7" : "pl-0"
                            } ${
                              isActive
                                ? "text-[var(--ink)]"
                                : "text-[var(--mute)] hover:text-[var(--ink)]"
                            }`}
                          >
                            {isH2 && (
                              <span
                                className={`flex-shrink-0 font-mono text-[10px] tracking-wider mt-0.5 transition-colors ${
                                  isActive
                                    ? "text-orange-500 font-bold"
                                    : "text-[var(--mute)]"
                                }`}
                              >
                                §{String(h2Counter).padStart(2, "0")}
                              </span>
                            )}
                            {!isH2 && (
                              <span
                                className={`flex-shrink-0 mt-1.5 w-1.5 h-px transition-colors ${
                                  isActive
                                    ? "bg-orange-500"
                                    : "bg-[var(--hair-strong)]"
                                }`}
                              />
                            )}
                            <span
                              className={`flex-1 text-[13px] leading-snug transition-all ${
                                isActive ? "font-bold" : ""
                              }`}
                            >
                              {item.text}
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              ) : null}

              {/* Floating share — minimal */}
              <div className="pt-6 border-t border-[var(--hair)]">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-orange-500 font-bold mb-4">
                  ※ Bagikan
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Bagikan ke X"
                    className="w-10 h-10 rounded-full border border-[var(--hair-strong)] flex items-center justify-center text-[var(--mute)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
                  >
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Bagikan ke LinkedIn"
                    className="w-10 h-10 rounded-full border border-[var(--hair-strong)] flex items-center justify-center text-[var(--mute)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    aria-label="Salin tautan"
                    className="w-10 h-10 rounded-full border border-[var(--hair-strong)] flex items-center justify-center text-[var(--mute)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile back button */}
        <div className="mt-12 pt-8 border-t border-[var(--hair)] flex items-center justify-between lg:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-[var(--ink)] uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Arsip
          </Link>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 text-xs font-bold text-[var(--ink)] uppercase tracking-wider"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Tersalin" : "Salin"}
          </button>
        </div>
      </div>

      {/* ───────── Related posts — editorial grid ───────── */}
      {relatedPosts.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-12 border-t border-[var(--hair)]">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-orange-500 font-bold mb-3">
                ※ Bacaan lanjutan
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-[var(--ink)] font-display tracking-[-0.025em]">
                Teruskan membaca
              </h3>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--ink)] hover:text-orange-500 uppercase tracking-wider transition-colors"
            >
              <span>Semua arsip</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
            {relatedPosts.map((p, idx) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
                {/* Number marker */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-orange-500 font-bold">
                    №{String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 h-px bg-[var(--hair)]" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--mute)]">
                    {p.category}
                  </span>
                </div>

                <div className="aspect-[4/3] overflow-hidden bg-[var(--bone)] mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <h4 className="text-lg font-bold text-[var(--ink)] group-hover:text-orange-500 transition-colors leading-snug tracking-tight font-display line-clamp-3 mb-3">
                  {p.title}
                </h4>

                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--mute)] uppercase tracking-wider">
                  <span>oleh {p.author.split(" ")[0]}</span>
                  <span>
                    {new Date(p.publishedAt).toLocaleDateString("id-ID", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
