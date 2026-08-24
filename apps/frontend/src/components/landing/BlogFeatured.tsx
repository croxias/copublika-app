"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

type Featured = {
  tag: string;
  img: string;
  category: string;
  readTime: string;
  date: string;
  title: string;
  desc: string;
  avatar: string;
  name: string;
  role: string;
};

const FEATURED: Featured[] = [
  {
    tag: "UTAMA",
    img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80&auto=format&fit=crop",
    category: "Guide",
    readTime: "12 min read",
    date: "15 Mei 2025",
    title:
      "Anatomi Naskah yang Diterima Q1: Membedah Tiga Naskah CoPublika dari Submit hingga Acceptance",
    desc:
      "Tiga naskah peserta cohort #05 berhasil diterima di jurnal Q1 dalam 6 bulan terakhir. Kami membedah pola umum, kesalahan yang dihindari, dan kerangka berpikir di balik revisi-revisi penting.",
    avatar: "https://i.pravatar.cc/80?img=8",
    name: "Dr. Ade Putranto",
    role: "Pendiri · Editor jurnal Q1",
  },
  {
    tag: "PILIHAN",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80&auto=format&fit=crop",
    category: "Interview",
    readTime: "8 min read",
    date: "02 Mei 2025",
    title:
      "Membaca Reviewer Comments Tanpa Patah Semangat: Kerangka Berpikir dari Editor Senior",
    desc:
      "Dr. Maya Rahmawati — reviewer aktif di 4 jurnal Q1 — berbagi cara membaca komentar reviewer sebagai data, bukan serangan personal.",
    avatar: "https://i.pravatar.cc/80?img=20",
    name: "Dr. Maya Rahmawati",
    role: "Head of Programs",
  },
  {
    tag: "ESAI",
    img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80&auto=format&fit=crop",
    category: "Essay",
    readTime: "10 min read",
    date: "18 Apr 2025",
    title: "Slow Scholarship: Mengapa Lambat Itu Tidak Apa-Apa di Dunia yang Mengejar Output",
    desc:
      "Esai panjang tentang etos kerja akademik, ritme yang berkelanjutan, dan kenapa kuantitas publikasi tidak selalu berbanding lurus dengan dampak.",
    avatar: "https://i.pravatar.cc/80?img=49",
    name: "Dr. Dewi Nirmala",
    role: "Mentor · Sociology",
  },
  {
    tag: "STUDI KASUS",
    img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200&q=80&auto=format&fit=crop",
    category: "Case Study",
    readTime: "15 min read",
    date: "05 Apr 2025",
    title: "Dari Reject di Q3 ke Accept di Q2: Satu Naskah, Tiga Submission, Sembilan Bulan",
    desc:
      "Studi kasus naskah peserta cohort #04. Kronologi lengkap setiap submission, reviewer comments, dan keputusan strategis di setiap titik.",
    avatar: "https://i.pravatar.cc/80?img=12",
    name: "Fajar Ramadhan",
    role: "Mentor · Engineering",
  },
];

type Card = {
  cat: string;
  catAccent?: boolean;
  img: string;
  meta: string;
  title: string;
  author: string;
};

