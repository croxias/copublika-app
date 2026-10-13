'use client';
import Link from "next/link";
import { useOptionalStaging } from "@/lib/staging";
import { useMemo } from "react";

// Hero landing: membaca slide Published dari staging store saat demo mode aktif.
// Saat demo off (production), store kosong → fallback ke konten statis bawaan,
// sehingga perilaku produksi tidak berubah pada fase ini.

const FALLBACK = {
  eyebrow: "Digital Research Engine — CoPublika",
  title: "Riset yang lebih terarah.",
  titleAccent: "Kolaborasi yang lebih berarti.",
  dek: "Ruang kerja dan komunitas terkurasi untuk akademisi yang ingin menemukan rekan riset, mengembangkan ide, dan menulis untuk publikasi berkualitas.",
  ctaLabel: "Mulai berkolaborasi",
  ctaHref: "/register",
  secondaryLabel: "Lihat proyek riset",
  secondaryHref: "/research",
  note: "Untuk akademisi pemula — lintas disiplin — Indonesia",
};

export function Hero() {
  const staging = useOptionalStaging();
  const slide = useMemo(() => {
    const published = (staging?.heroSlides ?? [])
      .filter((s) => s.status === "Published")
      .sort((a, b) => a.order - b.order);
    return published[0] ?? null;
  }, [staging]);

  const c = slide ?? FALLBACK;

  return (
    <section className="cp-home-hero" aria-labelledby="home-hero-title">
      <div className="cp-home-hero__inner">
        <div className="cp-home-hero__copy">
          <p className="cp-home-hero__eyebrow">
            <span aria-hidden="true" /> {c.eyebrow}
          </p>
          <h1 id="home-hero-title" className="cp-home-hero__title">
            {c.title} <em>{c.titleAccent}</em>
          </h1>
          <p className="cp-home-hero__dek">{c.dek}</p>
          <div className="cp-home-hero__actions">
            {c.ctaLabel && (
              <Link href={c.ctaHref || "/register"} className="cp-btn cp-btn--solid cp-btn--lg">
                {c.ctaLabel} <span className="cp-btn__arrow" aria-hidden="true">→</span>
              </Link>
            )}
            {c.secondaryLabel && (
              <Link href={c.secondaryHref || "/research"} className="cp-home-hero__secondary">
                {c.secondaryLabel} <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
          {c.note && <p className="cp-home-hero__note">{c.note}</p>}
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
