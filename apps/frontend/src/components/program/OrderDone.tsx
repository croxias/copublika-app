"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDollarSign, MessageCircle, UserRoundCheck } from "lucide-react";
import { PROGRAMS, formatRupiah } from "@/lib/data/programs";
import { ORDER_KEY, type Order } from "./RegisterForm";

const read = (): string | null => {
  try {
    return sessionStorage.getItem(ORDER_KEY);
  } catch {
    return null;
  }
};
const subscribe = () => () => {};

/** Confirmation after registering: order code, what was booked, and what happens next. */
export function OrderDone() {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const order = raw ? (JSON.parse(raw) as Order) : null;
  const program = order ? PROGRAMS[order.program] : null;

  return (
    <section className="cp-done">
      <div className="cp-ab-hero__bg" aria-hidden="true" />
      <div className="cp-ab-wrap cp-done__wrap">
        <div className="cp-done__card">
          <span className="cp-done__icon" aria-hidden="true"><CheckCircle2 size={34} /></span>
          <h1>Pendaftaran diterima</h1>
          {order && program ? (
            <>
              <p className="cp-done__lead">
                Terima kasih, {order.name.split(" ")[0]}. {order.newAccount ? "Akun member CoPublika Anda sudah aktif dan Anda sudah masuk." : "Program ini sudah tercatat di akun member Anda."}
              </p>
              <div className="cp-done__order">
                <div className="cp-done__code">
                  <span>Kode pesanan</span>
                  <strong>{order.code}</strong>
                </div>
                <dl>
                  <div><dt>Program</dt><dd>{program.name}</dd></div>
                  <div><dt>Detail</dt><dd>{order.detail}</dd></div>
                  <div><dt>Email</dt><dd>{order.email}</dd></div>
                  <div><dt>WhatsApp</dt><dd>{order.whatsapp}</dd></div>
                  <div className="is-total"><dt>Total</dt><dd>{formatRupiah(order.total)}</dd></div>
                </dl>
              </div>
            </>
          ) : (
            <p className="cp-done__lead">Data pendaftaran Anda sudah kami terima.</p>
          )}

          <ol className="cp-done__next">
            <li><UserRoundCheck size={18} aria-hidden="true" /><span><strong>Akun member aktif</strong> Anda bisa membuka detail proyek riset komunitas sekarang.</span></li>
            <li><MessageCircle size={18} aria-hidden="true" /><span><strong>Tim menghubungi via WhatsApp</strong> untuk konfirmasi jadwal dan instruksi pembayaran.</span></li>
            <li><CircleDollarSign size={18} aria-hidden="true" /><span><strong>Kursi Anda terkunci</strong> setelah pembayaran dikonfirmasi.</span></li>
          </ol>

          <div className="cp-done__ctas">
            <Link href="/research#proyek" className="cp-ab-btn cp-ab-btn--primary">Jelajahi proyek riset <ArrowRight size={16} aria-hidden="true" /></Link>
            {program && <Link href={program.href} className="cp-ab-btn cp-ab-btn--line">Kembali ke program</Link>}
          </div>
        </div>
      </div>
    </section>
  );
}
