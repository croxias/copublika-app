'use client';

import React from 'react';
import Link from 'next/link';

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: string;
  badge?: string;
  soft?: boolean;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const getNav = (): NavSection[] => [
  {
    section: 'Overview',
    items: [
      { id: 'dashboard', name: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard' },
      { id: 'analytics', name: 'Analytics', href: '/admin/analytics', icon: 'chart' }
    ]
  },
  {
    section: 'Curation',
    items: [
      { id: 'verifications', name: 'Verifikasi Pendaftar', href: '#', icon: 'user-check', badge: '14' },
      { id: 'batches', name: 'Batch Management', href: '#', icon: 'clock' },
      { id: 'members', name: 'Anggota', href: '#', icon: 'users', badge: '1.240', soft: true }
    ]
  },
  {
    section: 'Project Governance',
    items: [
      { id: 'projects', name: 'Riset & Proyek', href: '#', icon: 'file', badge: '8' },
      { id: 'clusters', name: 'Cluster Riset', href: '#', icon: 'grid' }
    ]
  },
  {
    section: 'Content',
    items: [
      { id: 'blog', name: 'Blog', href: '#', icon: 'edit' },
      { id: 'events', name: 'Event', href: '#', icon: 'calendar' },
      { id: 'lms', name: 'LMS — Siap Tembus Scopus', href: '#', icon: 'book' },
      { id: 'templates', name: 'Template Vault', href: '#', icon: 'package' }
    ]
  },
  {
    section: 'System',
    items: [
      { id: 'settings', name: 'Pengaturan Situs', href: '/admin/settings', icon: 'settings' },
      { id: 'audit', name: 'Audit & Keamanan', href: '#', icon: 'shield' }
    ]
  }
];

const ICONS: Record<string, React.ReactNode> = {
  'dashboard': (
    <g>
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </g>
  ),
  'chart': (
    <g>
      <path d="M3 3v18h18" />
      <path d="m7 14 4-4 4 4 5-5" />
    </g>
  ),
  'user-check': (
    <g>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </g>
  ),
  'clock': (
    <g>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4l2.5 2.5" />
    </g>
  ),
  'users': (
    <g>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </g>
  ),
  'file': (
    <g>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6" />
    </g>
  ),
  'grid': (
    <g>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h6v6H9z" />
    </g>
  ),
  'edit': (
    <g>
      <path d="M4 4h16v16H4z" />
      <path d="M4 9h16M9 4v16" />
    </g>
  ),
  'calendar': (
    <g>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </g>
  ),
  'book': (
    <g>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </g>
  ),
  'package': (
    <g>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="m3.27 6.96 8.73 5.05 8.73-5.05M12 22.08V12" />
    </g>
  ),
  'settings': (
    <g>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </g>
  ),
  'shield': (
    <g>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </g>
  )
};

interface AdminSidebarProps {
  activePage: string;
  isOpen?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activePage, isOpen = false }) => {
  const renderIcon = (name: string) => {
    return (
      <svg
        className="ico"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ICONS[name] || null}
      </svg>
    );
  };

  const nav = getNav();

  return (
    <aside className={`cp-side ${isOpen ? 'open' : ''}`}>
      <Link href="/admin/dashboard" className="cp-side-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-white.png" alt="CoPublika" />
        <div className="role">Superadmin</div>
      </Link>
      
      <nav className="cp-side-nav">
        {nav.map((section, idx) => (
          <div className="cp-side-section" key={idx}>
            <h6>{section.section}</h6>
            {section.items.map((item) => {
              const isActive = item.id === activePage;
              return (
                <Link
                  href={item.href}
                  className={`cp-side-link ${isActive ? 'active' : ''}`}
                  key={item.id}
                >
                  {renderIcon(item.icon)}
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className={`badge ${item.soft ? 'soft' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="cp-side-foot">
        <Link href="#" className="cp-batch-card">
          <div className="label">Batch #4 · Open</div>
          <div className="name">September 2025</div>
          <div className="meta">204 / 300 kuota terisi</div>
          <div className="bar">
            <span style={{ width: '68%' }}></span>
          </div>
        </Link>
      </div>
    </aside>
  );
};
