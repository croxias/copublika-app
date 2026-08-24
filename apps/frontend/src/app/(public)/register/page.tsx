"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/SupabaseAuthProvider";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Password tidak cocok.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      setLoading(false);
      return;
    }

    const result = await signUp(email, password, fullName);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  }

  if (success) {
    return (
      <section className="cp-auth">
        <div className="cp-auth__bg">
          <div className="cp-auth__orb cp-auth__orb--a" />
          <div className="cp-auth__orb cp-auth__orb--b" />
          <div className="cp-auth__dots" />
          <div className="cp-auth__vignette" />
        </div>
        <div className="cp-auth__inner">
          <div className="cp-auth__card cp-auth__card--success">
            <div className="cp-auth-success">
              <div className="cp-auth-success__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h1 className="cp-auth-success__title">Pendaftaran Berhasil</h1>
              <p className="cp-auth-success__desc">
                Silakan cek email Anda untuk verifikasi akun. Setelah terverifikasi, Anda bisa langsung masuk.
              </p>
              <Link href="/login" className="cp-auth-success__cta">
                Ke Halaman Masuk
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cp-auth">
      {/* Background */}
      <div className="cp-auth__bg">
        <div className="cp-auth__orb cp-auth__orb--a" />
        <div className="cp-auth__orb cp-auth__orb--b" />
        <div className="cp-auth__dots" />
        <div className="cp-auth__vignette" />
      </div>

      <div className="cp-auth__inner">
        <div className="cp-auth__card">
          {/* Header */}
          <div className="cp-auth__header">
            <div className="cp-auth__badge">
              <span className="cp-auth__pulse" />
              <span>Daftar Akun</span>
            </div>
            <h1 className="cp-auth__title">Bergabung dengan CoPublika.</h1>
            <p className="cp-auth__lead">Buat akun gratis untuk mengakses komunitas riset.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="cp-auth__form">
            {error && (
              <div className="cp-auth__error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {error}
              </div>
            )}

            <div className={`cp-auth__field ${focusedField === "fullName" ? "is-focused" : ""}`}>
              <label className="cp-auth__label" htmlFor="fullName">
                <span className="cp-auth__label-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </span>
                Nama Lengkap
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onFocus={() => setFocusedField("fullName")}
                onBlur={() => setFocusedField(null)}
                required
                className="cp-auth__input"
                placeholder="Dr. Budi Santoso"
              />
            </div>

            <div className={`cp-auth__field ${focusedField === "email" ? "is-focused" : ""}`}>
              <label className="cp-auth__label" htmlFor="email">
                <span className="cp-auth__label-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                required
                className="cp-auth__input"
                placeholder="nama@institusi.ac.id"
              />
            </div>

            <div className={`cp-auth__field ${focusedField === "password" ? "is-focused" : ""}`}>
              <label className="cp-auth__label" htmlFor="password">
                <span className="cp-auth__label-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                </span>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                required
                className="cp-auth__input"
                placeholder="Minimal 6 karakter"
              />
            </div>

            <div className={`cp-auth__field ${focusedField === "confirmPassword" ? "is-focused" : ""}`}>
              <label className="cp-auth__label" htmlFor="confirmPassword">
                <span className="cp-auth__label-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </span>
                Konfirmasi Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
                required
                className="cp-auth__input"
                placeholder="Ulangi password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cp-auth__submit"
            >
              {loading ? (
                <>
                  <span className="cp-auth__spinner" />
                  Mendaftarkan...
                </>
              ) : (
                <>
                  Daftar Sekarang
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
                </>
              )}
            </button>
          </form>

          <div className="cp-auth__footer">
            <p>Sudah punya akun?{" "}
              <Link href="/login" className="cp-auth__link">
                Masuk di sini
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
