import Link from "next/link";
import type { CSSProperties } from "react";
import { SpotlightGroup } from "@/components/ui/SpotlightGroup";

// "Apa yang kami lakukan": what membership actually gives an academic, as a bento.

const AVATARS = [44, 33, 49, 12, 25];
const FIELDS = ["Kesehatan", "Pendidikan", "Teknik", "Ekonomi", "Sosial & humaniora", "Sains data", "Hukum", "Pertanian"];
const PROGRESS = ["Draft", "Review", "Revisi", "Terbit"];
const MENTORS = [
  { name: "Dr. Aulia R.", badge: "Reviewer Q1", img: 47 },
  { name: "Dr. Bayu S.", badge: "Editor tamu", img: 15 },
];

export function WhyJoinBento() {
  return (
    <section className="cp-pillars cp-surface-ink">
      <div className="cp-pillars__wrap">
        <div className="cp-section-head" data-reveal>
          <div>
            <div className="cp-sh-tag">
              <span className="cp-sh-tag__bar" />
              <span>Apa yang kami lakukan</span>
            </div>
            <h2 className="cp-sh-h cp-sh-h--line">
              Satu ekosistem untuk <span className="cp-sh-h-accent">riset yang bertumbuh.</span>
            </h2>
          </div>
        </div>

        <SpotlightGroup className="cp-bento2">
          {/* Curated community */}
          <Link href="/about" className="cp-bento2__card cp-bento2__card--hero" data-spot data-reveal style={{ "--i": 0 } as CSSProperties}>
            <p className="cp-bento2__kicker">Komunitas terkurasi</p>
            <div className="cp-bento2__stat">
              1.240<span>+</span>
            </div>
            <h3 className="cp-bento2__h">akademisi aktif yang saling mendukung</h3>
            <p className="cp-bento2__p">
              Setiap anggota melewati verifikasi profil Google Scholar, sehingga diskusi tetap berkualitas dan
              kredibel.
            </p>
            <div className="cp-bento2__avatars" aria-hidden="true">
              {AVATARS.map((n) => (
                <span key={n} style={{ backgroundImage: `url('https://i.pravatar.cc/80?img=${n}')` }} />
              ))}
              <span className="cp-bento2__avatars-more">+1.2k</span>
            </div>
          </Link>

          {/* Cross-disciplinary */}
          <Link href="/research" className="cp-bento2__card cp-bento2__card--fields" data-spot data-reveal style={{ "--i": 1 } as CSSProperties}>
            <p className="cp-bento2__kicker">Lintas disiplin</p>
            <h3 className="cp-bento2__h">Kolaborasi lintas kampus dan bidang ilmu</h3>
            <p className="cp-bento2__p">Satu proyek, banyak sudut pandang. Temukan rekan dengan keahlian yang melengkapi riset Anda.</p>
            {/* Fields orbit a shared project: two elliptical rings, back items small and faded. */}
            <div className="cp-orbit" aria-hidden="true">
              <span className="cp-orbit__ellipse cp-orbit__ellipse--outer" />
              <span className="cp-orbit__ellipse cp-orbit__ellipse--inner" />
              <span className="cp-orbit__core">Proyek riset</span>
              {FIELDS.map((f, i) => (
                <span
                  key={f}
                  className={`cp-orbit__item ${i % 2 ? "cp-orbit__item--inner" : ""}`}
                  style={{ "--k": Math.floor(i / 2) } as CSSProperties}
                >
                  {f}
                </span>
              ))}
            </div>
          </Link>

          {/* Mentors */}
          <Link href="/siap-tembus-scopus" className="cp-bento2__card cp-bento2__card--feature" data-spot data-reveal style={{ "--i": 2 } as CSSProperties}>
            <div className="cp-bento2__visual cp-mentors" aria-hidden="true">
              {MENTORS.map((m) => (
                <span key={m.name} className="cp-mentors__row">
                  <span className="cp-mentors__avatar" style={{ backgroundImage: `url('https://i.pravatar.cc/80?img=${m.img}')` }} />
                  <span className="cp-mentors__name">{m.name}</span>
                  <span className="cp-mentors__badge">{m.badge}</span>
                </span>
              ))}
              <span className="cp-mentors__more">+45 mentor lainnya</span>
            </div>
            <div className="cp-bento2__row">
              <span className="cp-bento2__icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10 12 5 2 10l10 5 10-5z" />
                  <path d="M6 12v5c3 2 9 2 12 0v-5" />
                </svg>
              </span>
              <h3 className="cp-bento2__h">Mentor berpengalaman</h3>
            </div>
            <p className="cp-bento2__p">Masukan dari peneliti yang sudah berulang kali menembus jurnal bereputasi.</p>
          </Link>

          {/* Safe space */}
          <Link href="/about" className="cp-bento2__card cp-bento2__card--feature" data-spot data-reveal style={{ "--i": 3 } as CSSProperties}>
            <div className="cp-bento2__visual cp-chat" aria-hidden="true">
              <span className="cp-chat__bubble cp-chat__bubble--in">Maaf kalau dasar, bedanya jurnal Q1 dan Q2 apa?</span>
              <span className="cp-chat__bubble cp-chat__bubble--out">Pertanyaan bagus! Kita bahas pelan-pelan, ya.</span>
              <span className="cp-chat__typing">
                <i />
                <i />
                <i />
              </span>
            </div>
            <div className="cp-bento2__row">
              <span className="cp-bento2__icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2 4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <h3 className="cp-bento2__h">Ruang aman untuk bertanya</h3>
            </div>
            <p className="cp-bento2__p">Tidak ada pertanyaan yang terlalu dasar. Kita belajar bersama, dari pemula hingga senior.</p>
          </Link>

          {/* Measurable progress */}
          <Link href="/siap-tembus-scopus" className="cp-bento2__card cp-bento2__card--feature" data-spot data-reveal style={{ "--i": 4 } as CSSProperties}>
            <div className="cp-bento2__visual cp-track" aria-hidden="true">
              <span className="cp-track__head">
                <span>Naskah: tinjauan pustaka</span>
                <b>50%</b>
              </span>
              <span className="cp-track__bar">
                <span />
              </span>
              <ol className="cp-bento2__progress">
                {PROGRESS.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ol>
            </div>
            <div className="cp-bento2__row">
              <span className="cp-bento2__icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <path d="m7 15 4-4 3 3 5-6" />
                </svg>
              </span>
              <h3 className="cp-bento2__h">Progres yang terukur</h3>
            </div>
            <p className="cp-bento2__p">Pantau naskah dari draft hingga terbit dengan tonggak yang jelas.</p>
          </Link>
        </SpotlightGroup>
      </div>
    </section>
  );
}
