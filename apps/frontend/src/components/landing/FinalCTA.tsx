import Link from "next/link";

const TRUST = [
  { v: "1.240", accent: "+", l: "Anggota" },
  { v: "318", l: "Publikasi" },
  { v: "47", l: "Mentor" },
  { v: "76", accent: "%", l: "Tingkat akseptasi" },
];

// Closing call to action, styled as a dark manuscript sheet: ruled lines,
// slow drifting light, and a caret blinking after "paragraf pertama".
export function FinalCTA() {
  return (
    <section className="cp-cta-final">
      <div className="cp-cta-panel" data-reveal>
        <div className="cp-cta-panel__glow" aria-hidden="true" />
        <div className="cp-cta-panel__lines" aria-hidden="true" />
        <div className="cp-cta-panel__inner">
          <p className="cp-cta-panel__kicker">
            <span aria-hidden="true" /> Batch 7 dibuka
          </p>
          <h2 className="cp-cta-final__h">
            Saatnya menulis <span className="cp-sh-h-accent">paragraf pertama</span>
            <span className="cp-cta-panel__caret" aria-hidden="true" />
          </h2>
          <p className="cp-cta-final__p">
            Bergabunglah dengan ratusan akademisi yang sedang membangun rekam jejak publikasi mereka, bersama.
            Tidak perlu menunggu siap.
          </p>
          <div className="cp-cta-final__group">
            <Link href="/register" className="cp-cta-final__btn cp-cta-final__btn--accent">
              Gabung komunitas
              <span className="cp-cta-final__arr">→</span>
            </Link>
            <Link href="/contact" className="cp-cta-final__btn cp-cta-final__btn--line">
              Hubungi kami
            </Link>
          </div>
          <dl className="cp-cta-trust">
            {TRUST.map((t) => (
              <div key={t.l} className="cp-cta-trust__cell">
                <dt className="cp-cta-trust__l">{t.l}</dt>
                <dd className="cp-cta-trust__v">
                  {t.v}
                  {t.accent ? <span className="cp-cta-trust__accent">{t.accent}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
