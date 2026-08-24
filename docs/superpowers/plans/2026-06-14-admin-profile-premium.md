# Admin Profile Premium Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merombak tampilan halaman profil Superadmin (`/admin/profile`) dengan visual yang jauh lebih berkelas, menggunakan tekstur latar belakang mesh grid, dekorasi avatar glow ring, tab bergaya sliding-pill, input fields berikon SVG, dan mikro-animasi pada state hover dan fokus.

**Architecture:** Next.js Client Component di route `/admin/profile`.

**Tech Stack:** React, Next.js, SVG, CSS Transitions/Transforms.

---

### Task 1: Update Profile Page Component to Premium Layout & Interactive Toggles

**Files:**
- Modify: `apps/frontend/src/app/admin/(shell)/profile/page.tsx`

- [ ] **Step 1: Ganti kode halaman profil dengan implementasi UI Premium**

Update `apps/frontend/src/app/admin/(shell)/profile/page.tsx` secara keseluruhan dengan kode berikut:

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');
  const [profileForm, setProfileForm] = useState({
    name: 'Adi Wijaya',
    email: 'adi.wijaya@copublika.id',
    affiliation: 'Universitas Indonesia',
    expertise: 'Informatika, Artificial Intelligence, Data Science',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // State for input focus highlights
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Profil — CoPublika Admin';
  }, []);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: 'Informasi pribadi berhasil diperbarui!', type: 'success' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ text: 'Password baru dan konfirmasi password tidak cocok!', type: 'error' });
      return;
    }
    setMessage({ text: 'Password berhasil diperbarui!', type: 'success' });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <>
      {/* Page Header */}
      <div className="cp-pg-head">
        <div className="cp-greet">
          <div className="cp-crumb">
            <Link href="/admin/dashboard">Overview</Link>
            <span className="cp-sep">/</span>
            <span>Profil</span>
          </div>
          <h1 className="cp-title" style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Profil Superadmin
          </h1>
          <p className="cp-subtitle" style={{ fontSize: '14px', color: 'var(--muted)' }}>
            Kelola detail informasi akun personal dan tingkatkan keamanan login Anda.
          </p>
        </div>
      </div>

      {message && (
        <div style={{
          padding: '14px 20px',
          borderRadius: 'var(--radius-lg)',
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
          border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: message.type === 'success' ? '#0f766e' : '#b91c1c',
          fontSize: '14px',
          fontWeight: 600,
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'all 0.3s ease',
        }}>
          {message.type === 'success' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          {message.text}
        </div>
      )}

      <div className="cp-grid-2" style={{ gap: '24px' }}>
        {/* Kolom Kiri: Ringkasan Profil Premium */}
        <div 
          className="cp-card" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center', 
            padding: '40px 28px', 
            gap: '28px',
            position: 'relative',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 36px -12px rgba(233,113,28,0.08), 0 1px 3px rgba(0,0,0,0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'var(--shadow)';
          }}
        >
          {/* Subtle Mesh Grid Texture overlay */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '140px',
            backgroundImage: 'radial-gradient(var(--line) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
            opacity: 0.35,
            maskImage: 'linear-gradient(to bottom, black 60%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent)',
            pointerEvents: 'none',
          }} />

          {/* Avatar with dynamic glow and rotating border style */}
          <div style={{
            position: 'relative',
            marginTop: '15px',
            display: 'inline-flex',
          }}>
            <div style={{
              position: 'absolute',
              top: '-6px', left: '-6px', right: '-6px', bottom: '-6px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent) 0%, #0f172a 100%)',
              padding: '2px',
              pointerEvents: 'none',
            }} />
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              fontWeight: 800,
              border: '4px solid #ffffff',
              boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
              position: 'relative',
              zIndex: 2,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(233, 113, 28, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.12)';
            }}
            >
              AW
            </div>
          </div>

          <div style={{ zIndex: 2 }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--foreground)', marginBottom: '6px', letterSpacing: '-0.3px' }}>
              {profileForm.name}
            </h3>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--accent)',
              background: 'rgba(233, 113, 28, 0.06)',
              border: '1px solid rgba(233, 113, 28, 0.18)',
              padding: '3px 12px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '14px',
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }}></span>
              Superadmin
            </span>
            <p style={{ fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {profileForm.email}
            </p>
          </div>

          <div style={{ width: '100%', height: '1px', background: 'var(--line)', zIndex: 2 }} />

          {/* Stats with transparent orange round icon containers */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(233, 113, 28, 0.06)', color: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verifikasi Disetujui</span>
                <strong style={{ fontSize: '14px', color: 'var(--foreground)', fontWeight: 700 }}>124 pendaftar</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(233, 113, 28, 0.06)', color: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Proyek Direview</span>
                <strong style={{ fontSize: '14px', color: 'var(--foreground)', fontWeight: 700 }}>42 proyek</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(233, 113, 28, 0.06)', color: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status Sesi</span>
                <span style={{ fontSize: '14px', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                  Aktif (Superadmin)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Detail & Keamanan (Form Tab) */}
        <div 
          className="cp-card" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '28px',
            padding: '36px 32px',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 36px -12px rgba(15,23,42,0.04), 0 1px 3px rgba(0,0,0,0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'var(--shadow)';
          }}
        >
          {/* Sliding Pill Tab Switcher */}
          <div style={{ 
            display: 'inline-flex', 
            background: 'rgba(15, 23, 42, 0.03)', 
            padding: '4px', 
            borderRadius: '24px',
            alignSelf: 'flex-start',
            border: '1px solid var(--line)',
          }}>
            <button
              onClick={() => setActiveTab('personal')}
              style={{
                background: activeTab === 'personal' ? '#0F172A' : 'transparent',
                border: 'none',
                padding: '8px 20px',
                fontSize: '13px',
                fontWeight: activeTab === 'personal' ? 700 : 600,
                color: activeTab === 'personal' ? '#ffffff' : 'var(--muted)',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              Informasi Pribadi
            </button>
            <button
              onClick={() => setActiveTab('security')}
              style={{
                background: activeTab === 'security' ? '#0F172A' : 'transparent',
                border: 'none',
                padding: '8px 20px',
                fontSize: '13px',
                fontWeight: activeTab === 'security' ? 700 : 600,
                color: activeTab === 'security' ? '#ffffff' : 'var(--muted)',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              Keamanan Akun
            </button>
          </div>

          {activeTab === 'personal' ? (
            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Field 1: Nama Lengkap */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>Nama Lengkap</label>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '14px',
                    color: focusedInput === 'name' ? 'var(--accent)' : 'var(--muted)',
                    transition: 'color 0.2s',
                    display: 'flex',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={profileForm.name}
                    onFocus={() => setFocusedInput('name')}
                    onBlur={() => setFocusedInput(null)}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: 'var(--radius-md)',
                      border: focusedInput === 'name' ? '1px solid rgba(233,113,28,0.5)' : '1px solid var(--line)',
                      background: '#ffffff',
                      fontSize: '14px',
                      color: 'var(--foreground)',
                      outline: 'none',
                      boxShadow: focusedInput === 'name' ? '0 0 0 3px rgba(233,113,28,0.12)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  />
                </div>
              </div>

              {/* Field 2: Email Utama */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>Email Utama</label>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '14px',
                    color: focusedInput === 'email' ? 'var(--accent)' : 'var(--muted)',
                    transition: 'color 0.2s',
                    display: 'flex',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={profileForm.email}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: 'var(--radius-md)',
                      border: focusedInput === 'email' ? '1px solid rgba(233,113,28,0.5)' : '1px solid var(--line)',
                      background: '#ffffff',
                      fontSize: '14px',
                      color: 'var(--foreground)',
                      outline: 'none',
                      boxShadow: focusedInput === 'email' ? '0 0 0 3px rgba(233,113,28,0.12)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  />
                </div>
              </div>

              {/* Field 3: Afiliasi */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>Afiliasi</label>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '14px',
                    color: focusedInput === 'affiliation' ? 'var(--accent)' : 'var(--muted)',
                    transition: 'color 0.2s',
                    display: 'flex',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={profileForm.affiliation}
                    onFocus={() => setFocusedInput('affiliation')}
                    onBlur={() => setFocusedInput(null)}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, affiliation: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: 'var(--radius-md)',
                      border: focusedInput === 'affiliation' ? '1px solid rgba(233,113,28,0.5)' : '1px solid var(--line)',
                      background: '#ffffff',
                      fontSize: '14px',
                      color: 'var(--foreground)',
                      outline: 'none',
                      boxShadow: focusedInput === 'affiliation' ? '0 0 0 3px rgba(233,113,28,0.12)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  />
                </div>
              </div>

              {/* Field 4: Kategori Kepakaran */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>Kategori Kepakaran</label>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '14px',
                    color: focusedInput === 'expertise' ? 'var(--accent)' : 'var(--muted)',
                    transition: 'color 0.2s',
                    display: 'flex',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={profileForm.expertise}
                    onFocus={() => setFocusedInput('expertise')}
                    onBlur={() => setFocusedInput(null)}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, expertise: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: 'var(--radius-md)',
                      border: focusedInput === 'expertise' ? '1px solid rgba(233,113,28,0.5)' : '1px solid var(--line)',
                      background: '#ffffff',
                      fontSize: '14px',
                      color: 'var(--foreground)',
                      outline: 'none',
                      boxShadow: focusedInput === 'expertise' ? '0 0 0 3px rgba(233,113,28,0.12)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="cp-btn-primary"
                style={{
                  alignSelf: 'flex-start',
                  marginTop: '10px',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                  boxShadow: '0 4px 12px rgba(233,113,28,0.15)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(233,113,28,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(233,113,28,0.15)';
                }}
              >
                Simpan Perubahan
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Field 1: Password Saat Ini */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>Password Saat Ini</label>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '14px',
                    color: focusedInput === 'currentPassword' ? 'var(--accent)' : 'var(--muted)',
                    transition: 'color 0.2s',
                    display: 'flex',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onFocus={() => setFocusedInput('currentPassword')}
                    onBlur={() => setFocusedInput(null)}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: 'var(--radius-md)',
                      border: focusedInput === 'currentPassword' ? '1px solid rgba(233,113,28,0.5)' : '1px solid var(--line)',
                      background: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      boxShadow: focusedInput === 'currentPassword' ? '0 0 0 3px rgba(233,113,28,0.12)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  />
                </div>
              </div>

              {/* Field 2: Password Baru */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>Password Baru</label>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '14px',
                    color: focusedInput === 'newPassword' ? 'var(--accent)' : 'var(--muted)',
                    transition: 'color 0.2s',
                    display: 'flex',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onFocus={() => setFocusedInput('newPassword')}
                    onBlur={() => setFocusedInput(null)}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: 'var(--radius-md)',
                      border: focusedInput === 'newPassword' ? '1px solid rgba(233,113,28,0.5)' : '1px solid var(--line)',
                      background: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      boxShadow: focusedInput === 'newPassword' ? '0 0 0 3px rgba(233,113,28,0.12)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  />
                </div>
              </div>

              {/* Field 3: Konfirmasi Password Baru */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>Konfirmasi Password Baru</label>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '14px',
                    color: focusedInput === 'confirmPassword' ? 'var(--accent)' : 'var(--muted)',
                    transition: 'color 0.2s',
                    display: 'flex',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onFocus={() => setFocusedInput('confirmPassword')}
                    onBlur={() => setFocusedInput(null)}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: 'var(--radius-md)',
                      border: focusedInput === 'confirmPassword' ? '1px solid rgba(233,113,28,0.5)' : '1px solid var(--line)',
                      background: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      boxShadow: focusedInput === 'confirmPassword' ? '0 0 0 3px rgba(233,113,28,0.12)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="cp-btn-primary"
                style={{
                  alignSelf: 'flex-start',
                  marginTop: '10px',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                  boxShadow: '0 4px 12px rgba(233,113,28,0.15)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(233,113,28,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(233,113,28,0.15)';
                }}
              >
                Perbarui Password
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/app/admin/\(shell\)/profile/page.tsx
git commit -m "style: elevate Profile page with premium design accents, mesh texture, glow avatar, SVG icons, and sliding tab selector"
```

---

### Task 2: Build Verification

- [ ] **Step 1: Jalankan Typecheck & Build untuk memvalidasi halaman**

Run: `npm run build` dari `d:\Data - Alieja Web\app-copublika\apps\frontend`
Expected: Compile successfully without errors or warnings.
