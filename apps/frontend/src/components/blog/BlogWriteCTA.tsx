"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, FileText, MessageSquareText, Send } from "lucide-react";
import { CopublikaMark } from "@/components/brand/CopublikaMark";

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  { Icon: FileText, title: "Kirim outline", text: "Judul, tiga poin utama, dan untuk siapa tulisan Anda." },
  { Icon: MessageSquareText, title: "Catatan editor", text: "Tim editor membaca dan memberi catatan dalam 7 hari kerja." },
  { Icon: Send, title: "Terbit di blog", text: "Tulisan tayang dengan nama dan profil Anda sebagai penulis." },
];

const WANTED = ["Pengalaman submit & revisi", "Kiat metodologi", "Wawancara editor/reviewer", "Esai kehidupan akademik"];

/** Guest-writer call: three steps from outline to published, on a black section with the brand mark. */
export function BlogWriteCTA() {
  const reduce = useReducedMotion();
  return (
    <section className="cp-bw" aria-labelledby="cp-bw-title">
      <motion.span
        className="cp-bw__mark"
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0, rotate: -20 }}
        whileInView={{ opacity: 0.07, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <CopublikaMark />
      </motion.span>
      <div className="cp-ab-wrap cp-bw__wrap">
        <motion.div className="cp-bw__copy" initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: EASE }}>
          <span className="cp-bw__k"><i aria-hidden="true" /> Terbuka untuk penulis tamu</span>
          <h2 id="cp-bw-title">Pengalaman Anda bisa jadi <span>peta bagi penulis lain.</span></h2>
          <p>Kami mencari tulisan dari peneliti, dosen, editor, dan reviewer. Tidak perlu naskah jadi, cukup outline.</p>
          <ul className="cp-bw__wanted" aria-label="Tulisan yang kami cari">
            {WANTED.map((w) => <li key={w}>{w}</li>)}
          </ul>
          <div className="cp-bw__ctas">
            <Link href="/contact" className="cp-ab-btn cp-ab-btn--primary">Kirim outline <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/contact" className="cp-ab-btn cp-ab-btn--line">Tanya tim editor</Link>
          </div>
        </motion.div>

        <ol className="cp-bw__steps">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.title}
              initial={reduce ? false : { opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
            >
              <span className="cp-bw__n">0{i + 1}</span>
              <span className="cp-bw__ico" aria-hidden="true"><s.Icon size={20} /></span>
              <span>
                <strong>{s.title}</strong>
                <small>{s.text}</small>
              </span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
