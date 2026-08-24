import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { BlogPost } from "@/types";

export function LatestBlog({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="py-20 bg-[var(--surface)]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Editorial"
            title="Latest thinking from the community."
            description="Publishing strategy, curation insight, and practical execution notes from active academic contributors."
          />
          <Link href="/blog" className="text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-ink)]">
            View all posts
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.slug} className="bg-[var(--background)]">
              <Badge tone="accent">{post.category}</Badge>
              <h3 className="mt-4 text-xl font-bold tracking-tight text-[var(--foreground)]">{post.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{post.excerpt}</p>
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{new Date(post.publishedAt).toLocaleDateString("id-ID")}</p>
              <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex text-sm font-semibold text-[var(--accent)]">
                Read article
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
