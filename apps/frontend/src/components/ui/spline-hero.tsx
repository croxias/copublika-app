"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Spline opsional — fallback mewah tanpa dependensi.
// Jika mau 3D beneran: `pnpm add @splinetool/react-spline` lalu ganti SplineLazy ke dynamic import.
// Fallback ini sudah mewah (gradient + orbs) dan tidak bikin build 500.
function SplineFallback() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(520px 420px at 22% 18%, rgba(233,113,28,0.22), transparent 60%), radial-gradient(560px 480px at 82% 72%, rgba(120,90,255,0.18), transparent 60%), linear-gradient(180deg, #0a0a0a 0%, #111827 100%)",
      }}
    />
  );
}
const SplineLazy = dynamic(() => Promise.resolve(SplineFallback as unknown as React.ComponentType<{ scene: string; style?: React.CSSProperties }>), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%", background: "#06070a" }} />,
});

function SplineBackground() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        pointerEvents: "auto",
        overflow: "hidden",
        background: "#06070a",
      }}
    >
      <SplineLazy
        style={{ width: "100%", height: "100vh", pointerEvents: "auto", display: "block" }}
        scene="https://prod.spline.design/dJqTIQ-tE3ULUPMi/scene.splinecode"
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to right, rgba(0,0,0,0.72), transparent 28%, transparent 72%, rgba(0,0,0,0.72)), linear-gradient(to bottom, transparent 48%, rgba(0,0,0,0.88))`,
          pointerEvents: "none",
        }}
      />
      {/* Scopus glow — CoPublika signature */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: "42%",
          width: 560,
          height: 560,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(233,113,28,0.14), transparent 68%)",
          filter: "blur(2px)",
          pointerEvents: "none",
          borderRadius: 9999,
        }}
      />
    </div>
  );
}

function ScreenshotPreview({ innerRef }: { innerRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <section className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 mt-10 md:mt-12">
      <div
        ref={innerRef}
        className="bg-white rounded-2xl overflow-hidden shadow-[0_28px_80px_-24px_rgba(0,0,0,0.55)] border border-black/10 w-full md:w-[84%] lg:w-[72%] mx-auto"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop&q=80"
          alt="Preview dashboard CoPublika — Batch, Event, dan progres publikasi"
          className="w-full h-auto block"
          loading="lazy"
        />
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-black/[0.06] bg-[#fcfcfa]">
          <span className="text-xs font-semibold tracking-wide text-black/60">Preview · Batch #07 — Ongoing</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E9711C] px-3 py-1 text-xs font-bold text-white">Live cohort</span>
        </div>
      </div>
    </section>
  );
}

function SplineHeroContent() {
  return (
    <div className="text-white px-4 max-w-screen-xl mx-auto w-full flex flex-col lg:flex-row justify-between items-start lg:items-center py-16 gap-10">
      <div className="w-full lg:w-[54%]">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur text-xs font-semibold tracking-[0.08em]">
          <span className="size-2 rounded-full bg-[#E9711C] shadow-[0_0_0_4px_rgba(233,113,28,0.25)]" />
          BOOTCAMP · SIAP TEMBUS SCOPUS
        </div>
        <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[3.6rem] font-black leading-[0.9] tracking-[-0.04em] text-white">
          12 Minggu.
          <br />
          <span className="text-[#E9711C]">Ide → Submit.</span>
          <br />
          Sampai Scopus.
        </h1>
        <div className="mt-3 text-sm font-semibold tracking-[0.14em] text-white/60">KURASI · KLINIK MANUSKRIP · PEER REVIEW · SUBMISSION</div>
        <p className="mt-5 text-[15px] leading-relaxed text-white/75 max-w-[52ch]">
          Bootcamp terstruktur untuk dosen & peneliti. Cohort kecil, mentor Q1–Q3, dan sistem Batch terkurasi — bukan kelas massal. Kuota 24 kursi per cohort.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-white px-3 py-1.5 font-bold text-black">Hybrid · 12 minggu</span>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-semibold text-white">Mentor 1:6</span>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-semibold text-white">Klinik tiap pekan</span>
        </div>
      </div>

      <div className="w-full lg:w-[46%] lg:pl-8 flex flex-col items-start">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur w-full max-w-md">
          <div className="text-xs font-bold tracking-[0.08em] text-white/70">COHORT #07 — PENDAFTARAN DIBUKA</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">24</span>
            <span className="text-white/60">/ 60 kursi tersisa</span>
            <span className="ml-auto rounded-full bg-[#E9711C] px-2.5 py-1 text-xs font-bold text-white">40% terisi</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/15 overflow-hidden">
            <div className="h-full w-[40%] rounded-full bg-[#E9711C]" />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-white/65">Batch tertutup otomatis saat kuota penuh. Verifikasi 10 hari kerja — lolos → Member & akses LMS penuh.</p>
        </div>
        <div className="mt-5 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/join-batch"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black transition hover:bg-[#E9711C] hover:text-white"
          >
            Daftar Cohort #07
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/siap-tembus-scopus#kurikulum"
            className="inline-flex items-center justify-center rounded-full border border-white/25 bg-transparent px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
          >
            Lihat kurikulum
          </Link>
        </div>
      </div>
    </div>
  );
}

function SplineNavbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-20"
      style={{
        backgroundColor: "rgba(10,10,14,0.42)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="container mx-auto px-4 py-3.5 md:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.png" alt="CoPublika" className="h-7 w-auto object-contain" />
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/research" className="text-white/70 hover:text-white transition">
            Riset
          </Link>
          <Link href="/event" className="text-white/70 hover:text-white transition">
            Event
          </Link>
          <Link href="/siap-tembus-scopus" className="text-white hover:text-white font-semibold">
            Siap Tembus Scopus
          </Link>
        </div>
        <Link
          href="/join-batch"
          className="rounded-full border border-white/20 bg-white px-5 py-2 text-sm font-bold text-black transition hover:bg-[#E9711C] hover:text-white hover:border-[#E9711C]"
        >
          Join Batch
        </Link>
      </div>
    </nav>
  );
}

export function SplineHero({ withNavbar = false }: { withNavbar?: boolean }) {
  const screenshotRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!screenshotRef.current || !heroContentRef.current) return;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (screenshotRef.current) screenshotRef.current.style.transform = `translateY(-${y * 0.42}px)`;
        const op = 1 - Math.min(y / 420, 1);
        if (heroContentRef.current) {
          heroContentRef.current.style.opacity = String(op);
          heroContentRef.current.style.transform = `translateY(${y * 0.12}px)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative bg-black">
      {withNavbar && <SplineNavbar />}
      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0">
          <SplineBackground />
        </div>
        <div
          ref={heroContentRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            pointerEvents: "none",
            paddingTop: 72,
          }}
        >
          <div style={{ pointerEvents: "auto", width: "100%" }}>
            <SplineHeroContent />
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-black" style={{ marginTop: "-8vh" }}>
        <ScreenshotPreview innerRef={screenshotRef} />
        <div className="container mx-auto px-4 py-10 text-white/60 text-center text-sm">
          Scroll untuk melihat dashboard preview — Batch, Verifikasi Pendaftar, dan progres Scopus dalam satu alur.
        </div>
      </div>
    </div>
  );
}

export default SplineHero;
