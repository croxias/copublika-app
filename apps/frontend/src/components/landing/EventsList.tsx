import Link from "next/link";

const EVENTS = [
  {
    d: "12",
    m: "Jun",
    title: "Klinik Manuskrip: Membedah Reviewer Comments",
    sub: "Bersama Dr. Aulia Rahmawati, Editor Asia Pacific Journal of Education",
    where: "Daring · Zoom",
  },
  {
    d: "24",
    m: "Jun",
    title: "Editor Roundtable: Strategi Memilih Jurnal Q1–Q2",
    sub: "Diskusi panel 3 editor jurnal Scopus dari Asia Tenggara",
    where: "Daring · Webinar",
  },
  {
    d: "08",
    m: "Jul",
    title: "Workshop Luring: Academic Writing dengan Anchor Sentences",
    sub: "2 hari intensif, pendampingan tata-tulis Bahasa Inggris akademik",
    where: "Luring · Yogyakarta",
  },
  {
    d: "22",
    m: "Jul",
    title: "Doctoral Forum: Membangun Jejaring Internasional Sejak S3",
    sub: "Sharing dari 4 alumni S3 ITB, UI, UGM, dan Universitas Indonesia",
    where: "Hybrid · Jakarta",
  },
];

export function EventsList() {
  return (
    <section className="cp-events">
      <div className="cp-events__wrap">
        <div className="cp-section-head cp-section-head--two">
          <div>
            <div className="cp-sh-tag">
              <span className="cp-sh-tag__bar" />
              <span className="cp-sh-tag__num">06</span>
              <span>Agenda</span>
            </div>
            <h2 className="cp-sh-h">Acara mendatang.</h2>
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

        <div className="cp-events__list">
          {EVENTS.map((e) => (
            <Link key={e.title} href="/event" className="cp-event">
              <div className="cp-event__date">
                <span className="cp-event__d">{e.d}</span>
                <span className="cp-event__m">{e.m}</span>
              </div>
              <div className="cp-event__info">
                <h4>{e.title}</h4>
                <div className="cp-event__sub">{e.sub}</div>
              </div>
              <div className="cp-event__where">{e.where}</div>
              <div className="cp-event__go">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
