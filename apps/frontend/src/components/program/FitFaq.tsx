"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { CopublikaMark } from "@/components/brand/CopublikaMark";
import { BTM_COPY, STS_COPY } from "@/lib/content/programs";

const EASE = [0.22, 1, 0.36, 1] as const;

type Check = { id: string; text: string };
type Variant = "sts" | "bootcamp";

/** Each program's self-check. The `pivot` item sends the visitor to the other program. */
const CHECKS: Record<Variant, { items: Check[]; pivot: string; pivotIsMatch: boolean }> = {
  // 1-on-1 fits when the visitor already has a draft.
  sts: {
    items: STS_COPY.checks,
    pivot: "draft",
    pivotIsMatch: true,
  },
  // The bootcamp fits unless the draft is already complete.
  bootcamp: {
    items: BTM_COPY.checks,
    pivot: "complete",
    pivotIsMatch: false,
  },
};

const RESULT = {
  sts: { match: { lead: "Siap Tembus Scopus 1-on-1 cocok untuk naskah Anda.", href: "#mentor", cta: "Pilih mentor" }, other: { lead: "Belum punya draf? Mulai dari Bootcamp 30 Hari Menulis, lalu lanjut ke 1-on-1.", href: "/bootcamp-menulis", cta: "Lihat bootcamp" } },
  bootcamp: { match: { lead: "Bootcamp 30 Hari Menulis cocok untuk Anda.", href: "#angkatan", cta: "Pilih angkatan" }, other: { lead: "Draf sudah lengkap? Siap Tembus Scopus 1-on-1 lebih tepat untuk review mendalam.", href: "/siap-tembus-scopus", cta: "Lihat 1-on-1" } },
};

type Faq = { q: string; a: string };

/** Self-check on the left, numbered FAQ on the right, on a two-tone black section. */
export function FitFaq({ faq, variant }: { faq: Faq[]; variant: Variant }) {
  const cfg = CHECKS[variant];
  const reduce = useReducedMotion();
  const [on, setOn] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<number | null>(0);

  const score = cfg.items.filter((c) => on[c.id]).length;
  const pivotOn = !!on[cfg.pivot];
  const result = score === 0 ? null : pivotOn === cfg.pivotIsMatch ? "match" : "other";
  const copy = result ? RESULT[variant][result] : null;

  return (
    <div className="cp-sts-ff">
      {/* Self-check */}
      <div className="cp-sts-check">
        <motion.span
          className="cp-sts-check__mark"
          aria-hidden="true"
          initial={reduce ? false : { opacity: 0, rotate: -20, x: -40 }}
          whileInView={{ opacity: 0.12, rotate: 0, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <CopublikaMark />
        </motion.span>
        <span className="cp-sts-ff__k">01 · Untuk siapa</span>
        <h2>Cek kecocokan dalam 10 detik.</h2>
        <p className="cp-sts-check__lead">Centang yang sesuai dengan kondisi Anda.</p>

        <ul className="cp-sts-check__list">
          {cfg.items.map((c) => (
            <li key={c.id}>
              <label className={on[c.id] ? "is-on" : ""}>
                <input type="checkbox" checked={!!on[c.id]} onChange={(e) => setOn((s) => ({ ...s, [c.id]: e.target.checked }))} />
                <span className="cp-sts-check__box" aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
                {c.text}
              </label>
            </li>
          ))}
        </ul>

        <div className="cp-sts-check__meter" aria-hidden="true">
          {cfg.items.map((c, i) => <i key={c.id} className={i < score ? "is-on" : ""} />)}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={result ?? "none"}
            className={`cp-sts-check__result ${result === "match" ? "is-sts" : result === "other" ? "is-bootcamp" : ""}`}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
            transition={{ duration: 0.3, ease: EASE }}
            aria-live="polite"
          >
            {result === null && <p>Hasilnya muncul di sini setelah Anda mencentang.</p>}
            {copy && (
              <>
                <p><strong>{score}/{cfg.items.length} sesuai.</strong> {copy.lead}</p>
                <Link href={copy.href}>{copy.cta} <ArrowRight size={15} aria-hidden="true" /></Link>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FAQ */}
      <div className="cp-sts-faq">
        <FaqArt reduce={!!reduce} />
        <span className="cp-sts-ff__k">02 · FAQ</span>
        <h2>Yang sering ditanyakan.</h2>
        <ol>
          {faq.map((f, i) => (
            <li key={f.q} className={open === i ? "is-open" : ""}>
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                <span className="cp-sts-faq__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="cp-sts-faq__q">{f.q}</span>
                <span className="cp-sts-faq__plus" aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    className="cp-sts-faq__a"
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** FAQ backdrop: the open "C" of the CoPublika mark repeated as fine orange rings, and a question mark. */
function FaqArt({ reduce }: { reduce: boolean }) {
  const arc = (r: number) => {
    const p = (deg: number) => {
      const a = (deg * Math.PI) / 180;
      return `${(300 + r * Math.cos(a)).toFixed(1)} ${(300 + r * Math.sin(a)).toFixed(1)}`;
    };
    // From the top round the left side to the bottom, leaving a gap where the mark has its dot.
    return `M${p(-90)} A${r} ${r} 0 0 0 ${p(-166)} M${p(166)} A${r} ${r} 0 0 0 ${p(90)}`;
  };
  return (
    <div className="cp-sts-faq__art" aria-hidden="true">
      <svg viewBox="0 0 600 600" className="cp-sts-faq__rings">
        {[90, 140, 190, 240, 290].map((r, i) => (
          <motion.path
            key={r}
            d={arc(r)}
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.4, delay: i * 0.12, ease: EASE }}
          />
        ))}
      </svg>
      <span className="cp-sts-faq__q-glyph">?</span>
    </div>
  );
}
