/* global React, Reveal, Icon */

function CountUp({ to, duration = 1400, suffix = '+' }) {
  const [n, setN] = React.useState(0);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const start = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(eased * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}
window.CountUp = CountUp;

/* ============================================================
   HERO — Full-bleed black slider with animated backdrops
   Slide 1 — Community  (Join + Explore)
   Slide 2 — Blog       (Editorial notes)
   Slide 3 — Event      (Studios & council)
   Slide 4 — Research   (Active threads)
   ============================================================ */

const HSLIDE_MS = 6500;

/* ---------- Animated backdrops (SVG, deterministic) ---------- */

function BgNetwork() {
  // Constellation of nodes connected by lines — represents community
  const nodes = React.useMemo(() => {
    const r = (s) => { let x = Math.sin(s) * 10000; return x - Math.floor(x); };
    return Array.from({ length: 36 }, (_, i) => ({
      x: r(i * 9.13 + 1) * 100,
      y: r(i * 17.7 + 2) * 100,
      d: r(i * 3.3) * 4 + 3,
    }));
  }, []);
  const links = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
      if (Math.hypot(dx, dy) < 22) links.push([nodes[i], nodes[j]]);
    }
  }
  return (
    <svg className="cp-hbg cp-hbg--network" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id="hbgNodeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E9711C" stopOpacity="1" />
          <stop offset="100%" stopColor="#E9711C" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g stroke="rgba(255,255,255,0.07)" strokeWidth="0.08" fill="none">
        {links.map((l, i) => (
          <line key={i} x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y}>
            <animate attributeName="opacity" values="0.15;0.55;0.15" dur={`${4 + (i % 5)}s`} begin={`${(i % 7) * 0.3}s`} repeatCount="indefinite" />
          </line>
        ))}
      </g>
      <g>
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.d * 0.4} fill="url(#hbgNodeGrad)" opacity="0.5">
              <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${3 + (i % 4)}s`} begin={`${(i % 6) * 0.4}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={n.x} cy={n.y} r="0.35" fill="#fff" opacity="0.85" />
          </g>
        ))}
      </g>
    </svg>
  );
}

function BgGrid() {
  // Editorial — drifting horizontal rules + column ticks (paper / typesetting motif)
  return (
    <svg className="cp-hbg cp-hbg--grid" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="hbgGridFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(255,255,255,0)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <g>
        {Array.from({ length: 18 }).map((_, i) => {
          const y = 6 + i * 5.3;
          const w = 30 + (i % 4) * 14;
          const x = (i * 7) % 70;
          return (
            <rect key={i} x={x} y={y} width={w} height="0.18" fill="url(#hbgGridFade)" opacity="0.6">
              <animate attributeName="x" values={`${x};${x - 6};${x}`} dur={`${10 + (i % 5)}s`} repeatCount="indefinite" />
            </rect>
          );
        })}
      </g>
      <g stroke="rgba(233,113,28,0.55)" strokeWidth="0.12">
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1={12 + i * 13} y1="0" x2={12 + i * 13} y2="100" opacity="0.18" />
        ))}
      </g>
      {/* drifting paragraph marks */}
      <g fill="rgba(255,255,255,0.15)" fontFamily="Inter Tight" fontWeight="800" fontSize="9">
        <text x="8" y="22">§</text>
        <text x="84" y="46">¶</text>
        <text x="20" y="78">§</text>
        <text x="68" y="88">¶</text>
      </g>
    </svg>
  );
}

