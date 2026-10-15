// Copy for the two program pages (/siap-tembus-scopus, /bootcamp-menulis). The public components
// render it and the admin seeds "Program" from it, so both always start from the same text.
// Prices, mentor seats and batches live in lib/data/programs.ts.

export type SectionCopy = { tag: string; title: string; accent: string; lead: string };
export type FaqItem = { q: string; a: string };
export type CheckItem = { id: string; text: string };

/* ---------------------------------------------------------------------------
   Siap Tembus Scopus 1-on-1
   --------------------------------------------------------------------------- */

export const STS_COPY = {
  hero: {
    pill: "Program 1-on-1 · kursi terbatas",
    title: "Siap Tembus",
    accent: "Scopus",
    badge: "1-on-1",
    lead: "Satu mentor, satu naskah, fokus penuh. Sesi tatap muka online 90 menit, lalu empat putaran review sampai naskah Anda siap dikirim ke jurnal Scopus.",
    priceLabel: "Investasi sekali bayar",
    ctaPrimary: "Pilih mentor",
    ctaSecondary: "Lihat alur program",
    trust: ["Mentor aktif menulis & me-review", "Jadwal sesi disepakati bersama"],
    floatA: "Mentor pilihan Anda",
    floatB: "Siap submit ke Scopus",
  },
  benefits: {
    tag: "Yang Anda dapatkan",
    title: "Pendampingan pribadi,",
    accent: "bukan kelas massal.",
    lead: "Satu mentor fokus pada naskah Anda. Jelajahi isi programnya: klik bagian sesi dan putaran review untuk melihat detailnya.",
  } satisfies SectionCopy,
  /** Suggested shape of the 90-minute session; the mentor adapts it to the manuscript. */
  agenda: [
    { min: 15, title: "Diagnosa naskah", text: "Mentor membaca ringkasan riset Anda dan menandai kekuatan serta titik lemah utama." },
    { min: 30, title: "Bedah struktur & argumen", text: "Alur IMRaD, posisi gap riset, dan kekuatan argumen dibahas bagian demi bagian." },
    { min: 30, title: "Strategi jurnal target", text: "Memilih jurnal Scopus yang paling sesuai: scope, quartile, dan peluang diterima." },
    { min: 15, title: "Rencana revisi", text: "Daftar perbaikan berurutan yang Anda kerjakan sebelum putaran review pertama." },
  ],
  /** What the mentor concentrates on in each review round. */
  rounds: [
    { title: "Struktur & argumen", text: "Kerangka naskah, rumusan masalah, dan kontribusi riset.", ready: 40, checks: ["Alur IMRaD utuh", "Gap riset jelas", "Kontribusi tegas"] },
    { title: "Metode & hasil", text: "Kejelasan metodologi, validitas, dan penyajian hasil.", ready: 62, checks: ["Metode bisa direplikasi", "Analisis sesuai data", "Tabel & grafik terbaca"] },
    { title: "Bahasa & kohesi", text: "Gaya akademik, kohesi paragraf, dan konsistensi istilah.", ready: 82, checks: ["Kalimat ringkas", "Paragraf saling terhubung", "Istilah konsisten"] },
    { title: "Kesiapan submit", text: "Format jurnal, abstrak, cover letter, dan pemeriksaan akhir.", ready: 100, checks: ["Sesuai author guideline", "Abstrak & cover letter", "Siap diunggah"] },
  ],
  /** Documents the participant ends the program with, in the order they arrive. */
  kit: {
    tag: "Hasil yang Anda pegang",
    title: "Empat dokumen, satu naskah siap kirim.",
    items: [
      { title: "Rencana revisi", when: "Setelah sesi 1-on-1", tag: "Sesi 1-on-1", foot: "Daftar perbaikan berurutan" },
      { title: "4 catatan review", when: "Satu di tiap putaran", tag: "Review 1–4", foot: "Komentar tertulis mentor" },
      { title: "Rekomendasi jurnal", when: "Disusun bersama mentor", tag: "Jurnal target", foot: "Scope, quartile, peluang" },
      { title: "Naskah final", when: "Di akhir program", tag: "Siap submit", foot: "Sesuai author guideline" },
    ],
  },
  flow: {
    tag: "Alur program",
    title: "Dari draf,",
    accent: "sampai siap submit.",
    lead: "Empat langkah dengan mentor yang sama dari awal sampai akhir. Klik tiap langkah untuk melihat apa yang Anda lakukan dan dapatkan.",
  } satisfies SectionCopy,
  steps: [
    { title: "Daftar & pilih mentor", short: "Pilih mentor", text: "Pilih mentor sesuai bidang dan bulan pendampingan. Akun member CoPublika Anda langsung aktif saat mendaftar.", give: "Data diri, bidang riset, dan pilihan mentor", get: "Kursi bulan itu dan akun member CoPublika" },
    { title: "Sesi 1-on-1 · 90 menit", short: "Sesi 1-on-1", text: "Bertemu mentor secara online untuk membedah naskah, menentukan jurnal target, dan menyusun rencana revisi.", give: "Draf naskah atau kerangka riset", get: "Diagnosa naskah, jurnal target, dan rencana revisi" },
    { title: "4 putaran review", short: "4 × review", text: "Kirim naskah, terima catatan revisi tertulis, perbaiki, lalu kirim lagi. Empat kali, dengan mentor yang sama.", give: "Naskah hasil revisi di setiap putaran", get: "Catatan revisi tertulis dari mentor, empat kali" },
    { title: "Siap submit", short: "Siap submit", text: "Naskah final beserta saran jurnal target siap Anda kirim ke jurnal terindeks Scopus.", give: "Naskah final", get: "Naskah siap kirim dan rekomendasi jurnal" },
  ],
  mentors: {
    tag: "Pilih mentor",
    title: "Mentor aktif,",
    accent: "kursi terbatas.",
    lead: "Setiap mentor menerima maksimal 4 peserta per bulan. Buka detail mentor untuk melihat profil dan ketersediaan kursinya.",
  } satisfies SectionCopy,
  /** Self-check: the pivot item ("draft") decides between 1-on-1 and the bootcamp. */
  checks: [
    { id: "draft", text: "Saya sudah punya draf naskah, meskipun belum rapi." },
    { id: "rejected", text: "Saya pernah ditolak jurnal, atau ingin tahu kelemahan naskah saya." },
    { id: "private", text: "Saya lebih cocok didampingi satu mentor daripada kelas besar." },
    { id: "soon", text: "Saya ingin naskah siap dikirim dalam satu sampai dua bulan." },
  ] satisfies CheckItem[],
  faq: [
    { q: "Bagaimana sesi 1-on-1 berlangsung?", a: "Sesi berlangsung online selama 90 menit lewat video call. Jadwalnya disepakati bersama mentor setelah Anda terdaftar." },
    { q: "Apa yang terjadi di setiap putaran review?", a: "Anda mengirim naskah terbaru, lalu mentor mengembalikannya dengan catatan revisi tertulis. Ada empat putaran review dalam satu program." },
    { q: "Kenapa kursinya terbatas?", a: "Setiap mentor hanya menerima empat peserta per bulan supaya setiap naskah benar-benar diperhatikan. Pendaftaran untuk seorang mentor ditutup saat kursinya penuh." },
    { q: "Bagaimana kalau mentor pilihan saya penuh?", a: "Pilih mentor lain di bulan yang sama, atau pilih mentor yang sama untuk bulan berikutnya." },
    { q: "Apakah saya otomatis menjadi member?", a: "Ya. Saat mendaftar program, akun member CoPublika Anda dibuat sekaligus, sehingga Anda juga bisa membuka detail proyek riset komunitas." },
  ] satisfies FaqItem[],
  final: {
    title: "Naskah Anda layak dibaca reviewer terbaik.",
    text: "Pilih mentor sekarang. Pendaftaran sekaligus membuat akun member CoPublika.",
    includes: "1 sesi 90 menit + 4 putaran review",
    cta: "Pilih mentor",
  },
};

