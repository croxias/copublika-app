'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

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

  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (text: string) => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    setMessage(text);
    messageTimeoutRef.current = setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  useEffect(() => {
    document.title = 'Pengaturan Situs — CoPublika Admin';
  }, []);

  const handleSaveBatch = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Konfigurasi Batch Pendaftaran berhasil disimpan!');
  };

  const handleSaveCurator = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Aturan Kurasi Google Scholar berhasil diperbarui!');
  };

  const handleSaveNotif = () => {
    showToast('Preferensi Notifikasi Sistem disimpan!');
  };

  return (
    <>
      {/* Standard Page Header */}
      <div className="cp-pg-head">
        <div className="cp-greet">
          <div className="cp-crumb">
            <Link href="/admin/dashboard">Overview</Link>
            <span className="cp-sep">/</span>
            <span>Pengaturan</span>
          </div>
          <h1>Pengaturan Situs</h1>
          <p>Kelola konfigurasi pendaftaran batch, sistem kurasi, dan preferensi notifikasi.</p>
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
          marginBottom: '20px',
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
                  showToast('Mengunduh audit log backup...');
                }}
              >
                Download Log Audit Keamanan (.csv)
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
