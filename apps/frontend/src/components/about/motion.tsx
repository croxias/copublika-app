"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform, type Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({ children, delay = 0, y = 28, className, as = "div" }: { children: React.ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "li" | "article" | "section" }) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

const group: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const item: Variants = { hidden: { opacity: 0, y: 26, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE } } };

/** Container whose <StaggerItem> children appear one after another. */
export function Stagger({ children, className, as = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "ol" | "ul" | "dl" }) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp className={className} variants={group} initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.15 }}>
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "li" | "article" }) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={item}>
      {children}
    </Comp>
  );
}

/** Counts up to `value` (e.g. "1.240", "318", "76") when it scrolls into view. */
export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const target = Number(value.replace(/\./g, "").replace(",", "."));
  const numeric = Number.isFinite(target) && /^[\d.,]+$/.test(value);
  const [shown, setShown] = useState(numeric && !reduce ? "0" : value);

  useEffect(() => {
    if (!inView || !numeric || reduce) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => setShown(Math.round(v).toLocaleString("id-ID")),
    });
    return () => controls.stop();
  }, [inView, numeric, reduce, target]);

  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  );
}

/** Card that tilts slightly toward the pointer, with a soft light following it. */
export function TiltCard({ children, className, max = 7 }: { children: React.ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 18 });
  const glowX = useTransform(px, (v) => `${v * 100}%`);
  const glowY = useTransform(py, (v) => `${v * 100}%`);
  return (
    <motion.div
      className={className}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900, ["--gx" as string]: glowX, ["--gy" as string]: glowY }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      {children}
    </motion.div>
  );
}

/** SVG path that draws itself when it scrolls into view (used by the journey infographic). */
export function DrawPath({ d, className, delay = 0 }: { d: string; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.path
      d={d}
      className={className}
      initial={reduce ? false : { pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 2.2, delay, ease: EASE }}
    />
  );
}
