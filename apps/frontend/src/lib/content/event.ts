// Copy for /event and /event/[slug]. The public components render it and the admin seeds
// "Halaman Event" from it. Events themselves live in lib/data (admin: Konten → Agenda Event).

import type { SectionCopy } from "./programs";

export const EVENT_COPY = {
  hero: {
    pill: "Kalender kegiatan akademik",
    title: "Agenda",
    accent: "komunitas.",
    lead: "Webinar, klinik manuskrip, workshop, dan forum doktoral bersama editor dan reviewer jurnal. Sebagian besar gratis untuk anggota CoPublika.",
    ctaPrimary: "Lihat acara terdekat",
    ctaSecondary: "Kalender lengkap",
  },
  next: {
    tag: "Acara terdekat",
    title: "Jangan sampai",
    accent: "ketinggalan.",
    lead: "Pendaftaran masih dibuka. Simpan jadwalnya ke kalender Anda supaya tidak terlewat.",
  } satisfies SectionCopy,
  agenda: {
    tag: "Jadwal lengkap",
    title: "Agenda",
    accent: "berkelanjutan.",
    lead: "Cari berdasarkan topik atau pembicara, saring per jenis acara, atau lihat semuanya dalam kalender bulanan.",
  } satisfies SectionCopy,
  detail: {
    moreTag: "Agenda lainnya",
    moreTitle: "Acara",
    moreAccent: "berikutnya.",
    /** Price shown to non-members on free events and as the default for paid ones. */
    nonMemberPrice: 75_000,
    doneTitle: "Pendaftaran diterima.",
    doneText: "Tautan dan materi dikirim ke email Anda 24 jam sebelum acara.",
  },
};
