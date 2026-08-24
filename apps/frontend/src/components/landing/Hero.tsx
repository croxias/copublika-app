"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SLIDE_MS = 6000;

type Slide = {
  id: string;
  kicker: string;
  title: React.ReactNode;
  sub: string;
  cta: { label: string; href: string };
  alt: { label: string; href: string };
};

const SLIDES: Slide[] = [
  {
    id: "community",
    kicker: "01 — Komunitas",
    title: (
      <>
        Tidak perlu menunggu <em>siap</em>. Mulai dari sini.
      </>
    ),
    sub:
      "Bergabunglah dengan 1.240+ akademisi pemula yang sedang membangun rekam jejak publikasi mereka — bersama.",
    cta: { label: "Gabung Komunitas", href: "/register" },
    alt: { label: "Sudah punya akun?", href: "/login" },
  },
  {
    id: "about",
    kicker: "02 — Tentang Kami",
    title: (
      <>
        Bukan platform. <em>Sebuah komunitas.</em>
      </>
    ),
    sub:
      "Kami lahir dari pengamatan sederhana: akademisi pemula tidak kurang ide. Yang sering kurang adalah teman seperjuangan dan mentor yang sabar.",
    cta: { label: "Pelajari Kami", href: "/about" },
    alt: { label: "Empat nilai kami", href: "/about#values" },
  },
  {
    id: "research",
    kicker: "03 — Riset",
    title: (
      <>
        24 cluster. <span className="cp-hx-accent">Lintas disiplin.</span>
      </>
    ),
    sub:
      "Pendidikan, kesehatan, lingkungan, AI, kebijakan publik, dan 19 bidang lainnya. Temukan co-author yang sefrekuensi.",
    cta: { label: "Lihat Research Project", href: "/research" },
    alt: { label: "318 publikasi alumni", href: "/research" },
  },
  {
    id: "event",
    kicker: "04 — Acara",
    title: (
      <>
        Klinik, webinar, <em>forum doctoral.</em>
      </>
    ),
    sub:
      "Setiap minggu kami berkumpul — daring maupun luring — untuk membedah naskah, mendengarkan editor, dan menulis bersama.",
    cta: { label: "Lihat Agenda", href: "/event" },
    alt: { label: "6 acara bulan ini", href: "/event" },
  },
];

const RESEARCH_BARS = [
  { label: "Scopus Q1", width: 35, num: "42" },
  { label: "Scopus Q2", width: 70, num: "87" },
  { label: "Scopus Q3", width: 92, num: "112" },
  { label: "Sinta 1–2", width: 63, num: "77" },
];

function MembersCard() {
  return (
    <div className="cp-hx-card__inner">
      <div className="cp-hx-card__top">
        <span className="cp-hx-card__tag">LIVE COMMUNITY</span>
        <span className="cp-hx-card__num">01 / 04</span>
      </div>
      <div className="cp-hx-members">
        <div className="cp-hx-av-stack">
          <span className="cp-hx-av" style={{ backgroundImage: "url('https://i.pravatar.cc/80?img=12')" }} />
          <span className="cp-hx-av" style={{ backgroundImage: "url('https://i.pravatar.cc/80?img=32')" }} />
          <span className="cp-hx-av" style={{ backgroundImage: "url('https://i.pravatar.cc/80?img=47')" }} />
          <span className="cp-hx-av" style={{ backgroundImage: "url('https://i.pravatar.cc/80?img=23')" }} />
          <span className="cp-hx-av cp-hx-av--more">+1.2k</span>
        </div>
        <div className="cp-hx-members__meta">
          <strong>1.240+</strong>
          <span>anggota aktif</span>
        </div>
      </div>
      <div className="cp-hx-activity">
        <div className="cp-hx-activity__row">
          <span className="cp-hx-av-mini" style={{ backgroundImage: "url('https://i.pravatar.cc/40?img=15')" }} />
          <span><strong>Rini P.</strong> bergabung ke cluster <span className="cp-hx-tag-accent">EdTech</span></span>
        </div>
        <div className="cp-hx-activity__row">
          <span className="cp-hx-av-mini" style={{ backgroundImage: "url('https://i.pravatar.cc/40?img=33')" }} />
          <span><strong>dr. Andika H.</strong> submit naskah ke <span className="cp-hx-tag-accent">Scopus Q2</span></span>
        </div>
        <div className="cp-hx-activity__row">
          <span className="cp-hx-av-mini" style={{ backgroundImage: "url('https://i.pravatar.cc/40?img=51')" }} />
          <span><strong>Siti N.</strong> diterima di <span className="cp-hx-tag-accent">Sustainability Q1</span></span>
        </div>
      </div>
    </div>
  );
}

function AboutCard() {
  return (
    <div className="cp-hx-card__inner">
      <div className="cp-hx-card__top">
        <span className="cp-hx-card__tag">OUR DNA</span>
        <span className="cp-hx-card__num">02 / 04</span>
      </div>
      <div className="cp-hx-about">
        <div className="cp-hx-about__stat cp-hx-about__stat--tall">
          <span className="cp-hx-about__l">Berdiri di</span>
          <span className="cp-hx-about__v">2024<span className="cp-hx-accent">.</span></span>
        </div>
        <div className="cp-hx-about__stat">
          <span className="cp-hx-about__l">Mentor</span>
          <span className="cp-hx-about__v">47</span>
        </div>
        <div className="cp-hx-about__stat">
          <span className="cp-hx-about__l">Kampus mitra</span>
          <span className="cp-hx-about__v">12</span>
        </div>
      </div>
      <div className="cp-hx-about__foot">
        Yogyakarta, Indonesia · 4 nilai inti yang membentuk semua yang kami lakukan.
      </div>
    </div>
  );
}

