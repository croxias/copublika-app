"use client";

import Link from "next/link";
import { useState } from "react";

type Faq = { question: string; answer: string };

const DEFAULT_FAQS: Faq[] = [
  {
    question: "Apa itu CoPublika?",
    answer:
      "CoPublika adalah komunitas yang dibentuk khusus untuk akademisi pemula — dosen, peneliti, dan mahasiswa S2/S3 — yang ingin membangun rekam jejak publikasi terindeks. Kami menggabungkan kelompok riset, bootcamp, dan ruang komunitas dalam satu sistem.",
  },
  {
    question: "Siapa target anggota komunitas?",
    answer:
      "Akademisi pemula — dosen baru, peneliti awal karir, mahasiswa pascasarjana — yang merasa siap belajar tetapi membutuhkan struktur, mentor, dan teman seperjuangan untuk menjaga konsistensi.",
  },
  {
    question: "Apakah ada biaya untuk bergabung?",
    answer:
      "Forum komunitas, blog, dan beberapa webinar bersifat gratis. Program berstruktur seperti Siap Tembus Scopus berbayar — dengan opsi cicilan dan beasiswa institusi. Detail tarif disampaikan saat pendaftaran batch.",
  },
  {
    question: "Saya belum pernah submit ke jurnal sama sekali — apakah masih relevan?",
    answer:
      "Sangat relevan. Banyak peserta yang bergabung dari titik nol — kami mendampingi sejak pemilihan topik. Tidak ada pertanyaan yang terlalu kecil di komunitas.",
  },
  {
    question: "Apakah CoPublika menjamin naskah saya akan diterima Scopus?",
    answer:
      "Tidak ada lembaga yang dapat memberi jaminan absolut — keputusan akhir ada di tangan editor jurnal. Yang kami jaminkan adalah proses: kerangka kerja, mentor berpengalaman, dan klinik revisi yang konsisten.",
  },
  {
    question: "Bagaimana cara mendaftar?",
    answer:
      "Klik tombol Daftar di pojok kanan atas, atau pergi ke halaman program yang anda minati. Setelah membuat akun, anda akan langsung terhubung ke forum dan jadwal batch terdekat.",
  },
];

export function FAQ({ faqs }: { faqs?: Faq[] }) {
  const items = faqs && faqs.length ? faqs : DEFAULT_FAQS;
  const [open, setOpen] = useState(0);

  return (
    <section className="cp-faq-section cp-surface-ink">
      <div className="cp-faq-section__wrap cp-faq-layout">
        <div className="cp-faq-layout__head" data-reveal>
          <div className="cp-sh-tag">
            <span className="cp-sh-tag__bar" />
            <span>Pertanyaan umum</span>
          </div>
          <h2 className="cp-sh-h">
            Yang sering <span className="cp-sh-h-accent">ditanyakan.</span>
          </h2>
          <p className="cp-sh-sub">Belum menemukan jawabannya? Tim kami siap membantu.</p>
          <Link href="/contact" className="cp-sh-link">
            Hubungi kami
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="cp-faq2" data-reveal>
          {items.map((faq, i) => (
            <div key={faq.question} className={`cp-faq2__item ${open === i ? "is-open" : ""}`}>
              <button
                className="cp-faq2__q"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
              >
                <span className="cp-faq2__t">{faq.question}</span>
                <span className="cp-faq2__plus" aria-hidden="true" />
              </button>
              <div className="cp-faq2__a">
                <div className="cp-faq2__a-inner">
                  <div className="cp-faq2__a-text">{faq.answer}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
