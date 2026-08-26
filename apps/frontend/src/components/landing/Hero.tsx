import Link from "next/link";

export function Hero() {
  return (
    <section className="cp-home-hero" aria-labelledby="home-hero-title">
      <div className="cp-home-hero__inner">
        <div className="cp-home-hero__copy">
          <p className="cp-home-hero__eyebrow">
            <span aria-hidden="true" /> Digital Research Engine · CoPublika
          </p>
          <h1 id="home-hero-title" className="cp-home-hero__title">
            Riset yang lebih terarah. <em>Kolaborasi yang lebih berarti.</em>
          </h1>
          <p className="cp-home-hero__dek">
            Ruang kerja dan komunitas terkurasi untuk akademisi yang ingin menemukan rekan riset,
            mengembangkan ide, dan menulis untuk publikasi berkualitas.
          </p>
          <div className="cp-home-hero__actions">
            <Link href="/register" className="cp-btn cp-btn--solid cp-btn--lg">
              Mulai berkolaborasi <span className="cp-btn__arrow" aria-hidden="true">→</span>
            </Link>
            <Link href="/research" className="cp-home-hero__secondary">
              Lihat proyek riset <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <p className="cp-home-hero__note">Untuk akademisi pemula · lintas disiplin · Indonesia</p>
        </div>

        <div className="cp-home-hero__visual" role="img" aria-label="Diagram alur kolaborasi riset: dari ide, bertemu orang, hingga menjadi paper.">
          <div className="cp-home-hero__visual-head">
            <span>RESEARCH EXCHANGE</span>
            <span>OPEN / CURATED</span>
          </div>
          <div className="cp-home-hero__diagram" aria-hidden="true">
            <div className="cp-home-hero__node cp-home-hero__node--primary">IDEA</div>
            <div className="cp-home-hero__line cp-home-hero__line--one" />
            <div className="cp-home-hero__node cp-home-hero__node--secondary">PEOPLE</div>
            <div className="cp-home-hero__line cp-home-hero__line--two" />
            <div className="cp-home-hero__node cp-home-hero__node--accent">PAPER</div>
            <div className="cp-home-hero__axis cp-home-hero__axis--x" />
            <div className="cp-home-hero__axis cp-home-hero__axis--y" />
          </div>
          <div className="cp-home-hero__visual-foot">
            <span>DISCOVER</span><span>CONNECT</span><span>BUILD</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
