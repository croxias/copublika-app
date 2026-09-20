"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────
   CoPublika Quordix Hero — adapted from Quordix
   • Light palette #F8FAFC = var(--paper)
   • Accent #E9711C = var(--scopus)
   • Space Grotesk kept, but text is CoPublika
   • Navbar is OPT-IN (public layout already has cp-navx)
   • Background is absolute inside shell, not fixed
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;900&display=swap');

  .qhero-shell,
  .qhero-shell *,
  .qhero-shell *::before,
  .qhero-shell *::after { box-sizing: border-box; }

  .qhero-shell {
    font-family: 'Space Grotesk', var(--sans), sans-serif;
    color-scheme: light;
    background: #F8FAFC;
    color: #0f172a;
    position: relative;
    overflow: hidden;
  }

  /* ── Optional pill navbar (only when withNavbar) ── */
  .qhero-nav-wrap {
    position: absolute;
    top: 16px; left: 0; right: 0;
    z-index: 40;
    display: flex; justify-content: center;
    padding: 0 16px;
    pointer-events: none;
  }
  .qhero-nav-pill {
    width: 100%; max-width: 56rem;
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(233,113,28,0.18);
    border-radius: 9999px;
    box-shadow: 0 8px 32px rgba(233,113,28,0.08);
    padding: 8px 20px;
    display: flex; align-items: center; justify-content: space-between;
    pointer-events: auto;
  }
  .qhero-logo-mark {
    width: auto; height: 28px; display: block; object-fit: contain;
  }
  .qhero-nav-links { display:flex; align-items:center; gap:1.75rem; list-style:none; margin:0; padding:0; }
  .qhero-nav-link { font-size:0.875rem; font-weight:500; color:#475569; text-decoration:none; transition: color 150ms; }
  .qhero-nav-link:hover { color:#E9711C; }
  .qhero-nav-cta {
    display:inline-flex; align-items:center; padding:8px 18px;
    font-size:0.75rem; font-weight:700; color:#fff; background:#0f172a;
    border-radius:9999px; text-decoration:none; transition: background 150ms;
  }
  .qhero-nav-cta:hover { background:#E9711C; }
  .qhero-hamburger { display:none; background:none; border:none; cursor:pointer; flex-direction:column; gap:5px; padding:4px; }
  .qhero-hamburger span { display:block; width:22px; height:2px; background:currentColor; border-radius:2px; transition: transform 200ms, opacity 200ms; }
  .qhero-mobile-overlay {
    position:absolute; inset:0; z-index:35; background:rgba(255,255,255,0.97);
    backdrop-filter: blur(16px); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.75rem;
    opacity:0; pointer-events:none; transition: opacity 200ms;
  }
  .qhero-mobile-overlay.open { opacity:1; pointer-events:auto; }
  .qhero-mobile-link { font-size:1.5rem; font-weight:700; color:#0f172a; text-decoration:none; }
  .qhero-mobile-link:hover { color:#E9711C; }
  @media (max-width: 767px) {
    .qhero-nav-links, .qhero-nav-cta { display:none; }
    .qhero-hamburger { display:flex; }
  }

  /* ── Glitch on BERARTI ── */
  .qhero-glitch {
    position:relative; display:inline-block; font-weight:900; color:#0f172a;
    animation: qhero-color-toggle 7s infinite step-end;
  }
  .qhero-glitch::before, .qhero-glitch::after {
    content: attr(data-text); position:absolute; inset:0; width:100%; height:100%;
    opacity:0; background:#F8FAFC;
  }
  .qhero-glitch::before { animation: qhero-glitch-1 7s infinite linear; z-index:2; }
  .qhero-glitch::after  { animation: qhero-glitch-2 7s infinite linear; z-index:3; }
  @keyframes qhero-color-toggle {
    0%,44% { color:#0f172a; text-shadow:none; }
    42.1%,44.9% { text-shadow:-2px 0 #00ffff, 2px 0 #ff00ff; }
    45%,94% { color:#E9711C; text-shadow:none; }
    92.1%,94.9% { text-shadow:-2px 0 #a3e635, 2px 0 #ef4444; }
    95%,100% { color:#0f172a; text-shadow:none; }
  }
  @keyframes qhero-glitch-1 {
    0%,42% { opacity:0; transform:translate(0); }
    42.1% { opacity:1; color:#00ffff; clip-path:polygon(0 0,100% 0,100% 45%,0 45%); transform:translate(-10px,-5px) skew(20deg); }
    43% { color:#ff00ff; transform:translate(10px,5px) skew(-20deg); clip-path:polygon(0 10%,100% 0,100% 30%,0 35%); }
    44% { color:#E9711C; transform:translate(-10px,5px); clip-path:polygon(0 40%,100% 50%,100% 80%,0 90%); }
    44.9% { opacity:1; } 45% { opacity:0; } 45.1%,92% { opacity:0; transform:translate(0); }
    92.1% { opacity:1; color:#00ffff; clip-path:polygon(0 60%,100% 55%,100% 100%,0 100%); transform:translate(10px,-5px) skew(10deg); }
    93% { color:#ff00ff; transform:translate(-5px,5px) skew(-10deg); clip-path:polygon(0 20%,100% 20%,100% 100%,0 80%); }
    94.9% { opacity:1; } 95% { opacity:0; }
  }
  @keyframes qhero-glitch-2 {
    0%,42% { opacity:0; transform:translate(0); }
    42.1% { opacity:1; color:#a3e635; clip-path:polygon(0 55%,100% 55%,100% 100%,0 100%); transform:translate(10px,5px); }
    43% { color:#ef4444; transform:translate(-10px,-5px) skew(10deg); clip-path:polygon(0 20%,100% 20%,100% 100%,0 80%); }
    45% { opacity:0; } 45.1%,92% { opacity:0; transform:translate(0); }
    92.1% { opacity:1; color:#a3e635; clip-path:polygon(0 0,100% 0,100% 45%,0 45%); transform:translate(-10px,-5px); }
    93% { color:#ef4444; transform:translate(10px,5px) skew(-20deg); clip-path:polygon(0 10%,100% 0,100% 30%,0 35%); }
    95% { opacity:0; }
  }
  @keyframes qhero-pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
  .qhero-tagline-pulse { animation: qhero-pulse 2s ease-in-out infinite; }
  .qhero-btn {
    display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:9999px;
    background:#E9711C; color:#fff; font-weight:700; font-size:1rem; border:none; cursor:pointer;
    text-decoration:none; font-family:'Space Grotesk',sans-serif;
    transition: background 150ms, transform 150ms, box-shadow 150ms;
    box-shadow: 0 10px 30px rgba(233,113,28,0.22);
  }
  .qhero-btn:hover { background:#C25A12; transform: translateY(-1px); box-shadow: 0 14px 34px rgba(233,113,28,0.32); }
  .qhero-btn--ghost {
    background:#fff; color:#0f172a; border:1px solid rgba(15,23,42,0.12); box-shadow:none;
  }
  .qhero-btn--ghost:hover { background:#0f172a; color:#fff; border-color:#0f172a; }
  .qhero-btn svg { transition: transform 150ms; }
  .qhero-btn:hover svg { transform: translateX(3px); }
`;

function CoPublikaMark() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo-black.png" alt="CoPublika" className="qhero-logo-mark" />
  );
}

const NAV_LINKS = [
  { label: "Riset", href: "/research" },
  { label: "Program", href: "/siap-tembus-scopus" },
  { label: "Event", href: "/event" },
  { label: "Batch", href: "/join-batch" },
] as const;

function QuordixNavbarInline({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <>
      <header className="qhero-nav-wrap">
        <div className="qhero-nav-pill">
          <Link href="/" style={{ display: "block" }}>
            <CoPublikaMark />
          </Link>
          <nav aria-label="Primary">
            <ul className="qhero-nav-links">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="qhero-nav-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/join-batch" className="qhero-nav-cta">
              Join Batch
            </Link>
            <button className="qhero-hamburger" onClick={() => setOpen(!open)} aria-label={open ? "Close" : "Open"} aria-expanded={open}>
              <span style={{ transform: open ? "rotate(45deg) translateY(7px)" : "none" }} />
              <span style={{ opacity: open ? 0 : 1 }} />
              <span style={{ transform: open ? "rotate(-45deg) translateY(-7px)" : "none" }} />
            </button>
          </div>
        </div>
      </header>
      <div className={`qhero-mobile-overlay${open ? " open" : ""}`} role="dialog" aria-modal="true">
        {NAV_LINKS.map((l) => (
          <Link key={l.label} href={l.href} className="qhero-mobile-link" onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link href="/join-batch" className="qhero-btn" onClick={() => setOpen(false)}>
          Join Batch
        </Link>
      </div>
    </>
  );
}

function DotGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let mouseX = -1000, mouseY = -1000;
    let isMobile = false;
    const SPACING = 30, BASE_R = 1.5, HOVER_R = 110, SCAN_DUR = 2600, SCAN_PAUSE = 3800;
    const DEFAULT_COLOR = "rgba(148,163,184,0.38)";
    const ACTIVE_COLOR = "#E9711C";

    class Particle {
      x = 0; y = 0; vx = 0; vy = 0; size = 0;
      constructor(w: number, h: number) { this.reset(w, h); }
      reset(w: number, h: number) {
        this.x = Math.random() * w; this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.45; this.vy = (Math.random() - 0.5) * 0.45;
        this.size = Math.random() * 1.6 + 0.4;
      }
      update(w: number, h: number) {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }
      draw(c: CanvasRenderingContext2D) {
        c.beginPath(); c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = "rgba(233,113,28,0.13)"; c.fill();
      }
    }
    const particles: Particle[] = [];
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect ? rect.width : window.innerWidth;
      canvas.height = rect ? rect.height : 760;
      isMobile = window.innerWidth < 768;
      particles.length = 0;
      const n = isMobile ? 14 : 36;
      for (let i = 0; i < n; i++) particles.push(new Particle(canvas.width, canvas.height));
    };
    const onMove = (e: MouseEvent) => {
      if (isMobile) return;
      const r = canvas.getBoundingClientRect();
      mouseX = e.clientX - r.left; mouseY = e.clientY - r.top;
    };
    const onLeave = () => { mouseX = -1000; mouseY = -1000; };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.update(canvas.width, canvas.height); p.draw(ctx); });
      const loop = performance.now() % (SCAN_DUR + SCAN_PAUSE);
      const scanY = isMobile ? (Math.min(loop / SCAN_DUR, 1)) * (canvas.height + HOVER_R * 2) - HOVER_R : 0;
      for (let x = 0; x < canvas.width; x += SPACING) {
        for (let y = 0; y < canvas.height; y += SPACING) {
          const dist = isMobile ? Math.abs(y - scanY) : Math.hypot(x - mouseX, y - mouseY);
          if (dist < HOVER_R) {
            const s = 1 - dist / HOVER_R;
            ctx.fillStyle = ACTIVE_COLOR;
            ctx.shadowBlur = isMobile ? 0 : 14; ctx.shadowColor = isMobile ? "transparent" : "rgba(233,113,28,0.35)";
            ctx.beginPath(); ctx.arc(x, y, BASE_R + s * (isMobile ? 1.8 : 2.8), 0, Math.PI * 2); ctx.fill();
          } else {
            ctx.fillStyle = DEFAULT_COLOR; ctx.shadowBlur = 0;
            ctx.beginPath(); ctx.arc(x, y, BASE_R, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    resize(); draw();
    return () => {
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "#F8FAFC", overflow: "hidden",
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
      <div style={{ position: "absolute", top: "-18%", left: "-10%", width: "46%", height: "44%", background: "rgba(203,213,225,0.38)", filter: "blur(110px)", borderRadius: 9999 }} />
      <div style={{ position: "absolute", bottom: "-16%", right: "-8%", width: "38%", height: "38%", background: "rgba(203,213,225,0.36)", filter: "blur(110px)", borderRadius: 9999 }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.022, userSelect: "none", pointerEvents: "none" }}>
        <span style={{ fontSize: "38vw", fontWeight: 900, lineHeight: 1, color: "#000" }}>&lt;</span>
        <span style={{ width: "18vw" }} />
        <span style={{ fontSize: "38vw", fontWeight: 900, lineHeight: 1, color: "#000" }}>&gt;</span>
      </div>
    </div>
  );
}

export type QuordixHeroProps = {
  withNavbar?: boolean;
  batchNumber?: number;
  batchOpen?: boolean;
  seatsRemaining?: number;
  seatsTotal?: number;
};

export default function QuordixHero({ withNavbar = false, batchNumber = 7, batchOpen = true, seatsRemaining = 24, seatsTotal = 60 }: QuordixHeroProps) {
  const [open, setOpen] = useState(false);
  const fill = Math.round(((seatsTotal - seatsRemaining) / Math.max(1, seatsTotal)) * 100);
  return (
    <div className="qhero-shell" style={{ minHeight: "min(88vh, 860px)", display: "flex", flexDirection: "column" }}>
      <style>{STYLES}</style>
      <DotGridBackground />
      {withNavbar && <QuordixNavbarInline open={open} setOpen={setOpen} />}

      <main
        style={{
          position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", textAlign: "center",
          padding: withNavbar ? "7.5rem 1rem 3rem" : "4.5rem 1rem 3.5rem",
          width: "100%", maxWidth: "64rem", margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "1.25rem", width: "100%" }}>
          {/* Eyebrow: Batch status live */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 9999, background: "rgba(255,255,255,0.9)", border: "1px solid rgba(233,113,28,0.18)", boxShadow: "0 4px 16px rgba(15,23,42,0.06)", marginBottom: 18 }}>
            <span style={{ width: 7, height: 7, borderRadius: 9999, background: batchOpen ? "#16a34a" : "#94a3b8", boxShadow: batchOpen ? "0 0 0 4px rgba(22,163,74,0.18)" : "none", display: "inline-block" }} />
            <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", color: "#0f172a" }}>
              Cohort #{String(batchNumber).padStart(2, "0")} — {batchOpen ? `Pendaftaran Dibuka · ${seatsRemaining} kursi tersisa` : "Pendaftaran Ditutup"}
            </span>
          </div>

          <h1
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              fontWeight: 900, letterSpacing: "-0.03em", textTransform: "uppercase", margin: 0,
            }}
          >
            <span className="qhero-tagline-pulse" style={{ fontSize: "clamp(0.75rem, 1.9vw, 1rem)", fontWeight: 800, letterSpacing: "0.22em", color: "#E9711C", marginBottom: "1.1rem", display: "block" }}>
              DIGITAL RESEARCH ENGINE · COPUBLIKA
            </span>
            <span style={{ fontSize: "clamp(2.6rem, 9vw, 7.2rem)", fontWeight: 900, lineHeight: 0.88, color: "#0f172a" }}>RISET YANG</span>
            <span style={{ fontSize: "clamp(2.6rem, 9vw, 7.2rem)", fontWeight: 900, lineHeight: 0.88, color: "#0f172a", opacity: 0.92 }}>LEBIH TERARAH.</span>
            <span style={{ fontSize: "clamp(2.6rem, 9vw, 7.2rem)", fontWeight: 900, lineHeight: 0.88, display: "flex", gap: "0.12em", flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ color: "#0f172a" }}>KOLABORASI</span>
              <span className="qhero-glitch" data-text="BERARTI">
                BERARTI.
              </span>
            </span>
          </h1>
        </div>

        <p style={{ fontSize: "clamp(0.92rem, 1.6vw, 1.06rem)", color: "#64748b", maxWidth: "38rem", lineHeight: 1.7, margin: "0 0 1.6rem" }}>
          Ruang kerja dan komunitas terkurasi untuk akademisi yang ingin menemukan rekan riset, mengembangkan ide, dan
          menulis untuk publikasi berkualitas — dari ide hingga <em style={{ color: "#0f172a", fontStyle: "normal", fontWeight: 700 }}>paper siap Scopus</em>.
        </p>

        {/* Batch mini bar */}
        {batchOpen && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 16, background: "rgba(255,255,255,0.92)", border: "1px solid rgba(15,23,42,0.08)", boxShadow: "0 8px 24px rgba(15,23,42,0.06)", marginBottom: 22 }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", color: "#64748b" }}>KUOTA TERISI</div>
              <div style={{ fontWeight: 800, color: "#0f172a" }}>
                {seatsTotal - seatsRemaining} <span style={{ color: "#94a3b8", fontWeight: 600 }}>/ {seatsTotal}</span>
              </div>
            </div>
            <div style={{ width: 140, height: 8, borderRadius: 9999, background: "#e2e8f0", overflow: "hidden" }}>
              <div style={{ width: `${fill}%`, height: "100%", background: "#E9711C", borderRadius: 9999 }} />
            </div>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#E9711C" }}>{fill}%</div>
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          <Link href="/join-batch" className="qhero-btn">
            <span>Mulai berkolaborasi</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </Link>
          <Link href="/research" className="qhero-btn qhero-btn--ghost">
            Lihat proyek riset
          </Link>
        </div>
        <p style={{ marginTop: 14, fontSize: "0.7rem", letterSpacing: "0.06em", color: "#94a3b8", fontFamily: "var(--mono)" }}>
          Untuk akademisi pemula · lintas disiplin · Indonesia
        </p>
      </main>
    </div>
  );
}
