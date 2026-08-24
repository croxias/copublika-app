/* global React, Reveal, Icon */

function FinalCTA() {
  return (
    <section className="cp-final">
      <div className="cp-final__bg" aria-hidden="true"></div>
      <div className="cp-final__inner">
        <Reveal className="cp-final__eyebrow cp-mono"><span>§ 07</span><span>Final Step</span></Reveal>
        <Reveal as="h2" className="cp-final__title" delay={80}>
          Siap Jadi Bagian<br/>Komunitas <span className="cp-final__title-mute">CoPublika?</span>
        </Reveal>
        <Reveal className="cp-final__deck" delay={180}>
          <p style={{ margin: 0 }}>Batch 04 ditutup 14 Juni 2026. Aplikasi singkat, standar tetap tinggi. Keputusan dikirim tertulis dalam 10 hari kerja.</p>
        </Reveal>
        <Reveal className="cp-final__cta-row" delay={260}>
          <a href="join-batch.html" className="cp-btn cp-btn--invert cp-btn--solid cp-btn--xl">
            Daftar Batch Sekarang <span className="cp-btn__arrow"><Icon.Arrow /></span>
          </a>
          <a href="curation-process.html" className="cp-btn cp-btn--xl" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
            Pelajari Curation Process
          </a>
        </Reveal>
      </div>
    </section>
  );
}
window.FinalCTA = FinalCTA;

function Footer() {
  const cols = [
    { title: 'Menu', items: [['Home', 'index.html'], ['About', 'about.html'], ['Research Project', 'research-project.html'], ['Blog', 'blog.html'], ['Event', 'event.html']] },
    { title: 'Program', items: [['Siap Tembus Scopus', 'siap-tembus-scopus.html']] },
    { title: 'Contact', items: [['hello@copublika.id', 'mailto:hello@copublika.id'], ['Contact Form', 'contact.html'], ['Press', '#']] },
    { title: 'Legal', items: [['Terms', '#'], ['Privacy', '#'], ['Council Charter', '#']] },
  ];
  return (
    <footer className="cp-foot">
      <div className="cp-foot__inner">
        <div className="cp-foot__top">
          <div>
            <div className="cp-foot__brand-mark">
              <span className="cp-foot__brand-circle"><img src="assets/favicon-black.png" alt="" /></span>
              <span className="cp-foot__brand-text">CoPublika</span>
            </div>
            <p className="cp-foot__brand-tag">A privately-curated ecosystem for senior researchers. Curation manual, jaringan tertutup, hasil terukur.</p>
          </div>
          <div className="cp-foot__cols">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="cp-foot__col-title">{c.title}</div>
                <ul className="cp-foot__col-list">
                  {c.items.map(([l, h]) => <li key={l}><a href={h} className="cp-foot__link">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="cp-foot__bottom">
          <div>© 2026 CoPublika</div>
          <div>Jakarta · Singapore · Zürich</div>
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