const CARDS: Card[] = [
  { cat: "Guide", img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80&auto=format&fit=crop", meta: "4 min · Mei 2025", title: "7 Kesalahan Umum Saat Memilih Jurnal Target", author: "— Dr. Maya Rahmawati" },
  { cat: "Interview", catAccent: true, img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80&auto=format&fit=crop", meta: "8 min · Apr 2025", title: "Membaca Reviewer Comments Tanpa Patah Semangat", author: "— Dr. Ade Putranto" },
  { cat: "Essay", img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80&auto=format&fit=crop", meta: "12 min · Mar 2025", title: "Mengapa Publikasi Internasional Penting Bagi Dosen Pemula", author: "— Dr. Lina Kartika" },
  { cat: "Guide", img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80&auto=format&fit=crop", meta: "6 min · Mar 2025", title: "Struktur IMRaD: Mengapa Reviewer Menyukai Naskah Disiplin", author: "— Dr. Bayu Setiawan" },
  { cat: "Studi Kasus", catAccent: true, img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80&auto=format&fit=crop", meta: "15 min · Feb 2025", title: "Dari Reject di Q3 ke Accept di Q2: Satu Naskah, Tiga Submission", author: "— Fajar Ramadhan" },
  { cat: "Guide", img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80&auto=format&fit=crop", meta: "9 min · Feb 2025", title: "Cara Menulis Abstract yang Membuat Reviewer Membuka Naskah Anda", author: "— Dr. Maya Rahmawati" },
  { cat: "Essay", img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80&auto=format&fit=crop", meta: "10 min · Jan 2025", title: "Slow Scholarship: Mengapa Lambat Itu Tidak Apa-Apa", author: "— Dr. Dewi Nirmala" },
  { cat: "Guide", img: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80&auto=format&fit=crop", meta: "7 min · Dec 2024", title: "Menggunakan AI sebagai Asisten Riset Tanpa Melanggar Etika", author: "— Fajar Ramadhan" },
  { cat: "Interview", catAccent: true, img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80&auto=format&fit=crop", meta: "6 min · Dec 2024", title: "Kolaborasi Internasional: Mencari Co-Author yang Sefrekuensi", author: "— Dr. Lina Kartika" },
  { cat: "Forum", img: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80&auto=format&fit=crop", meta: "11 min · Nov 2024", title: "Beasiswa S3 Luar Negeri: Sharing Alumni LPDP & Chevening", author: "— Dr. Hadi Suryanto" },
];

export function BlogFeatured() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i: number) => {
    setIdx(i);
    setPaused(true);
    // Auto-resume after 10 seconds of inactivity
    const t = setTimeout(() => setPaused(false), 10000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % FEATURED.length), 6000);
    return () => clearInterval(t);
  }, [paused]);

  const list = [...CARDS, ...CARDS];

  return (
    <section className="cp-blog" id="blog-section">
      <div className="cp-blog__wrap">
        {/* ── Section Header: two-col with "Lihat semua" on right ── */}
        <div className="cp-section-head cp-section-head--two">
          <div>
            <div className="cp-sh-tag">
              <span className="cp-sh-tag__bar" />
              <span className="cp-sh-tag__num">07</span>
              <span>Tulisan terbaru</span>
            </div>
            <h2 className="cp-sh-h">Dari editor &amp; mentor.</h2>
          </div>
          <div className="cp-blog__head-right">
            <Link href="/blog" className="cp-sh-link">
              Lihat semua
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Featured Blog Hero Carousel ── */}
        <div
          className="cp-bh-wrap"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {FEATURED.map((f, i) => (
            <Link
              key={f.title}
              href="/blog"
              className={`cp-bh ${i === idx ? "is-active" : ""}`}
              aria-hidden={i !== idx}
              tabIndex={i !== idx ? -1 : undefined}
            >
              <div className="cp-bh__img">
                <span className="cp-bh__tag">{f.tag}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.img} alt="" loading="lazy" />
              </div>
              <div className="cp-bh__body">
                <div className="cp-bh__meta">
                  <span>{f.category}</span>
                  <span className="cp-bh__meta-sep">/</span>
                  <span>{f.readTime}</span>
                  <span className="cp-bh__meta-sep">/</span>
                  <span>{f.date}</span>
                </div>
                <h3 className="cp-bh__h">{f.title}</h3>
                <p className="cp-bh__p">{f.desc}</p>
                <div className="cp-bh__author">
                  <span
                    className="cp-bh__avatar"
                    style={{ backgroundImage: `url('${f.avatar}')` }}
                  />
                  <div className="cp-bh__author-info">
                    <div className="cp-bh__name">{f.name}</div>
                    <div className="cp-bh__role">{f.role}</div>
                  </div>
                  <span className="cp-bh__cta">
                    Baca
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Pagination dots */}
          <div className="cp-bh-dots">
            {FEATURED.map((_, i) => (
              <button
                key={`dot-${i}`}
                className={`cp-bh-dot ${i === idx ? "is-active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(i);
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Blog Marquee: portrait-style cards ── */}
      <div className="cp-marquee cp-marquee--mt" style={{ ["--speed" as never]: "65s" }}>
        <div className="cp-marquee__track cp-marquee__track--reverse">
          {list.map((c, i) => (
            <Link key={`${c.title}-${i}`} className="cp-bc" href="/blog">
              <div className="cp-bc__thumb">
                <span className={`cp-bc__cat ${c.catAccent ? "cp-bc__cat--accent" : ""}`}>{c.cat}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt="" loading="lazy" />
              </div>
              <div className="cp-bc__body">
                <span className="cp-bc__meta">{c.meta}</span>
                <h4 className="cp-bc__h">{c.title}</h4>
                <span className="cp-bc__author">{c.author}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
