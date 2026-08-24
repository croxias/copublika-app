"use client";

import { useState } from "react";
import { BlogHero } from "./BlogHero";
import { BlogFeaturedPost } from "./BlogFeaturedPost";
import { BlogExplorer } from "./BlogExplorer";
import { BlogEditorCTA } from "./BlogEditorCTA";
import type { BlogCategory } from "@/lib/data/blog-articles";

export function BlogPageClient() {
  const [category, setCategory] = useState<BlogCategory | "all">("all");
  const [query, setQuery] = useState("");

  function handleCategory(c: BlogCategory | "all") {
    setCategory(c);
    setQuery("");
  }

  function handleQuery(q: string) {
    setQuery(q);
    setCategory("all");
  }

  return (
    <>
      <BlogHero />
      <BlogFeaturedPost />
      <BlogExplorer
        key={`${category}-${query}`}
        category={category}
        setCategory={handleCategory}
        query={query}
        setQuery={handleQuery}
      />
      <BlogEditorCTA />
    </>
  );
}
