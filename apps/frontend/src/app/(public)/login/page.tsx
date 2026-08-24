"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/SupabaseAuthProvider";

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      window.location.href = "/";
    }

    setLoading(false);
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
              <span>Masuk</span>
            </div>
            <h1 className="cp-auth__title">Selamat datang kembali.</h1>
            <p className="cp-auth__lead">Masuk untuk mengakses akun CoPublika Anda.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="cp-auth__form">
            {error && (
              <div className="cp-auth__error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {error}
              </div>
            )}

            <div className={`cp-auth__field ${focusedField === "email" ? "is-focused" : ""}`}>
              <label className="cp-auth__label" htmlFor="login-email">
                <span className="cp-auth__label-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                Email
              </label>
              <input
                id="login-email"
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
              <label className="cp-auth__label" htmlFor="login-password">
                <span className="cp-auth__label-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                </span>
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                required
                className="cp-auth__input"
                placeholder="••••••••"
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
                  Memuat...
                </>
              ) : (
                <>
                  Masuk
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                </>
              )}
            </button>
          </form>

          <div className="cp-auth__footer">
            <p>Belum punya akun?{" "}
              <Link href="/register" className="cp-auth__link">
                Daftar sekarang
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
