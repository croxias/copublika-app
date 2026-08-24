# Spesifikasi Desain: Redesain Halaman Blog & Halaman Detail Blog CoPublika

Dokumen ini mendokumentasikan spesifikasi desain frontend untuk meningkatkan UI/UX, visualisasi gambar, animasi, dan motion pada halaman blog utama serta pembuatan halaman detail blog yang interaktif dan premium.

## 1. Tujuan & Sasaran
* **Visual Premium**: Mengubah tampilan blog standar menjadi pengalaman membaca kelas atas yang dinamis dengan visualisasi gambar representatif dari Unsplash.
* **Animasi Mengalir (Fluid Motion)**: Memanfaatkan `framer-motion` untuk menghidupkan interaksi perpindahan kategori, pemuatan kartu, hover, dan transisi halaman.
* **Pengalaman Membaca Optimal (Reading Experience)**: Menyediakan halaman detail blog yang bersih, responsif, menggunakan tipografi *Plus Jakarta Sans*, serta dilengkapi fitur kenyamanan membaca seperti *reading progress bar*, *sharing menu*, dan rekomendasi artikel terkait.
* **Unifikasi Data**: Menggabungkan data artikel listing (`blog-articles.ts`) dengan mekanisme data detail agar tidak memicu halaman 404 ketika salah satu dari 17 artikel di-klik.

---

## 2. Struktur Data & Integrasi Frontend
Seluruh konten artikel akan dikonsolidasikan dalam data statis frontend di `src/lib/data/blog-articles.ts`. Setiap artikel akan diperkaya dengan field `content` berisi teks lengkap naskah berformat Markdown/HTML untuk disajikan di halaman detail `/blog/[slug]`.

### Modifikasi Tipe Data `BlogArticle`:
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
  content: string; // Teks lengkap artikel
};
```

---

## 3. Desain UI & Motion (Halaman Blog Utama)
* **Hero Section**: 
  * Orbs bercahaya latar belakang bergerak lambat (*floating animation*).
  * Judul menggunakan *Masking Text Reveal* (teks muncul dari bawah batas transparan).
* **Featured Article**:
  * Efek hover: Gambar sampul membesar (`scale: 1.03`), transisi greyscale ke warna penuh, panah link CTA bergerak ke kanan atas (`translateX(4px) translateY(-4px)`).
* **Toolbar & Tabs Filter**:
  * Pemuatan filter kategori menggunakan transisi pegas (`layoutId` framer-motion) untuk memindahkan pill background aktif secara mulus.
  * Transisi grid: Kartu-kartu di-render ulang dengan efek *fade-in staggered* (delay bertahap 0.05s).
* **Cards Grid**:
  * Gambar sampul berkualitas tinggi dari Unsplash yang disesuaikan dengan topik akademis.
  * Hover: Elevasi kartu ke atas (`translateY(-6px)`), peningkatan bayangan halus (*box-shadow* lembut), gambar menjadi berwarna penuh.

---

## 4. Desain UI & Motion (Halaman Detail Blog)
* **Hero Banner**:
  * Gambar sampul lebar dengan efek *parallax scrolling* (bergerak lebih lambat daripada kecepatan scroll halaman).
  * Overlay gradien gelap untuk menjaga keterbacaan teks judul di atas gambar jika diperlukan, atau layout terpisah yang elegan.
* **Reading Progress Bar**:
  * Bar tipis berwarna `--scopus` (#E9711C) di bagian atas viewport yang memanjang sesuai dengan persentase scroll halaman (`scrollYProgress`).
* **Main Content Area (`max-w-3xl` / `70ch`)**:
  * Tipografi menggunakan **Plus Jakarta Sans** dengan spasi baris (`leading-relaxed`), ukuran teks optimal untuk membaca jarak jauh.
  * Konten didesain menggunakan styling CSS khusus untuk tag Markdown (`p`, `h2`, `h3`, `blockquote`, `ul`, `ol`). Blockquote memiliki aksen garis vertikal tebal berwarna oranye Scopus.
* **Sidebar Melayang (Sticky Share/Back)**:
  * Tombol kembali yang elegan dan menu interaktif untuk menyalin tautan artikel atau membagikannya ke media sosial.
* **Section Rekomendasi (Related Posts)**:
  * Menampilkan 3 artikel lain di bagian bawah sebagai anjuran membaca berikutnya dengan visual grid kompak.

---

## 5. Rencana Verifikasi
* **Manual**: Menjalankan dev server, menguji filter kategori, menguji transisi hover, dan memastikan setiap klik artikel membuka halaman detail yang sesuai tanpa 404.
* **Animasi**: Memastikan frame rate stabil (60 FPS) pada animasi framer-motion di browser.
* **Responsif**: Menguji visualisasi pada resolusi desktop, tablet, dan smartphone.
