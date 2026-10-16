"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Check, CircleDollarSign, Download, MailCheck, MessageCircle } from "lucide-react";
import { AnimatedMark } from "@/components/brand/AnimatedMark";
import { MARK_DOT, MARK_PARTS, MARK_VIEWBOX } from "@/components/brand/CopublikaMark";
import { MEMBERSHIP, PROGRAMS, formatRupiah } from "@/lib/data/programs";
import { downloadReceipt, type ReceiptRow } from "@/lib/receipt";
import { DoneBackdrop } from "./DoneBackdrop";
import { ORDER_KEY, type Order } from "./RegisterForm";

const read = (): string | null => {
  try {
    return sessionStorage.getItem(ORDER_KEY);
  } catch {
    return null;
  }
};
const subscribe = () => () => {};
const EASE = [0.22, 1, 0.36, 1] as const;

const firstName = (name: string) => {
  const w = name.replace(/^(dr|prof)\.?\s+/i, "").trim().split(/\s+/)[0] ?? "";
  return w ? w[0].toUpperCase() + w.slice(1) : "";
};
const issuedAt = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }) + " WIB";

// Deterministic 0–1 noise per index, so the burst is the same on every render.
const noise = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  // Two decimals keep server and client output identical.
  return Math.round((x - Math.floor(x)) * 100) / 100;
};

/** A one-time burst of mark pieces (arcs, discs, dots) falling past the card. */
const PIECES = Array.from({ length: 26 }, (_, i) => ({
  shape: (["ring", "disc", "dot", "dot"] as const)[i % 4],
  left: Math.round(4 + noise(i, 1) * 92),
  size: Math.round(14 + noise(i, 2) * 22),
  drift: (noise(i, 3) - 0.5) * 160,
  spin: (noise(i, 4) - 0.5) * 540,
  delay: 0.5 + noise(i, 5) * 0.9,
  duration: 2.6 + noise(i, 6) * 1.6,
  tone: (["is-orange", "is-white", "is-orange", "is-soft"] as const)[(i * 7) % 4],
}));

function Burst() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div className="cp-done__burst" aria-hidden="true">
      {PIECES.map((p, i) => (
        <motion.svg
          key={i}
          viewBox={MARK_VIEWBOX}
          className={`cp-done__piece ${p.tone}`}
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
          initial={{ y: -80, x: 0, rotate: 0, opacity: 0 }}
          animate={{ y: "105vh", x: p.drift, rotate: p.spin, opacity: [0, 1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.3, 0.1, 0.5, 1], times: [0, 0.1, 0.8, 1] }}
        >
          {p.shape === "ring" ? <path d={MARK_PARTS.ringTop} /> : p.shape === "disc" ? <path d={MARK_PARTS.disc} /> : <circle cx={MARK_DOT.x} cy={MARK_DOT.y} r={MARK_DOT.r * 4} />}
        </motion.svg>
      ))}
    </div>
  );
}


const rowsV = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.55 } } };
const rowV = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } } };

