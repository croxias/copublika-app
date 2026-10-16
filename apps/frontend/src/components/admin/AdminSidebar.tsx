'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ChevronLeft, ChevronRight, UserRound } from 'lucide-react';
import { useCms } from '@/lib/cms/store';
import { inQueue } from '@/lib/cms/review';

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: string;
  badge?: string;
  soft?: boolean;
  /** Planned for a later phase: shown greyed out with "Segera", not clickable. */
  soon?: boolean;
  /** Other routes that belong to this item (e.g. About's sub-page editors). */
  also?: string[];
  /** Sub-menu: the item becomes a toggle that expands these links. */
  children?: NavItem[];
}

interface NavSection {
  section: string;
  items: NavItem[];
}

// Structure: docs/superpowers/specs/2026-10-14-admin-cms-public-pages-design.md \u00a73.
// Menus that only exist as a staging preview stay reachable in demo mode.
const getNav = (demoEnabled = false, reviewCount = 0): NavSection[] => [
  {
    section: 'Ringkasan',
    items: [
      { id: 'dashboard', name: 'Dasbor', href: '/admin/dashboard', icon: 'dashboard' },
      { id: 'analytics', name: 'Analitik', href: '/admin/analytics', icon: 'chart' }
    ]
  },
  {
    section: 'Konten',
    items: [
      { id: 'blog', name: 'Artikel Blog', href: '/admin/blog', icon: 'edit', ...(reviewCount ? { badge: String(reviewCount) } : {}) },
      { id: 'events', name: 'Agenda Event', href: '/admin/events', icon: 'calendar' }
    ]
  },
  {
    section: 'Riset',
    items: [
      { id: 'projects', name: 'Riset & Proyek', href: '/admin/projects', icon: 'file' },
      { id: 'publications', name: 'Publikasi Anggota', href: '/admin/publications', icon: 'book' }
    ]
  },
  {
    section: 'Konfigurasi Website Publik',
    items: [
      { id: 'page-home', name: 'Beranda', href: '/admin/website/home', icon: 'home' },
      { id: 'page-about', name: 'About', href: '/admin/website/about', icon: 'info', also: ['/admin/website/about-team', '/admin/website/about-mentors'] },
      { id: 'page-research', name: 'Halaman Riset', href: '/admin/website/research', icon: 'layout' },
      { id: 'page-blog', name: 'Halaman Blog', href: '/admin/website/blog', icon: 'book' },
      {
        id: 'program',
        name: 'Program',
        href: '/admin/website/siap-tembus-scopus',
        icon: 'award',
        children: [
          { id: 'program-sts', name: 'Siap Tembus Scopus', href: '/admin/website/siap-tembus-scopus', icon: 'award' },
          { id: 'program-btm', name: 'Bootcamp 30 Hari', href: '/admin/website/bootcamp-menulis', icon: 'edit' }
        ]
      },
      { id: 'page-curation', name: 'Proses Kurasi', href: '/admin/website/curation', icon: 'route' },
      { id: 'page-contact', name: 'Kontak', href: '/admin/website/contact', icon: 'mail' }
    ]
  },
  {
    section: 'Pustaka Bersama',
    items: [
      { id: 'people', name: 'Tim & Mentor', href: '/admin/library/people', icon: 'users' },
      { id: 'testimonials', name: 'Testimoni', href: '/admin/library/testimonials', icon: 'quote' },
      { id: 'faqs', name: 'FAQ', href: '/admin/library/faqs', icon: 'help' }
    ]
  },
  {
    section: 'Kurasi',
    items: [
      { id: 'batches', name: 'Manajemen Batch', href: '/admin/batches', icon: 'clock' },
      { id: 'applicants', name: 'Verifikasi Pendaftar', href: '/admin/applicants', icon: 'user-check', ...(demoEnabled ? { badge: 'Preview', soft: true } : { soon: true }) },
      { id: 'members', name: 'Anggota', href: '/admin/members', icon: 'users', soon: true }
    ]
  },
  {
    section: 'Program',
    items: [
      { id: 'lms', name: 'Modul LMS', href: '/admin/lms', icon: 'book', soon: true },
      { id: 'templates', name: 'Template Vault', href: '/admin/templates', icon: 'package', soon: true }
    ]
  },
  {
    section: 'Sistem',
    items: [
      { id: 'settings', name: 'Pengaturan Situs', href: '/admin/settings', icon: 'settings' },
      { id: 'audit', name: 'Audit & Keamanan', href: '/admin/audit', icon: 'shield', soon: true }
    ]
  }
];

