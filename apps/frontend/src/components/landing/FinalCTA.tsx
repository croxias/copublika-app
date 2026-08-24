import Link from "next/link";

const TRUST = [
  { v: "1.240", accent: "+", l: "Anggota" },
  { v: "318", l: "Publikasi" },
  { v: "47", l: "Mentor" },
  { v: "76", accent: "%", l: "Tingkat Akseptasi" },
];

export function FinalCTA() {
  return (
    <section className="cp-cta-final">
      <div className="cp-cta-final__grid" aria-hidden="true" />
      <div className="cp-cta-final__orbit" aria-hidden="true" />
      <div className="cp-cta-final__wrap">
        <h2 className="cp-cta-final__h">Saatnya menulis paragraf pertama.</h2>
        <p className="cp-cta-final__p">
          Bergabunglah dengan ratusan akademisi pemula yang sedang membangun rekam jejak
          publikasi mereka — bersama. Tidak perlu menunggu siap.
        </p>
        <div className="cp-cta-final__group">
          <Link href="/register" className="cp-cta-final__btn cp-cta-final__btn--accent">
            Gabung Komunitas
            <span className="cp-cta-final__arr">→</span>
          </Link>
          <Link href="/contact" className="cp-cta-final__btn cp-cta-final__btn--line">
            Hubungi Kami
          </Link>
        </div>
        <div className="cp-cta-trust">
          {TRUST.map((t, i) => (
            <span key={t.l} className="cp-cta-trust__cell">
              <span className="cp-cta-trust__v">
                {t.v}
                {t.accent ? <span className="cp-cta-trust__accent">{t.accent}</span> : null}
              </span>
              <span className="cp-cta-trust__l">{t.l}</span>
              {i < TRUST.length - 1 ? <span className="cp-cta-trust__div" aria-hidden="true" /> : null}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
