"use client";

import { useEffect, useRef } from "react";
import { MARK_DOT, MARK_PATH } from "@/components/brand/CopublikaMark";

// Living backdrop for the confirmation: a dot grid that ripples outward from the card, like a
// signal leaving it, with a few CoPublika marks drifting slowly upward. Canvas keeps it cheap;
// it pauses when the tab is hidden and stays still for reduced motion.

const GAP = 26;
const ORANGE = [233, 113, 28] as const;
const WAVE_EVERY = 2600; // ms between ripples
const WAVE_SPEED = 0.32; // px per ms
const WAVE_WIDTH = 120;

type Mark = { x: number; y: number; size: number; speed: number; spin: number; angle: number; alpha: number };

export function DoneBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mark = new Path2D(MARK_PATH);
    const dot = new Path2D();
    dot.arc(MARK_DOT.x, MARK_DOT.y, MARK_DOT.r, 0, Math.PI * 2);

    let w = 0;
    let h = 0;
    let marks: Mark[] = [];
    let raf = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(5, Math.round(w / 220));
      marks = Array.from({ length: n }, (_, i) => ({
        x: ((i + 0.5) / n) * w + (Math.sin(i * 7.1) * w) / (n * 3),
        y: ((i * 0.37) % 1) * h,
        size: 44 + ((i * 13) % 5) * 14,
        speed: 0.018 + ((i * 5) % 4) * 0.007,
        spin: (i % 2 ? 1 : -1) * (0.00004 + ((i * 3) % 4) * 0.00002),
        angle: i * 0.9,
        alpha: 0.09 + ((i * 11) % 4) * 0.03,
      }));
    };

    const draw = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, w, h);
      // Ripples start behind the card (upper middle of the section).
      const cx = w / 2;
      const cy = Math.min(h * 0.42, 420);
      const fronts: number[] = [];
      for (let k = 0; k < 4; k++) {
        const age = (t - k * WAVE_EVERY) % (WAVE_EVERY * 4);
        if (age > 0) fronts.push(age * WAVE_SPEED);
      }
      const maxR = Math.hypot(w, h);

      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          const d = Math.hypot(x - cx, y - cy);
          let glow = 0;
          for (const r of fronts) {
            const off = Math.abs(d - r);
            if (off < WAVE_WIDTH) glow = Math.max(glow, (1 - off / WAVE_WIDTH) * (1 - r / maxR));
          }
          const fade = Math.max(0, 1 - d / (maxR * 0.75));
          if (glow > 0.02) {
            ctx.fillStyle = `rgba(${ORANGE[0]},${ORANGE[1]},${ORANGE[2]},${(0.25 + glow * 0.75) * fade})`;
            ctx.beginPath();
            ctx.arc(x, y, 1.2 + glow * 1.6, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = `rgba(255,255,255,${0.1 * fade + 0.03})`;
            ctx.fillRect(x - 0.6, y - 0.6, 1.2, 1.2);
          }
        }
      }

      for (const m of marks) {
        if (!reduce) {
          m.y -= m.speed * 16;
          m.angle += m.spin * 16;
          if (m.y < -m.size * 2) m.y = h + m.size;
        }
        const s = m.size / 640;
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.angle);
        ctx.scale(s, s);
        ctx.translate(-280, -320);
        ctx.strokeStyle = `rgba(255,255,255,${m.alpha * 2.2})`;
        ctx.lineWidth = 1.2 / s;
        ctx.stroke(mark);
        ctx.fillStyle = `rgba(${ORANGE[0]},${ORANGE[1]},${ORANGE[2]},${m.alpha * 4})`;
        ctx.fill(dot);
        ctx.restore();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(performance.now());
    });
    ro.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="cp-done__canvas" aria-hidden="true" />;
}
