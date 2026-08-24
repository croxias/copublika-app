# Redesain Halaman Blog & Pembuatan Halaman Detail Blog CoPublika Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menyatukan data blog, meningkatkan kualitas animasi & motion halaman blog utama menggunakan Framer Motion, serta membuat halaman detail blog yang estetis, responsif, dan kaya fitur kenyamanan membaca dengan font Plus Jakarta Sans.

**Architecture:** 
1. Mengintegrasikan konten penuh ke dalam catalog data statis `src/lib/data/blog-articles.ts` dan memperbarui `src/lib/data/blog.ts` agar halaman detail dapat memanggil data dari sana secara instan.
2. Memanfaatkan `framer-motion` di komponen `BlogHero`, `BlogFeaturedPost`, dan `BlogExplorer` untuk menambahkan animasi transisi tab, staggered grid entry, masked text reveal, dan float orbs background.
3. Membangun halaman detail blog (`src/app/blog/[slug]/page.tsx`) premium yang dilengkapi *parallax image layout*, *reading progress bar*, *floating share actions*, tipografi membaca optimal, serta section artikel rekomendasi di bagian bawah.

**Tech Stack:** Next.js (App Router), React 19, Framer Motion, Tailwind CSS v4, Lucide Icons, Plus Jakarta Sans.

---

## Rencana File

### Baru:
- `docs/superpowers/plans/2026-05-25-blog-redesign-plan.md` (Rencana ini)

### Dimodifikasi:
- `apps/frontend/src/lib/data/blog-articles.ts` (Menambahkan konten detail untuk 17 artikel)
- `apps/frontend/src/lib/data/blog.ts` (Menghubungkan pencarian slug ke `BLOG_ARTICLES`)
- `apps/frontend/src/components/blog/BlogHero.tsx` (Animasi reveal & floating orbs)
- `apps/frontend/src/components/blog/BlogFeaturedPost.tsx` (Animasi hover & transition)
- `apps/frontend/src/components/blog/BlogExplorer.tsx` (Animasi filter tab layoutId & staggered grid cards)
- `apps/frontend/src/app/blog/[slug]/page.tsx` (Halaman detail baru terstruktur premium)
- `apps/frontend/src/app/globals.css` (Style artikel detail, blockquote, progress bar, & layout pendukung)

---

### Task 1: Integrasi Konten Artikel & Unifikasi Data

**Files:**
- Modify: `apps/frontend/src/lib/data/blog-articles.ts`
- Modify: `apps/frontend/src/lib/data/blog.ts`

- [ ] **Step 1: Tambahkan field `content` ke tipe `BlogArticle` di `blog-articles.ts` dan tulis konten detail yang kaya untuk ke-17 artikel.**
Setiap artikel harus dilengkapi teks Markdown lengkap yang relevan dengan judulnya.
Contoh penulisan data:
```typescript
export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  categoryLabel: string;
  cover: string;
  author: string;
  authorInitials: string;
  readTime: string;
  date: string;
  featured?: boolean;
  content: string; // Tambahkan ini
};
```
Isi teks detail harus memuat heading (`##`), paragraf panjang, poin-poin terurut (`-`), dan blockquote (`>`) bernada akademis berkualitas tinggi.

- [ ] **Step 2: Modifikasi `getBlogPostBySlug` di `apps/frontend/src/lib/data/blog.ts` agar membaca dari `BLOG_ARTICLES` jika ada.**
Jika slug ditemukan di `BLOG_ARTICLES`, ubah datanya ke bentuk tipe `BlogPost` agar kompatibel dengan detail page.
Kode implementasi:
```typescript
import { BLOG_ARTICLES } from "./blog-articles";

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  if (article) {
    return {
      id: article.slug,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content || "Konten belum didefinisikan.",
      coverImage: article.cover,
      category: article.categoryLabel,
      author: article.author,
      publishedAt: article.date + "-01T00:00:00.000Z",
      isPublished: true,
    };
  }
  // Fallback ke Supabase / fallbackBlogs lama
  ...
}
```

---

### Task 2: Animasi Motion pada Halaman Blog Utama

**Files:**
- Modify: `apps/frontend/src/components/blog/BlogHero.tsx`
- Modify: `apps/frontend/src/components/blog/BlogFeaturedPost.tsx`
- Modify: `apps/frontend/src/components/blog/BlogExplorer.tsx`

