"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    let particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const PARTICLE_COUNT = 55;
    const CONNECTION_DIST = 120;
    const MOUSE_DIST = 180;
    const mouse = { x: -9999, y: -9999 };
    let rafId = 0;

    function resize() {
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
      }));
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(233,113,28,0.55)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = 1 - dist / CONNECTION_DIST;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(233,113,28,${alpha * 0.25})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < MOUSE_DIST) {
          const alpha = 1 - md / MOUSE_DIST;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.15})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    function onMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    rafId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        borderRadius: "inherit",
      }}
    />
  );
}

const META = [
  { l: "Berdiri", v: "2026" },
  { l: "Markas", v: "Bandung, Jawa Barat" },
  { l: "Anggota", v: "1.240", accent: "+" },
  { l: "Email", v: "copublika@gmail.com" },
];

const MISSION_CHECKS = [
  "Mentor aktif yang masih menulis di jurnal Q1–Q3",
  "Klinik manuskrip mingguan dengan peer-review internal",
  "Komunitas tanpa ranking — semua belajar bersama",
];

const VALUES = [
  {
    n: "01",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: "Proses, bukan janji",
    desc: "Kami tidak menjual jaminan acceptance. Kami menjamin kerangka kerja, klinik mingguan, dan mentor yang hadir.",
  },
  {
    n: "02",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="10" r="2.5" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M14.5 16c1.5-1 3-1.5 4.5-1.5 1.5 0 3 .5 4 1.5" />
      </svg>
    ),
    title: "Kolaboratif, bukan kompetitif",
    desc: "Tidak ada ranking peserta. Sesama anggota didorong menjadi co-author dan saling memberi peer-review.",
  },
  {
    n: "03",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
    title: "Konsisten, bukan instan",
    desc: "Publikasi terindeks adalah maraton. Kami merancang ritme yang berkelanjutan — bukan sprint 30 hari yang melelahkan.",
  },
  {
    n: "04",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14z" />
        <path d="M4 19.5A2.5 2.5 0 016.5 22H20" />
      </svg>
    ),
    title: "Akademik, bukan transaksional",
    desc: "Mentor kami adalah peneliti aktif. Hubungan dengan peserta adalah hubungan akademik — bukan layanan pelanggan.",
  },
];

const TIMELINE = [
  {
    yr: "2026",
    mo: "Maret",
    stage: "Genesis",
    title: "Diskusi informal antar dosen muda",
    desc: "Lima dosen muda dari lima kampus berkumpul rutin untuk membaca draf manuskrip — tanpa nama, tanpa struktur.",
  },
  {
    yr: "2026",
    mo: "Juni",
    stage: "Berdiri",
    title: "CoPublika resmi berdiri",
    desc: "Cohort #1 dibuka dengan 18 peserta dari 11 kampus. 14 di antaranya berhasil publikasi dalam 9 bulan.",
  },
  {
    yr: "2026",
    mo: "September",
    stage: "Tumbuh",
    title: "Cluster riset diluncurkan",
    desc: "Forum mingguan, klinik manuskrip, dan 12 cluster lintas-disiplin mulai berjalan. Mentor aktif bertambah jadi 24.",
  },
  {
    yr: "2027",
    mo: "Sekarang",
    stage: "Hari ini",
    title: "1.240+ anggota, 318 publikasi",
    desc: "Cohort #07 mulai 15 September 2027. Kami terus tumbuh — bersama kampus dan akademisi dari seluruh Indonesia.",
  },
];

const TEAM = [
  { name: "Dr. Ade Putranto", role: "Founder", badge: "Founder", specialty: "EdTech · h-index 14", img: "8" },
  { name: "Dr. Maya Rahmawati", role: "Head of Programs", badge: "Head of Programs", specialty: "Public Health · Q2 Editor", img: "20" },
  { name: "Dr. Bayu Setiawan", role: "Lead Mentor", badge: "Lead Mentor", specialty: "Sustainability · Q1 Reviewer", img: "11" },
  { name: "Dr. Lina Kartika", role: "Lead Editor", badge: "Lead Editor", specialty: "Linguistics · TEFLIN", img: "44" },
  { name: "Fajar Ramadhan, Ph.D.", role: "Mentor", badge: "Mentor", specialty: "Engineering · AI", img: "12" },
  { name: "Dr. Dewi Nirmala", role: "Mentor", badge: "Mentor", specialty: "Sociology · Qualitative", img: "49" },
  { name: "Dr. Hadi Suryanto", role: "Mentor", badge: "Mentor", specialty: "Economics · Policy", img: "33" },
];

