"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

// Text that slides up word by word (or letter by letter) out of a clipped line.
// Adapted from danielpetho/vertical-cut-reveal; respects reduced motion.

type Props = {
  children: string;
  reverse?: boolean;
  transition?: Transition;
  splitBy?: "words" | "characters";
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | number;
  containerClassName?: string;
  wordLevelClassName?: string;
  elementLevelClassName?: string;
  onComplete?: () => void;
  autoStart?: boolean;
};

export type VerticalCutRevealRef = { startAnimation: () => void; reset: () => void };

const graphemes = (text: string) => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return Array.from(new Intl.Segmenter("id", { granularity: "grapheme" }).segment(text), (s) => s.segment);
  }
  return Array.from(text);
};

export const VerticalCutReveal = forwardRef<VerticalCutRevealRef, Props>(function VerticalCutReveal(
  {
    children,
    reverse = false,
    transition = { type: "spring", stiffness: 190, damping: 22 },
    splitBy = "words",
    staggerDuration = 0.2,
    staggerFrom = "first",
    containerClassName,
    wordLevelClassName,
    elementLevelClassName,
    onComplete,
    autoStart = true,
  },
  ref,
) {
  const reduce = useReducedMotion();
  const [animating, setAnimating] = useState(false);
  const words = useMemo(
    () => children.split(" ").map((w, i, all) => ({ chars: splitBy === "characters" ? graphemes(w) : [w], space: i < all.length - 1 })),
    [children, splitBy],
  );
  const total = words.reduce((n, w) => n + w.chars.length, 0);

  const delayOf = useCallback(
    (i: number) => {
      if (staggerFrom === "first") return i * staggerDuration;
      if (staggerFrom === "last") return (total - 1 - i) * staggerDuration;
      if (staggerFrom === "center") return Math.abs(Math.floor(total / 2) - i) * staggerDuration;
      return Math.abs(staggerFrom - i) * staggerDuration;
    },
    [staggerFrom, staggerDuration, total],
  );

  useImperativeHandle(ref, () => ({ startAnimation: () => setAnimating(true), reset: () => setAnimating(false) }));
  useEffect(() => {
    if (autoStart) setAnimating(true);
  }, [autoStart]);

  const baseDelay = typeof transition.delay === "number" ? transition.delay : 0;
  let index = 0;

  return (
    <span className={cn("flex flex-wrap whitespace-pre-wrap", containerClassName)}>
      <span className="sr-only">{children}</span>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden="true" className={cn("inline-flex overflow-hidden", wordLevelClassName)}>
          {w.chars.map((c, ci) => {
            const i = index++;
            const last = wi === words.length - 1 && ci === w.chars.length - 1;
            return (
              <span key={ci} className={cn("relative whitespace-pre-wrap", elementLevelClassName)}>
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: reverse ? "-100%" : "100%" }}
                  animate={animating || reduce ? { y: 0 } : { y: reverse ? "-100%" : "100%" }}
                  transition={{ ...transition, delay: baseDelay + delayOf(i) }}
                  onAnimationComplete={last ? onComplete : undefined}
                >
                  {c}
                </motion.span>
              </span>
            );
          })}
          {w.space && <span> </span>}
        </span>
      ))}
    </span>
  );
});
