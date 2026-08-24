/* =====================================================================
   CoPublika — MEMBER shell renderer
   Different sidebar for Research Workspace (PRD 8.2)
   ===================================================================== */
(function () {
  'use strict';

  const NAV = [
    { section: 'Workspace', items: [
      { id: 'dashboard', name: 'Dashboard', href: 'dashboard.html', icon: 'home' },
      { id: 'projects', name: 'Riset Saya', href: 'projects.html', icon: 'file', badge: '3' },
      { id: 'collaborators', name: 'Kolaborator', href: 'collaborators.html', icon: 'users', badge: '2', soft: true },
      { id: 'tracker', name: 'Tracker Riset', href: 'tracker.html', icon: 'check' }
    ]},
    { section: 'Belajar', items: [
      { id: 'lms', name: 'LMS — Siap Tembus Scopus', href: 'lms.html', icon: 'book' },
      { id: 'templates', name: 'Template Vault', href: 'templates.html', icon: 'package' }
    ]},
    { section: 'Komunitas', items: [
      { id: 'cluster', name: 'Cluster Saya', href: 'cluster.html', icon: 'grid' },
      { id: 'members', name: 'Member Directory', href: 'members.html', icon: 'users-2' },
      { id: 'events', name: 'Event', href: 'events.html', icon: 'calendar' }
    ]},
    { section: 'Akun', items: [
      { id: 'profile', name: 'Profil Saya', href: 'profile.html', icon: 'user' }
    ]}
  ];

  const ICONS = {
    'home': '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    'file': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/>',
    'users': '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    'check': '<polyline points="22 11.08 22 12 22 12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    'book': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    'package': '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.27 6.96 8.73 5.05 8.73-5.05M12 22.08V12"/>',
    'grid': '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/>',
    'users-2': '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>',
    'calendar': '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    'user': '<circle cx="12" cy="8" r="4"/><path d="M16 21v-2a4 4 0 0 0-4-4 4 4 0 0 0-4 4v2"/>'
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
          <div class="role">Member</div>
        </div>
      </a>
      <nav class="side-nav">${sections}</nav>
      <div class="side-foot">
        <a class="batch-card" href="lms.html">
          <div class="label">LMS Progress · Mod 04</div>
          <div class="name">Siap Tembus Scopus</div>
          <div class="meta">62% · 6 dari 10 modul</div>
          <div class="bar"><span style="width: 62%;"></span></div>
        </a>
      </div>
    `;
  }

  function renderTopbar(opts) {
    const placeholder = opts.search || 'Cari paper, member, cluster, atau ide riset…';
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
        <a class="vbtn approve" href="submit-project.html" style="margin-right: 4px;">+ Ajukan Proyek</a>
        <a class="icon-btn" title="Notifikasi" href="notifications.html">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          <span class="dot"></span>
        </a>
        <a class="top-profile" title="Profil" href="profile.html">
          <span class="av">HS</span>
          <span>
            <span class="pn">Dr. Hadi Suryanto</span><br/>
            <span class="pr">Member · Batch #3</span>
          </span>
        </a>
      </div>
    `;
  }

  function init() {
    const body = document.body;
    const pageId = body.dataset.page || 'dashboard';
    const searchHint = body.dataset.search;

    let shell = body.querySelector('.admin');
    if (!shell) {
      shell = document.createElement('div');
      shell.className = 'admin';
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
    }

    const aside = shell.querySelector('.side');
    const toggle = shell.querySelector('[data-menu-toggle]');
    if (toggle && aside) {
      toggle.addEventListener('click', () => aside.classList.toggle('open'));
    }

    document.querySelectorAll('.tabs, .seg').forEach(group => {
      group.addEventListener('click', e => {
        const b = e.target.closest('.tab, button');
        if (!b || !group.contains(b)) return;
        if (b.tagName === 'A') return;
        group.querySelectorAll('.tab, button').forEach(t => t.classList.remove('active'));
        b.classList.add('active');
      });
    });

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
