"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Calendar, Check, Clock, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { CopublikaMark, MARK_DOT, MARK_RING_PATH, MARK_VIEWBOX } from "@/components/brand/CopublikaMark";
import { PEOPLE } from "@/lib/cms/seed/people";
import { BLOG_COPY } from "@/lib/content/blog";
import { initials, personPhoto } from "@/lib/content/research";
import { BLOG_ARTICLES } from "@/lib/data/blog-articles";
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
  const currentUrl = `/blog/${post.slug}`;
  const encodedTitle = encodeURIComponent(post.title);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });


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
    const parts = text.split(/(\[[^\]]+\]\([^)\s]+\)|\*\*.*?\*\*|\*.*?\*|`.*?`)/);
    return parts.map((part, i) => {
      const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (link) {
        const external = /^https?:/.test(link[2]);
        return (
          <a key={i} href={link[2]} className="cp-bd-link" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {parseInlineStyle(link[1])}
          </a>
        );
      }
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

      // Image on its own line: ![caption](src "title"), as the admin editor writes it.
      const img = line.match(/^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)$/);
      if (img) {
        flushList(i);
        const caption = img[3] || img[1];
        elements.push(
          <figure key={i} className="cp-bd-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img[2]} alt={img[1]} loading="lazy" />
            {caption && <figcaption>{caption}</figcaption>}
          </figure>
        );
        continue;
      }
      if (/^(-{3,}|\*{3,})$/.test(line)) {
        flushList(i);
        elements.push(<hr key={i} className="cp-bd-hr" />);
        continue;
      }

      if (line.startsWith("## ")) {
        const text = line.replace("## ", "");
        const id = slugify(text);
        elements.push(
          <div key={i} className="mt-16 mb-8 first:mt-4">
            <span className="cp-bd-h2-rule" aria-hidden="true" />
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

  const article = BLOG_ARTICLES.find((a) => a.slug === post.slug);
  const words = post.content ? post.content.split(/\s+/).length : 0;
  const minutes = article ? parseInt(article.readTime, 10) || 1 : Math.max(1, Math.round(words / 200));
  const photo = personPhoto(post.author);
  const person = PEOPLE.find((p) => p.name === post.author);
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("id-ID", { year: "numeric", month: "long" });

  const ordered = [...BLOG_ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
  const at = ordered.findIndex((a) => a.slug === post.slug);
  const newer = at > 0 ? ordered[at - 1] : null;
  const older = at >= 0 && at < ordered.length - 1 ? ordered[at + 1] : null;

  return (
    <div ref={containerRef} className="cp-bd">
      <motion.div className="cp-bd__progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />

      {/* Hero: one column, title uses the full width, byline right under it. */}
      <header className="cp-bd-hero">
        <div className="cp-bd-hero__bg" aria-hidden="true">
          <motion.img src={post.coverImage} alt="" className="cp-bd-hero__photo" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }} />
          <span className="cp-bd-hero__tint" />
          <span className="cp-bd-hero__shade" />
          <svg className="cp-bd-hero__ring" viewBox={MARK_VIEWBOX}><path d={MARK_RING_PATH} /><circle cx={MARK_DOT.x} cy={MARK_DOT.y} r={MARK_DOT.r} /></svg>
          <span className="cp-sts-hero__grain" />
        </div>
        <div className="cp-ab-wrap">
          <div className="cp-bd-hero__bar">
            <Link href="/blog" className="cp-back">
              <span className="cp-back__icon" aria-hidden="true"><ArrowLeft size={16} /></span>
              Kembali ke blog
            </Link>
            <nav className="cp-bd-crumb" aria-label="Lokasi">
              <Link href="/blog">Blog</Link>
              <span aria-hidden="true">/</span>
              <span>{post.category}</span>
            </nav>
          </div>

          <motion.div className="cp-bd-hero__head" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <span className="cp-bd-pill">{post.category}</span>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
          </motion.div>

          <motion.div className="cp-bd-byline" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
            <span className="cp-bd-avatar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {photo ? <img src={photo} alt="" /> : initials(post.author) || "CP"}
            </span>
            <span className="cp-bd-byline__who">
              <small>Ditulis oleh</small>
              <strong>{post.author}</strong>
            </span>
            <span className="cp-bd-byline__meta">
              {person?.affiliation && <span>{person.affiliation}</span>}
              <span><Calendar size={14} aria-hidden="true" /> {formattedDate}</span>
              <span><Clock size={14} aria-hidden="true" /> {minutes} menit baca</span>
            </span>
            <span className="cp-bd-byline__share" aria-label="Bagikan">
              <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" aria-label="Bagikan ke X"><TwitterIcon width={15} height={15} /></a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Bagikan ke LinkedIn"><LinkedinIcon width={15} height={15} /></a>
              <button type="button" onClick={handleCopyLink} aria-label="Salin tautan">{copied ? <Check size={15} /> : <Copy size={15} />}</button>
            </span>
          </motion.div>
        </div>
      </header>


      {/* Body: a single reading column. */}
      <article className="cp-bd-article">
        {renderContent(post.content)}

        <div className="cp-bd-end">
          <span className="cp-bd-end__mark" aria-hidden="true">■</span>
          <Helpful />
        </div>

        <section className="cp-bd-author" aria-label="Tentang penulis">
          <div className="cp-bd-author__main">
            <span className="cp-bd-avatar cp-bd-avatar--lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {photo ? <img src={photo} alt="" /> : initials(post.author) || "CP"}
            </span>
            <div>
              <small>Tentang penulis</small>
              <strong>{post.author}</strong>
              {person?.affiliation && <span className="cp-bd-author__aff">{person.role} · {person.affiliation}</span>}
              <p>{person?.bio ?? "Bagian dari komunitas mentor dan alumni CoPublika yang membimbing penulisan dan publikasi akademik."}</p>
              {person?.topics && <ul>{person.topics.slice(0, 3).map((t) => <li key={t}>{t}</li>)}</ul>}
            </div>
          </div>
          <div className="cp-bd-author__cta">
            <span className="cp-bd-author__mark" aria-hidden="true"><CopublikaMark /></span>
            <div>
              <strong>{BLOG_COPY.detail.ctaTitle.replace("{penulis}", post.author.split(",")[0])}</strong>
              <span>{BLOG_COPY.detail.ctaText}</span>
            </div>
            <Link href="/siap-tembus-scopus">{BLOG_COPY.detail.ctaButton} <ArrowUpRight size={15} aria-hidden="true" /></Link>
          </div>
        </section>

      </article>

      {/* Continue reading: heading, previous / next cards, then a dated list that reveals each cover on hover. */}
      <section className="cp-bd-more" aria-labelledby="cp-bd-more-title">
        <div className="cp-bd-wrap">
          <div className="cp-bd-list__head">
            <span className="cp-bd-list__k">{BLOG_COPY.detail.moreTag}</span>
            <h2 id="cp-bd-more-title">{BLOG_COPY.detail.moreTitle} <span>{BLOG_COPY.detail.moreAccent}</span></h2>
            <Link href="/blog#semua" className="cp-bd-list__all">Semua tulisan <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>

          <nav className="cp-bd-pn" aria-label="Artikel sebelumnya dan berikutnya">
            <PnCard post={older} dir="prev" />
            <PnCard post={newer} dir="next" />
          </nav>

          {relatedPosts.length > 0 && (
            <ol className="cp-bd-list__rows">
              {relatedPosts.slice(0, 4).map((r, i) => {
                const d = new Date(r.publishedAt);
                return (
                  <motion.li key={r.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5, delay: i * 0.06 }}>
                    <Link href={`/blog/${r.slug}`} className="cp-bd-row">
                      <time className="cp-bd-row__date" dateTime={r.publishedAt}>
                        <b>{d.toLocaleDateString("id-ID", { month: "short" }).replace(".", "")}</b>
                        <span>{d.getFullYear()}</span>
                      </time>
                      <span className="cp-bd-row__main">
                        <span className="cp-bd-row__cat">{r.category}</span>
                        <strong>{r.title}</strong>
                        <span className="cp-bd-row__meta">{r.author} · {BLOG_ARTICLES.find((a) => a.slug === r.slug)?.readTime ?? "5 min"} baca</span>
                      </span>
                      <span className="cp-bd-row__thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={r.coverImage} alt="" loading="lazy" />
                      </span>
                      <span className="cp-bd-row__go" aria-hidden="true"><ArrowUpRight size={20} /></span>
                    </Link>
                  </motion.li>
                );
              })}
            </ol>
          )}
        </div>
      </section>
    </div>
  );
}

