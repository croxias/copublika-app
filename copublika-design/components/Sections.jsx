/* global React, Reveal, Icon */

function ResearchProjects() {
  const items = [
    { id: 'RP-018', status: 'Active', title: 'Maritime AI Routing for Eastern Indonesia', lead: 'Dr. Rini Hapsari', inst: 'ITS Surabaya', tags: ['AI', 'Maritime', 'Logistics'] },
    { id: 'RP-021', status: 'In Review', title: 'Genomic Markers in Tropical Public Health', lead: 'Prof. M. Hartono', inst: 'UGM', tags: ['Bio', 'Health', 'Tropical'] },
    { id: 'RP-024', status: 'Active', title: 'Edge-Compute Models for Coastal Climate', lead: 'Dr. A. Setyawan', inst: 'ITB', tags: ['Climate', 'Edge', 'ML'] },
    { id: 'RP-027', status: 'Recruiting', title: 'Quantum Optics for Secure Telemetry', lead: 'Dr. Ananya Iyer', inst: 'IIT Bombay', tags: ['Quantum', 'Telecom'] },
  ];
  return (
    <section id="research" className="cp-section">
      <div className="cp-section__head">
        <div className="cp-section__eyebrow cp-mono"><span>§ 03</span><span>Research Project · Academic Community</span></div>
        <h2 className="cp-section__title">Active Projects. <span className="cp-section__title-mute">Real Collaboration.</span></h2>
        <p className="cp-section__deck">A glimpse at studies currently moving inside the CoPublika network — led by senior academics, paired with vetted co-authors.</p>
      </div>
      <div className="cp-rp__grid cp-rp__grid--4">
        {items.map((p, i) => (
          <Reveal key={p.id} className="cp-rp__card" delay={i * 80}>
            <div className="cp-rp__top">
              <span className="cp-mono cp-rp__id">{p.id}</span>
              <span className="cp-rp__status">{p.status}</span>
            </div>
            <h3 className="cp-rp__title">{p.title}</h3>
            <div className="cp-rp__lead">
              <span className="cp-rp__lead-avatar">{p.lead.split(' ').slice(-2).map(w => w[0]).join('')}</span>
              <div>
                <div className="cp-rp__lead-name">{p.lead}</div>
                <div className="cp-rp__lead-inst">{p.inst}</div>
              </div>
            </div>
            <div className="cp-rp__tags">{p.tags.map(t => <span key={t} className="cp-rp__tag">{t}</span>)}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
window.ResearchProjects = ResearchProjects;

function Benefits() {
  const items = [
    { i: '01', icon: <Icon.Users />, title: 'Curated Network', body: 'Every member is reviewed in writing. Identity, institution, and trajectory verified — no bots, no scraping.' },
    { i: '02', icon: <Icon.Spark />, title: 'Accelerated Scopus', body: 'A 16-week structured program with senior co-authors and editorial sprints toward a Q1/Q2 venue.' },
    { i: '03', icon: <Icon.Lock />, title: 'Exclusive Collaboration', body: 'Project rooms, role agreements, and version-controlled drafts. Built for serious research, not status posting.' },
  ];
  return (
    <section id="why" className="cp-section">
      <div className="cp-section__head">
        <div className="cp-section__eyebrow cp-mono"><span>§ 04</span><span>Kenapa Gabung CoPublika Community?</span></div>
        <h2 className="cp-section__title">Three reasons. <span className="cp-section__title-mute">No marketing fluff.</span></h2>
      </div>
      <div className="cp-benefits__grid">
        {items.map((b, idx) => (
          <Reveal key={b.i} className="cp-benefits__card" delay={idx * 80}>
            <div className="cp-mono cp-benefits__num">{b.i}</div>
            <div className="cp-benefits__icon">{b.icon}</div>
            <h3 className="cp-benefits__title">{b.title}</h3>
            <p className="cp-benefits__body">{b.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
window.Benefits = Benefits;

function Reviews() {
  const quotes = [
    { q: 'CoPublika compressed what used to be a two-year journey into a single batch. Every collaborator I met was already vetted.', a: 'Dr. M. Hartono', r: 'Universitas Gadjah Mada' },
    { q: 'It is the only network where I do not have to filter. Everyone in the room has done the work.', a: 'Prof. L. Andersen', r: 'Lund University' },
    { q: 'Three submissions, three accepts. The editorial desk turned a hesitant draft into a confident contribution.', a: 'Dr. P. Subagio', r: 'BRIN' },
    { q: 'A rare network — small enough to know everyone, serious enough to ship.', a: 'Dr. Mei Lin Tan', r: 'NUS Singapore' },
  ];
  return (
    <section className="cp-section">
      <div className="cp-section__head">
        <div className="cp-section__eyebrow cp-mono"><span>§ 05</span><span>Review Member</span></div>
        <h2 className="cp-section__title">Said quietly, <span className="cp-section__title-mute">where it counts.</span></h2>
      </div>
      <div className="cp-rev__rail">
        {quotes.map((q, i) => (
          <Reveal key={i} className="cp-rev__card" delay={i * 80}>
            <p className="cp-rev__q">"{q.q}"</p>
            <div className="cp-rev__attr">
              <span className="cp-rev__avatar">{q.a.split(' ').slice(-2).map(w => w[0]).join('')}</span>
              <div>
                <div className="cp-rev__name">{q.a}</div>
                <div className="cp-rev__inst">{q.r}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
window.Reviews = Reviews;

function FAQ() {
  const items = [
    ['Apa itu CoPublika?', 'CoPublika adalah ekosistem komunitas akademik yang dikurasi secara manual — menghubungkan peneliti senior melalui database tertutup dan program publikasi terstruktur.'],
    ['Bagaimana proses curation bekerja?', 'Setiap aplikasi dibaca oleh Curation Council (3 reviewer). Identitas, afiliasi institusi, dan trajektori publikasi diverifikasi secara manual. Keputusan dikirim tertulis dalam 10 hari kerja.'],
    ['Berapa biaya program Siap Tembus Scopus?', 'Tier Researcher mulai dari Rp 14,5 juta per cohort. Tier Researcher + Co-Author Rp 22 juta. Tier Group Studio (3–6 manuscript) custom — diskusi langsung dengan council.'],
    ['Apakah saya harus berasal dari institusi top untuk diterima?', 'Tidak. Kami menilai kualitas argumen, kontribusi, dan keseriusan kerja — bukan prestise institusi. Banyak alumni berasal dari universitas regional.'],
    ['Apa yang membedakan CoPublika dari komunitas lain?', 'Kurasi manual, jaringan tertutup, dan editorial desk yang aktif. Tidak ada scraping data, tidak ada profil publik, tidak ada noise.'],
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <section id="faq" className="cp-section">
      <div className="cp-section__head">
        <div className="cp-section__eyebrow cp-mono"><span>§ 06</span><span>FAQ Komunitas</span></div>
        <h2 className="cp-section__title">Pertanyaan yang sering <span className="cp-section__title-mute">ditanyakan.</span></h2>
      </div>
      <div className="cp-faq">
        {items.map(([q, a], i) => (
          <div key={i} className={`cp-faq__item ${open === i ? 'cp-faq__item--open' : ''}`}>
            <button className="cp-faq__btn" onClick={() => setOpen(open === i ? -1 : i)}>
              <span className="cp-faq__q">{q}</span>
              <span className="cp-faq__plus" aria-hidden="true"></span>
            </button>
            <div className="cp-faq__a"><div className="cp-faq__a-inner"><div className="cp-faq__a-text">{a}</div></div></div>
          </div>
        ))}
      </div>
    </section>
  );
}
window.FAQ = FAQ;

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
