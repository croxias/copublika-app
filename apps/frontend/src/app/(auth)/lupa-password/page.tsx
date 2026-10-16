"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MailCheck, Send } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { AuthField, AuthShell } from "@/components/auth/AuthShell";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const sp = use(searchParams);
  const [email, setEmail] = useState(sp.email ?? "");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailError = !email.trim() ? "Masukkan email akun Anda." : !EMAIL_RE.test(email.trim()) ? "Format email belum benar, mis. nama@kampus.ac.id." : "";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    setError(null);
    if (emailError) return;
    setLoading(true);
    const { error } = await authClient.requestPasswordReset({ email: email.trim(), redirectTo: `${window.location.origin}/reset-password` });
    setLoading(false);
    // The same answer whether or not the email has an account, so accounts cannot be guessed.
    if (error && error.status !== 400) {
      setError(error.status === 429 ? "Terlalu banyak permintaan. Tunggu beberapa menit, lalu coba lagi." : "Link belum bisa dikirim. Coba lagi sebentar lagi.");
      return;
    }
    setSent(true);
  }

  return (
    <AuthShell
      title={sent ? "Cek email Anda" : "Lupa password?"}
      lead={sent ? "Ikuti link di email untuk membuat password baru." : "Masukkan email akun Anda. Kami kirim link untuk membuat password baru."}
      tagline={<>Akses Anda, <em>tetap aman.</em></>}
      sub="Link atur ulang hanya dikirim ke email akun Anda dan berlaku satu jam."
    >
      {sent ? (
        <div className="cp-login__sent" role="status">
          <span className="cp-login__sent-ico" aria-hidden="true"><MailCheck size={26} /></span>
          <p>
            Jika <b>{email.trim()}</b> terdaftar, link atur ulang password sudah kami kirim. Link berlaku <b>1 jam</b>. Cek juga folder spam atau promosi.
          </p>
          <button type="button" className="cp-login__alt is-button" onClick={() => setSent(false)}>Kirim ulang ke email lain</button>
        </div>
      ) : (
        <form className="cp-login__form" onSubmit={submit} noValidate>
          <AuthField label="Email" error={touched ? emailError : undefined}>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="nama@kampus.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={touched && !!emailError}
              autoFocus
            />
          </AuthField>
          {error && <p className="cp-login__notice is-error" role="alert">{error}</p>}
          <button type="submit" className="cp-login__submit" disabled={loading}>
            {loading ? <><Loader2 size={18} className="cp-login__spin" aria-hidden="true" /> Mengirim…</> : <>Kirim link reset <Send size={17} aria-hidden="true" /></>}
          </button>
        </form>
      )}

      <Link href="/login" className="cp-login__back"><ArrowLeft size={16} aria-hidden="true" /> Kembali ke halaman masuk</Link>
    </AuthShell>
  );
}