/** Longest matching href wins, so /admin/website/home beats /admin/website. */
const activeId = (nav: NavSection[], pathname: string) =>
  nav
    .flatMap((s) => s.items.flatMap((i) => i.children ?? [i]))
    .filter((i) => [i.href, ...(i.also ?? [])].some((h) => pathname === h || pathname.startsWith(`${h}/`)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.id;

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
  'layout': (
    <g>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </g>
  ),
  'sliders': (
    <g>
      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
    </g>
  ),
  'info': (
    <g>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
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
  ),
  'home': (
    <g>
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </g>
  ),
  'award': (
    <g>
      <circle cx="12" cy="9" r="6" />
      <path d="m8.5 14.2-1.5 7.8 5-3 5 3-1.5-7.8" />
    </g>
  ),
  'route': (
    <g>
      <circle cx="6" cy="19" r="2.5" />
      <circle cx="18" cy="5" r="2.5" />
      <path d="M8.5 19H17a3.5 3.5 0 0 0 0-7H7a3.5 3.5 0 0 1 0-7h8.5" />
    </g>
  ),
  'mail': (
    <g>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </g>
  ),
  'quote': (
    <g>
      <path d="M4 21c3 0 7-1 7-8V5H4v8h4" />
      <path d="M14 21c3 0 7-1 7-8V5h-7v8h4" />
    </g>
  ),
  'help': (
    <g>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" />
    </g>
  )
};

interface AdminSidebarProps {
  pathname: string;
  isOpen?: boolean;
  demoEnabled?: boolean;
  collapsed?: boolean;
  onCollapse?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ pathname, isOpen = false, demoEnabled = false, collapsed = false, onCollapse }) => {
  const [roleOpen, setRoleOpen] = useState(false);
  /** Sub-menus the admin opened or closed by hand; unset groups follow the active page. */
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [role, setRole] = useState('Administrator');
  const [hoveredTooltip, setHoveredTooltip] = useState<{ label: string; top: number; left: number } | null>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeRoleMenu = (event: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) setRoleOpen(false);
    };
    document.addEventListener('mousedown', closeRoleMenu);
    return () => document.removeEventListener('mousedown', closeRoleMenu);
  }, []);

  const roles = ['Administrator', 'Kurator', 'Editor'];

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

  const reduceMotion = useReducedMotion();
  // Writer submissions waiting for an editor show as a count on Artikel Blog.
  const cms = useCms();
  const nav = getNav(demoEnabled, (cms.collections.blog ?? []).filter(inQueue).length);
  const activePage = activeId(nav, pathname);
  const showTooltip = (event: React.MouseEvent<HTMLAnchorElement> | React.FocusEvent<HTMLAnchorElement>, label: string) => {
    if (!collapsed) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredTooltip({ label, top: rect.top + rect.height / 2, left: rect.right + 12 });
  };

  return (
    <aside className={`cp-shell-sidebar ${isOpen ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}>
      {collapsed && hoveredTooltip && <div className="cp-sidebar-tooltip" role="tooltip" style={{ top: hoveredTooltip.top, left: hoveredTooltip.left }}>{hoveredTooltip.label}</div>}
      <div className="cp-shell-sidebar-topline">
        <Link href="/admin/dashboard" className="cp-shell-sidebar-brand" aria-label="CoPublika dashboard">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.png" alt="CoPublika" />
        </Link>
        <button type="button" className="cp-shell-sidebar-collapse" onClick={() => { setRoleOpen(false); onCollapse?.(); }} aria-label={collapsed ? 'Perbesar sidebar' : 'Perkecil sidebar'} aria-pressed={collapsed}>
          <span className="toggle-icon" aria-hidden="true">{collapsed ? <ChevronRight size={17} strokeWidth={2.4} /> : <ChevronLeft size={17} strokeWidth={2.4} />}</span>
          <span className="toggle-label">{collapsed ? 'Buka sidebar' : 'Perkecil sidebar'}</span>
        </button>
      </div>
      <div className="cp-shell-sidebar-profile">
        <span className="cp-shell-sidebar-avatar" aria-label="Foto profil belum tersedia"><UserRound size={38} strokeWidth={1.7} /></span>
        <div className="cp-shell-sidebar-identity"><strong>Croxias Digital House</strong><small>Admin Console</small></div>
        <div className="cp-shell-sidebar-role" ref={roleRef}>
          <button type="button" className="role-trigger" onClick={() => setRoleOpen((value) => !value)} aria-expanded={roleOpen} aria-haspopup="listbox"><span className="role-dot" aria-hidden="true" />{role}<span className="role-chevron" aria-hidden="true"><ChevronDown size={14} strokeWidth={2.2} /></span></button>
          {roleOpen && <div className="cp-shell-sidebar-role-menu" role="listbox" aria-label="Pilih peran">{roles.map((item) => <button type="button" role="option" aria-selected={role === item} key={item} onClick={() => { setRole(item); setRoleOpen(false); }}><span className="role-option-dot" aria-hidden="true" />{item}{role === item && <span className="role-check" aria-hidden="true">✓</span>}</button>)}</div>}
        </div>
      </div>
      <nav className="cp-shell-sidebar-nav">
        {nav.map((section, idx) => (
          <div className="cp-shell-sidebar-section" key={idx}>
            <h6>{section.section}</h6>
            {section.items.map((item) => {
              if (item.children) {
                const childActive = item.children.some((c) => c.id === activePage);
                const open = collapsed ? false : (openGroups[item.id] ?? childActive);
                return (
                  <div className={`cp-shell-sidebar-group ${childActive ? 'has-active' : ''} ${open ? 'is-open' : ''}`} key={item.id}>
                    {collapsed ? (
                      <Link
                        href={item.href}
                        className={`cp-shell-sidebar-link ${childActive ? 'active' : ''}`}
                        data-tooltip={item.name}
                        title={item.name}
                        aria-label={item.name}
                      >
                        {renderIcon(item.icon)}
                        <span>{item.name}</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className={`cp-shell-sidebar-link cp-shell-sidebar-toggle ${childActive ? 'is-parent-active' : ''}`}
                        aria-expanded={open}
                        aria-controls={`nav-${item.id}`}
                        onClick={() => setOpenGroups((g) => ({ ...g, [item.id]: !open }))}
                      >
                        {renderIcon(item.icon)}
                        <span>{item.name}</span>
                        <span className="cp-shell-sidebar-caret" aria-hidden="true"><ChevronDown size={14} strokeWidth={2.4} /></span>
                      </button>
                    )}
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          id={`nav-${item.id}`}
                          className="cp-shell-sidebar-sub"
                          initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {item.children.map((child, ci) => {
                            const isChildActive = child.id === activePage;
                            return (
                              <motion.div
                                key={child.id}
                                initial={reduceMotion ? false : { x: -8, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.25, delay: 0.05 + ci * 0.05 }}
                              >
                                <Link
                                  href={child.href}
                                  className={`cp-shell-sidebar-sublink ${isChildActive ? 'active' : ''}`}
                                  aria-current={isChildActive ? 'page' : undefined}
                                >
                                  <span className="cp-shell-sidebar-subdot" aria-hidden="true" />
                                  {child.name}
                                </Link>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              const isActive = item.id === activePage;
              if (item.soon) {
                return (
                  <span
                    className="cp-shell-sidebar-link is-soon"
                    aria-disabled="true"
                    title={collapsed ? `${item.name} (segera)` : 'Tersedia di fase berikutnya'}
                    key={item.id}
                  >
                    {renderIcon(item.icon)}
                    <span>{item.name}</span>
                    <span className="badge soon">Segera</span>
                  </span>
                );
              }
              return (
                <Link
                  href={item.href}
                  className={`cp-shell-sidebar-link ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  data-tooltip={item.name}
                  title={collapsed ? item.name : undefined}
                  aria-label={collapsed ? item.name : undefined}
                  onMouseEnter={(event) => showTooltip(event, item.name)}
                  onMouseLeave={() => setHoveredTooltip(null)}
                  onFocus={(event) => showTooltip(event, item.name)}
                  onBlur={() => setHoveredTooltip(null)}
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

    </aside>
  );
};
