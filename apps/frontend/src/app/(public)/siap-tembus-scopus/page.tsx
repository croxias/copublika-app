import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { HeroCanvas } from "./HeroCanvas";
import { getOpenBatches } from "@/lib/data/batches";

const QUICK_META_STATIC = [
  { label: "Durasi", value: "12 Minggu" },
  { label: "Format", value: "Hybrid", sub: "(Online + 2x Luring)" },
  { label: "Mulai", value: "15 Sep 2026" },
];

const IDEAL_PROFILE = [
  "Dosen 1–5 tahun pengalaman yang ingin membangun rekam jejak publikasi internasional.",
  "Mahasiswa S2/S3 yang membutuhkan publikasi sebagai syarat lulus atau syarat beasiswa.",
  "Peneliti yang sudah pernah submit tapi sering ditolak — atau merasa stuck di tahap revisi.",
  "Akademisi yang punya data / ide tapi belum tahu cara mengubahnya menjadi naskah jurnal.",
];

const OUTPUTS = [
  "Satu naskah lengkap (5.000–8.000 kata) siap di-submit ke jurnal target.",
  "Daftar jurnal target dengan analisis fit, scope, dan timeline publikasi.",
  "Cover letter + response-to-reviewer template yang sudah teruji.",
  "Jaringan 24 rekan satu batch + akses alumni network CoPublika seumur hidup.",
];

const CURRICULUM = [
  { week: "W 1–2", phase: "Phase 01 / Discover", title: "Pemilihan Topik & Jurnal Target", desc: "Workshop scoping, pemetaan gap riset, dan analisis fit jurnal Scopus.", deliv: "◆ 1-page Concept Note" },
  { week: "W 3–4", phase: "Phase 02 / Review", title: "Tinjauan Pustaka Sistematis", desc: "Strategi pencarian, sintesis tematik, dan penyusunan argumen literatur.", deliv: "◆ Literature Matrix" },
  { week: "W 5–6", phase: "Phase 03 / Method", title: "Metodologi & Analisis Data", desc: "Justifikasi metode, validitas, dan presentasi hasil yang publikasi-ready.", deliv: "◆ Methods + Results Draft" },
  { week: "W 7–8", phase: "Phase 04 / Write", title: "Penulisan Akademik Bahasa Inggris", desc: "Anchor sentences, kohesi paragraf, dan diksi akademik untuk reviewer internasional.", deliv: "◆ Full Manuscript Draft" },
  { week: "W 9–10", phase: "Phase 05 / Refine", title: "Klinik Manuskrip & Peer Review", desc: "Internal peer review dua putaran, mock reviewer comments, dan revisi terstruktur.", deliv: "◆ Revised Manuscript" },
  { week: "W 11–12", phase: "Phase 06 / Submit", title: "Submission & Strategi Revisi", desc: "Cover letter, response strategy, dan pendampingan submission portal.", deliv: "◆ Submitted to Scopus" },
];

const MENTORS = [
  { initials: "AP", name: "Dr. Ade Putranto, M.Sc.", field: "Educational Tech · Q1 Author", bio: "Penulis 28 artikel Scopus, reviewer di 4 jurnal Q1, mentor sejak 2019.", hIndex: "h-index 14", color: "#E9711C" },
  { initials: "MR", name: "Dr. Maya Rahmawati", field: "Public Health · Q2 Editor", bio: "Associate editor di jurnal kesehatan Q2, fokus literasi kesehatan komunitas.", hIndex: "h-index 11", color: "#2E7D32" },
  { initials: "BS", name: "Dr. Bayu Setiawan", field: "Sustainability · Q1 Reviewer", bio: "Reviewer aktif di Sustainability dan Resources, Conservation & Recycling.", hIndex: "h-index 9", color: "#1565C0" },
  { initials: "LK", name: "Dr. Lina Kartika", field: "Linguistics · TEFLIN Q3", bio: "Spesialis academic writing dan editor di TEFLIN Journal.", hIndex: "h-index 8", color: "#6A1B9A" },
  { initials: "FR", name: "Fajar Ramadhan, Ph.D.", field: "AI & Engineering · Q1", bio: "Penulis 12 paper IEEE, fokus computer vision dan AI etis.", hIndex: "h-index 7", color: "#00695C" },
  { initials: "DN", name: "Dr. Dewi Nirmala", field: "Sociology · Q2 Author", bio: "Spesialis riset kualitatif, pendekatan etnografi, dan grounded theory.", hIndex: "h-index 10", color: "#C62828" },
];

const FREE_FEATURES = [
  { text: "Akses semua modul 12 minggu" },
  { text: "Mentor 1-on-1 (6 sesi)" },
  { text: "Klinik manuskrip mingguan" },
  { text: "Sertifikat & alumni network" },
];

