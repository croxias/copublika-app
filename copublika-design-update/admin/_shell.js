/* =====================================================================
   CoPublika — Admin shell renderer
   Injects sidebar + topbar + sets active nav based on body[data-page]
   ===================================================================== */
(function () {
  'use strict';

  const NAV = [
    { section: 'Overview', items: [
      { id: 'dashboard', name: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
      { id: 'analytics', name: 'Analytics', href: 'analytics.html', icon: 'chart' }
    ]},
    { section: 'Curation', items: [
      { id: 'verifications', name: 'Verifikasi Pendaftar', href: 'verifications.html', icon: 'user-check', badge: '14' },
      { id: 'batches', name: 'Batch Management', href: 'batches.html', icon: 'clock' },
      { id: 'members', name: 'Anggota', href: 'members.html', icon: 'users', badge: '1.240', soft: true }
    ]},
    { section: 'Project Governance', items: [
      { id: 'projects', name: 'Riset & Proyek', href: 'projects.html', icon: 'file', badge: '8' },
      { id: 'clusters', name: 'Cluster Riset', href: 'clusters.html', icon: 'grid' }
    ]},
    { section: 'Content', items: [
      { id: 'blog', name: 'Blog', href: 'blog.html', icon: 'edit' },
      { id: 'events', name: 'Event', href: 'events.html', icon: 'calendar' },
      { id: 'lms', name: 'LMS — Siap Tembus Scopus', href: 'lms.html', icon: 'book' },
      { id: 'templates', name: 'Template Vault', href: 'templates.html', icon: 'package' }
    ]},
    { section: 'System', items: [
      { id: 'settings', name: 'Pengaturan Situs', href: 'settings.html', icon: 'settings' },
      { id: 'audit', name: 'Audit & Keamanan', href: 'audit.html', icon: 'shield' }
    ]}
  ];

  const ICONS = {
    'dashboard': '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
    'chart': '<path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 5-5"/>',
    'user-check': '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/>',
    'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 8v4l2.5 2.5"/>',
    'users': '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    'file': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/>',
    'grid': '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/>',
    'edit': '<path d="M4 4h16v16H4z"/><path d="M4 9h16M9 4v16"/>',
    'calendar': '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    'book': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    'package': '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.27 6.96 8.73 5.05 8.73-5.05M12 22.08V12"/>',
    'settings': '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'
  };

  function svg(name) {
    return `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
  }

  function renderSidebar(activeId) {
    const sections = NAV.map(sec => {
      const links = sec.items.map(item => {
        const active = item.id === activeId ? ' active' : '';
        const badge = item.badge
          ? `<span class="badge${item.soft ? ' soft' : ''}">${item.badge}</span>`
          : '';
        return `<a class="side-link${active}" href="${item.href}">${svg(item.icon)}<span>${item.name}</span>${badge}</a>`;
      }).join('');
      return `<div class="side-section"><h6>${sec.section}</h6>${links}</div>`;
    }).join('');

    return `
      <a class="side-brand" href="dashboard.html">
        <span class="logo">C</span>
        <div>
          <div class="name">CoPublika</div>
          <div class="role">Superadmin</div>
        </div>
      </a>
      <nav class="side-nav">${sections}</nav>
      <div class="side-foot">
        <a class="batch-card" href="batches.html">
          <div class="label">Batch #4 · Open</div>
          <div class="name">September 2025</div>
          <div class="meta">204 / 300 kuota terisi</div>
          <div class="bar"><span></span></div>
        </a>
      </div>
    `;
  }

  function renderTopbar(opts) {
    const placeholder = opts.search || 'Cari member, proyek, Google Scholar ID, post…';
    return `
      <button class="menu-toggle" aria-label="Toggle menu" data-menu-toggle>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
      <div class="top-search">
        <svg class="search-i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" placeholder="${placeholder}" />
        <span class="kbd">⌘ K</span>
      </div>
      <div class="top-actions">
        <button class="icon-btn" title="Tema">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <a class="icon-btn" title="Notifikasi" href="notifications.html">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          <span class="dot"></span>
        </a>
        <a class="top-profile" title="Akun" href="account.html">
          <span class="av">A</span>
          <span>
            <span class="pn">Adi Wijaya</span><br/>
            <span class="pr">Superadmin</span>
          </span>
        </a>
      </div>
    `;
  }

  function init() {
    const body = document.body;
    const pageId = body.dataset.page || 'dashboard';
    const searchHint = body.dataset.search;

    // Build shell wrapper if it doesn't exist
    let shell = body.querySelector('.admin');
    if (!shell) {
      shell = document.createElement('div');
      shell.className = 'admin';
      // Wrap existing children inside .main > .content
      const main = document.createElement('div');
      main.className = 'main';
      const topbar = document.createElement('header');
      topbar.className = 'topbar';
      const content = document.createElement('main');
      content.className = 'content';
      while (body.firstChild) content.appendChild(body.firstChild);
      const aside = document.createElement('aside');
      aside.className = 'side';
      main.appendChild(topbar);
      main.appendChild(content);
      shell.appendChild(aside);
      shell.appendChild(main);
      body.appendChild(shell);

      aside.innerHTML = renderSidebar(pageId);
      topbar.innerHTML = renderTopbar({ search: searchHint });
    } else {
      // Pre-rendered shell (legacy) — only patch active link
      shell.querySelectorAll('.side-link.active').forEach(el => el.classList.remove('active'));
      const target = shell.querySelector(`.side-link[href$="${pageId}.html"]`);
      if (target) target.classList.add('active');
    }

    // Mobile menu toggle
    const aside = shell.querySelector('.side');
    const toggle = shell.querySelector('[data-menu-toggle]');
    if (toggle && aside) {
      toggle.addEventListener('click', () => aside.classList.toggle('open'));
    }

    // Generic interactions: tab segments, period segment, segment buttons
    document.querySelectorAll('.tabs, .seg').forEach(group => {
      group.addEventListener('click', e => {
        const b = e.target.closest('.tab, button');
        if (!b || !group.contains(b)) return;
        if (b.tagName === 'A') return;
        group.querySelectorAll('.tab, button').forEach(t => t.classList.remove('active'));
        b.classList.add('active');
      });
    });

    // Reveal-in animation
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
