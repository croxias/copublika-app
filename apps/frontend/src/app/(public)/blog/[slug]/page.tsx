import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/data/blog";
import { BLOG_ARTICLES } from "@/lib/data/blog-articles";
import { fallbackBlogs } from "@/lib/data/fallbacks";
import { BlogDetailContent } from "@/components/blog/BlogDetailContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Artikel Tidak Ditemukan — CoPublika",
    };
  }

  return {
    title: `${post.title} — CoPublika Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.coverImage,
          alt: post.title,
        },
      ],
    },
  };
}

export function generateStaticParams() {
  const slugs = new Set([
    ...BLOG_ARTICLES.map((post) => post.slug),
    ...fallbackBlogs.map((post) => post.slug),
  ]);

  return Array.from(slugs, (slug) => ({ slug }));
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  // Ambil artikel terkait
  const allPosts = await getBlogPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  // Jika related posts kurang dari 3, ambil dari kategori lain sebagai pelengkap
  if (relatedPosts.length < 3) {
    const fillAmount = 3 - relatedPosts.length;
    const fallbackList = allPosts
      .filter((p) => p.slug !== slug && p.category !== post.category)
      .slice(0, fillAmount);
    relatedPosts.push(...fallbackList);
  }

  return <BlogDetailContent post={post} relatedPosts={relatedPosts} />;
}
