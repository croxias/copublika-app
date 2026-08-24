"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getFeaturedArticle } from "@/lib/data/blog-articles";
import { ArrowUpRight, BookOpen, Star } from "lucide-react";

const MONTH_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
function formatDate(iso: string) {
  const [y, m] = iso.split("-");
  return `${MONTH_ID[Math.max(0, Math.min(11, parseInt(m, 10) - 1))]} ${y}`;
}

export function BlogFeaturedPost() {
  const article = getFeaturedArticle();

  return (
    <section className="cp-blog-section relative py-20 bg-[var(--paper)]">
      <div className="cp-blog-section__wrap">
        {/* Section Heading with decorative elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex items-end justify-between flex-wrap gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--scopus)] uppercase tracking-widest font-bold mb-3">
              <Star className="w-3.5 h-3.5" />
              <span>Editor&rsquo;s Choice</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--ink)] font-display tracking-tight">
              Artikel Pilihan Editor
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--mute)] font-mono">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{article.readTime} read</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="group"
        >
          <Link href={`/blog/${article.slug}`} className="block">
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-0 border border-[var(--hair)] rounded-[28px] overflow-hidden bg-white shadow-lg hover:shadow-2xl hover:border-[var(--ink)] transition-all duration-500">
              {/* Cover image (Lg: 7 cols) */}
              <div className="lg:col-span-7 h-[280px] md:h-[420px] lg:h-full relative overflow-hidden bg-[var(--bone)]">
                <span className="absolute top-5 left-5 z-10 inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--scopus)] text-white text-[10px] font-bold font-mono uppercase tracking-wider rounded-full shadow-lg">
                  <Star className="w-3 h-3" />
                  Sorotan
                </span>
                <Image
                  src={article.cover}
                  alt={article.title}
                  fill
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Body content card (Lg: 5 cols) */}
              <div className="lg:col-span-5 p-8 md:p-10 lg:p-12 flex flex-col justify-between bg-gradient-to-br from-white to-[var(--paper)] relative z-20 border-t lg:border-t-0 lg:border-l border-[var(--hair)]">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-orange-50 text-[var(--scopus)] text-[10px] font-mono font-bold uppercase rounded-full border border-orange-100">
                      {article.categoryLabel}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[var(--hair-strong)]" />
                    <span className="text-[10px] text-[var(--mute)] font-mono uppercase tracking-wider">{article.readTime} read</span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--ink)] group-hover:text-[var(--scopus)] transition-colors duration-300 leading-tight font-display tracking-tight">
                    {article.title}
                  </h2>

                  <p className="text-sm text-[var(--mute)] leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--hair)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--scopus)] to-orange-700 text-white flex items-center justify-center font-bold text-[10px] uppercase shadow-md">
                      {article.authorInitials}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-[var(--ink)]">{article.author}</div>
                      <div className="text-[10px] text-[var(--mute)] font-mono">{formatDate(article.date)}</div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--scopus)] group-hover:gap-2.5 transition-all duration-300">
                    <span>Baca Selengkapnya</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