/** Confirmation after registering: who registered, what was booked, and a receipt to keep. */
export function OrderDone() {
  const reduce = useReducedMotion();
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const order = raw ? (JSON.parse(raw) as Order) : null;
  const program = order && order.program !== "member" ? PROGRAMS[order.program] : null;
  const items = order?.items ?? [];
  const isMember = !!order?.profile;
  const [busy, setBusy] = useState(false);

  const rows: ReceiptRow[] = order
    ? [
        { label: program ? "Program" : "Pesanan", value: program ? program.name : items[0]?.label ?? MEMBERSHIP.name },
        { label: "Detail", value: order.detail },
        ...items.slice(1).map((x) => ({ label: x.label, value: x.amount ? formatRupiah(x.amount) : x.was ? `Gratis (normal ${formatRupiah(x.was)})` : "Gratis" })),
        ...(order.profile
          ? [
              { label: "Kategori", value: order.profile.role },
              ...(order.profile.institution ? [{ label: "Afiliasi", value: order.profile.institution }] : []),
              { label: "Identitas", value: order.profile.id },
              ...(order.profile.scholar ? [{ label: "Google Scholar", value: order.profile.scholar }] : []),
            ]
          : []),
        { label: "Nama", value: order.name },
        { label: "Email", value: order.email },
        { label: "WhatsApp", value: order.whatsapp },
      ]
    : [];
  const total = order ? (order.total ? formatRupiah(order.total) : "Gratis") : "";

  const download = async () => {
    if (!order) return;
    setBusy(true);
    await downloadReceipt({
      code: order.code,
      title: isMember ? "Registrasi member diterima" : "Pendaftaran diterima",
      status: isMember ? "Menunggu persetujuan admin" : order.total ? "Menunggu pembayaran" : "Diterima",
      issued: issuedAt(order.createdAt),
      rows,
      total,
      note: isMember
        ? `Link aktivasi akun dikirim ke ${order.email} dalam 1×24 jam setelah pendaftaran disetujui.`
        : "Tim CoPublika menghubungi Anda via WhatsApp untuk konfirmasi jadwal dan instruksi pembayaran.",
    });
    setBusy(false);
  };

  return (
    <section className="cp-done">
      <DoneBackdrop />
      <Burst />
      <div className="cp-ab-wrap cp-done__wrap">
        <motion.div className="cp-done__card" initial={reduce ? false : { opacity: 0, y: 28, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: EASE }}>
          <header className="cp-done__brand">
            <span className="cp-done__logo">
              <AnimatedMark className="cp-done__mark" delay={0.35} />
              <span>CoPublika</span>
            </span>
            <span className="cp-done__doc">Bukti pendaftaran</span>
          </header>

          <div className="cp-done__hero">
            <motion.span className="cp-done__icon" aria-hidden="true" initial={reduce ? false : { scale: 0.4, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.25 }}>
              <Check size={30} strokeWidth={3} />
            </motion.span>
            <h1>{isMember ? "Registrasi member diterima" : "Pendaftaran diterima"}</h1>
            {order ? (
              isMember ? (
                <p className="cp-done__lead">
                  Terima kasih, {firstName(order.name)}. Pendaftaran member Anda sudah kami terima. Mohon tunggu <b>1×24 jam</b>: link aktivasi akun akan kami kirim ke <b>{order.email}</b>.
                </p>
              ) : (
                <p className="cp-done__lead">
                  Terima kasih, {firstName(order.name)}. {order.newAccount ? <>Akun member Anda sudah dibuat. Link aktivasi akun kami kirim ke <b>{order.email}</b> dalam 1×24 jam.</> : program ? "Program ini sudah tercatat di akun member Anda." : "Aktivasi member Anda sudah tercatat."}
                </p>
              )
            ) : (
              <p className="cp-done__lead">Data pendaftaran Anda sudah kami terima.</p>
            )}
          </div>

          {order && (
            <div className="cp-done__ticket">
              <div className="cp-done__code">
                <span>Kode pendaftaran</span>
                <strong>{order.code}</strong>
              </div>
              <motion.dl variants={rowsV} initial={reduce ? false : "hidden"} animate="show">
                {rows.filter((r) => r.label !== "Nama").map((r) => (
                  <motion.div key={r.label} variants={rowV}><dt>{r.label}</dt><dd>{r.value}</dd></motion.div>
                ))}
              </motion.dl>
              <div className="cp-done__total"><span>Total</span><strong>{total}</strong></div>
            </div>
          )}

          {isMember && order ? (
            <p className="cp-done__mail"><MailCheck size={18} aria-hidden="true" /> Cek juga folder spam atau promosi bila email aktivasi belum masuk.</p>
          ) : (
            order && (
              <ol className="cp-done__next">
                <li><MessageCircle size={18} aria-hidden="true" /><span><strong>Tim menghubungi via WhatsApp</strong> {order.total ? "untuk konfirmasi jadwal dan instruksi pembayaran." : "jika ada data yang perlu dilengkapi."}</span></li>
                {program && <li><CircleDollarSign size={18} aria-hidden="true" /><span><strong>Kursi Anda terkunci</strong> setelah pembayaran dikonfirmasi.</span></li>}
              </ol>
            )
          )}

          <div className="cp-done__ctas">
            {order && (
              <button type="button" className="cp-done__btn is-accent" onClick={download} disabled={busy}>
                <Download size={16} aria-hidden="true" /> {busy ? "Menyiapkan…" : "Download bukti"}
              </button>
            )}
            <Link href="/" className="cp-done__btn is-line"><ArrowLeft size={16} aria-hidden="true" /> Kembali ke website</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
