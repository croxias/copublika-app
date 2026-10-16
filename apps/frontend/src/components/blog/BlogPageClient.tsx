"use client";

import { useRef, useState } from "react";
import { SectionHead } from "@/components/program/shared";
import { MARK_DOT, MARK_RING_PATH, MARK_VIEWBOX } from "@/components/brand/CopublikaMark";
import { BLOG_COPY } from "@/lib/content/blog";
import type { BlogCategory } from "@/lib/data/blog-articles";
import { BlogEditorsPick } from "./BlogEditorsPick";
import { BlogGrid } from "./BlogGrid";
import { BlogHero } from "./BlogHero";
import { BlogWriteCTA } from "./BlogWriteCTA";

export function BlogPageClient() {
  const [category, setCategory] = useState<BlogCategory | "all">("all");
  const [query, setQuery] = useState("");
  const gridRef = useRef<HTMLElement>(null);

  /** Search from the hero: show matches across every category and jump to the list. */
  const search = (q: string) => {
    setCategory("all");
    setQuery(q);
    requestAnimationFrame(() => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <main className="cp-pg cp-sts cp-bl">
      <BlogHero onSearch={search} />

      <section className="cp-ab-sec cp-sts-sec cp-sts-sec--warm">
        <div className="cp-sts-sec__glow" aria-hidden="true" />
        <div className="cp-ab-wrap">
          <SectionHead {...BLOG_COPY.picks} />
          <BlogEditorsPick />
        </div>
      </section>

      <section ref={gridRef} className="cp-ab-sec cp-bl-all" id="semua">
        <div className="cp-bl-all__bg" aria-hidden="true">
          <span className="cp-sts-hero__cols"><i /><i /><i /><i /><i /></span>
          <svg className="cp-bl-all__ring" viewBox={MARK_VIEWBOX}><path d={MARK_RING_PATH} /><circle cx={MARK_DOT.x} cy={MARK_DOT.y} r={MARK_DOT.r} /></svg>
          <span className="cp-bl-all__word">ARSIP</span>
          <span className="cp-sts-hero__grain" />
        </div>
        <div className="cp-ab-wrap">
          <SectionHead ink {...BLOG_COPY.archive} />
          <BlogGrid category={category} setCategory={setCategory} query={query} setQuery={setQuery} />
        </div>
      </section>

      <BlogWriteCTA />
    </main>
  );
}
