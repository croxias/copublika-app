"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, Move3d } from "lucide-react";
import { PUBS } from "@/lib/data/publications";
import { focusResearch } from "./events";
import { MARK_DOT, MARK_PATH, MARK_VIEWBOX } from "@/components/brand/CopublikaMark";

type Vec = { x: number; y: number; z: number };
type Field = { name: string; pubs: number; q1: number; links: string[]; p: Vec };

const ACCENT = "233,113,28";
const PERSPECTIVE = 3.2;
const AUTO_SPIN = 0.0016;

/** Evenly spread n points on a unit sphere (Fibonacci lattice). */
function lattice(n: number, offset = 0): Vec[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - ((i + 0.5) / n) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i + offset;
    return { x: Math.cos(t) * r, y, z: Math.sin(t) * r };
  });
}

/**
 * Research fields from the members' publications, with an edge wherever an author has published
 * in both fields. That makes the globe an infographic of how the community crosses disciplines.
 */
function buildFields(): Field[] {
  const byField = new Map<string, { pubs: number; q1: number; authors: Set<string> }>();
  for (const pub of PUBS) {
    const f = byField.get(pub.cluster) ?? { pubs: 0, q1: 0, authors: new Set<string>() };
    f.pubs += 1;
    if (pub.quartile === "q1") f.q1 += 1;
    for (const a of pub.authors.split(/\.,\s*/)) f.authors.add(a.split(",")[0].trim());
    byField.set(pub.cluster, f);
  }
  const names = [...byField.keys()].sort((a, b) => byField.get(b)!.pubs - byField.get(a)!.pubs);
  const points = lattice(names.length, 0.6);
  return names.map((name, i) => {
    const mine = byField.get(name)!;
    const links = names.filter((other) => other !== name && [...byField.get(other)!.authors].some((a) => mine.authors.has(a)));
    return { name, pubs: mine.pubs, q1: mine.q1, links, p: points[i] };
  });
}

function rotate(v: Vec, yaw: number, pitch: number): Vec {
  const x = v.x * Math.cos(yaw) + v.z * Math.sin(yaw);
  const z1 = -v.x * Math.sin(yaw) + v.z * Math.cos(yaw);
  return { x, y: v.y * Math.cos(pitch) - z1 * Math.sin(pitch), z: v.y * Math.sin(pitch) + z1 * Math.cos(pitch) };
}

/** Points along the great circle from a to b, lifted off the surface so the edge reads as an arc. */
function arc(a: Vec, b: Vec, steps = 24): Vec[] {
  const dot = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y + a.z * b.z));
  const omega = Math.acos(dot);
  const s = Math.sin(omega) || 1;
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const k1 = Math.sin((1 - t) * omega) / s;
    const k2 = Math.sin(t * omega) / s;
    const lift = 1 + 0.18 * Math.sin(Math.PI * t);
    return { x: (a.x * k1 + b.x * k2) * lift, y: (a.y * k1 + b.y * k2) * lift, z: (a.z * k1 + b.z * k2) * lift };
  });
}

const FIELDS = buildFields();

/** Back-to-front copies of the mark; stacked along Z they read as one extruded solid. */
const MARK_LAYERS = Array.from({ length: 14 }, (_, i) => 13 - i);

