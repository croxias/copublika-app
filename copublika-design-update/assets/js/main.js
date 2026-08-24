/* CoPublika — shared interactions */
(function () {
  'use strict';

  // ============================================================
  // i18n dictionary (basic — Indonesia default, English alt)
  // ============================================================
  const DICT = {
    'nav.home':       { id: 'Home',             en: 'Home' },
    'nav.about':      { id: 'About',            en: 'About' },
    'nav.research':   { id: 'Research Project', en: 'Research Project' },
    'nav.program':    { id: 'Program',          en: 'Program' },
    'nav.scopus':     { id: 'Siap Tembus Scopus', en: 'Scopus-Ready Program' },
    'nav.scopus.sub': { id: 'Bootcamp publikasi terindeks', en: 'Indexed publication bootcamp' },
    'nav.blog':       { id: 'Blog',             en: 'Blog' },
    'nav.event':      { id: 'Event',            en: 'Event' },
    'nav.contact':    { id: 'Contact',          en: 'Contact' },
    'nav.login':      { id: 'Log In',           en: 'Log In' },
    'nav.register':   { id: 'Daftar',           en: 'Register' },

    'footer.tagline': {
      id: 'Komunitas akademisi pemula menuju publikasi internasional terindeks.',
      en: 'A community of early-career academics on the path to internationally indexed publication.'
    },
    'footer.explore': { id: 'Jelajah',  en: 'Explore' },
    'footer.program': { id: 'Program',  en: 'Program' },
    'footer.connect': { id: 'Terhubung',en: 'Connect' },
    'footer.newsletter.label': { id: 'Buletin Mingguan', en: 'Weekly Bulletin' },
    'footer.newsletter.copy': {
      id: 'Tips publikasi, undangan event, dan call for papers — setiap Jumat.',
      en: 'Publication tips, event invites, and calls for papers — every Friday.'
    },
    'footer.newsletter.placeholder': { id: 'Email akademik anda', en: 'Your academic email' },
    'footer.newsletter.cta': { id: 'Berlangganan', en: 'Subscribe' },
    'footer.copyright': {
      id: '© 2025 CoPublika. Seluruh hak cipta dilindungi.',
      en: '© 2025 CoPublika. All rights reserved.'
    },

    'cta.join':       { id: 'Gabung Komunitas', en: 'Join the Community' },
    'cta.learn':      { id: 'Pelajari Program', en: 'Explore Programs' },
    'cta.readmore':   { id: 'Baca selengkapnya',en: 'Read more' },
    'cta.viewall':    { id: 'Lihat semua',      en: 'View all' },
  };

  function applyI18n(lang) {
    document.documentElement.lang = lang;
    function setContent(el, value) {
      if (value == null) return;
      if (value.indexOf('<') !== -1) el.innerHTML = value;
      else el.textContent = value;
    }
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      const entry = DICT[k];
      if (entry && entry[lang]) setContent(el, entry[lang]);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const k = el.getAttribute('data-i18n-placeholder');
      const entry = DICT[k];
      if (entry && entry[lang]) el.placeholder = entry[lang];
    });
    document.querySelectorAll('[data-i18n-id], [data-i18n-en]').forEach(el => {
      const v = (lang === 'en' && el.hasAttribute('data-i18n-en'))
        ? el.getAttribute('data-i18n-en')
        : el.getAttribute('data-i18n-id');
      setContent(el, v);
    });
  }

  function getLang() { return localStorage.getItem('cp_lang') || 'id'; }
  function setLang(l) { localStorage.setItem('cp_lang', l); applyI18n(l); updateLangUI(l); }
  function updateLangUI(l) {
    document.querySelectorAll('.lang-current').forEach(el => el.textContent = l.toUpperCase());
    document.querySelectorAll('.lang-flag-current').forEach(el => {
      el.classList.remove('id','en');
      el.classList.add(l);
    });
    document.querySelectorAll('.lang-option').forEach(el => {
      el.classList.toggle('active', el.dataset.lang === l);
    });
  }

  // ============================================================
  // Header & Footer injection
  // ============================================================
  function renderHeader(active) {
    const html = `
    <div class="announce" id="announce">
      <div class="announce-inner">
        <span class="ann-pulse"></span>
        <span class="ann-text">
          <strong data-i18n-id="Cohort #07 dibuka" data-i18n-en="Cohort #07 open">Cohort #07 dibuka</strong>
          <span class="ann-text-long"> · <span data-i18n-id="24 dari 60 kursi tersisa" data-i18n-en="24 of 60 seats left">24 dari 60 kursi tersisa</span></span>
        </span>
        <a class="ann-cta" href="siap-tembus-scopus.html"><span data-i18n-id="Daftar sekarang" data-i18n-en="Apply now">Daftar sekarang</span></a>
        <button class="ann-close" id="annClose" aria-label="Close">×</button>
      </div>
    </div>
    <nav class="nav" id="nav">
      <div class="wrap nav-inner">
        <a class="nav-logo" href="index.html" aria-label="CoPublika">
          <img src="assets/img/logo-black.png" alt="CoPublika" class="logo-black">
          <img src="assets/img/logo-white.png" alt="CoPublika" class="logo-white">
        </a>
        <div class="nav-menu">
          <a class="nav-link ${active==='home'?'is-active':''}" href="index.html" data-i18n="nav.home">Home</a>
          <a class="nav-link ${active==='about'?'is-active':''}" href="about.html" data-i18n="nav.about">About</a>
          <a class="nav-link ${active==='research'?'is-active':''}" href="research.html" data-i18n="nav.research">Research Project</a>
          <div class="nav-dropdown ${active==='scopus'?'':''}">
            <a class="nav-link ${active==='scopus'?'is-active':''}" href="javascript:void(0)"><span data-i18n="nav.program">Program</span><span class="caret"></span></a>
            <div class="nav-dropdown-menu">
              <a class="dropdown-item" href="siap-tembus-scopus.html">
                <div class="di-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/>
                  </svg>
                </div>
                <div class="di-content">
                  <span class="di-title">
                    <span data-i18n="nav.scopus">Siap Tembus Scopus</span>
                    <span class="di-badge">Flagship</span>
                  </span>
                  <span class="di-sub" data-i18n="nav.scopus.sub">Bootcamp 12 minggu untuk publikasi terindeks Scopus Q1–Q3.</span>
                </div>
                <span class="di-arrow">→</span>
              </a>
            </div>
          </div>
          <a class="nav-link ${active==='blog'?'is-active':''}" href="blog.html" data-i18n="nav.blog">Blog</a>
          <a class="nav-link ${active==='event'?'is-active':''}" href="event.html" data-i18n="nav.event">Event</a>
          <a class="nav-link ${active==='contact'?'is-active':''}" href="contact.html" data-i18n="nav.contact">Contact</a>
        </div>
        <div class="nav-right">
          <div class="lang" id="lang">
            <button class="lang-btn" aria-haspopup="true">
              <span class="lang-flag lang-flag-current id"></span>
              <span class="lang-current">ID</span>
              <span class="lang-caret"></span>
            </button>
            <div class="lang-menu" role="menu">
              <button class="lang-option" data-lang="id"><span class="lang-flag id"></span> Indonesia</button>
              <button class="lang-option" data-lang="en"><span class="lang-flag en"></span> English</button>
            </div>
          </div>
          <div class="auth" style="display:flex; gap:6px; align-items:center; margin-left:6px;">
            <a class="btn btn-ghost" href="login.html" data-i18n="nav.login">Log In</a>
            <a class="btn btn-dark" href="register.html" data-i18n="nav.register">Daftar</a>
          </div>
          <button class="nav-burger" id="burger" aria-label="Menu"><span></span></button>
        </div>
      </div>
    </nav>
    <div class="mobile-menu" id="mobileMenu">
      <a href="index.html" data-i18n="nav.home">Home</a>
      <a href="about.html" data-i18n="nav.about">About</a>
      <a href="research.html" data-i18n="nav.research">Research Project</a>
      <a href="siap-tembus-scopus.html" data-i18n="nav.scopus">Siap Tembus Scopus</a>
      <a href="blog.html" data-i18n="nav.blog">Blog</a>
      <a href="event.html" data-i18n="nav.event">Event</a>
      <a href="contact.html" data-i18n="nav.contact">Contact</a>
      <div style="display:flex; gap:8px; margin-top:24px;">
        <a class="btn btn-line" href="login.html" data-i18n="nav.login">Log In</a>
        <a class="btn btn-dark" href="register.html" data-i18n="nav.register">Daftar</a>
      </div>
    </div>`;
    const el = document.getElementById('site-header');
    if (el) el.innerHTML = html;
  }

  function renderFooter() {
    const html = `
    <footer class="footer">
      <div class="wrap">
        <div class="footer-cols">
          <div class="footer-col">
            <h5 data-i18n-id="Komunitas" data-i18n-en="Community">Komunitas</h5>
            <ul>
              <li><a href="index.html" data-i18n="nav.home">Home</a></li>
              <li><a href="about.html" data-i18n="nav.about">About</a></li>
              <li><a href="register.html" data-i18n-id="Bergabung" data-i18n-en="Join">Bergabung</a></li>
              <li><a href="event.html#forum" data-i18n-id="Forum Diskusi" data-i18n-en="Discussion Forum">Forum Diskusi</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h5 data-i18n="footer.program">Program</h5>
            <ul>
              <li><a href="siap-tembus-scopus.html" data-i18n="nav.scopus">Siap Tembus Scopus</a></li>
              <li><a href="research.html" data-i18n-id="Riset Kolaboratif" data-i18n-en="Collaborative Research">Riset Kolaboratif</a></li>
              <li><a href="event.html" data-i18n-id="Workshop & Klinik" data-i18n-en="Workshop & Clinic">Workshop & Klinik</a></li>
              <li><a href="event.html" data-i18n-id="Mentoring 1-on-1" data-i18n-en="1-on-1 Mentoring">Mentoring 1-on-1</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h5 data-i18n-id="Riset" data-i18n-en="Research">Riset</h5>
            <ul>
              <li><a href="research.html" data-i18n="nav.research">Research Project</a></li>
              <li><a href="research.html#clusters" data-i18n-id="Cluster Riset" data-i18n-en="Research Clusters">Cluster Riset</a></li>
              <li><a href="research.html#publications" data-i18n-id="Publikasi Alumni" data-i18n-en="Alumni Publications">Publikasi Alumni</a></li>
              <li><a href="research.html" data-i18n-id="Peer Review" data-i18n-en="Peer Review">Peer Review</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h5 data-i18n-id="Acara" data-i18n-en="Events">Acara</h5>
            <ul>
              <li><a href="event.html" data-i18n-id="Agenda Mendatang" data-i18n-en="Upcoming">Agenda Mendatang</a></li>
              <li><a href="event.html#webinar">Webinar</a></li>
              <li><a href="event.html#clinic" data-i18n-id="Klinik Manuskrip" data-i18n-en="Manuscript Clinic">Klinik Manuskrip</a></li>
              <li><a href="event.html#forum" data-i18n-id="Doctoral Forum" data-i18n-en="Doctoral Forum">Doctoral Forum</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h5 data-i18n-id="Sumber" data-i18n-en="Resources">Sumber</h5>
            <ul>
              <li><a href="blog.html" data-i18n="nav.blog">Blog</a></li>
              <li><a href="blog.html#guide" data-i18n-id="Panduan" data-i18n-en="Guides">Panduan</a></li>
              <li><a href="blog.html#case" data-i18n-id="Studi Kasus" data-i18n-en="Case Studies">Studi Kasus</a></li>
              <li><a href="about.html#faq">FAQ</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h5 data-i18n-id="Akun" data-i18n-en="Account">Akun</h5>
            <ul>
              <li><a href="login.html" data-i18n="nav.login">Log In</a></li>
              <li><a href="register.html" data-i18n="nav.register">Daftar</a></li>
              <li><a href="contact.html" data-i18n="nav.contact">Contact</a></li>
              <li><a href="mailto:halo@copublika.id">halo@copublika.id</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <a class="footer-brand" href="index.html" aria-label="CoPublika">
            <img src="assets/img/logo-white.png" alt="CoPublika">
          </a>
          <div class="footer-end">
            <div class="footer-social" aria-label="Social media">
              <a href="#" target="_blank" rel="noopener" aria-label="Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" stroke="none"/></svg></a>
              <a href="#" target="_blank" rel="noopener" aria-label="LinkedIn"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg></a>
              <a href="#" target="_blank" rel="noopener" aria-label="YouTube"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.51a3 3 0 00-2.13-2.13C19.5 4 12 4 12 4s-7.5 0-9.37.38A3 3 0 00.5 6.51 31.4 31.4 0 000 12a31.4 31.4 0 00.5 5.49 3 3 0 002.13 2.13C4.5 20 12 20 12 20s7.5 0 9.37-.38a3 3 0 002.13-2.13A31.4 31.4 0 0024 12a31.4 31.4 0 00-.5-5.49zM9.5 15.5v-7l6.5 3.5z"/></svg></a>
              <a href="#" target="_blank" rel="noopener" aria-label="X"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21.5l-7.39 8.443L23 22h-6.797l-5.317-6.91L4.8 22H1.546l7.91-9.029L1 2h6.965l4.806 6.349L18.244 2zm-1.18 18h1.832L7.045 4H5.082L17.064 20z"/></svg></a>
              <a href="https://wa.me/6281320250707" target="_blank" rel="noopener" aria-label="WhatsApp"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.32A8 8 0 003.93 14l-1.13 4.13 4.24-1.11A8 8 0 1017.6 6.32zM12 18.53a6.66 6.66 0 01-3.4-.93l-.24-.15-2.51.66.67-2.45-.16-.25A6.65 6.65 0 1118.65 12 6.65 6.65 0 0112 18.53zm3.65-5c-.2-.1-1.18-.58-1.36-.65s-.32-.1-.45.1-.51.65-.63.78-.23.15-.43.05a5.45 5.45 0 01-2.7-2.36c-.2-.35.2-.32.59-1.08a.36.36 0 000-.34c-.05-.1-.45-1.08-.62-1.48s-.32-.33-.45-.33h-.39a.74.74 0 00-.54.25 2.27 2.27 0 00-.7 1.69 3.94 3.94 0 00.82 2.09 9 9 0 003.45 3.06c.49.2.87.32 1.16.41a2.81 2.81 0 001.29.08 2.1 2.1 0 001.38-.98 1.71 1.71 0 00.12-.97c-.04-.1-.18-.16-.38-.25z"/></svg></a>
            </div>
            <div class="footer-meta">
              <span data-i18n-id="© 2025 CoPublika." data-i18n-en="© 2025 CoPublika.">© 2025 CoPublika.</span>
              <a href="#" data-i18n-id="Privasi" data-i18n-en="Privacy">Privasi</a>
              <span class="sep">·</span>
              <a href="#" data-i18n-id="Ketentuan" data-i18n-en="Terms">Ketentuan</a>
              <span class="sep">·</span>
              <a href="#" data-i18n-id="Keamanan" data-i18n-en="Security">Keamanan</a>
            </div>
          </div>
        </div>
      </div>
    </footer>`;
    const el = document.getElementById('site-footer');
    if (el) el.innerHTML = html;
  }

  // ============================================================
  // Bindings (run after header/footer injection)
  // ============================================================
  function bindNav() {
    const nav = document.getElementById('nav');
    const onScroll = () => {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Announcement dismiss
    const ann = document.getElementById('announce');
    const annClose = document.getElementById('annClose');
    if (ann && localStorage.getItem('cp_announce_dismissed') === '1') {
      document.body.classList.add('no-announce');
    }
    if (annClose) {
      annClose.addEventListener('click', () => {
        document.body.classList.add('no-announce');
        localStorage.setItem('cp_announce_dismissed', '1');
      });
    }

    // Burger
    const burger = document.getElementById('burger');
    const menu = document.getElementById('mobileMenu');
    if (burger && menu) {
      burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        menu.classList.toggle('open');
      });
      menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        burger.classList.remove('open');
        menu.classList.remove('open');
      }));
    }

    // Dropdown hover-intent (small close delay so cursor can travel)
    document.querySelectorAll('.nav-dropdown').forEach(dd => {
      let closeTimer;
      const open = () => { clearTimeout(closeTimer); dd.classList.add('open'); };
      const scheduleClose = () => {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(() => dd.classList.remove('open'), 220);
      };
      dd.addEventListener('mouseenter', open);
      dd.addEventListener('mouseleave', scheduleClose);
      // Click-to-toggle (good for touch + extra control)
      const trigger = dd.querySelector(':scope > .nav-link');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dd.classList.toggle('open');
        });
      }
    });
    // Click outside closes any open dropdown
    document.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-dropdown.open').forEach(dd => {
        if (!dd.contains(e.target)) dd.classList.remove('open');
      });
    });

    // Language switcher
    const lang = document.getElementById('lang');
    if (lang) {
      const btn = lang.querySelector('.lang-btn');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        lang.classList.toggle('open');
      });
      lang.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', () => {
          setLang(opt.dataset.lang);
          lang.classList.remove('open');
        });
      });
      document.addEventListener('click', () => lang.classList.remove('open'));
    }
  }

  function bindReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  function bindCursor() {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);
    let x = 0, y = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    function raf() {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      requestAnimationFrame(raf);
    }
    raf();
    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('a, button, .card, .hover-mag');
      dot.classList.toggle('is-hover', !!t);
    });
  }

  function bindCounters() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        // mark parent .stat as in-view so sparklines/top-bar animate
        const parent = el.closest('.stat');
        if (parent) parent.classList.add('in-view');

        const to = parseFloat(el.dataset.count);
        const dur = 2000;
        const start = performance.now();
        // easeOutQuint — punchy at start, smooth landing
        const ease = (p) => 1 - Math.pow(1 - p, 5);
        function tick(t) {
          const p = Math.min(1, (t - start) / dur);
          const val = to * ease(p);
          el.textContent = (to % 1 === 0)
            ? Math.round(val).toLocaleString('id-ID')
            : val.toFixed(1);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
  }

  // Public init
  window.CoPublika = {
    init(active) {
      renderHeader(active);
      renderFooter();
      bindNav();
      bindReveal();
      bindCursor();
      bindCounters();
      applyI18n(getLang());
      updateLangUI(getLang());
    }
  };
})();