export default function AboutPage() {
  return (
    <main className="cp-about">
      <section className="cp-about__hero">
        <div className="cp-about__orb-a" aria-hidden="true" />
        <div className="cp-about__orb-b" aria-hidden="true" />
        <div className="cp-about__wrap">
          <div className="cp-about__hero-grid">
            <div className="cp-about__hero-left">
              <div className="cp-about__badge">
                <span className="cp-about__pulse" aria-hidden="true" />
                <span>Tentang CoPublika</span>
              </div>
              <h1 className="cp-about__h1">
                Bukan platform. <em>Sebuah komunitas</em> untuk akademisi pemula.
              </h1>
              <p className="cp-about__lead">
                Kami lahir dari pengamatan sederhana: akademisi pemula di Indonesia tidak kekurangan ide.
                Yang sering kurang adalah teman seperjuangan, mentor yang sabar, dan struktur yang konsisten.
              </p>
              <div className="cp-about__meta">
                {META.map((m) => (
                  <div key={m.l} className="cp-about__meta-item">
                    <span className="cp-about__meta-l">{m.l}</span>
                    <span className="cp-about__meta-v">
                      {m.v}
                      {m.accent ? <span className="cp-about__meta-accent">{m.accent}</span> : null}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="cp-about__visual" aria-hidden="true">
              <HeroCanvas />
              <div className="cp-about__ring" />
              <div className="cp-about__ring cp-about__ring--2" />
              <div className="cp-about__float-card cp-about__float-card--1">
                <span className="cp-about__float-num">47</span>
                <span className="cp-about__float-lbl">Mentor</span>
              </div>
              <div className="cp-about__float-card cp-about__float-card--2">
                <span className="cp-about__float-num">318</span>
                <span className="cp-about__float-lbl">Publikasi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cp-about__mission">
        <div className="cp-about__wrap">
          <div className="cp-about__mission-grid">
            <div className="cp-about__mission-card">
              <div className="cp-about__mission-label">
                <span className="cp-about__mission-dot" />
                <span>Misi Kami</span>
              </div>
              <svg className="cp-about__quote-icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 7H5C5 4.5 6 3 8 3l1-2C6 1 3 4 3 8v8h6V7zm10 0h-4c0-2.5 1-4 3-4l1-2c-3 0-6 3-6 7v8h6V7z" />
              </svg>
              <h2 className="cp-about__mission-h">
                Mendampingi akademisi pemula menemukan suara akademiknya — dan menerbitkannya di jurnal yang dihormati.
              </h2>
              <p className="cp-about__mission-p">
                Kami percaya bahwa publikasi internasional adalah keterampilan yang bisa dipelajari, bukan bakat yang diwariskan.
              </p>
            </div>
            <div className="cp-about__mission-side">
              <h3 className="cp-about__mission-side-h">
                Setiap akademisi berhak punya{" "}
                <span className="cp-about__accent">ruang aman</span>{" "}
                untuk gagal dan belajar.
              </h3>
              <p className="cp-about__mission-side-sub">
                Akses ke mentor berpengalaman, struktur kerja yang jelas, dan teman seperjuangan — hal yang dulu hanya dimiliki segelintir kampus elit.
              </p>
              <div className="cp-about__checks">
                {MISSION_CHECKS.map((c) => (
                  <div key={c} className="cp-about__check">
                    <span className="cp-about__check-ico">&#10003;</span>
                    <span className="cp-about__check-txt">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cp-about__values">
        <div className="cp-about__wrap">
          <div className="cp-about__values-head">
            <div className="cp-about__values-tag">
              <span className="cp-about__values-num">/ 02</span>
              <span>Nilai Inti</span>
            </div>
            <h2 className="cp-about__values-h">Empat prinsip yang kami pegang.</h2>
            <p className="cp-about__values-sub">
              Apa yang membedakan komunitas kami dari platform pembelajaran lainnya.
            </p>
          </div>
          <div className="cp-about__values-bento">
            {VALUES.map((v) => (
              <div key={v.n} className="cp-about__value-card">
                <span className="cp-about__value-num">/ {v.n}</span>
                <div className="cp-about__value-icon">{v.icon}</div>
                <h4 className="cp-about__value-title">{v.title}</h4>
                <p className="cp-about__value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cp-about__quote">
        <div className="cp-about__wrap">
          <div className="cp-about__quote-inner">
            <svg className="cp-about__quote-mark" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 7H5C5 4.5 6 3 8 3l1-2C6 1 3 4 3 8v8h6V7zm10 0h-4c0-2.5 1-4 3-4l1-2c-3 0-6 3-6 7v8h6V7z" />
            </svg>
            <blockquote className="cp-about__quote-text">
              Publikasi internasional bukan ujian akhir.{" "}
              <span className="cp-about__quote-accent">Ia adalah percakapan</span>{" "}
              — dan setiap percakapan butuh teman.
            </blockquote>
            <div className="cp-about__quote-attr">
              <span className="cp-about__quote-av">CP</span>
              <div>
                <div className="cp-about__quote-who">Tim Pendiri CoPublika</div>
                <div className="cp-about__quote-role">Bandung &middot; 2026</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cp-about__timeline">
        <div className="cp-about__wrap">
          <div className="cp-about__timeline-head">
            <div className="cp-about__timeline-tag">
              <span className="cp-about__timeline-tag-num">/ 03</span>
              <span>Perjalanan</span>
            </div>
            <h2 className="cp-about__timeline-h">Singkat, tapi berarti.</h2>
          </div>
          <div className="cp-about__timeline-track">
            {TIMELINE.map((t) => (
              <div key={t.yr + t.stage} className="cp-about__tl-step">
                <div className="cp-about__tl-dot" aria-hidden="true" />
                <div className="cp-about__tl-yr">{t.yr}</div>
                <div className="cp-about__tl-mo">{t.mo}</div>
                <div className="cp-about__tl-stage">{t.stage}</div>
                <h4 className="cp-about__tl-title">{t.title}</h4>
                <p className="cp-about__tl-desc">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cp-about__team">
        <div className="cp-about__wrap">
          <div className="cp-about__team-head">
            <div className="cp-about__team-tag">
              <span className="cp-about__team-tag-num">/ 04</span>
              <span>Tim &amp; Mentor</span>
            </div>
            <h2 className="cp-about__team-h">
              Peneliti aktif. Editor jurnal. Co-author yang sabar.
            </h2>
            <p className="cp-about__team-sub">
              Mentor inti kami punya rekam jejak publikasi di jurnal Q1–Q3 dan pengalaman menjadi reviewer.
            </p>
          </div>
          <div className="cp-about__team-grid">
            {TEAM.map((m) => (
              <div key={m.name} className="cp-about__member-card">
                <div className="cp-about__member-ph">
                  <Image src={`https://i.pravatar.cc/400?img=${m.img}`} alt="" fill className="object-cover" />
                  <span className="cp-about__member-badge">{m.badge}</span>
                </div>
                <div className="cp-about__member-info">
                  <div className="cp-about__member-name">{m.name}</div>
                  <div className="cp-about__member-role">{m.specialty}</div>
                </div>
              </div>
            ))}
            <div className="cp-about__member-card cp-about__member-card--more">
              <div className="cp-about__member-ph cp-about__member-ph--more">+</div>
              <div className="cp-about__member-info">
                <div className="cp-about__member-name">40+ Mentor lainnya</div>
                <div className="cp-about__member-role">Lintas 15 bidang</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cp-cta-final">
        <div className="cp-cta-final__grid" aria-hidden="true" />
        <div className="cp-cta-final__orbit" aria-hidden="true" />
        <div className="cp-cta-final__wrap">
          <div className="cp-cta-badge">
            <span className="cp-cta-badge__pulse" aria-hidden="true" />
            <span>Cohort #07 dibuka &middot; 24 kursi tersisa</span>
          </div>
          <h2 className="cp-cta-final__h">
            Mau jadi bagian dari <em>cerita ini</em>?
          </h2>
          <p className="cp-cta-final__p">
            Pendaftaran terbuka untuk akademisi pemula dari kampus manapun di Indonesia. Tidak perlu menunggu siap.
          </p>
          <div className="cp-cta-final__group">
            <Link href="/register" className="cp-cta-final__btn cp-cta-final__btn--accent">
              Gabung Komunitas
              <span className="cp-cta-final__arr">&#8594;</span>
            </Link>
            <Link href="/contact" className="cp-cta-final__btn cp-cta-final__btn--line">
              Hubungi Kami
            </Link>
          </div>
          <div className="cp-cta-trust">
            <span className="cp-cta-trust__cell">
              <span className="cp-cta-trust__v">
                1.240<span className="cp-cta-trust__accent">+</span>
              </span>
              <span className="cp-cta-trust__l">Anggota</span>
              <span className="cp-cta-trust__div" aria-hidden="true" />
            </span>
            <span className="cp-cta-trust__cell">
              <span className="cp-cta-trust__v">318</span>
              <span className="cp-cta-trust__l">Publikasi</span>
              <span className="cp-cta-trust__div" aria-hidden="true" />
            </span>
            <span className="cp-cta-trust__cell">
              <span className="cp-cta-trust__v">47</span>
              <span className="cp-cta-trust__l">Mentor</span>
              <span className="cp-cta-trust__div" aria-hidden="true" />
            </span>
            <span className="cp-cta-trust__cell">
              <span className="cp-cta-trust__v">
                76<span className="cp-cta-trust__accent">%</span>
              </span>
              <span className="cp-cta-trust__l">Tingkat Akseptasi</span>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