- [ ] **Step 1: Tambahkan animasi pada `BlogHero.tsx`.**
Gunakan `motion` dari `framer-motion` untuk menganimasi kemunculan teks dan orbs background.
*   Orbs background berputar/bergerak pelan dengan `animate={{ x: [0, 15, -15, 0], y: [0, -10, 10, 0] }}` dan `transition={{ duration: 10, repeat: Infinity }}`.
*   Teks judul masuk dengan `initial={{ y: 20, opacity: 0 }}` dan `animate={{ y: 0, opacity: 1 }}`.

- [ ] **Step 2: Tambahkan animasi pada `BlogFeaturedPost.tsx`.**
*   Bungkus tautan artikel utama dengan `motion.div` yang memiliki efek reveal.
*   Hover efek pada kartu: bayangan menebal, scale gambar sampul membesar `scale: 1.03` dengan transisi transparan ke berwarna penuh.
*   Transisi panah tautan baca: translate x dan y saat dihover.

- [ ] **Step 3: Tambahkan animasi transisi tab kategori & staggered grid kartu pada `BlogExplorer.tsx`.**
*   Gunakan `<motion.span layoutId="activeCategoryBg" ... />` pada tombol kategori terpilih sehingga latar belakang aktif bergeser secara halus dari satu kategori ke kategori lainnya.
*   Bungkus daftar grid kartu dengan Framer Motion Container `variants={{ show: { transition: { staggerChildren: 0.06 } } }}` dan animasikan tiap kartu saat muncul dengan efek slide up.
*   Hover pada `ArticleCard` memicu scale gambar dan elevasi kartu.

---

### Task 3: Pembuatan Halaman Detail Blog Premium & Responsif

**Files:**
- Modify: `apps/frontend/src/app/blog/[slug]/page.tsx`
- Modify: `apps/frontend/src/app/globals.css`

- [ ] **Step 1: Buat layout halaman detail premium di `apps/frontend/src/app/blog/[slug]/page.tsx`.**
Halaman ini harus memuat:
1.  **Reading Progress Bar** menggunakan `motion.div` dengan style `scaleX: scrollYProgress` di bagian paling atas fixed layout.
2.  **Breadcrumbs & Kategori Badge** di atas judul.
3.  **Hero Area**: Judul besar, metadata author dengan avatar inisial, tanggal publikasi, dan total waktu baca.
4.  **Parallax Cover Image**: Gambar sampul lebar dengan efek scaling saat user men-scroll ke bawah.
5.  **Sticky Reading Tools Panel**: Tombol kembali ke blog, tombol Salin Link dengan feedback toast "Link disalin!", dan tombol share ke media sosial.
6.  **Artikel Konten**: Pembungkus dengan class `.prose-academic` yang menampung paragraf naskah yang diformat estetik.
7.  **Related Posts**: Rekomendasi 3 artikel lain yang relevan di bagian bawah, lengkap dengan card hover.

- [ ] **Step 2: Tambahkan CSS formatting naskah akademis di `apps/frontend/src/app/globals.css`.**
Buat class `.prose-academic` untuk merapikan tag HTML/Markdown:
*   Paragraf: font-size responsif, line-height 1.8, spasi bawah renggang (`margin-bottom: 1.5rem`).
*   Sub-heading (`h2`, `h3`): Font tebal, aksen garis bawah tipis, warna hitam tegas, margin atas yang jelas.
*   Blockquote: Latar belakang abu-abu sangat muda (atau bone), border kiri tebal 4px berwarna oranye Scopus (`#E9711C`), gaya tulisan miring (*italic*).
*   Lists (`ul`, `ol`): Indentasi yang pas dengan custom list bullet berwarna Scopus.
*   Efek Parallax & Progress Bar styling.

---

### Task 4: Verifikasi & Uji Coba Aplikasi

- [ ] **Step 1: Jalankan typecheck dan proses build lokal.**
Jalankan command `pnpm typecheck` dan `pnpm build` di direktori frontend untuk memastikan tidak ada error TypeScript maupun Next.js compile errors.
- [ ] **Step 2: Jalankan dev server.**
Jalankan dev server dengan command `pnpm dev` dan periksa di browser:
*   Akses halaman utama `/blog` dan uji filter tab (lihat transisi pill background-nya).
*   Uji transisi hover kartu artikel.
*   Klik salah satu artikel dan pastikan halaman detail terbuka dengan benar (tidak ada error 404).
*   Uji fungsionalitas tombol "Salin Link", scroll progress bar, dan responsivitas layout mobile.
