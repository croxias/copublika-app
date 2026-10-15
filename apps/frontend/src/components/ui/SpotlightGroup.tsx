"use client";

import type { PointerEvent, ReactNode } from "react";

/**
 * Tracks the pointer over a group of cards and writes its position into the
 * hovered card's `--mx` / `--my`, so CSS can paint a soft light that follows
 * the cursor. Cards opt in with `data-spot`. One listener for the whole group.
 */
export function SpotlightGroup({ className, children }: { className?: string; children: ReactNode }) {
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spot]");
    if (!card || !e.currentTarget.contains(card)) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div className={className} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}
