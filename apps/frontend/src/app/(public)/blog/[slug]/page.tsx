import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/data/blog";
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

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
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
