"use client";

import { useEffect } from "react";

/**
 * Reveals every `[data-reveal]` element as it scrolls into view by setting
 * `data-revealed`; the motion itself lives in CSS. Mount once per page.
 *
 * Content is never hidden before this runs: the root only gets
 * `.cp-reveal-ready` after elements already on screen are marked revealed, so
 * no-JS visitors and the first paint both see everything.
 */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!els.length || typeof IntersectionObserver === "undefined") return;

    const vh = window.innerHeight;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.dataset.revealed = "true";
    }
    root.classList.add("cp-reveal-ready");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.revealed = "true";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    for (const el of els) if (!el.dataset.revealed) io.observe(el);

    return () => {
      io.disconnect();
      root.classList.remove("cp-reveal-ready");
    };
  }, []);

  return null;
}
