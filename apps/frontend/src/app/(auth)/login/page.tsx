"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Info, Loader2, UserRoundPlus } from "lucide-react";
import { authClient, safeNext } from "@/lib/auth-client";
import { AuthField, AuthShell } from "@/components/auth/AuthShell";
import { PolicyDialog, type PolicyTab } from "@/components/program/PolicyDialog";

type Search = { next?: string; reason?: string; reset?: string };

const REGISTER = "/daftar?program=member&paket=gratis";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function LoginPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = use(searchParams);
  const next = safeNext(sp.next);
  const gated = sp.reason === "research";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [policy, setPolicy] = useState<{ open: boolean; tab: PolicyTab }>({ open: false, tab: "privasi" });

  const emailError = !email.trim() ? "Masukkan email Anda." : !EMAIL_RE.test(email.trim()) ? "Format email belum benar, mis. nama@kampus.ac.id." : "";
  const passwordError = !password ? "Masukkan password Anda." : password.length < 8 ? "Password minimal 8 karakter." : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setError(null);
    if (emailError || passwordError) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>(".cp-login [aria-invalid='true']")?.focus());
      return;
    }
    setLoading(true);
    const { error } = await authClient.signIn.email({ email: email.trim(), password, rememberMe: remember });
    if (error) {
      setLoading(false);
      setError(
        error.status === 401
          ? "Email atau password salah. Periksa lagi, atau atur ulang password Anda."
          : error.status === 403
            ? "Akun Anda belum aktif. Buka link aktivasi yang kami kirim ke email Anda."
            : error.status === 429
              ? "Terlalu banyak percobaan. Tunggu sebentar, lalu coba lagi."
              : error.message ?? "Gagal masuk. Coba lagi.",
      );
      return;
    }
    window.location.href = next;
  }

  const registerHref = sp.next ? `${REGISTER}&next=${encodeURIComponent(next)}` : REGISTER;

  return (
    <AuthShell
      title="Masuk ke akun"
      lead={gated ? "Detail proyek riset hanya untuk anggota. Masuk dulu, lalu Anda langsung kembali ke proyek tersebut." : "Lanjutkan riset dan tulisan Anda bersama komunitas CoPublika."}
    >
      {sp.reset === "ok" && (
        <p className="cp-login__notice is-ok" role="status">
          <Info size={16} aria-hidden="true" /> Password berhasil diganti. Silakan masuk dengan password baru.
        </p>
      )}

      <form className="cp-login__form" onSubmit={handleSubmit} noValidate>
        <AuthField label="Email" error={touched.email ? emailError : undefined}>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="nama@kampus.ac.id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            aria-invalid={touched.email && !!emailError}
            autoFocus
          />
        </AuthField>

        <AuthField
          label="Password"
          error={touched.password ? passwordError : undefined}
          trailing={
            <button type="button" className="cp-login__eye" onClick={() => setShow((s) => !s)} aria-label={show ? "Sembunyikan password" : "Tampilkan password"} aria-pressed={show}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        >
          <input
            type={show ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Password Anda"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            aria-invalid={touched.password && !!passwordError}
          />
        </AuthField>

        <div className="cp-login__row">
          <label className="cp-login__check">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span aria-hidden="true" />
            Ingat saya di perangkat ini
          </label>
          <Link href={`/lupa-password${email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ""}`} className="cp-login__forgot">Lupa password?</Link>
        </div>

        {error && <p className="cp-login__notice is-error" role="alert">{error}</p>}

        <button type="submit" className="cp-login__submit" disabled={loading}>
          {loading ? <><Loader2 size={18} className="cp-login__spin" aria-hidden="true" /> Memproses…</> : <>Masuk <ArrowRight size={18} aria-hidden="true" /></>}
        </button>
      </form>

      <div className="cp-login__or"><span>atau</span></div>

      <Link href={registerHref} className="cp-login__alt">
        <UserRoundPlus size={18} aria-hidden="true" />
        <span>Belum punya akun? <b>Daftar member gratis</b></span>
        <ArrowRight size={16} aria-hidden="true" />
      </Link>

      <Link href="/" className="cp-login__home">
        <ArrowLeft size={16} aria-hidden="true" /> Kembali ke website
      </Link>

      <p className="cp-login__terms">
        Dengan masuk, Anda menyetujui{" "}
        <button type="button" onClick={() => setPolicy({ open: true, tab: "syarat" })}>Syarat Keanggotaan</button> dan{" "}
        <button type="button" onClick={() => setPolicy({ open: true, tab: "privasi" })}>Kebijakan Privasi</button> CoPublika.
      </p>

      <PolicyDialog open={policy.open} tab={policy.tab} onTab={(tab) => setPolicy((p) => ({ ...p, tab }))} onOpenChange={(open) => setPolicy((p) => ({ ...p, open }))} onAgree={() => {}} />
    </AuthShell>
  );
}
