import { getEvents } from "@/lib/data/events";
import { EventClient } from "./EventClient";

export default async function EventPage() {
  const events = await getEvents();

  return (
    <>
      <section className="cp-ev-hero-v2">
        <div className="cp-ev-hero-v2__orb1" aria-hidden="true" />
        <div className="cp-ev-hero-v2__orb2" aria-hidden="true" />
        <div className="cp-ev-hero-v2__orb3" aria-hidden="true" />
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="cp-ev-hero-v2__wrap">
            <div className="cp-ev-hero-v2__eyebrow">Kalender Kegiatan Akademik</div>
            <h1>
              Agenda <em>Komunitas</em>.
            </h1>
            <p className="cp-ev-hero-v2__lead">
              Webinar, klinik manuskrip, dan forum doctoral — sebagian besar gratis untuk anggota komunitas CoPublika.
            </p>
            <div className="cp-ev-hero-v2__kpis">
              <div className="cp-ev-hero-v2__kpi">
                <div className="cp-ev-hero-v2__kpi-v">24<span style={{ color: "var(--scopus)" }}>+</span></div>
                <div className="cp-ev-hero-v2__kpi-l">Acara / Tahun</div>
              </div>
              <div className="cp-ev-hero-v2__kpi-div" />
              <div className="cp-ev-hero-v2__kpi">
                <div className="cp-ev-hero-v2__kpi-v">318</div>
                <div className="cp-ev-hero-v2__kpi-l">Peserta</div>
              </div>
              <div className="cp-ev-hero-v2__kpi-div" />
              <div className="cp-ev-hero-v2__kpi">
                <div className="cp-ev-hero-v2__kpi-v">76<span style={{ color: "var(--scopus)" }}>%</span></div>
                <div className="cp-ev-hero-v2__kpi-l">Akseptasi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cp-section--tight" style={{ background: "var(--paper)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <EventClient events={events} />
        </div>
      </section>
    </>
  );
}
