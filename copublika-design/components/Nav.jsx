/* global React */
const { useState: useNS, useEffect: useNE, useRef: useNR } = React;

const FlagID = (p) => (
  <svg viewBox="0 0 18 12" width="18" height="12" {...p}>
    <rect width="18" height="6" fill="#E70011"/>
    <rect y="6" width="18" height="6" fill="#fff"/>
  </svg>
);
const FlagEN = (p) => (
  <svg viewBox="0 0 18 12" width="18" height="12" {...p}>
    <rect width="18" height="12" fill="#012169"/>
    <path d="M0 0L18 12M18 0L0 12" stroke="#fff" strokeWidth="1.4"/>
    <path d="M0 0L18 12M18 0L0 12" stroke="#C8102E" strokeWidth="0.7"/>
    <path d="M9 0V12M0 6H18" stroke="#fff" strokeWidth="2"/>
    <path d="M9 0V12M0 6H18" stroke="#C8102E" strokeWidth="1"/>
  </svg>
);

const Icon = {
  Sun: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>),
  Moon: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>),
  Chev: (p) => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="6 9 12 15 18 9"/></svg>),
  Arrow: (p) => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>),
  Users: (p) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  Spark: (p) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}><path d="M12 2l2.39 6.97L21 11l-6.61 2.03L12 20l-2.39-6.97L3 11l6.61-2.03z"/></svg>),
  Lock: (p) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
};
window.Icon = Icon;

const LANGS = [
  { code: 'EN', label: 'English', Flag: FlagEN },
  { code: 'ID', label: 'Bahasa Indonesia', Flag: FlagID },
];

function Nav({ active = 'home' }) {
  const [scrolled, setScrolled] = useNS(false);
  const [open, setOpen] = useNS(false);
  const [lang, setLang] = useNS('EN');
  const [drop, setDrop] = useNS(false);
  const [langOpen, setLangOpen] = useNS(false);
  const dropRef = useNR(null);
  const langRef = useNR(null);

  useNE(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.dataset.theme = 'light';
    const savedLang = localStorage.getItem('cp-lang') || 'EN';
    setLang(savedLang);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useNE(() => {
    const onClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDrop(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const pickLang = (code) => {
    setLang(code);
    localStorage.setItem('cp-lang', code);
    setLangOpen(false);
  };

  const items = [
    { id: 'home', label: 'Home', href: 'index.html' },
    { id: 'about', label: 'About', href: 'about.html' },
    { id: 'research', label: 'Research Project', href: 'research-project.html' },
    { id: 'program', label: 'Program', href: '#', drop: true },
    { id: 'blog', label: 'Blog', href: 'blog.html' },
    { id: 'event', label: 'Event', href: 'event.html' },
    { id: 'contact', label: 'Contact', href: 'contact.html' },
  ];

  const current = LANGS.find(l => l.code === lang) || LANGS[0];

  return (
    <header className={`cp-nav ${scrolled ? 'cp-nav--scrolled' : ''}`}>
      <div className="cp-nav__inner">
        <a href="index.html" className="cp-nav__brand">
          <span className="cp-nav__mark"><img src="assets/favicon-black.png" alt="" /></span>
          <span className="cp-nav__wordmark">CoPublika</span>
        </a>

        <nav className="cp-nav__links">
          {items.map((it) => it.drop ? (
            <div key={it.id} ref={dropRef} style={{ position: 'relative' }}>
              <button className={`cp-nav__link ${active === it.id ? 'cp-nav__link--active' : ''}`}
                aria-expanded={drop} onClick={() => setDrop(!drop)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', font: 'inherit' }}>
                {it.label} <span className="cp-nav__chev"><Icon.Chev /></span>
              </button>
              <div className={`cp-nav__drop ${drop ? 'cp-nav__drop--open' : ''}`}>
                <a href="siap-tembus-scopus.html" className="cp-nav__drop-item">
                  <div className="cp-nav__drop-item-title">Siap Tembus Scopus</div>
                  <div className="cp-nav__drop-item-sub">16-week flagship · Q1/Q2 venue</div>
                </a>
              </div>
            </div>
          ) : (
            <a key={it.id} href={it.href}
              className={`cp-nav__link ${active === it.id ? 'cp-nav__link--active' : ''}`}>
              {it.label}
            </a>
          ))}
        </nav>

        <div className="cp-nav__actions">
          <div ref={langRef} style={{ position: 'relative' }}>
            <button className="cp-nav__lang" onClick={() => setLangOpen(!langOpen)} aria-label="Language">
              <span className="cp-nav__lang-flag"><current.Flag /></span>
              <span>{current.code}</span>
              <span className="cp-nav__chev" style={{ display: 'inline-flex', transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}><Icon.Chev /></span>
            </button>
            <div className={`cp-nav__lang-menu ${langOpen ? 'cp-nav__lang-menu--open' : ''}`}>
              {LANGS.map(({ code, label, Flag }) => (
                <div key={code} className={`cp-nav__lang-opt ${lang === code ? 'cp-nav__lang-opt--active' : ''}`} onClick={() => pickLang(code)}>
                  <span className="cp-nav__lang-flag"><Flag /></span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <a href="login.html" className="cp-btn cp-btn--ghost cp-nav__cta-login">Log In</a>
          <a href="join-batch.html" className="cp-btn cp-btn--solid">
            Join Batch <span className="cp-btn__arrow"><Icon.Arrow /></span>
          </a>
          <button className="cp-nav__menu" onClick={() => setOpen(!open)} aria-label="Menu">
            <span></span><span></span>
          </button>
        </div>
      </div>

      {open && (
        <div className="cp-nav__sheet">
          {items.map((it) => (
            <a key={it.id} href={it.drop ? 'siap-tembus-scopus.html' : it.href}>{it.label}</a>
          ))}
          <a href="login.html">Log In</a>
          <a href="join-batch.html" style={{ fontWeight: 700 }}>Join Batch →</a>
        </div>
      )}
    </header>
  );
}

window.Nav = Nav;

function Reveal({ children, delay = 0, as = 'div', className = '', ...rest }) {
  const ref = useNR(null);
  const [vis, setVis] = useNS(false);
  useNE(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  return <Tag ref={ref} className={`cp-reveal ${vis ? 'cp-reveal--in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>{children}</Tag>;
}
window.Reveal = Reveal;
