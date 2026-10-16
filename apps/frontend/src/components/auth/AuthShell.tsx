"use client";

import Link from "next/link";
import { GrainGradient } from "@paper-design/shaders-react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedMark, MARK_RING_VIEWBOX } from "@/components/brand/AnimatedMark";
import "@/components/program/program.css";
import "./auth.css";

// Two-panel shell for Log In, Lupa password and Atur ulang password: the form card on the left,
// a dark grain-gradient panel with the brand line on the right.

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  title: string;
  lead: React.ReactNode;
  children: React.ReactNode;
  /** Big line on the dark panel. */
  tagline?: React.ReactNode;
  /** Short line under the tagline. */
  sub?: React.ReactNode;
};

export function AuthShell({ title, lead, children, tagline, sub }: Props) {
  const reduce = useReducedMotion();
  return (
    <section className="cp-login">
      <div className="cp-login__grid">
        <motion.div className="cp-login__card" initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
          <div className="cp-login__inner">
            <Link href="/" className="cp-login__logo" aria-label="CoPublika, ke beranda">
              <AnimatedMark className="cp-login__mark" delay={0.2} />
              <span>CoPublika</span>
            </Link>
            <header className="cp-login__head">
              <h1>{title}</h1>
              <p>{lead}</p>
            </header>
            {children}
          </div>
        </motion.div>

        <div className="cp-login__art">
          <GrainGradient
            speed={reduce ? 0 : 1}
            scale={1}
            rotation={0}
            offsetX={0}
            offsetY={0}
            softness={0.5}
            intensity={0.5}
            noise={0.25}
            shape="corners"
            frame={2854.5}
            colors={["#FFFFFF", "#E9711C", "#E9711C", "#FFFFFF"]}
            colorBack="#00000000"
            className="cp-login__shader"
          />
          <div className="cp-login__art-top">
            <span className="cp-login__kicker">CoPublika · Digital Research Engine</span>
          </div>
          <div className="cp-login__emblem" aria-hidden="true">
            <span className="cp-login__orbit" />
            <span className="cp-login__halo" />
            <span className="cp-login__halo is-2" />
            <span className="cp-login__halo is-3" />
            <span className="cp-login__ring" />
            <AnimatedMark className="cp-login__emblem-mark" delay={0.5} viewBox={MARK_RING_VIEWBOX} />
          </div>
          <div className="cp-login__art-copy">
            <motion.h2 initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}>
              {tagline ?? (
                <>
                  Ekosistem kolaborasi untuk riset yang <em>berintegritas.</em>
                </>
              )}
            </motion.h2>
            <motion.p initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.75 }}>
              {sub ?? "Tempat peneliti, dosen, dan mahasiswa menulis, saling meninjau, dan menerbitkan karya bersama secara jujur dan terbuka."}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
  trailing?: React.ReactNode;
};

/** A field box with its label pinned inside on the right, like the concept, plus an error line. */
export function AuthField({ label, error, hint, children, trailing }: FieldProps) {
  return (
    <div className={`cp-login__field ${error ? "has-error" : ""}`}>
      <label className="cp-login__box">
        {children}
        <span className="cp-login__label">{label}</span>
        {trailing}
      </label>
      {error ? <span className="cp-login__err" role="alert">{error}</span> : hint ? <span className="cp-login__hint">{hint}</span> : null}
    </div>
  );
}
