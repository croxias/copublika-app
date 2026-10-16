// Copy for /contact. The public page renders it and the admin seeds "Kontak" from it.
// Messages sent from the form land in the admin's Kotak Pesan (staging: browser storage) and
// are answered by Tim Admin CoPublika.

export type ContactTopic = { label: string; reply: string; replyHours: number; channel: string; hint: string };

export const CONTACT_COPY = {
  hero: {
    badge: "Hubungi kami",
    title: "Sapa",
    accent: "kami.",
    lead: "Pertanyaan program, kolaborasi riset, atau ajakan menulis tamu. Pilih topiknya, Tim Admin CoPublika membalas dalam satu hari kerja.",
    cta: "Tulis pesan",
  },
  topics: [
    { label: "Program", reply: "± 4 jam kerja", replyHours: 4, channel: "WhatsApp", hint: "Siap Tembus Scopus, Bootcamp, jadwal angkatan, dan pembayaran." },
    { label: "Kolaborasi", reply: "± 1 hari kerja", replyHours: 24, channel: "Email", hint: "Kerja sama kampus, riset bersama, sponsor event, dan media." },
    { label: "Tulisan tamu", reply: "± 2 hari kerja", replyHours: 48, channel: "Email", hint: "Kirim outline tulisan untuk Blog CoPublika." },
    { label: "Keanggotaan", reply: "± 1 hari kerja", replyHours: 24, channel: "Email", hint: "Status pendaftaran batch, verifikasi profil, dan akun anggota." },
    { label: "Lainnya", reply: "± 1 hari kerja", replyHours: 24, channel: "Email", hint: "Pertanyaan lain yang tidak masuk kategori di atas." },
  ] satisfies ContactTopic[],
  channels: [
    { label: "Email", value: "copublika@gmail.com", href: "mailto:copublika@gmail.com" },
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
    address: "Jl. Meteor Raya Blok A-II No. 298, Sekejati, Buahbatu, Bandung, Jawa Barat 40286",
    /** "lat, lng" of the office pin; mapQuery is the fallback search. */
    coords: "-6.950347, 107.659361",
    mapQuery: "Jl. Meteor Raya No. 298, Sekejati, Bandung",
  },
  faq: {
    tag: "Sebelum menulis",
    title: "Mungkin jawabannya",
    accent: "sudah ada.",
    items: [
      { q: "Berapa lama pesan saya dibalas?", a: "Pesan di jam kerja dibalas sesuai perkiraan per topik, paling lama satu hari kerja. Pesan di akhir pekan dibalas Senin." },
      { q: "Bisakah saya konsultasi naskah lewat pesan ini?", a: "Untuk review naskah, gunakan program Siap Tembus Scopus 1-on-1 agar mentor bisa membaca naskah lengkap. Pertanyaan singkat tetap boleh dikirim lewat form ini." },
      { q: "Bagaimana cara mengajukan kerja sama kampus?", a: "Pilih topik Kolaborasi dan ceritakan bentuk kerja sama yang Anda bayangkan. Tim Admin CoPublika akan mengirim proposal dan jadwal diskusi." },
      { q: "Saya ingin menulis untuk Blog CoPublika.", a: "Pilih topik Tulisan tamu dan sertakan judul serta tiga poin utama tulisan Anda. Tim Admin CoPublika membalas dengan catatan dalam dua hari kerja." },
    ],
  },
};
