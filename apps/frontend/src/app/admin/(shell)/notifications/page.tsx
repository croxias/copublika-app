'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'success' | 'warning' | 'info' | 'danger';
  category: 'verification' | 'project' | 'system' | 'batch';
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Verifikasi Berhasil',
    message: 'Dr. Wira Pradana telah berhasil diverifikasi otomatis dengan skor kecocokan 94%.',
    time: '2 menit yang lalu',
    read: false,
    type: 'success',
    category: 'verification'
  },
  {
    id: '2',
    title: 'Proyek Baru Diajukan',
    message: '"Doctoral Supervision in the Online Modality" oleh Dr. Hadi Suryanto perlu review.',
    time: '18 menit yang lalu',
    read: false,
    type: 'info',
    category: 'project'
  },
  {
    id: '3',
    title: 'Batch Hampir Penuh',
    message: 'Batch #4 telah mencapai 68% kapasitas (204/300). Pertimbangkan untuk membuka batch baru.',
    time: '1 jam yang lalu',
    read: true,
    type: 'warning',
    category: 'batch'
  },
  {
    id: '4',
    title: 'Pendaftar Ditolak Otomatis',
    message: 'APP-2415 ditolak otomatis - Scholar ID tidak valid atau tidak ditemukan.',
    time: '3 jam yang lalu',
    read: true,
    type: 'danger',
    category: 'verification'
  },
  {
    id: '5',
    title: 'Event Dipublikasikan',
    message: 'Event "Strategi Memilih Jurnal Q1" berhasil dipublikasikan dan tampil di kalender publik.',
    time: '5 jam yang lalu',
    read: true,
    type: 'success',
    category: 'system'
  },
  {
    id: '6',
    title: 'Template Populer',
    message: 'Template "Cover Letter — Computers & Education" diunduh 12 kali dalam 24 jam terakhir.',
    time: '8 jam yang lalu',
    read: true,
    type: 'info',
    category: 'system'
  },
  {
    id: '7',
    title: 'Verifikasi Manual Diperlukan',
    message: 'APP-2417 memerlukan verifikasi manual - afiliasi tidak cocok dengan database.',
    time: '12 jam yang lalu',
    read: false,
    type: 'warning',
    category: 'verification'
  },
  {
    id: '8',
    title: 'Artikel Dipublikasi',
    message: '"7 Heuristik Memilih Reviewer" dipublikasi otomatis. Traffic awal: 1.240 visit.',
    time: '1 hari yang lalu',
    read: true,
    type: 'success',
    category: 'system'
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'verification' | 'project' | 'system'>('all');
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    document.title = 'Notification Center — CoPublika Admin';
    const timer = setTimeout(() => setReveal(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.category === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalCount = notifications.length;
  const verificationCount = notifications.filter((n) => n.category === 'verification').length;
  const projectCount = notifications.filter((n) => n.category === 'project').length;
  const systemCount = notifications.filter((n) => n.category === 'system').length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case 'danger':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        );
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="cp-pg-head">
        <div className="cp-greet">
          <div className="cp-crumb">
            <Link href="/admin/dashboard">Overview</Link>
            <span className="cp-sep">/</span>
            <span>Notification Center</span>
          </div>
          <h1>Notification Center</h1>
          <p>
            {unreadCount > 0 ? (
              <>
                {unreadCount} notifikasi belum dibaca dari {totalCount} total notifikasi
              </>
            ) : (
              <>Semua notifikasi telah dibaca</>
            )}
          </p>
        </div>
        <div className="cp-notif-actions">
          {unreadCount > 0 && (
            <button className="cp-vbtn cp-ghost" onClick={markAllAsRead}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Tandai semua dibaca
            </button>
          )}
          {totalCount > 0 && (
            <button className="cp-vbtn cp-ghost cp-danger" onClick={clearAll}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Clear notifications
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <section className="cp-notif-summary">
        <div className={`cp-notif-summary-card cp-reveal ${reveal ? 'cp-in' : ''}`}>
          <div className="cp-notif-summary-icon cp-notif-success">
            {getNotifIcon('success')}
          </div>
          <div className="cp-notif-summary-info">
            <span className="cp-notif-summary-count">{totalCount}</span>
            <span className="cp-notif-summary-label">Total Notifikasi</span>
          </div>
        </div>
        <div className={`cp-notif-summary-card cp-reveal ${reveal ? 'cp-in' : ''}`}>
          <div className="cp-notif-summary-icon cp-notif-warning">
            {getNotifIcon('warning')}
          </div>
          <div className="cp-notif-summary-info">
            <span className="cp-notif-summary-count">{unreadCount}</span>
            <span className="cp-notif-summary-label">Belum Dibaca</span>
          </div>
        </div>
        <div className={`cp-notif-summary-card cp-reveal ${reveal ? 'cp-in' : ''}`}>
          <div className="cp-notif-summary-icon cp-notif-info">
            {getNotifIcon('info')}
          </div>
          <div className="cp-notif-summary-info">
            <span className="cp-notif-summary-count">{verificationCount}</span>
            <span className="cp-notif-summary-label">Verifikasi</span>
          </div>
        </div>
        <div className={`cp-notif-summary-card cp-reveal ${reveal ? 'cp-in' : ''}`}>
          <div className="cp-notif-summary-icon cp-notif-danger">
            {getNotifIcon('danger')}
          </div>
          <div className="cp-notif-summary-info">
            <span className="cp-notif-summary-count">{projectCount}</span>
            <span className="cp-notif-summary-label">Proyek</span>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="cp-notif-filters">
        <div className="cp-tabs cp-notif-tabs">
          <button className={`cp-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            Semua <span className="ct">{totalCount}</span>
          </button>
          <button className={`cp-tab ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
            Belum Dibaca <span className="ct">{unreadCount}</span>
          </button>
          <button className={`cp-tab ${filter === 'verification' ? 'active' : ''}`} onClick={() => setFilter('verification')}>
            Verifikasi <span className="ct">{verificationCount}</span>
          </button>
          <button className={`cp-tab ${filter === 'project' ? 'active' : ''}`} onClick={() => setFilter('project')}>
            Proyek <span className="ct">{projectCount}</span>
          </button>
          <button className={`cp-tab ${filter === 'system' ? 'active' : ''}`} onClick={() => setFilter('system')}>
            Sistem <span className="ct">{systemCount}</span>
          </button>
        </div>
      </section>

      {/* Notifications List */}
      <section className={`cp-card cp-notif-list-card cp-reveal ${reveal ? 'cp-in' : ''}`}>
        {filteredNotifications.length === 0 ? (
          <div className="cp-notif-empty-state">
            <div className="cp-notif-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </div>
            <h4>Tidak ada notifikasi</h4>
            <p>
              {filter === 'all'
                ? 'Belum ada notifikasi yang masuk. Notifikasi akan muncul di sini ketika ada aktivitas.'
                : 'Tidak ada notifikasi pada kategori ini.'}
            </p>
          </div>
        ) : (
          <div className="cp-notif-timeline">
            {filteredNotifications.map((notif, index) => (
              <div
                key={notif.id}
                className={`cp-notif-timeline-item ${!notif.read ? 'unread' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => markAsRead(notif.id)}
              >
                <div className={`cp-notif-timeline-icon cp-notif-${notif.type}`}>
                  {getNotifIcon(notif.type)}
                </div>
                <div className="cp-notif-timeline-content">
                  <div className="cp-notif-timeline-header">
                    <span className="cp-notif-timeline-title">{notif.title}</span>
                    <span className="cp-notif-timeline-time">{notif.time}</span>
                  </div>
                  <p className="cp-notif-timeline-message">{notif.message}</p>
                  <div className="cp-notif-timeline-meta">
                    <span className={`cp-pill cp-${notif.type === 'success' ? 'success' : notif.type === 'warning' ? 'pending' : notif.type === 'danger' ? 'rejected' : 'plain'}`}>
                      {notif.category === 'verification' ? 'Verifikasi' : notif.category === 'project' ? 'Proyek' : notif.category === 'batch' ? 'Batch' : 'Sistem'}
                    </span>
                    {!notif.read && <span className="cp-notif-unread-dot">Baru</span>}
                  </div>
                </div>
                {!notif.read && <div className="cp-notif-timeline-indicator" />}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
