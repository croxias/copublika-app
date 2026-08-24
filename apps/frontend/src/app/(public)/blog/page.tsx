import { BlogPageClient } from "@/components/blog/BlogPageClient";

export const metadata = {
  title: "Blog — CoPublika",
  description:
    "Cerita, panduan, dan esai dari mentor, editor, dan alumni CoPublika tentang riset, publikasi, dan kehidupan akademik di Indonesia.",
};

export default function BlogPage() {
  return <BlogPageClient />;
}