/* ---------------------------------------------------------------------------
   Bootcamp 30 Hari Menulis
   --------------------------------------------------------------------------- */

export const BTM_COPY = {
  hero: {
    title: "Bootcamp",
    accent: "30 Hari Menulis",
    lead: "Satu bulan, satu angkatan, satu naskah utuh. Webinar setiap minggu, tools penulisan, pelacak progres harian, lalu naskah Anda dibaca mentor tanpa biaya tambahan.",
    priceLabel: "Investasi satu angkatan",
    includesValue: "4 webinar",
    includesNote: "+ review gratis mentor",
    ctaSecondary: "Lihat rencana 30 hari",
    trust: ["Belajar bersama satu angkatan", "Rekaman webinar tersedia"],
    floatB: "Pelacak progres harian",
  },
  benefits: {
    tag: "Yang Anda dapatkan",
    title: "Ritme, alat, dan",
    accent: "umpan balik mentor.",
    lead: "Semua yang dibutuhkan untuk menyelesaikan satu naskah dalam sebulan. Klik tiap minggu, tools, dan pin catatan untuk melihat isinya.",
  } satisfies SectionCopy,
  weeks: [
    { week: "Minggu 1", title: "Fondasi & kerangka", text: "Menetapkan pertanyaan riset, jurnal target, dan kerangka IMRaD naskah." },
    { week: "Minggu 2", title: "Pendahuluan & tinjauan pustaka", text: "Menulis latar belakang, gap riset, dan sintesis literatur." },
    { week: "Minggu 3", title: "Metode & hasil", text: "Menuliskan metodologi dan menyajikan hasil secara jelas." },
    { week: "Minggu 4", title: "Diskusi & finalisasi", text: "Diskusi, kesimpulan, abstrak, lalu naskah dikirim untuk review mentor." },
  ],
  /** Suggested share of words per IMRaD section in the template (an example, not a rule). */
  imrad: [
    { label: "Pendahuluan", share: 15 },
    { label: "Metode", share: 20 },
    { label: "Hasil", share: 25 },
    { label: "Diskusi", share: 30 },
    { label: "Kesimpulan", share: 10 },
  ],
  journalChecks: ["Scope jurnal sesuai topik", "Terindeks Scopus & quartile jelas", "Waktu review wajar", "Biaya publikasi sesuai anggaran", "Gaya sitasi dicatat"],
  paragraph: [
    { k: "Klaim", t: "Satu gagasan utama di kalimat pertama." },
    { k: "Bukti", t: "Data atau rujukan yang mendukung klaim." },
    { k: "Tautan", t: "Kaitkan ke argumen paragraf berikutnya." },
  ],
  review: {
    tag: "Bonus · tanpa biaya tambahan",
    title: "Naskah Anda dibaca mentor di akhir bootcamp.",
    lead: "Kirim naskah hasil 30 hari, lalu terima catatan tertulis langsung di naskah. Klik pin untuk melihat contoh catatannya.",
    /** Sample mentor comments pinned to a manuscript page (positions in %). */
    pins: [
      { top: 22, left: 70, text: "Perjelas gap riset: apa yang belum diteliti studi sebelumnya?" },
      { top: 48, left: 28, text: "Sebutkan jumlah dan kriteria sampel di sini." },
      { top: 74, left: 62, text: "Bandingkan temuan ini dengan dua studi terdahulu." },
    ],
  },
  plan: {
    tag: "Rencana 30 hari",
    title: "Empat minggu,",
    accent: "satu naskah utuh.",
    lead: "Geser atau klik hari mana saja untuk melihat fokus menulis, hari webinar, dan perkiraan kata yang sudah terkumpul.",
  } satisfies SectionCopy,
  /** Example daily word target used for the running count in the plan. */
  dailyWords: 500,
  batches: {
    tag: "Pilih angkatan",
    title: "Mulai bersama",
    accent: "satu angkatan.",
    lead: "Setiap angkatan mulai di tanggal yang sama dan mengikuti empat webinar yang sama.",
  } satisfies SectionCopy,
  /** Self-check: the pivot item ("complete") sends the visitor to the 1-on-1 instead. */
  checks: [
    { id: "idea", text: "Saya punya ide atau data riset, tapi naskahnya belum jadi." },
    { id: "rhythm", text: "Saya sering menunda menulis dan butuh ritme harian." },
    { id: "structure", text: "Saya ingin belajar struktur naskah jurnal langkah demi langkah." },
    { id: "complete", text: "Draf saya sudah lengkap, tinggal butuh review mendalam." },
  ] satisfies CheckItem[],
  faq: [
    { q: "Kapan webinar mingguan berlangsung?", a: "Satu kali setiap minggu selama bootcamp, sesuai jadwal angkatan Anda. Rekamannya tersedia bila Anda berhalangan hadir." },
    { q: "Apa saja tools yang saya dapatkan?", a: "Template naskah IMRaD, checklist pemilihan jurnal, kerangka paragraf, dan akses ke pelacak menulis untuk mencatat target dan jumlah kata harian." },
    { q: "Bagaimana review gratis oleh mentor?", a: "Di akhir bootcamp, naskah yang Anda kirim diulas oleh mentor CoPublika dengan catatan tertulis, tanpa biaya tambahan." },
    { q: "Apakah harus sudah punya draf?", a: "Tidak. Bootcamp dimulai dari kerangka naskah, jadi cukup membawa ide atau data riset yang ingin dituliskan." },
    { q: "Apakah saya otomatis menjadi member?", a: "Ya. Saat mendaftar bootcamp, akun member CoPublika Anda dibuat sekaligus." },
  ] satisfies FaqItem[],
  final: {
    title: "Tiga puluh hari dari sekarang, naskah Anda sudah utuh.",
    includes: "4 webinar + tools + pelacak + review gratis",
  },
};
