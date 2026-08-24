const STATS = [
  { v: "24", l: "Cluster aktif" },
  { v: "12", l: "Proyek berjalan" },
  { v: "318", l: "Publikasi" },
  { v: "76%", l: "Akseptasi" },
];

export function ResearchHero() {
  return (
    <section className="cp-stsz-hero cp-res-hero">
      <div className="cp-stsz-hero__grid" aria-hidden="true" />
      <div className="cp-stsz-hero__orb-a" aria-hidden="true" />
      <div className="cp-stsz-hero__orb-b" aria-hidden="true" />

      <div className="cp-stsz-hero__inner">
        <div className="cp-stsz-pulse">
          <i />
          <span>24 Cluster Aktif · 318 Publikasi Terindeks</span>
        </div>

        <h1 className="cp-stsz-hero__title">
          Riset yang berdampak.{" "}
          <span className="cp-stsz-hero__accent">Bersama.</span>
        </h1>

        <p className="cp-stsz-hero__lead">
          Galeri proyek riset aktif, publikasi alumni, dan kerangka kolaborasi lintas
          disiplin. Telusuri bidang anda, temukan co-author yang sefrekuensi, dan ikut
          menulis naskah berikutnya.
        </p>

        <div className="cp-res-hero__stats">
          {STATS.map((s) => (
            <div key={s.l} className="cp-res-hero__stat">
              <span className="cp-res-hero__stat-v">{s.v}</span>
              <span className="cp-res-hero__stat-l">{s.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