function ResearchCard({ active }: { active: boolean }) {
  return (
    <div className="cp-hx-card__inner">
      <div className="cp-hx-card__top">
        <span className="cp-hx-card__tag">PUBLICATION INDEX</span>
        <span className="cp-hx-card__num">03 / 04</span>
      </div>
      <div className="cp-hx-chart">
        {RESEARCH_BARS.map((b) => (
          <div key={b.label} className="cp-hx-chart__row">
            <span className="cp-hx-chart__label">{b.label}</span>
            <span className="cp-hx-chart__track">
              <span
                className="cp-hx-chart__fill"
                style={{ width: active ? `${b.width}%` : "0%" }}
              />
            </span>
            <span className="cp-hx-chart__num">{b.num}</span>
          </div>
        ))}
      </div>
      <div className="cp-hx-chart__foot">
        <span>TOTAL · 2024</span>
        <span className="cp-hx-chart__total">318</span>
      </div>
    </div>
  );
}

function EventCard() {
  return (
    <div className="cp-hx-card__inner">
      <div className="cp-hx-card__top">
        <span className="cp-hx-card__tag">NEXT UP</span>
        <span className="cp-hx-card__num">04 / 04</span>
      </div>
      <div className="cp-hx-event">
        <div className="cp-hx-event__date">
          <div className="cp-hx-event__d">12</div>
          <div className="cp-hx-event__m">JUN</div>
        </div>
        <div className="cp-hx-event__info">
          <h5>Klinik Manuskrip: Membedah Reviewer Comments</h5>
          <div className="cp-hx-event__meta">Dr. Aulia · Zoom · 19.30 WIB</div>
        </div>
      </div>
      <div className="cp-hx-event__list">
        <div className="cp-hx-event__row">
          <span className="cp-hx-event__dd">24 Jun</span>
          <span className="cp-hx-event__tt">Editor Roundtable Q1–Q2</span>
          <span className="cp-hx-event__type">Webinar</span>
        </div>
        <div className="cp-hx-event__row">
          <span className="cp-hx-event__dd">08 Jul</span>
          <span className="cp-hx-event__tt">Workshop Academic Writing</span>
          <span className="cp-hx-event__type">Luring</span>
        </div>
        <div className="cp-hx-event__row">
          <span className="cp-hx-event__dd">22 Jul</span>
          <span className="cp-hx-event__tt">Doctoral Forum</span>
          <span className="cp-hx-event__type">Hybrid</span>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [paused]);

  const go = (n: number) => setIdx(((n % SLIDES.length) + SLIDES.length) % SLIDES.length);

  return (
    <section
      className="cp-hx"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Animated background layers */}
      <div className="cp-hx-bg" aria-hidden="true">
        <div className="cp-hx-bg__orb cp-hx-bg__orb--a" />
        <div className="cp-hx-bg__orb cp-hx-bg__orb--b" />
        <div className="cp-hx-bg__dots" />
        <div className="cp-hx-bg__scan" />
        <div className="cp-hx-bg__vignette" />
      </div>

      <div className="cp-hx-inner">
        {/* Top strip */}
        <div className="cp-hx-top">
          <div className="cp-hx-eyebrow">
            <span className="cp-hx-pulse" />
            <span>Komunitas Akademisi Pemula</span>
            <span className="cp-hx-eyebrow__div" />
            <span className="cp-hx-eyebrow__num">EST. 2024</span>
          </div>
          <div className="cp-hx-meta-top">
            <span className="cp-hx-live">Cohort #07 dibuka</span>
            <span>·</span>
            <span>24 kursi tersisa</span>
          </div>
        </div>

        {/* Stage: rotating headline + synced card */}
        <div className="cp-hx-stage">
          <div className="cp-hx-head">
            {SLIDES.map((s, i) => (
              <div
                key={s.id}
                className={`cp-hx-slide ${i === idx ? "is-active" : ""}`}
                aria-hidden={i !== idx}
              >
                <span className="cp-hx-kicker">{s.kicker}</span>
                <h1 className="cp-hx-title">{s.title}</h1>
                <p className="cp-hx-sub">{s.sub}</p>
                <div className="cp-hx-ctas">
                  <Link href={s.cta.href} className="cp-hx-btn cp-hx-btn--primary">
                    <span>{s.cta.label}</span>
                    <span className="cp-hx-btn__arr">→</span>
                  </Link>
                  <Link href={s.alt.href} className="cp-hx-btn cp-hx-btn--text">
                    {s.alt.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="cp-hx-side">
            <div className={`cp-hx-card ${idx === 0 ? "is-active" : ""}`}><MembersCard /></div>
            <div className={`cp-hx-card ${idx === 1 ? "is-active" : ""}`}><AboutCard /></div>
            <div className={`cp-hx-card ${idx === 2 ? "is-active" : ""}`}><ResearchCard active={idx === 2} /></div>
            <div className={`cp-hx-card ${idx === 3 ? "is-active" : ""}`}><EventCard /></div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="cp-hx-bottom">
          <div className="cp-hx-dots">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                className={`cp-hx-dot ${i === idx ? "is-active" : ""}`}
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1}`}
              >
                <svg viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16.7" />
                </svg>
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
          <div className="cp-hx-cue" aria-hidden="true">
            <span>Gulir untuk eksplor</span>
            <span className="cp-hx-cue__line" />
          </div>
          <div className="cp-hx-arrows">
            <button className="cp-hx-arrow" onClick={() => go(idx - 1)} aria-label="Previous">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="cp-hx-arrow" onClick={() => go(idx + 1)} aria-label="Next">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
