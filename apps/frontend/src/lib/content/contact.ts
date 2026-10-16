// Copy for /contact. The public page renders it and the admin seeds "Kontak" from it.
// Messages sent from the form land in the admin's Kotak Pesan (staging: browser storage).

export type ContactTopic = { label: string; team: string; reply: string; channel: string; hint: string };

export const CONTACT_COPY = {
  hero: {
    badge: "Hubungi kami",
    title: "Sapa",
    accent: "kami.",
    lead: "Pertanyaan program, kolaborasi riset, atau ajakan menulis tamu. Pilih topiknya, kami teruskan ke tim yang tepat dan membalas dalam satu hari kerja.",
    routerTitle: "Pesan Anda akan diteruskan ke",
    cta: "Tulis pesan",
  },
  topics: [
    { label: "Program", team: "Tim Program", reply: "± 4 jam kerja", channel: "WhatsApp", hint: "Siap Tembus Scopus, Bootcamp, jadwal angkatan, dan pembayaran." },
    { label: "Kolaborasi", team: "Tim Kemitraan", reply: "± 1 hari kerja", channel: "Email", hint: "Kerja sama kampus, riset bersama, sponsor event, dan media." },
    { label: "Tulisan tamu", team: "Tim Editor", reply: "± 2 hari kerja", channel: "Email", hint: "Kirim outline tulisan untuk Blog CoPublika." },
    { label: "Keanggotaan", team: "Tim Kurasi", reply: "± 1 hari kerja", channel: "Email", hint: "Status pendaftaran batch, verifikasi profil, dan akun anggota." },
    { label: "Lainnya", team: "Tim CoPublika", reply: "± 1 hari kerja", channel: "Email", hint: "Pertanyaan lain yang tidak masuk kategori di atas." },
  ] satisfies ContactTopic[],
  channels: [
    { label: "Email", value: "halo@copublika.id", href: "mailto:halo@copublika.id" },
    { label: "WhatsApp", value: "+62 813 2025 0707", href: "https://wa.me/6281320250707" },
    { label: "Instagram", value: "@copublika.id", href: "https://instagram.com/copublika.id" },
    { label: "Threads", value: "@copublika.id", href: "https://threads.net/@copublika.id" },
  ],
  hours: {
    /** Monday-first, WIB. Empty open/close means closed. */
    days: [
      { day: "Senin", open: "09:00", close: "17:00" },
      { day: "Selasa", open: "09:00", close: "17:00" },
      { day: "Rabu", open: "09:00", close: "17:00" },
      { day: "Kamis", open: "09:00", close: "17:00" },
      { day: "Jumat", open: "09:00", close: "16:00" },
      { day: "Sabtu", open: "", close: "" },
      { day: "Minggu", open: "", close: "" },
    ],
    note: "Pesan di luar jam kerja dibalas pada hari kerja berikutnya.",
  },
  form: {
    tag: "Kirim pesan",
    title: "Ceritakan",
    accent: "kebutuhan Anda.",
    lead: "Semakin jelas konteksnya, semakin cepat kami bisa membantu.",
    consent: "Dengan mengirim, Anda setuju kami menyimpan email dan nomor Anda untuk membalas pesan ini.",
    submit: "Kirim pesan",
    successTitle: "Pesan terkirim.",
    successText: "Terima kasih. Tim kami membalas ke email Anda sesuai perkiraan waktu di atas.",
  },
  location: {
    label: "Kantor",
    address: "Jl. Cik Di Tiro No. 24, Bandung, Jawa Barat 40113",
    mapQuery: "Jl. Cik Di Tiro No. 24, Bandung",
  },
  faq: {
    tag: "Sebelum menulis",
    title: "Mungkin jawabannya",
    accent: "sudah ada.",
    items: [
      { q: "Berapa lama pesan saya dibalas?", a: "Pesan di jam kerja dibalas sesuai perkiraan per topik, paling lama satu hari kerja. Pesan di akhir pekan dibalas Senin." },
      { q: "Bisakah saya konsultasi naskah lewat pesan ini?", a: "Untuk review naskah, gunakan program Siap Tembus Scopus 1-on-1 agar mentor bisa membaca naskah lengkap. Pertanyaan singkat tetap boleh dikirim lewat form ini." },
      { q: "Bagaimana cara mengajukan kerja sama kampus?", a: "Pilih topik Kolaborasi dan ceritakan bentuk kerja sama yang Anda bayangkan. Tim Kemitraan akan mengirim proposal dan jadwal diskusi." },
      { q: "Saya ingin menulis untuk Blog CoPublika.", a: "Pilih topik Tulisan tamu dan sertakan judul serta tiga poin utama tulisan Anda. Tim Editor membalas dengan catatan dalam dua hari kerja." },
    ],
  },
};
