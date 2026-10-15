"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { BLOG_ARTICLES, BLOG_CATEGORIES } from "@/lib/data/blog-articles";
import { BlogBook } from "./BlogBook";

const EASE = [0.22, 1, 0.36, 1] as const;
const line = { hidden: { opacity: 0, y: "100%" }, show: { opacity: 1, y: "0%", transition: { duration: 0.9, ease: EASE } } };
const fade = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };

/** Topics readers search for most; each one fills the search box. */
const TOPICS = ["Memilih jurnal", "Abstract", "Cover letter", "Revisi", "Reviewer"];

export function BlogHero({ onSearch }: { onSearch: (q: string) => void }) {
  const reduce = useReducedMotion();
  const [q, setQ] = useState("");
  const authors = useMemo(() => new Set(BLOG_ARTICLES.map((a) => a.author)).size, []);
  const stats = [
    { value: BLOG_ARTICLES.length, label: "tulisan" },
    { value: BLOG_CATEGORIES.length - 1, label: "kategori" },
    { value: authors, label: "penulis" },
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(q.trim());
  };

  return (
    <section className="cp-sts-hero cp-bl-hero" aria-labelledby="cp-bl-title">
      <div className="cp-sts-hero__bg" aria-hidden="true">
        <span className="cp-sts-hero__cols"><i /><i /><i /><i /><i /></span>
        <span className="cp-bl-hero__quote">“</span>
        <span className="cp-sts-hero__grain" />
      </div>

      <div className="cp-sts-hero__wrap">
        <motion.div className="cp-sts-hero__copy" initial={reduce ? false : "hidden"} animate="show" variants={{ show: { transition: { staggerChildren: 0.09 } } }}>
          <motion.span className="cp-sts-pill" variants={fade}>
            <i aria-hidden="true" /> Jurnal CoPublika · ditulis mentor & alumni
          </motion.span>

          <h1 id="cp-bl-title" className="cp-sts-hero__title cp-bl-hero__title">
            <span className="cp-sts-mask"><motion.span variants={line}>Menembus jurnal,</motion.span></span>
            <span className="cp-sts-mask"><motion.span variants={line} className="is-accent">dari yang sudah sampai.</motion.span></span>
          </h1>

          <motion.p className="cp-sts-hero__lead" variants={fade}>
            Panduan praktis, wawancara reviewer, dan bedah naskah anggota, ditulis mentor dan alumni yang sudah melewati proses review jurnal Scopus. Gratis, tanpa basa-basi.
          </motion.p>

          <motion.form className="cp-bl-search" onSubmit={submit} variants={fade} role="search">
            <Search size={18} aria-hidden="true" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari topik: abstract, cover letter, revisi…" aria-label="Cari tulisan" />
            <button type="submit">Cari <ArrowRight size={15} aria-hidden="true" /></button>
          </motion.form>

          <motion.div className="cp-bl-topics" variants={fade}>
            <span>Populer:</span>
            {TOPICS.map((t) => (
              <button key={t} type="button" onClick={() => { setQ(t); onSearch(t); }}>{t}</button>
            ))}
          </motion.div>

          <motion.dl className="cp-bl-stats" variants={fade}>
            {stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          className="cp-sts-hero__visual"
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
        >
          <BlogBook />
        </motion.div>
      </div>
    </section>
  );
}
