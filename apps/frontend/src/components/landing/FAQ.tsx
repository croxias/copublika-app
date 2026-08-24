"use client";

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
      "Forum komunitas, blog, dan beberapa webinar bersifat gratis. Program berstruktur seperti Siap Tembus Scopus berbayar — dengan opsi cicilan dan beasiswa institusi. Detail tarif disampaikan saat pendaftaran cohort.",
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
      "Klik tombol Daftar di pojok kanan atas, atau pergi ke halaman program yang anda minati. Setelah membuat akun, anda akan langsung terhubung ke forum dan jadwal cohort terdekat.",
  },
];

export function FAQ({ faqs }: { faqs?: Faq[] }) {
  const items = faqs && faqs.length ? faqs : DEFAULT_FAQS;
  const [open, setOpen] = useState(0);

  return (
    <section className="cp-faq-section">
      <div className="cp-faq-section__wrap">
        <div className="cp-section-head cp-section-head--two">
          <div>
            <div className="cp-sh-tag">
              <span className="cp-sh-tag__bar" />
              <span className="cp-sh-tag__num">09</span>
              <span>Pertanyaan umum</span>
            </div>
            <h2 className="cp-sh-h">Yang sering ditanyakan.</h2>
          </div>
        </div>

        <div className="cp-faq2">
          {items.map((faq, i) => (
            <div key={faq.question} className={`cp-faq2__item ${open === i ? "is-open" : ""}`}>
              <button
                className="cp-faq2__q"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
              >
                <span className="cp-faq2__n">{String(i + 1).padStart(2, "0")}</span>
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
