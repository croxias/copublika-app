import Link from "next/link";
import { EventsBoard, type LandingEvent } from "./EventsBoard";

// Placeholder agenda until events come from the CMS.
export const EVENTS: LandingEvent[] = [
  {
    date: "2026-10-24",
    title: "Klinik Naskah: Membedah Komentar Reviewer",
    sub: "Bersama Dr. Aulia Rahmawati, editor Asia Pacific Journal of Education",
    where: "Daring · Zoom",
    status: "Segera",
  },
  {
    date: "2026-11-07",
    title: "Editor Roundtable: Strategi Memilih Jurnal Q1–Q2",
    sub: "Diskusi panel tiga editor jurnal Scopus dari Asia Tenggara",
    where: "Daring · Webinar",
    status: "Pendaftaran dibuka",
  },
  {
    date: "2026-11-21",
    title: "Workshop Luring: Academic Writing dengan Anchor Sentences",
    sub: "Dua hari intensif pendampingan tata tulis bahasa Inggris akademik",
    where: "Luring · Yogyakarta",
    status: "Pendaftaran dibuka",
  },
  {
    date: "2026-12-05",
    title: "Doctoral Forum: Membangun Jejaring Internasional Sejak S3",
    sub: "Berbagi pengalaman dari empat alumni S3 ITB, UI, UGM, dan Unair",
    where: "Hybrid · Jakarta",
    status: "Pendaftaran dibuka",
  },
];

export function EventsList() {
  return (
    <section className="cp-events">
      <div className="cp-events__wrap">
        <div className="cp-section-head cp-section-head--link" data-reveal>
          <div>
            <div className="cp-sh-tag">
              <span className="cp-sh-tag__bar" />
              <span>Agenda</span>
            </div>
            <h2 className="cp-sh-h cp-sh-h--line">Acara <span className="cp-sh-h-accent">mendatang.</span></h2>
          </div>
          <div className="cp-blog__head-right">
            <Link href="/event" className="cp-sh-link">
              Lihat semua
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        <EventsBoard events={EVENTS} />
      </div>
    </section>
  );
}
