// Copy for /blog and /blog/[slug]. The public components render it and the admin seeds
// "Halaman Blog" from it, so both always start from the same text. Articles live in
// lib/data/blog-articles.ts (admin: Konten → Artikel Blog).

import type { SectionCopy } from "./programs";

/** The "Pilihan editor" notebook and carousel are laid out for at most this many picks. */
export const EDITORS_PICK_MAX = 6;

export const BLOG_COPY = {
  hero: {
    pill: "Jurnal CoPublika · ditulis mentor & alumni",
    title: "Menembus jurnal,",
    accent: "dari yang sudah sampai.",
    lead: "Panduan praktis, wawancara reviewer, dan bedah naskah anggota, ditulis mentor dan alumni yang sudah melewati proses review jurnal Scopus. Gratis, tanpa basa-basi.",
    searchPlaceholder: "Cari topik: abstract, cover letter, revisi…",
    topics: ["Memilih jurnal", "Abstract", "Cover letter", "Revisi", "Reviewer"],
  },
  picks: {
    tag: "Pilihan editor",
    title: "Mulai dari sini,",
    accent: "enam bacaan wajib.",
    lead: "Dipilih tim editor untuk Anda yang sedang menyiapkan naskah pertama atau baru saja ditolak jurnal.",
  } satisfies SectionCopy,
  archive: {
    tag: "Semua tulisan",
    title: "Arsip lengkap,",
    accent: "cari yang Anda butuhkan.",
    lead: "Filter per kategori, cari topik tertentu, atau mulai dari bacaan singkat.",
  } satisfies SectionCopy,
  write: {
    tag: "Terbuka untuk penulis tamu",
    title: "Pengalaman Anda bisa jadi",
    accent: "peta bagi penulis lain.",
    lead: "Kami mencari tulisan dari peneliti, dosen, editor, dan reviewer. Tidak perlu naskah jadi, cukup outline.",
    wanted: ["Pengalaman submit & revisi", "Kiat metodologi", "Wawancara editor/reviewer", "Esai kehidupan akademik"],
    steps: [
      { title: "Kirim outline", text: "Judul, tiga poin utama, dan untuk siapa tulisan Anda." },
      { title: "Catatan editor", text: "Tim editor membaca dan memberi catatan dalam 7 hari kerja." },
      { title: "Terbit di blog", text: "Tulisan tayang dengan nama dan profil Anda sebagai penulis." },
    ],
    ctaPrimary: "Kirim outline",
    ctaSecondary: "Tanya tim editor",
  },
  detail: {
    /** `{penulis}` is replaced with the author's first name. */
    ctaTitle: "Ingin naskah Anda dibaca mentor seperti {penulis}?",
    ctaText: "Siap Tembus Scopus 1-on-1: sesi 90 menit + 4 putaran review sampai siap submit.",
    ctaButton: "Lihat program",
    moreTag: "Bacaan lanjutan",
    moreTitle: "Masih ingin belajar?",
    moreAccent: "Teruskan dengan ini.",
    newestTitle: "Ini tulisan terbaru kami.",
    oldestTitle: "Ini tulisan pertama kami.",
    edgeText: "Tulisan baru dari mentor dan alumni CoPublika terus ditambahkan.",
  },
};
