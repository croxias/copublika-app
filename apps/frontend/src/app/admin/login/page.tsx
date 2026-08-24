'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Log In — CoPublika Admin';
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock verification
    setTimeout(() => {
      if (email === 'admin@copublika.com' && password === 'admin123') {
        window.location.href = '/admin/dashboard';
      } else {
        setError('Email atau kata sandi salah. Gunakan admin@copublika.com & admin123 untuk masuk.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <main className="login-main">
      <div className="auth-wrap">
        {/* Left Side: Form */}
        <div className="auth-form">
          <div className="inner">
            <div className="auth-eyebrow">Superadmin Access</div>
            <h1>Masuk ke panel kontrol.</h1>
            <p className="sub">
              Akses terbatas untuk administrator platform CoPublika.
            </p>

            {error && (
              <div className="error-banner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="anda@copublika.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="password">Kata Sandi</label>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="auth-row">
                <label className="auth-checkbox">
                  <input type="checkbox" />
                  <span>Ingat saya</span>
                </label>
                <a className="fp" href="#">
                  Lupa kata sandi?
                </a>
              </div>
              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? 'Memproses...' : 'Masuk →'}
              </button>
            </form>

            <div className="auth-divider">Atau</div>

            <div className="back-link">
              <Link href="/">
                ← Kembali ke website
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Marketing Aside */}
        <aside className="auth-aside">
          <div className="logo-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.png" alt="CoPublika" style={{ height: '28px', width: 'auto', display: 'block' }} />
          </div>
          <div className="marketing">
            <div className="quote-mark">“</div>
            <blockquote>
              Kelola komunitas riset terbesar di Indonesia dari satu panel kontrol.
            </blockquote>
            <div className="who">
              <div className="av">CP</div>
              <div>
                <div className="name">Tim CoPublika</div>
                <div className="role">Yogyakarta · Indonesia</div>
              </div>
            </div>
            <div className="stats">
              <div>
                <div className="v">
                  1,240<span className="accent">+</span>
                </div>
                <div className="l">Anggota</div>
              </div>
              <div>
                <div className="v">318</div>
                <div className="l">Publikasi</div>
              </div>
              <div>
                <div className="v">47</div>
                <div className="l">Mentor</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        .login-main {
          min-height: 100vh;
          display: flex;
          background: #f7f5f1;
          font-family: var(--font-jakarta), -apple-system, sans-serif;
        }
        .auth-wrap {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          width: 100%;
          min-height: 100vh;
        }
        @media (max-width: 900px) {
          .auth-wrap {
            grid-template-columns: 1fr;
          }
          .auth-aside {
            display: none !important;
          }
        }

        .auth-form {
          background: #ffffff;
          padding: clamp(40px, 6vw, 80px);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .auth-form .inner {
          max-width: 420px;
          width: 100%;
          margin: 0 auto;
        }
        .auth-eyebrow {
          font-family: var(--font-jetbrains), monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #E9711C;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
        }
        .auth-eyebrow::before {
          content: "";
          width: 24px;
          height: 1px;
          background: #E9711C;
        }
        .auth-form h1 {
          font-size: clamp(36px, 4vw, 44px);
          letter-spacing: -0.025em;
          line-height: 1.1;
          margin-bottom: 14px;
          font-weight: 700;
          color: #0a0a0a;
        }
        .auth-form .sub {
          color: #4a4a4a;
          font-size: 15px;
          line-height: 1.5;
          margin-bottom: 36px;
        }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fdebea;
          border: 1px solid #f8b4b4;
          color: #a3201b;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 13.5px;
          margin-bottom: 24px;
          line-height: 1.4;
        }

        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .auth-field label {
          font-family: var(--font-jetbrains), monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #4a4a4a;
          font-weight: 500;
        }
        .auth-field input {
          border: 1px solid #e8e6e1;
          background: #f7f5f1;
          border-radius: 8px;
          padding: 14px 16px;
          font-size: 15px;
          color: #0a0a0a;
          transition: border-color 0.2s, background-color 0.2s;
        }
        .auth-field input:focus {
          outline: 0;
          border-color: #0a0a0a;
          background: #ffffff;
        }
        .auth-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 8px 0 24px;
        }
        .auth-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          color: #1a1a1a;
          cursor: pointer;
        }
        .auth-checkbox input {
          width: 16px;
          height: 16px;
          accent-color: #E9711C;
        }
        .auth-row .fp {
          font-size: 13.5px;
          color: #E9711C;
          text-decoration: none;
        }
        .auth-row .fp:hover {
          text-decoration: underline;
        }

        .btn-submit {
          width: 100%;
          height: 48px;
          background: #0a0a0a;
          color: #ffffff;
          border: 0;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        .btn-submit:hover:not(:disabled) {
          background: #2a2a2a;
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 28px 0;
          font-family: var(--font-jetbrains), monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #8a8a8a;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #e8e6e1;
        }

        .back-link {
          text-align: center;
          font-size: 14px;
        }
        .back-link a {
          color: #4a4a4a;
          text-decoration: none;
          transition: color 0.2s;
        }
        .back-link a:hover {
          color: #0a0a0a;
        }

        /* Marketing side */
        .auth-aside {
          background: #0a0a0a;
          color: white;
          padding: clamp(40px, 6vw, 80px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .auth-aside::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 30%, rgba(233,113,28,0.2), transparent 50%);
          pointer-events: none;
        }
        .logo-row {
          position: relative;
          z-index: 2;
        }
        .logo-text {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.02em;
          font-family: 'Fraunces', serif;
        }
        .logo-text em {
          font-style: italic;
          color: #E9711C;
          font-weight: 400;
        }
        .marketing {
          position: relative;
          z-index: 1;
          margin-top: auto;
        }
        .quote-mark {
          font-size: 80px;
          line-height: 0.6;
          color: #E9711C;
          font-family: 'Fraunces', serif;
          margin-bottom: 12px;
        }
        blockquote {
          font-size: clamp(22px, 2.4vw, 30px);
          line-height: 1.25;
          letter-spacing: -0.015em;
          font-weight: 500;
          margin-bottom: 32px;
          max-width: 28ch;
          color: #f7f5f1;
        }
        .who {
          display: flex;
          gap: 14px;
          align-items: center;
          padding-top: 24px;
          border-top: 1px solid #2a2a2a;
        }
        .who .av {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-jetbrains), monospace;
          font-size: 13px;
          color: white;
          font-weight: 500;
        }
        .who .name {
          font-size: 15px;
          font-weight: 500;
          color: white;
        }
        .who .role {
          font-family: var(--font-jetbrains), monospace;
          font-size: 11px;
          color: #9a9a9a;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid #2a2a2a;
          position: relative;
          z-index: 1;
        }
        .stats .v {
          font-size: 28px;
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1;
          margin-bottom: 8px;
          color: white;
        }
        .stats .v .accent {
          color: #E9711C;
        }
        .stats .l {
          font-family: var(--font-jetbrains), monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9a9a9a;
        }
      `}</style>
    </main>
  );
}