export const metadata = {
  title: "Siap Tembus Scopus — CoPublika",
  description: "Bootcamp 12 minggu untuk publikasi terindeks Scopus.",
};

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default async function SiapTembusScopusPage() {
  const openBatches = await getOpenBatches();
  const activeBatch = openBatches[0];
  const seatsLabel = activeBatch ? `${activeBatch.seatsRemaining} / ${activeBatch.seatsTotal}` : "24 / 60";
  const seatsRemaining = activeBatch?.seatsRemaining ?? 24;
  const seatsTotal = activeBatch?.seatsTotal ?? 60;
  const filled = Math.round(((seatsTotal - seatsRemaining) / seatsTotal) * 100);
  const cohortLabel = activeBatch ? `Batch #${activeBatch.number}` : "Batch #07";
  const joinHref = activeBatch ? `/join-batch?batchId=${activeBatch.id}` : "/join-batch";
  return (
    <main className="cp-stsz">
      {/* Hero */}
      <section className="cp-stsz-hero">
        <div className="cp-stsz-hero__orb-a" aria-hidden="true" />
        <div className="cp-stsz-hero__inner">
          <div className="cp-stsz-hero__grid-layout">
            <div className="cp-stsz-hero__content">
              <Reveal>
                <div className="cp-stsz-pulse">
                  <i />
                  <span>{cohortLabel} — Pendaftaran Dibuka</span>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="cp-stsz-hero__title">
                  Bootcamp<br />
                  <span className="cp-stsz-hero__accent">Siap Tembus Scopus</span>
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="cp-stsz-hero__lead">
                  12 minggu pendampingan terstruktur — mulai dari pemilihan topik hingga
                  acceptance letter. Mentor 1-on-1 dengan rekam jejak publikasi Q1–Q3.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="cp-stsz-hero__cta">
                  <Link href={joinHref} className="cp-stsz-cta-btn cp-stsz-cta-btn--primary cp-stsz-cta-btn--lg">
                    <span>Daftar {cohortLabel}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                  <a href="#curriculum" className="cp-stsz-cta-btn cp-stsz-cta-btn--ghost cp-stsz-cta-btn--lg">
                    <span>Lihat Modul</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </a>
                </div>
              </Reveal>
            </div>

            <div className="cp-stsz-hero__visual">
              <HeroCanvas />
              <div className="cp-stsz-hero__ring" />
              <div className="cp-stsz-hero__ring cp-stsz-hero__ring--2" />
              <div className="cp-stsz-hero__stat-card cp-stsz-hero__stat-card--1">
                <span className="cp-stsz-hero__stat-num">76%</span>
                <span className="cp-stsz-hero__stat-lbl">Akseptasi</span>
              </div>
              <div className="cp-stsz-hero__stat-card cp-stsz-hero__stat-card--2">
                <span className="cp-stsz-hero__stat-num">318</span>
                <span className="cp-stsz-hero__stat-lbl">Publikasi</span>
              </div>
              <div className="cp-stsz-hero__phase-track">
                {CURRICULUM.map((c, i) => (
                  <div key={c.phase} className="cp-stsz-hero__phase-dot" title={c.title}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Reveal delay={0.32}>
            <div className="cp-stsz-meta">
              {[...QUICK_META_STATIC, { label: "Kuota tersisa", value: seatsLabel }].map((m) => (
                <div key={m.label} className="cp-stsz-meta__item">
                  <div className="cp-stsz-meta__l">{m.label}</div>
                  <div className="cp-stsz-meta__v">
                    {m.value}
                    {m.sub && <span className="cp-stsz-meta__sub"> {m.sub}</span>}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Fit Section */}
      <section className="cp-stsz-fit">
        <div className="cp-stsz-wrap">
          <div className="cp-stsz-section__head">
            <Reveal>
              <div className="cp-stsz-tag">
                <span className="cp-stsz-tag__bar" />
                <span>Untuk siapa</span>
              </div>
              <h2 className="cp-stsz-section__title">Anda akan cocok di sini jika&hellip;</h2>
            </Reveal>
          </div>

          <div className="cp-stsz-fit__grid">
            <Reveal>
              <div className="cp-stsz-fit__card">
                <div className="cp-stsz-fit__eyebrow">
                  <span className="cp-stsz-fit__dot" />
                  <span>Profil ideal</span>
                </div>
                <ul className="cp-stsz-fit__list">
                  {IDEAL_PROFILE.map((item) => (
                    <li key={item}>
                      <span className="cp-stsz-fit__bullet" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="cp-stsz-fit__card cp-stsz-fit__card--accent">
                <div className="cp-stsz-fit__eyebrow">
                  <span className="cp-stsz-fit__dot" />
                  <span>Output anda</span>
                </div>
                <ul className="cp-stsz-fit__list">
                  {OUTPUTS.map((item, idx) => (
                    <li key={item}>
                      <span className="cp-stsz-fit__num">{String(idx + 1).padStart(2, "0")}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" className="cp-stsz-curri-section">
        <div className="cp-stsz-wrap">
          <div className="cp-stsz-section__head cp-stsz-section__head--split">
            <Reveal>
              <div className="cp-stsz-tag">
                <span className="cp-stsz-tag__bar" />
                <span>Kurikulum 12 minggu</span>
              </div>
              <h2 className="cp-stsz-section__title">12 minggu, 6 fase.</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="cp-stsz-section__sub">
                Setiap fase memiliki output yang konkret. Tidak ada fase yang dilewati — bahkan
                jika anda sudah pernah submit sebelumnya.
              </p>
            </Reveal>
          </div>

          <div className="cp-stsz-curri">
            {CURRICULUM.map((c) => (
              <div key={c.phase} className="cp-stsz-curri__row">
                <div className="cp-stsz-curri__left">
                  <span className="cp-stsz-curri__week">{c.week}</span>
                </div>
                <div className="cp-stsz-curri__content">
                  <div className="cp-stsz-curri__phase">{c.phase}</div>
                  <h4 className="cp-stsz-curri__title">
                    {c.title}
                    <span className="cp-stsz-curri__desc">{c.desc}</span>
                  </h4>
                  <div className="cp-stsz-curri__deliv">{c.deliv}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors */}
      <section className="cp-stsz-mentors">
        <div className="cp-stsz-wrap">
          <div className="cp-stsz-section__head">
            <Reveal>
              <div className="cp-stsz-tag">
                <span className="cp-stsz-tag__bar" />
                <span>Dibimbing mentor aktif</span>
              </div>
              <h2 className="cp-stsz-section__title">Dibimbing peneliti aktif.</h2>
              <p className="cp-stsz-section__sub">
                Mentor inti kami punya rekam jejak publikasi di jurnal Q1–Q3 dan pengalaman sebagai reviewer.
              </p>
            </Reveal>
          </div>

          <div className="cp-stsz-mentors__grid">
            {MENTORS.map((m, idx) => (
              <Reveal key={m.name} delay={(idx % 3) * 0.1}>
                <div className="cp-stsz-mentor">
                  <div
                    className="cp-stsz-mentor__avatar"
                    style={{ background: `${m.color}14`, borderColor: `${m.color}38`, color: m.color }}
                  >
                    {m.initials}
                  </div>
                  <div>
                    <h5 className="cp-stsz-mentor__name">{m.name}</h5>
                    <div className="cp-stsz-mentor__field">{m.field}</div>
                    <p className="cp-stsz-mentor__bio">{m.bio}</p>
                    <span className="cp-stsz-mentor__badge" style={{ color: m.color, background: `${m.color}14` }}>
                      {m.hIndex}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Free Slot */}
      <section className="cp-stsz-free">
        <div className="cp-stsz-free__glow-a" aria-hidden="true" />
        <div className="cp-stsz-free__glow-b" aria-hidden="true" />
        <div className="cp-stsz-wrap">
          <div className="cp-stsz-free__inner">
            <Reveal>
              <div className="cp-stsz-free__pill">
                <i />
                <span>Beta &middot; 100% Gratis</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="cp-stsz-free__title">
                {cohortLabel} — <em>100% gratis</em>.<br />Hanya {seatsRemaining} kursi tersisa dari {seatsTotal}.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="cp-stsz-free__lead">
                Sebagai bagian dari program beta CoPublika, biaya bootcamp 12 minggu sepenuhnya
                digratiskan. Yang kami minta hanya komitmen anda untuk hadir sampai akhir.
              </p>
            </Reveal>

            <Reveal delay={0.28}>
              <div className="cp-stsz-slot">
                <div className="cp-stsz-slot__top">
                  <div>
                    <div className="cp-stsz-slot__l">Kuota terisi</div>
                    <div className="cp-stsz-slot__count">
                      <span className="cp-stsz-slot__count-num">{seatsTotal - seatsRemaining}</span>
                      <span className="cp-stsz-slot__count-of">/ {seatsTotal}</span>
                    </div>
                  </div>
                  <div className="cp-stsz-slot__right">
                    <div className="cp-stsz-slot__l">Tersisa</div>
                    <div className="cp-stsz-slot__remain">{seatsRemaining} kursi</div>
                  </div>
                </div>
                <div className="cp-stsz-slot__bar">
                  <div className="cp-stsz-slot__bar-fill" style={{ width: `${filled}%` }} />
                </div>
                <div className="cp-stsz-slot__foot">
                  <span className="cp-stsz-slot__foot-dot">&#9679;</span>
                  Pendaftaran ditutup ketika kuota terpenuhi
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.36}>
              <div className="cp-stsz-free__features">
                {FREE_FEATURES.map((f) => (
                  <div key={f.text} className="cp-stsz-free__feature">
                    <span className="cp-stsz-free__feature-ico"><CheckIcon /></span>
                    <span className="cp-stsz-free__feature-txt">{f.text}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.44}>
              <div className="cp-stsz-free__cta">
                <Link href={joinHref} className="cp-stsz-cta-btn cp-stsz-cta-btn--primary cp-stsz-cta-btn--lg">
                  <span>Klaim Kursi Gratis — {cohortLabel}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link href="/contact" className="cp-stsz-cta-btn cp-stsz-cta-btn--ghost cp-stsz-cta-btn--lg">
                  <span>Tanya dulu</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}