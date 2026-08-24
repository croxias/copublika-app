import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fallbackBlogs } from "./fallbacks";
import { BLOG_ARTICLES } from "./blog-articles";
import type { BlogPost } from "@/types";

function mapBlogRow(row: Record<string, unknown>): BlogPost {
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    excerpt: String(row.excerpt ?? ""),
    content: String(row.content_md ?? row.content ?? ""),
    coverImage: String(row.cover_image ?? row.coverImage ?? ""),
    category: String(row.category ?? ""),
    author: String(row.author ?? "CoPublika Editorial"),
    publishedAt: String(row.publish_date ?? row.published_at ?? row.publishedAt ?? new Date().toISOString()),
    isPublished: Boolean(row.is_published ?? row.isPublished ?? true),
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createServerSupabaseClient();

  const localPosts: BlogPost[] = BLOG_ARTICLES.map((a) => ({
    id: a.slug,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    content: a.content,
    coverImage: a.cover,
    category: a.categoryLabel,
    author: a.author,
    publishedAt: a.date + "-01T00:00:00.000Z",
    isPublished: true,
  }));

  if (!supabase) {
    const combined = [...localPosts];
    fallbackBlogs.forEach((fb) => {
      if (!combined.some((cp) => cp.slug === fb.slug)) {
        combined.push(fb);
      }
    });
    return combined;
  }
  try {
    const { data, error } = await supabase
      .from("content_blogs")
      .select("*")
      .eq("is_published", true)
      .order("publish_date", { ascending: false });
    if (error || !data) return localPosts;
    const rows = (data ?? []) as Record<string, unknown>[];
    return rows.map(mapBlogRow);
  } catch {
    return localPosts;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  // Cek ke data statik local terlebih dahulu
  const staticArt = BLOG_ARTICLES.find((a) => a.slug === slug);
  if (staticArt) {
    return {
      id: staticArt.slug,
      slug: staticArt.slug,
      title: staticArt.title,
      excerpt: staticArt.excerpt,
      content: staticArt.content,
      coverImage: staticArt.cover,
      category: staticArt.categoryLabel,
      author: staticArt.author,
      publishedAt: staticArt.date + "-01T00:00:00.000Z",
      isPublished: true,
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackBlogs.find((b) => b.slug === slug) ?? null;
  try {
    const { data, error } = await supabase
      .from("content_blogs")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error || !data) {
      return fallbackBlogs.find((b) => b.slug === slug) ?? null;
    }
    return mapBlogRow(data as Record<string, unknown>);
  } catch {
    return fallbackBlogs.find((b) => b.slug === slug) ?? null;
  }
}

export async function getLatestBlogPosts(limit = 3): Promise<BlogPost[]> {
  const all = await getBlogPosts();
  return all.slice(0, limit);
}
