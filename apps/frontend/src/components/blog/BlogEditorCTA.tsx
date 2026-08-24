"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Send, FileText, Users, ArrowRight } from "lucide-react";

export function BlogEditorCTA() {
  return (
    <section className="cp-blog-cta">
      <div className="cp-blog-cta__bg" aria-hidden="true" />
      <div className="cp-blog-cta__inner">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="cp-blog-cta__eyebrow">
            <span className="cp-blog-cta__dot" />
            Open for submissions
          </div>
        </motion.div>

        <motion.h2
          className="cp-blog-cta__title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Mau <em>menulis</em> di blog kami?
        </motion.h2>

        <motion.p
          className="cp-blog-cta__lead"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Kami terbuka untuk tulisan tamu dari peneliti, editor, dan akademisi. Kirim outline
          anda — tim editor kami akan membaca dan memberi catatan dalam 7 hari kerja.
        </motion.p>

        <motion.div
          className="cp-blog-cta__group"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/contact" className="cp-blog-cta__btn cp-blog-cta__btn--solid">
            <Send className="w-4 h-4" />
            Hubungi Editor
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link href="/about" className="cp-blog-cta__btn cp-blog-cta__btn--ghost">
            <FileText className="w-4 h-4" />
            Pedoman penulis
          </Link>
        </motion.div>

        <motion.div
          className="cp-blog-cta__stats"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="cp-blog-cta__stat">
            <span className="cp-blog-cta__stat-v flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--scopus)]" />
              18+
            </span>
            <span className="cp-blog-cta__stat-l">Tulisan</span>
          </div>
          <span className="cp-blog-cta__div" aria-hidden="true" />
          <div className="cp-blog-cta__stat">
            <span className="cp-blog-cta__stat-v">7 hari</span>
            <span className="cp-blog-cta__stat-l">Respons editor</span>
          </div>
          <span className="cp-blog-cta__div" aria-hidden="true" />
          <div className="cp-blog-cta__stat">
            <span className="cp-blog-cta__stat-v flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--scopus)]" />
              12+
            </span>
            <span className="cp-blog-cta__stat-l">Penulis tamu</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
