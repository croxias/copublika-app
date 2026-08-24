import Link from "next/link";

export function WhyJoinBento() {
  return (
    <section className="cp-pillars">
      <div className="cp-pillars__wrap">
        <div className="cp-section-head cp-section-head--center">
          <div className="cp-sh-tag" style={{ marginBottom: 16 }}>
            <span className="cp-sh-tag__num">03</span>
            <span>Apa yang kami lakukan</span>
          </div>
          <h2 className="cp-sh-h">Kenapa Gabung CoPublika?</h2>
          <p className="cp-sh-sub">
            Komunitas akademisi pemula Indonesia yang supportive, kolaboratif, dan siap
            menemani anda menjadi peneliti yang lebih baik.
          </p>
        </div>

        <div className="cp-bento">
          {/* Big stat card */}
          <Link className="cp-bento__card cp-bento__card--stat cp-bento__span-2" href="/about">
            <div className="cp-bento__bignum">
              <svg className="cp-bento__circle" viewBox="0 0 200 100" preserveAspectRatio="none">
                <ellipse cx="100" cy="50" rx="92" ry="42" transform="rotate(-2 100 50)" />
              </svg>
              <span className="cp-bento__bignum-v">
                1.240<span className="cp-bento__accent">+</span>
              </span>
            </div>
            <h3 className="cp-bento__h">Akademisi Aktif</h3>
          </Link>

          {/* Fingerprint icon card */}
          <Link className="cp-bento__card cp-bento__card--icon cp-bento__span-2" href="/about">
            <div className="cp-bento__inner">
              <div className="cp-bento__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c-2 0-4-2-4-5" />
                  <path d="M12 22c2 0 4-2 4-5v-7a4 4 0 00-8 0v7" />
                  <path d="M16 10a4 4 0 00-8 0v7" />
                  <path d="M20 10a8 8 0 00-16 0v3" />
                  <path d="M4 14v3" />
                </svg>
              </div>
              <h3 className="cp-bento__h">Komunitas Terpercaya</h3>
              <p className="cp-bento__p">
                Diskusi berkualitas, networking nyata, dan kolaborasi riset yang meaningful.
              </p>
            </div>
          </Link>

          {/* Chart card */}
          <Link className="cp-bento__card cp-bento__card--chart cp-bento__span-2" href="/research">
            <div className="cp-bento__chart">
              <span className="cp-bento__speed-l">Progress</span>
              <span className="cp-bento__speed-v">+47% YoY</span>
              <svg className="cp-bento__spark" viewBox="0 0 200 60" preserveAspectRatio="none">
                <path d="M0,45 L18,38 L36,42 L54,30 L72,34 L90,22 L108,28 L126,18 L144,24 L162,12 L180,16 L200,8" />
              </svg>
            </div>
            <h3 className="cp-bento__h">Level Up Bareng</h3>
            <p className="cp-bento__p">
              Tracking progres riset anda, share achievement, dan lihat bagaimana skill akademik
              bertumbuh.
            </p>
          </Link>

          {/* Safe space wide */}
          <Link className="cp-bento__card cp-bento__card--wide cp-bento__span-3" href="/about">
            <div className="cp-bento__wleft">
              <div className="cp-bento__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" />
                </svg>
              </div>
              <h3 className="cp-bento__h">Safe Space untuk Belajar</h3>
              <p className="cp-bento__p">
                Lingkungan supportive untuk semua level. Mau pemula atau berpengalaman — kami
                saling bantu untuk grow together.
              </p>
            </div>
            <div className="cp-bento__wright">
              <svg className="cp-bento__growth" viewBox="0 0 280 140" preserveAspectRatio="none">
                <path className="cp-bento__growth-area" d="M0,115 L20,108 L40,118 L60,95 L80,100 L100,82 L120,90 L140,68 L160,75 L180,50 L200,58 L220,40 L240,28 L260,32 L280,12 L280,140 L0,140 Z" />
                <path className="cp-bento__growth-line" d="M0,115 L20,108 L40,118 L60,95 L80,100 L100,82 L120,90 L140,68 L160,75 L180,50 L200,58 L220,40 L240,28 L260,32 L280,12" />
              </svg>
            </div>
          </Link>

          {/* Collaboration wide */}
          <Link className="cp-bento__card cp-bento__card--wide cp-bento__span-3" href="/research">
            <div className="cp-bento__wleft">
              <div className="cp-bento__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="8" r="3" />
                  <circle cx="17" cy="10" r="2.5" />
                  <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                  <path d="M14.5 16c1.5-1 3-1.5 4.5-1.5 1.5 0 3 .5 4 1.5" />
                </svg>
              </div>
              <h3 className="cp-bento__h">Kolaborasi Tanpa Batas</h3>
              <p className="cp-bento__p">
                Bikin riset bareng, share knowledge, dan publikasikan karya yang berdampak —
                bersama tim mentor & peer.
              </p>
            </div>
            <div className="cp-bento__wright cp-bento__wright--plain">
              <div className="cp-bento__avlist">
                <div className="cp-bento__avrow cp-bento__avrow--r1">
                  <span>Rini P.</span>
                  <span className="cp-bento__avatar" style={{ backgroundImage: "url('https://i.pravatar.cc/60?img=44')" }} />
                </div>
                <div className="cp-bento__avrow cp-bento__avrow--r2">
                  <span className="cp-bento__avatar" style={{ backgroundImage: "url('https://i.pravatar.cc/60?img=33')" }} />
                  <span>dr. Andika H.</span>
                </div>
                <div className="cp-bento__avrow cp-bento__avrow--r3">
                  <span>Siti N.</span>
                  <span className="cp-bento__avatar" style={{ backgroundImage: "url('https://i.pravatar.cc/60?img=49')" }} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