/** Quick reader feedback (kept in this browser until the backend stores it). */
function Helpful() {
  const [vote, setVote] = useState<"yes" | "no" | null>(null);
  return (
    <div className="cp-bd-helpful" aria-live="polite">
      {vote ? (
        <p>{vote === "yes" ? "Terima kasih! Senang artikel ini membantu." : "Terima kasih atas masukannya, kami akan memperbaikinya."}</p>
      ) : (
        <>
          <p>Apakah artikel ini membantu?</p>
          <div>
            <button type="button" onClick={() => setVote("yes")}><ThumbsUp size={15} aria-hidden="true" /> Membantu</button>
            <button type="button" onClick={() => setVote("no")}><ThumbsDown size={15} aria-hidden="true" /> Kurang</button>
          </div>
        </>
      )}
    </div>
  );
}

type PnPost = { slug: string; title: string; cover: string; author: string; readTime: string };

/** Previous / next card. With no neighbour it becomes a black card carrying the white CoPublika mark. */
function PnCard({ post, dir }: { post: PnPost | null; dir: "prev" | "next" }) {
  const label = dir === "prev" ? "Sebelumnya" : "Berikutnya";
  const Arrow = dir === "prev" ? ArrowLeft : ArrowRight;
  if (!post) {
    return (
      <div className={`cp-bd-pn__item is-empty is-${dir}`}>
        <CopublikaMark className="cp-bd-pn__logo" />
        <span className="cp-bd-pn__body">
          <small>{label}</small>
          <strong>{dir === "next" ? BLOG_COPY.detail.newestTitle : BLOG_COPY.detail.oldestTitle}</strong>
          <em>{BLOG_COPY.detail.edgeText}</em>
          <Link href="/blog#semua" className="cp-bd-pn__all">Lihat semua tulisan <ArrowRight size={14} aria-hidden="true" /></Link>
        </span>
      </div>
    );
  }
  return (
    <Link href={`/blog/${post.slug}`} className={`cp-bd-pn__item is-${dir}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={post.cover} alt="" loading="lazy" />
      <svg className="cp-bd-pn__ring" viewBox={MARK_VIEWBOX} aria-hidden="true"><path d={MARK_RING_PATH} /></svg>
      <span className="cp-bd-pn__top">
        <small>{label}</small>
        <span className="cp-bd-pn__go" aria-hidden="true"><Arrow size={18} /></span>
      </span>
      <span className="cp-bd-pn__body">
        <strong>{post.title}</strong>
        <em>{post.author} · {post.readTime} baca</em>
      </span>
    </Link>
  );
}
