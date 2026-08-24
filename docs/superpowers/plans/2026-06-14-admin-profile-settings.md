# Admin Profile & Settings Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membuat halaman Profile (`/admin/profile`) dan Settings (`/admin/settings`) untuk Superadmin, serta menghubungkan navigasi dropdown akun di header dan sidebar.

**Architecture:** Menggunakan Next.js Client Component di dalam route group `(shell)` sehingga secara otomatis mewarisi layout Sidebar dan Topbar. Layout halaman menggunakan CSS grid `.cp-grid-2` untuk menyelaraskan tampilan Bento-box yang serasi dengan Dashboard utama.

**Tech Stack:** React, Next.js (App Router), TypeScript, Tailwind CSS / Vanilla CSS (berdasarkan `admin.css` yang sudah ada).

---

### Task 1: Dynamic activePage in AdminShellLayout

**Files:**
- Modify: [layout.tsx](file:///d:/Data%20-%20Alieja%20Web/app-copublika/apps/frontend/src/app/admin/%28shell%29/layout.tsx)

- [ ] **Step 1: Ganti `activePage` statis dengan deteksi dinamis dari `usePathname`**

Update `apps/frontend/src/app/admin/(shell)/layout.tsx` agar menggunakan `usePathname` untuk melacak rute aktif dan mengirimkannya ke `AdminSidebar`:

```tsx
'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import '../admin.css';

export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  // Tentukan id menu aktif berdasarkan pathname
  let activePage = 'dashboard';
  if (pathname.includes('/admin/analytics')) activePage = 'analytics';
  else if (pathname.includes('/admin/settings')) activePage = 'settings';
  else if (pathname.includes('/admin/profile')) activePage = 'profile'; // profile tidak ada di sidebar utama tapi dideteksi agar dashboard tidak aktif

  return (
    <div className="cp-admin-body">
      <div className="cp-admin">
        {/* Sidebar */}
        <AdminSidebar activePage={activePage} isOpen={sidebarOpen} />

        {/* Overlay to close sidebar on mobile */}
        {sidebarOpen && (
          <div 
            className="cp-sidebar-overlay"
            onClick={handleOverlayClick}
          />
        )}

        {/* Main Content Area */}
        <div className="cp-main">
          <AdminTopbar onMenuToggle={handleMenuToggle} />
          <main className="cp-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/app/admin/\(shell\)/layout.tsx
git commit -m "feat: make activePage dynamic in admin shell layout using usePathname"
```

---

### Task 2: Build the Superadmin Profile Page

**Files:**
- Create: `apps/frontend/src/app/admin/(shell)/profile/page.tsx`

- [ ] **Step 1: Buat file halaman profil Superadmin**

Buat file baru di `apps/frontend/src/app/admin/(shell)/profile/page.tsx` dengan kode berikut:

```tsx
'use client';

import React, { useState } from 'react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'pribadi' | 'keamanan'>('pribadi');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '32px' }}>
      <div className="cp-content-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="cp-title">Profil Superadmin</h1>
          <p className="cp-subtitle">Kelola informasi akun dan pengaturan keamanan Anda.</p>
        </div>
      </div>

      {message && (
        <div style={{
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: message.type === 'success' ? '#10b981' : '#ef4444',
          fontSize: '14px',
          fontWeight: 500,
        }}>
          {message.text}
        </div>
      )}

      <div className="cp-grid-2">
        {/* Kolom Kiri: Ringkasan Profil */}
        <div className="cp-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 24px', gap: '24px' }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0f172a, #334155)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 700,
            border: '2px solid var(--line)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}>
            AW
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>{profileForm.name}</h3>
            <span style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--accent)',
              background: 'rgba(233, 113, 28, 0.08)',
              border: '1px solid rgba(233, 113, 28, 0.2)',
              padding: '2px 8px',
              borderRadius: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '12px',
            }}>
              Superadmin
            </span>
            <p style={{ fontSize: '13px', color: 'var(--muted)' }}>{profileForm.email}</p>
          </div>

          <div style={{ width: '100%', height: '1px', background: 'var(--line)' }} />

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--muted)' }}>Verifikasi Disetujui</span>
              <strong style={{ color: 'var(--foreground)' }}>124 pendaftar</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--muted)' }}>Proyek Direview</span>
              <strong style={{ color: 'var(--foreground)' }}>42 proyek</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--muted)' }}>Status Akun</span>
              <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                Aktif
              </span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Detail & Keamanan (Form Tab) */}
        <div className="cp-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Tab Navigation */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', gap: '24px', paddingBottom: '4px' }}>
            <button
              onClick={() => setActiveTab('pribadi')}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 4px 12px 4px',
                fontSize: '14px',
                fontWeight: activeTab === 'pribadi' ? 600 : 500,
                color: activeTab === 'pribadi' ? 'var(--foreground)' : 'var(--muted)',
                borderBottom: activeTab === 'pribadi' ? '2px solid var(--foreground)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Informasi Pribadi
            </button>
            <button
              onClick={() => setActiveTab('keamanan')}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 4px 12px 4px',
                fontSize: '14px',
                fontWeight: activeTab === 'keamanan' ? 600 : 500,
                color: activeTab === 'keamanan' ? 'var(--foreground)' : 'var(--muted)',
                borderBottom: activeTab === 'keamanan' ? '2px solid var(--foreground)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Keamanan Akun
            </button>
          </div>

          {activeTab === 'pribadi' ? (
            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>Nama Lengkap</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--line)',
                    background: '#ffffff',
                    fontSize: '14px',
                    color: 'var(--foreground)',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>Alamat Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--line)',
                    background: '#ffffff',
                    fontSize: '14px',
                    color: 'var(--foreground)',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>Afiliasi Kampus / Instansi</label>
                <input
                  type="text"
                  value={profileForm.affiliation}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, affiliation: e.target.value }))}
                  required
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--line)',
                    background: '#ffffff',
                    fontSize: '14px',
                    color: 'var(--foreground)',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>Bidang Kepakaran</label>
                <input
                  type="text"
                  value={profileForm.expertise}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, expertise: e.target.value }))}
                  required
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--line)',
                    background: '#ffffff',
                    fontSize: '14px',
                    color: 'var(--foreground)',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                className="cp-btn-primary"
                style={{
                  alignSelf: 'flex-start',
                  marginTop: '6px',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                }}
              >
                Simpan Perubahan
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>Password Saat Ini</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  required
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--line)',
                    background: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>Password Baru</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  required
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--line)',
                    background: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>Konfirmasi Password Baru</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--line)',
                    background: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                className="cp-btn-primary"
                style={{
                  alignSelf: 'flex-start',
                  marginTop: '6px',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                }}
              >
                Perbarui Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/app/admin/\(shell\)/profile/page.tsx
git commit -m "feat: implement Superadmin profile page with bento layout and dynamic tabs"
```

---

### Task 3: Build the Superadmin Settings Page

**Files:**
- Create: `apps/frontend/src/app/admin/(shell)/settings/page.tsx`

- [ ] **Step 1: Buat file halaman pengaturan Superadmin**

Buat file baru di `apps/frontend/src/app/admin/(shell)/settings/page.tsx` dengan kode berikut:

```tsx
'use client';

import React, { useState } from 'react';

export default function SettingsPage() {
  const [batchOpen, setBatchOpen] = useState(true);
  const [batchQuota, setBatchQuota] = useState(300);
  const [batchDeadline, setBatchDeadline] = useState('2025-09-30');
  const [autoVerify, setAutoVerify] = useState(true);
  const [minHIndex, setMinHIndex] = useState(2);

  const [notifNewMember, setNotifNewMember] = useState(true);
  const [notifNewProject, setNotifNewProject] = useState(true);
  const [notifVerificationFail, setNotifVerificationFail] = useState(false);

  const [message, setMessage] = useState<string | null>(null);

  const handleSaveBatch = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Konfigurasi Batch Pendaftaran berhasil disimpan!');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSaveCurator = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Aturan Kurasi Google Scholar berhasil diperbarui!');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSaveNotif = () => {
    setMessage('Preferensi Notifikasi Sistem disimpan!');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '32px' }}>
      <div className="cp-content-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="cp-title">Pengaturan Situs</h1>
          <p className="cp-subtitle">Kelola konfigurasi batch pendaftaran, sistem kurasi, dan preferensi notifikasi.</p>
        </div>
      </div>

      {message && (
        <div style={{
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid #10b981',
          color: '#10b981',
          fontSize: '14px',
          fontWeight: 500,
        }}>
          {message}
        </div>
      )}

      <div className="cp-grid-2">
        {/* Kolom Kiri: Batch & Scholar Rules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card 1: Batch Configuration */}
          <div className="cp-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)' }}>Manajemen Batch Pendaftaran</h3>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: batchOpen ? '#10b981' : 'var(--muted)',
                background: batchOpen ? 'rgba(16, 185, 129, 0.08)' : 'var(--line)',
                padding: '2px 8px',
                borderRadius: '4px',
              }}>
                Batch #4 · {batchOpen ? 'Open' : 'Closed'}
              </span>
            </div>

            <form onSubmit={handleSaveBatch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>Status Pendaftaran Batch</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Buka atau tutup akses pendaftaran batch baru bagi publik.</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={batchOpen}
                    onChange={(e) => setBatchOpen(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: batchOpen ? 'var(--accent)' : '#ccc',
                    borderRadius: '34px',
                    transition: '0.4s',
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '14px', width: '14px',
                      left: batchOpen ? '23px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: '0.4s',
                    }} />
                  </span>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>Batas Kuota Batch</label>
                  <input
                    type="number"
                    value={batchQuota}
                    onChange={(e) => setBatchQuota(Number(e.target.value))}
                    required
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--line)',
                      background: '#ffffff',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>Tanggal Penutupan</label>
                  <input
                    type="date"
                    value={batchDeadline}
                    onChange={(e) => setBatchDeadline(e.target.value)}
                    required
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--line)',
                      background: '#ffffff',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="cp-btn-primary"
                style={{
                  alignSelf: 'flex-start',
                  fontSize: '12px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                }}
              >
                Simpan Konfigurasi Batch
              </button>
            </form>
          </div>

          {/* Card 2: Google Scholar Verification */}
          <div className="cp-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)' }}>Integrasi & Kurasi Google Scholar</h3>
            </div>

            <form onSubmit={handleSaveCurator} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>Google Scholar One-Click Verification</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Tarik otomatis metadata H-Index dan instansi pendaftar secara real-time.</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={autoVerify}
                    onChange={(e) => setAutoVerify(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: autoVerify ? 'var(--accent)' : '#ccc',
                    borderRadius: '34px',
                    transition: '0.4s',
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '14px', width: '14px',
                      left: autoVerify ? '23px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: '0.4s',
                    }} />
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>Batas Minimum H-Index Auto-Approval</label>
                <input
                  type="number"
                  value={minHIndex}
                  onChange={(e) => setMinHIndex(Number(e.target.value))}
                  required
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--line)',
                    background: '#ffffff',
                    fontSize: '13px',
                    width: '120px',
                    outline: 'none',
                  }}
                />
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  Pendaftar dengan Scholar H-Index &gt;= batas ini akan disarankan untuk otomatis diterima.
                </span>
              </div>

              <button
                type="submit"
                className="cp-btn-primary"
                style={{
                  alignSelf: 'flex-start',
                  fontSize: '12px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                }}
              >
                Simpan Aturan Kurasi
              </button>
            </form>
          </div>
        </div>

        {/* Kolom Kanan: Notifications & System Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card 3: Email Notifications */}
          <div className="cp-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)' }}>Notifikasi Sistem</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>Pendaftar Baru Masuk</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Kirim email alert saat ada pendaftar batch baru.</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '18px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifNewMember}
                    onChange={(e) => setNotifNewMember(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: notifNewMember ? 'var(--accent)' : '#ccc',
                    borderRadius: '34px',
                    transition: '0.3s',
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '12px', width: '12px',
                      left: notifNewMember ? '21px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: '0.3s',
                    }} />
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>Pengajuan Proyek Baru</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Kirim email alert untuk antrian persetujuan proyek riset.</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '18px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifNewProject}
                    onChange={(e) => setNotifNewProject(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: notifNewProject ? 'var(--accent)' : '#ccc',
                    borderRadius: '34px',
                    transition: '0.3s',
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '12px', width: '12px',
                      left: notifNewProject ? '21px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: '0.3s',
                    }} />
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>Kegagalan Verifikasi</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Kirim email alert saat Scholar ID tidak dapat di-fetch.</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '18px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifVerificationFail}
                    onChange={(e) => setNotifVerificationFail(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: notifVerificationFail ? 'var(--accent)' : '#ccc',
                    borderRadius: '34px',
                    transition: '0.3s',
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '12px', width: '12px',
                      left: notifVerificationFail ? '21px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: '0.3s',
                    }} />
                  </span>
                </label>
              </div>

              <button
                onClick={handleSaveNotif}
                className="cp-btn-primary"
                style={{
                  alignSelf: 'flex-start',
                  fontSize: '12px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  marginTop: '8px',
                  border: 'none',
                  outline: 'none',
                }}
              >
                Simpan Notifikasi
              </button>
            </div>
          </div>

          {/* Card 4: System Audit */}
          <div className="cp-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)' }}>Audit & Keamanan</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>
                Unduh riwayat log aktivitas admin untuk kebutuhan audit keamanan ekosistem CoPublika.
              </div>
              
              <div style={{
                background: 'rgba(244, 241, 235, 0.5)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                border: '1px solid var(--line)',
              }}>
                <div>Database Status: <strong style={{ color: '#10b981' }}>Connected</strong></div>
                <div>Server Load: <strong style={{ color: 'var(--foreground)' }}>0.08 (Ok)</strong></div>
                <div>Last Audit Log Backup: <span style={{ color: 'var(--muted)' }}>Hari ini, 04:00 WIB</span></div>
              </div>

              <button
                className="cp-btn-secondary"
                style={{
                  alignSelf: 'flex-start',
                  fontSize: '12px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  border: '1px solid var(--line)',
                  outline: 'none',
                  background: 'none',
                  color: 'var(--foreground)',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                }}
                onClick={() => {
                  setMessage('Mengunduh audit log backup...');
                  setTimeout(() => setMessage(null), 3000);
                }}
              >
                Download Audit Log (.csv)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/app/admin/\(shell\)/settings/page.tsx
git commit -m "feat: implement Superadmin Settings page with Batch and Scholar controls"
```

---

### Task 4: Connect sidebar link to Settings Page

**Files:**
- Modify: [AdminSidebar.tsx](file:///d:/Data%20-%20Alieja%20Web/app-copublika/apps/frontend/src/components/admin/AdminSidebar.tsx)

- [ ] **Step 1: Ganti tautan link "Pengaturan Situs" dari `#` ke `/admin/settings`**

Modifikasi file `apps/frontend/src/components/admin/AdminSidebar.tsx` baris ke-55 untuk mengubah href setting item dari `#` ke `/admin/settings`:

```diff
   {
     section: 'System',
     items: [
-      { id: 'settings', name: 'Pengaturan Situs', href: '#', icon: 'settings' },
+      { id: 'settings', name: 'Pengaturan Situs', href: '/admin/settings', icon: 'settings' },
       { id: 'audit', name: 'Audit & Keamanan', href: '#', icon: 'shield' }
     ]
   }
```

- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/components/admin/AdminSidebar.tsx
git commit -m "feat: connect sidebar settings item to /admin/settings"
```

---

### Task 5: Build Verification

- [ ] **Step 1: Jalankan Typecheck & Build untuk memvalidasi halaman**

Run: `npm run build` dari `d:\Data - Alieja Web\app-copublika\apps\frontend`
Expected: Compile successfully without errors or warnings.