const shortest = (from: number, to: number) => from + ((((to - from) % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;

export function FieldGlobe() {
  const reduce = useReducedMotion();
  const fields = FIELDS;
  const [active, setActive] = useState<number | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const markRef = useRef<HTMLDivElement>(null);
  const view = useRef({ yaw: 0.4, pitch: -0.32, vYaw: 0, vPitch: 0, target: null as number | null, targetPitch: 0, holdUntil: 0, dragging: false, hovering: false });
  const activeRef = useRef<number | null>(null);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!stage || !canvas || !ctx) return;

    const dust = lattice(180);
    const rings: Vec[][] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const y = Math.sin((lat * Math.PI) / 180);
      const r = Math.cos((lat * Math.PI) / 180);
      rings.push(Array.from({ length: 73 }, (_, i) => ({ x: Math.cos((i / 72) * 2 * Math.PI) * r, y, z: Math.sin((i / 72) * 2 * Math.PI) * r })));
    }
    for (let lon = 0; lon < 180; lon += 30) {
      const a = (lon * Math.PI) / 180;
      rings.push(Array.from({ length: 73 }, (_, i) => {
        const t = (i / 72) * 2 * Math.PI;
        return { x: Math.cos(t) * Math.cos(a), y: Math.sin(t), z: Math.cos(t) * Math.sin(a) };
      }));
    }
    const edges: { a: number; b: number; pts: Vec[] }[] = [];
    fields.forEach((f, i) => f.links.forEach((name) => {
      const j = fields.findIndex((g) => g.name === name);
      if (j > i) edges.push({ a: i, b: j, pts: arc(f.p, fields[j].p) });
    }));

    let w = 0, h = 0, R = 0, raf = 0, visible = true;
    const resize = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      R = Math.min(w, h) * 0.36;
      markRef.current?.style.setProperty("--mark", `${R * 0.82}px`);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const project = (v: Vec) => {
      const s = PERSPECTIVE / (PERSPECTIVE - v.z);
      return { x: w / 2 + v.x * R * s, y: h / 2 - v.y * R * s, s, z: v.z };
    };

    const frame = () => {
      const st = view.current;
      if (st.holdUntil === -1) st.holdUntil = performance.now() + 2500;
      if (st.target !== null) {
        st.yaw += (st.target - st.yaw) * 0.08;
        st.pitch += (st.targetPitch - st.pitch) * 0.08;
        if (Math.abs(st.target - st.yaw) < 0.002) st.target = null;
      } else if (!st.dragging) {
        st.yaw += st.vYaw;
        st.pitch = Math.max(-1.1, Math.min(1.1, st.pitch + st.vPitch));
        st.vYaw *= 0.94;
        st.vPitch *= 0.94;
        // Keep spinning unless the pointer is over the globe or a field was just tapped.
        if (!reduce && !st.hovering && performance.now() > st.holdUntil && Math.abs(st.vYaw) < AUTO_SPIN) st.yaw += AUTO_SPIN;
      }

      ctx.clearRect(0, 0, w, h);
      const halo = ctx.createRadialGradient(w / 2, h / 2, R * 0.2, w / 2, h / 2, R * 1.35);
      halo.addColorStop(0, `rgba(${ACCENT},0.16)`);
      halo.addColorStop(1, `rgba(${ACCENT},0)`);
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      ctx.lineWidth = 1;
      for (const ring of rings) {
        for (let i = 1; i < ring.length; i++) {
          const a = project(rotate(ring[i - 1], st.yaw, st.pitch));
          const b = project(rotate(ring[i], st.yaw, st.pitch));
          const front = (a.z + b.z) / 2;
          ctx.strokeStyle = `rgba(255,255,255,${front > 0 ? 0.05 + front * 0.07 : 0.025})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      for (const d of dust) {
        const p = project(rotate(d, st.yaw, st.pitch));
        ctx.fillStyle = `rgba(255,255,255,${0.08 + Math.max(0, p.z) * 0.3})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.1 * p.s, 0, Math.PI * 2);
        ctx.fill();
      }

      const sel = activeRef.current;
      for (const e of edges) {
        const lit = sel !== null && (e.a === sel || e.b === sel);
        ctx.lineWidth = lit ? 2 : 1;
        for (let i = 1; i < e.pts.length; i++) {
          const a = project(rotate(e.pts[i - 1], st.yaw, st.pitch));
          const b = project(rotate(e.pts[i], st.yaw, st.pitch));
          const depth = Math.max(0.15, ((a.z + b.z) / 2 + 1) / 2);
          const alpha = lit ? 0.95 * depth : sel !== null ? 0.08 * depth : 0.38 * depth;
          ctx.strokeStyle = `rgba(${ACCENT},${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Light travelling along each collaboration arc.
      if (!reduce) {
        const now = performance.now() / 1000;
        edges.forEach((e, k) => {
          const lit = sel !== null && (e.a === sel || e.b === sel);
          if (sel !== null && !lit) return;
          const t = (now * 0.22 + k * 0.37) % 1;
          const pos = t * (e.pts.length - 1);
          const i = Math.floor(pos);
          const a = e.pts[i], b = e.pts[Math.min(i + 1, e.pts.length - 1)], f = pos - i;
          const p = project(rotate({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, z: a.z + (b.z - a.z) * f }, st.yaw, st.pitch));
          const depth = (p.z + 1) / 2;
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 7 * p.s);
          glow.addColorStop(0, `rgba(255,214,170,${0.9 * depth})`);
          glow.addColorStop(1, `rgba(${ACCENT},0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 7 * p.s, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // The mark sways with the spin instead of turning all the way round.
      if (markRef.current) {
        markRef.current.style.transform = `translate(-50%, -50%) rotateY(${Math.sin(st.yaw) * 32}deg) rotateX(${st.pitch * -22}deg)`;
      }

      fields.forEach((f, i) => {
        const el = labelRefs.current[i];
        if (!el) return;
        const p = project(rotate(f.p, st.yaw, st.pitch));
        const depth = (p.z + 1) / 2;
        const dim = sel !== null && sel !== i && !fields[sel].links.includes(f.name);
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${0.72 + depth * 0.38})`;
        el.style.opacity = String(dim ? 0.25 : 0.3 + depth * 0.7);
        el.style.zIndex = String(Math.round(depth * 100));
      });

      if (visible) raf = requestAnimationFrame(frame);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was) raf = requestAnimationFrame(frame);
    });
    io.observe(stage);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [fields, reduce]);

  // Drag to spin, with a little inertia on release.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let last: { x: number; y: number } | null = null;
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      last = { x: e.clientX, y: e.clientY };
      view.current.dragging = true;
      view.current.target = null;
      stage.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!last) return;
      const st = view.current;
      st.vYaw = (e.clientX - last.x) * 0.006;
      st.vPitch = (e.clientY - last.y) * 0.004;
      st.yaw += st.vYaw;
      st.pitch = Math.max(-1.1, Math.min(1.1, st.pitch + st.vPitch));
      last = { x: e.clientX, y: e.clientY };
    };
    const up = () => {
      last = null;
      view.current.dragging = false;
    };
    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);
    return () => {
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
      stage.removeEventListener("pointercancel", up);
    };
  }, []);

  /** Select a field and turn the globe so it faces the viewer. */
  const pick = (i: number) => {
    setActive(i);
    const { x, y, z } = fields[i].p;
    view.current.target = shortest(view.current.yaw, Math.atan2(-x, z));
    view.current.targetPitch = Math.max(-0.9, Math.min(0.9, Math.atan2(y, Math.hypot(x, z))));
    view.current.holdUntil = -1; // the frame loop turns this into "now + 2.5s"
  };

  const f = active !== null ? fields[active] : null;
  const totalLinks = fields.reduce((n, x) => n + x.links.length, 0) / 2;

  return (
    <div className="cp-fg">
      <div
        ref={stageRef}
        className="cp-fg__stage"
        onMouseEnter={() => (view.current.hovering = true)}
        onMouseLeave={() => (view.current.hovering = false)}
      >
        <canvas ref={canvasRef} className="cp-fg__canvas" aria-hidden="true" />
        <div className="cp-fg__mark-stage" aria-hidden="true">
          <div ref={markRef} className="cp-fg__mark">
            {MARK_LAYERS.map((i) => (
              <svg key={i} viewBox={MARK_VIEWBOX} className="cp-fg__mark-layer" style={{ ["--z" as never]: i }}>
                <path d={MARK_PATH} />
                <circle cx={MARK_DOT.x} cy={MARK_DOT.y} r={MARK_DOT.r} />
              </svg>
            ))}
          </div>
        </div>
        <div className="cp-fg__labels" role="group" aria-label="Bidang riset anggota">
          {fields.map((field, i) => (
            <button
              key={field.name}
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              type="button"
              className={`cp-fg__node ${active === i ? "is-active" : ""}`}
              onMouseEnter={() => pick(i)}
              onFocus={() => pick(i)}
              onClick={() => pick(i)}
              aria-pressed={active === i}
              aria-label={`${field.name}: ${field.pubs} publikasi`}
            >
              <i aria-hidden="true" />
              {field.name}
            </button>
          ))}
        </div>
        <span className="cp-fg__hint" aria-hidden="true">
          <Move3d size={14} /> Seret untuk memutar
        </span>
      </div>

      <div className="cp-fg__panel" aria-live="polite">
        {f ? (
          <>
            <div className="cp-fg__panel-main">
              <span className="cp-fg__k">Bidang riset</span>
              <strong>{f.name}</strong>
              <span className="cp-fg__facts">
                <b>{f.pubs}</b> publikasi · <b>{f.q1}</b> Scopus Q1 · terhubung ke <b>{f.links.length}</b> bidang
              </span>
            </div>
            <button type="button" className="cp-fg__go" onClick={() => focusResearch({ target: "publications", cluster: f.name })}>
              Lihat publikasi <ArrowRight size={14} />
            </button>
          </>
        ) : (
          <div className="cp-fg__panel-main">
            <span className="cp-fg__k">Peta bidang riset</span>
            <strong>{fields.length} bidang, {totalLinks} jembatan kolaborasi</strong>
            <span className="cp-fg__facts">
              <i className="cp-fg__legend" aria-hidden="true" /> Garis = penulis yang menerbitkan di dua bidang. Pilih bidang untuk melihat detail.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