function BgOrbit() {
  // Event — orbiting rings + scheduled marks (calendar / time motif)
  return (
    <svg className="cp-hbg cp-hbg--orbit" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g transform="translate(50 55)">
        {[18, 28, 40, 54].map((r, i) => (
          <g key={r}>
            <circle r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.15" strokeDasharray={i % 2 ? '0.6 1.4' : '0'} />
            <g>
              <animateTransform attributeName="transform" type="rotate" from="0" to={i % 2 === 0 ? 360 : -360} dur={`${20 + i * 8}s`} repeatCount="indefinite" />
              <circle cx={r} cy="0" r={i === 1 ? 0.9 : 0.55} fill={i === 1 ? '#E9711C' : 'rgba(255,255,255,0.7)'} />
              {i === 2 && <circle cx={-r} cy="0" r="0.6" fill="rgba(255,255,255,0.45)" />}
            </g>
          </g>
        ))}
        <circle r="2.4" fill="#E9711C" opacity="0.85" />
        <circle r="2.4" fill="none" stroke="#E9711C" strokeWidth="0.2">
          <animate attributeName="r" values="2.4;7;2.4" dur="3.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="3.6s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}

function BgPulse() {
  // Research — vertical activity bars + waveform (active threads / work in progress)
  const bars = React.useMemo(() => {
    const r = (s) => { let x = Math.sin(s) * 9999; return x - Math.floor(x); };
    return Array.from({ length: 28 }, (_, i) => ({ x: i * 3.6 + 2, h: r(i * 2.3) * 30 + 6, d: r(i) * 2 + 1 }));
  }, []);
  return (
    <svg className="cp-hbg cp-hbg--pulse" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <g>
        {bars.map((b, i) => (
          <rect key={i} x={b.x} y={50 - b.h / 2} width="1.4" height={b.h} rx="0.4" fill={i % 5 === 0 ? '#E9711C' : 'rgba(255,255,255,0.18)'}>
            <animate attributeName="height" values={`${b.h};${b.h * 0.5};${b.h};${b.h * 1.2};${b.h}`} dur={`${b.d + 2}s`} repeatCount="indefinite" />
            <animate attributeName="y" values={`${50 - b.h / 2};${50 - b.h * 0.25};${50 - b.h / 2};${50 - b.h * 0.6};${50 - b.h / 2}`} dur={`${b.d + 2}s`} repeatCount="indefinite" />
          </rect>
        ))}
      </g>
      <path d="M0 75 Q 12 65 25 75 T 50 75 T 75 75 T 100 75" stroke="rgba(233,113,28,0.45)" strokeWidth="0.25" fill="none">
        <animate attributeName="d"
          values="M0 75 Q 12 65 25 75 T 50 75 T 75 75 T 100 75;
                  M0 75 Q 12 85 25 75 T 50 75 T 75 75 T 100 75;
                  M0 75 Q 12 65 25 75 T 50 75 T 75 75 T 100 75"
          dur="6s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

/* ---------- Slide content ---------- */

const HSLIDES = [
  {
    id: 'community',
    eyebrow: 'I — COMMUNITY',
    section: 'JOIN & EXPLORE',
    headlineA: 'The synergy',
    headlineB: 'behind every',
    headlineC: 'breakthrough.',
    deck: 'CoPublika is a privately-curated ecosystem for senior researchers — pairing a vetted collaborator network with structured publications that compound real impact.',
    primary: { label: 'Join the Community', href: 'join-batch.html' },
    secondary: { label: 'Explore Network', href: 'research-project.html' },
    chips: [
      { k: 'TOTAL AKADEMISI', v: '500+' },
      { k: 'COUNTRIES', v: '41' },
      { k: 'CURATION', v: 'MANUAL' },
    ],
    bg: 'network',
  },
  {
    id: 'blog',
    eyebrow: 'II — BLOG',
    section: 'NOTES FROM THE DESK',
    headlineA: 'Editorial notes,',
    headlineB: 'written by',
    headlineC: 'the desk.',
    deck: 'Long-form essays, council letters, and method critiques — published by our editors and reviewers. No SEO bait, no listicles. Quiet writing for serious readers.',
    primary: { label: 'Read the Blog', href: 'blog.html' },
    secondary: { label: 'Featured Essay', href: 'blog.html#featured' },
    chips: [
      { k: 'POSTS THIS YEAR', v: '24' },
      { k: 'AVG. READ', v: '12 MIN' },
      { k: 'TOPICS', v: '4' },
    ],
    bg: 'grid',
  },
  {
    id: 'event',
    eyebrow: 'III — EVENT',
    section: 'STUDIOS & COUNCIL DAYS',
    headlineA: 'Small rooms,',
    headlineB: 'long',
    headlineC: 'conversations.',
    deck: 'Method studios for members, public readings, and council office hours. Twenty seats per room. Calendar updated weekly across Jakarta, Singapore, and Zürich.',
    primary: { label: 'See Calendar', href: 'event.html' },
    secondary: { label: 'RSVP an Event', href: 'event.html#upcoming' },
    chips: [
      { k: 'UPCOMING', v: '05' },
      { k: 'CITIES', v: 'JKT · SGP · ZRH' },
      { k: 'NEXT', v: '22 MAY' },
    ],
    bg: 'orbit',
  },
  {
    id: 'research',
    eyebrow: 'IV — RESEARCH',
    section: 'LIVE PROJECT REGISTRY',
    headlineA: 'Real work,',
    headlineB: 'moving',
    headlineC: 'in the open.',
    deck: 'Nine active threads, led by senior researchers, paired with vetted co-authors, routed toward real venues. Filter by domain, follow phase by phase.',
    primary: { label: 'Browse Projects', href: 'research-project.html' },
    secondary: { label: 'About the Process', href: 'curation-process.html' },
    chips: [
      { k: 'ACTIVE', v: '05' },
      { k: 'IN REVIEW', v: '02' },
      { k: 'RECRUITING', v: '02' },
    ],
    bg: 'pulse',
  },
];

function Backdrop({ kind, active }) {
  const cls = `cp-hbg-wrap ${active ? 'is-active' : ''}`;
  return (
    <div className={cls} aria-hidden="true">
      {kind === 'network' && <BgNetwork />}
      {kind === 'grid' && <BgGrid />}
      {kind === 'orbit' && <BgOrbit />}
      {kind === 'pulse' && <BgPulse />}
    </div>
  );
}

function Hero() {
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => {
      setIdx((i) => (i + 1) % HSLIDES.length);
      setTick((k) => k + 1);
    }, HSLIDE_MS);
    return () => clearTimeout(t);
  }, [idx, paused]);

  const jump = (i) => { setIdx(i); setTick((k) => k + 1); };
  const next = () => jump((idx + 1) % HSLIDES.length);
  const prev = () => jump((idx - 1 + HSLIDES.length) % HSLIDES.length);

  return (
    <section className="cp-hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Backdrops */}
      <div className="cp-hero__bg">
        {HSLIDES.map((s, i) => <Backdrop key={s.id} kind={s.bg} active={i === idx} />)}
        <div className="cp-hero__grain" aria-hidden="true"></div>
        <div className="cp-hero__vignette" aria-hidden="true"></div>
      </div>

      {/* Decorative crosshairs */}
      <div className="cp-hero__crosshair cp-hero__crosshair--tl" aria-hidden="true"></div>
      <div className="cp-hero__crosshair cp-hero__crosshair--tr" aria-hidden="true"></div>
      <div className="cp-hero__crosshair cp-hero__crosshair--bl" aria-hidden="true"></div>
      <div className="cp-hero__crosshair cp-hero__crosshair--br" aria-hidden="true"></div>

      {/* Top rail */}
      <div className="cp-hero__rail cp-hero__rail--top">
        <div className="cp-hero__rail-l">
          <span className="cp-hero__live"><i></i>LIVE FROM THE NETWORK</span>
        </div>
        <div className="cp-hero__rail-r cp-mono">
          <span>BATCH 04 · 19/24 SEATS</span>
          <span className="cp-hero__rail-dot"></span>
          <span>JKT {String(new Date().getUTCHours() + 7).padStart(2,'0')}:00 WIB</span>
        </div>
      </div>

      {/* Slides stage */}
      <div className="cp-hero__stage">
        {HSLIDES.map((s, i) => (
          <div key={s.id} className={`cp-hero__slide ${i === idx ? 'is-active' : i < idx ? 'is-prev' : 'is-next'}`}>
            <div className="cp-hero__inner">
              <div className="cp-hero__eyebrow">
                <span className="cp-hero__eyebrow-num">{s.eyebrow}</span>
                <span className="cp-hero__eyebrow-sep"></span>
                <span className="cp-hero__eyebrow-section">{s.section}</span>
              </div>

              <h1 className="cp-hero__h">
                <span className="cp-hero__h-line"><span className="cp-hero__h-inner">{s.headlineA}</span></span>
                <span className="cp-hero__h-line"><span className="cp-hero__h-inner cp-hero__h-italic">{s.headlineB}</span></span>
                <span className="cp-hero__h-line"><span className="cp-hero__h-inner cp-hero__h-mute">{s.headlineC}</span></span>
              </h1>

              <p className="cp-hero__deck">{s.deck}</p>

              <div className="cp-hero__cta">
                <a href={s.primary.href} className="cp-hero__cta-primary">
                  <span>{s.primary.label}</span>
                  <span className="cp-hero__cta-arrow"><Icon.Arrow /></span>
                </a>
                <a href={s.secondary.href} className="cp-hero__cta-ghost">{s.secondary.label}</a>
              </div>

              <div className="cp-hero__chips">
                {s.chips.map((c) => (
                  <div key={c.k} className="cp-hero__chip">
                    <span className="cp-hero__chip-k">{c.k}</span>
                    <span className="cp-hero__chip-v">{c.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom rail — navigation */}
      <div className="cp-hero__rail cp-hero__rail--bot">
        <div className="cp-hero__progress">
          {HSLIDES.map((s, i) => (
            <button
              key={s.id}
              className={`cp-hero__tab ${i === idx ? 'is-active' : ''} ${i < idx ? 'is-done' : ''}`}
              onClick={() => jump(i)}
            >
              <span className="cp-hero__tab-num">0{i + 1}</span>
              <span className="cp-hero__tab-lbl">{s.eyebrow.split('—')[1].trim()}</span>
              <span className="cp-hero__tab-bar">
                <span className="cp-hero__tab-fill" key={i === idx ? `t-${tick}` : `s-${i}`}></span>
              </span>
            </button>
          ))}
        </div>
        <div className="cp-hero__arrows">
          <button className="cp-hero__arrow" onClick={prev} aria-label="Previous slide">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button className="cp-hero__arrow" onClick={next} aria-label="Next slide">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
window.Hero = Hero;

/* ============================================================
   KPI / Marquee — unchanged structure
   ============================================================ */

function KPI() {
  return (
    <section className="cp-section--tight" style={{ padding: '40px 0' }}>
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 var(--pad)' }}>
        <div className="cp-kpi">
          <Reveal className="cp-kpi__cell">
            <div className="cp-mono cp-kpi__lbl">Total Akademisi</div>
            <div className="cp-kpi__num"><CountUp to={500} /></div>
            <div className="cp-kpi__sub">Verified senior researchers across 41 countries.</div>
          </Reveal>
          <Reveal className="cp-kpi__cell" delay={120}>
            <div className="cp-mono cp-kpi__lbl">Total Research Project</div>
            <div className="cp-kpi__num"><CountUp to={120} /></div>
            <div className="cp-kpi__sub">Active and recently-completed collaborations.</div>
          </Reveal>
          <Reveal className="cp-kpi__cell" delay={240}>
            <div className="cp-mono cp-kpi__lbl">Global Publications</div>
            <div className="cp-kpi__num"><CountUp to={300} /></div>
            <div className="cp-kpi__sub">Scopus-indexed outputs from cohort members.</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
window.KPI = KPI;

function Marquee() {
  const items = ['Curated', 'Synergy', 'Scopus', 'Indexed', 'Verified', 'Collaboration', 'Research'];
  const loop = [...items, ...items];
  return (
    <div className="cp-marquee">
      <div className="cp-marquee__track">
        {loop.map((w, i) => <span key={i} className="cp-marquee__item">{w}</span>)}
      </div>
      <div className="cp-marquee__track" aria-hidden="true">
        {loop.map((w, i) => <span key={i} className="cp-marquee__item">{w}</span>)}
      </div>
    </div>
  );
}
window.Marquee = Marquee;
