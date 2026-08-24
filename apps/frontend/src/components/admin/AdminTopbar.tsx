'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'success' | 'warning' | 'info' | 'danger';
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Verifikasi Berhasil',
    message: 'Dr. Wira Pradana telah berhasil diverifikasi otomatis.',
    time: '2 menit yang lalu',
    read: false,
    type: 'success'
  },
  {
    id: '2',
    title: 'Proyek Baru',
    message: '"Doctoral Supervision in the Online Modality" perlu review.',
    time: '18 menit yang lalu',
    read: false,
    type: 'info'
  },
  {
    id: '3',
    title: 'Batch Hampir Penuh',
    message: 'Batch #4 telah mencapai 68% kapasitas (204/300).',
    time: '1 jam yang lalu',
    read: true,
    type: 'warning'
  },
  {
    id: '4',
    title: 'Pendaftar Ditolak',
    message: 'APP-2415 ditolak otomatis - Scholar ID tidak valid.',
    time: '3 jam yang lalu',
    read: true,
    type: 'danger'
  }
];

interface AdminTopbarProps {
  onMenuToggle: () => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ onMenuToggle }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('cp-topbar-search');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case 'danger':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      default:
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        );
    }
  };

  return (
    <header className="cp-topbar">
      <button 
        className="cp-menu-toggle" 
        aria-label="Toggle menu" 
        onClick={onMenuToggle}
      >
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.8" 
          strokeLinecap="round"
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      <div className="cp-top-search">
        <svg 
          className="search-i" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input 
          id="cp-topbar-search"
          type="text" 
          placeholder="Cari member, proyek, Google Scholar ID, post…" 
        />
        <span className="kbd">⌘ K</span>
      </div>

      <div className="cp-top-actions">
        {/* Notification */}
        <div className="cp-notif-wrapper" ref={notifRef}>
          <button 
            className="cp-icon-btn cp-notif-btn" 
            title="Notifikasi"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.7" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="cp-notif-badge">{unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div className="cp-notif-dropdown">
              <div className="cp-notif-header">
                <h4>Notifikasi</h4>
                <div className="cp-notif-header-actions">
                  {unreadCount > 0 && (
                    <button className="cp-notif-action-btn" onClick={markAllAsRead}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Tandai dibaca
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button className="cp-notif-action-btn cp-notif-clear" onClick={clearAll}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <div className="cp-notif-list">
                {notifications.length === 0 ? (
                  <div className="cp-notif-empty">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                    <p>Tidak ada notifikasi</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`cp-notif-item ${!notif.read ? 'unread' : ''}`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <div className={`cp-notif-icon cp-notif-${notif.type}`}>
                        {getNotifIcon(notif.type)}
                      </div>
                      <div className="cp-notif-content">
                        <div className="cp-notif-title">{notif.title}</div>
                        <div className="cp-notif-message">{notif.message}</div>
                        <div className="cp-notif-time">{notif.time}</div>
                      </div>
                      {!notif.read && <div className="cp-notif-dot" />}
                    </div>
                  ))
                )}
              </div>
              <div className="cp-notif-footer">
                <Link href="/admin/notifications" className="cp-notif-view-all">
                  Lihat semua notifikasi
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Account */}
        <div className="cp-account-wrapper" ref={accountRef}>
          <button 
            className="cp-top-profile" 
            onClick={() => setAccountOpen(!accountOpen)}
            aria-label="Account menu"
          >
            <span className="av">AW</span>
          </button>

          {accountOpen && (
            <div className="cp-account-dropdown">
              <div className="cp-account-header">
                <div className="cp-account-avatar">AW</div>
                <div className="cp-account-info">
                  <span className="cp-account-name">Adi Wijaya</span>
                  <span className="cp-account-role">Superadmin</span>
                  <span className="cp-account-email">copublika@gmail.com</span>
                </div>
              </div>
              <div className="cp-account-divider" />
              <div className="cp-account-menu">
                <Link href="/admin/profile" className="cp-account-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Profil</span>
                </Link>
                <Link href="/admin/settings" className="cp-account-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>Pengaturan</span>
                </Link>
              </div>
              <div className="cp-account-divider" />
              <div className="cp-account-menu">
                <button className="cp-account-item cp-account-logout">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};