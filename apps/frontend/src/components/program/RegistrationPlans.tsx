"use client";

import { createContext, useContext, useRef, useState } from "react";
import Link from "next/link";
import { DEFAULT_SETTINGS, memberPlans, monthsText, perUnit, usePublicProgramPrices, usePublicSettings, type RegistrationSettings } from "@/lib/cms/registration-settings";
import NumberFlow from "@number-flow/react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type Variants } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CalendarDays,
  CheckCheck,
  FileSearch,
  FlaskConical,
  Gift,
  History,
  LineChart,
  PenLine,
  Presentation,
  RefreshCw,
  Sparkles,
  UserRoundPlus,
  Users,
  Video,
  Wrench,
} from "lucide-react";
import {
  BOOTCAMP_BATCHES,
  PROGRAMS,
  STS_MENTORS,
  batchSeatsLeft,
  formatDate,
  formatRupiah,
  seatsLeft,
} from "@/lib/data/programs";

// Pendaftaran: four equal choices, no required order. Registration is free for the first
// month, activation renews a year, and both programs include a year of membership free.

const EASE = [0.22, 1, 0.36, 1] as const;
/** Pengaturan pendaftaran for the cards below (defaults until the staged values load). */
const Settings = createContext<RegistrationSettings>(DEFAULT_SETTINGS);
const useS = () => useContext(Settings);

/* ---------- Motion ---------- */

const gridV: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } };
const cardV: Variants = {
  hidden: { opacity: 0, y: 44, scale: 0.97, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { type: "spring", stiffness: 110, damping: 20, mass: 0.9, staggerChildren: 0.06, delayChildren: 0.18 } },
};
const itemV: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/** A card that rises in, then leans gently toward the pointer. */
function PlanCard({ className, children }: { className: string; children: (shown: boolean) => React.ReactNode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(!!reduce);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [3.5, -3.5]), { stiffness: 160, damping: 18 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-3.5, 3.5]), { stiffness: 160, damping: 18 });

  const move = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const leave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.article
      ref={ref}
      className={className}
      variants={reduce ? undefined : cardV}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1100 }}
      whileHover={reduce ? undefined : { y: -6, transition: { type: "spring", stiffness: 260, damping: 22 } }}
      onPointerMove={move}
      onPointerLeave={leave}
      onViewportEnter={() => setShown(true)}
      viewport={{ once: true, amount: 0.25 }}
    >
      {children(shown)}
    </motion.article>
  );
}

const Item = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <motion.div className={className} variants={itemV}>
    {children}
  </motion.div>
);

/* ---------- Pieces ---------- */

function Head({ kicker, icon, badge, badgeInk }: { kicker: string; icon: React.ReactNode; badge?: string; badgeInk?: boolean }) {
  return (
    <Item className="cp-plan__head">
      <span className="cp-plan__kicker">{icon} {kicker}</span>
      {badge && <span className={`cp-plan__badge ${badgeInk ? "is-ink" : ""}`}>{badge}</span>}
    </Item>
  );
}

function Price({ value, unit, shown }: { value: number; unit: string; shown: boolean }) {
  return (
    <Item className="cp-plan__price">
      {value === 0 ? (
        <span className="cp-plan__amount">Gratis</span>
      ) : (
        <NumberFlow value={shown ? value : 0} locales="id-ID" prefix="Rp. " className="cp-plan__amount" transformTiming={{ duration: 900, easing: "cubic-bezier(.22,1,.36,1)" }} spinTiming={{ duration: 900, easing: "cubic-bezier(.22,1,.36,1)" }} willChange />
      )}
      <span className="cp-plan__unit">{unit}</span>
    </Item>
  );
}

function Ctas({ primary, secondary, tone, closed }: { primary: { label: string; href: string }; secondary?: { label: string; href: string }; tone: "accent" | "ink"; closed?: boolean }) {
  return (
    <Item className="cp-plan__ctas">
      {closed ? (
        <span className="cp-plan__btn is-closed" aria-disabled="true">Ditutup sementara</span>
      ) : (
        <Link href={primary.href} className={`cp-plan__btn is-${tone}`}>
          {primary.label} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
      {secondary && !closed && <Link href={secondary.href} className="cp-plan__btn is-line">{secondary.label}</Link>}
    </Item>
  );
}

function Features({ items }: { items: { text: string; icon: React.ReactNode }[] }) {
  return (
    <Item className="cp-plan__features">
      <ul>
        {items.map((f) => (
          <li key={f.text}><span aria-hidden="true">{f.icon}</span>{f.text}</li>
        ))}
      </ul>
    </Item>
  );
}

function Includes({ title, items }: { title: string; items: string[] }) {
  return (
    <Item className="cp-plan__includes">
      <h4>{title}</h4>
      <ul>
        {items.map((x) => (
          <li key={x}><span className="cp-plan__check" aria-hidden="true"><CheckCheck size={13} /></span>{x}</li>
        ))}
      </ul>
    </Item>
  );
}

function MemberBonus() {
  const s = useS();
  if (!s.programBonusMonths) return null;
  return (
    <Item className="cp-plan__bonus">
      <Gift size={15} aria-hidden="true" />
      <span>Bonus member {monthsText(s.programBonusMonths)}<small><s>{formatRupiah(s.yearlyPrice)}</s> <b>Gratis</b></small></span>
    </Item>
  );
}

/* ---------- Cards ---------- */

function RegisterCard() {
  const s = useS();
  const p = memberPlans(s).gratis;
  return (
    <PlanCard className="cp-plan is-member">
      {(shown) => (
        <>
          <Head kicker="Keanggotaan" icon={<UserRoundPlus size={14} aria-hidden="true" />} badge="Mulai gratis" />
          <Item><h3>{p.name}</h3><p className="cp-plan__desc">{p.tagline}</p></Item>
          <Item className="cp-plan__proof">
            <span className="cp-plan__proof-ico" aria-hidden="true"><CalendarClock size={18} /></span>
            <span><strong>{monthsText(s.freeMonths)} pertama</strong><small>Tanpa kartu, tanpa biaya</small></span>
          </Item>
          <Price value={p.price} unit={p.unit} shown={shown} />
          <Item className="cp-plan__note">Lanjut {formatRupiah(s.yearlyPrice)} {perUnit(s.yearlyMonths)} setelahnya</Item>
          <Ctas tone="accent" closed={!s.freeOpen} primary={{ label: "Daftar gratis", href: "/daftar?program=member&paket=gratis" }} secondary={{ label: "Sudah punya akun? Masuk", href: "/login?next=%2Fdaftar" }} />
          <Features items={p.features.map((text, i) => ({ text, icon: [<BadgeCheck key="a" size={18} />, <FlaskConical key="b" size={18} />, <PenLine key="c" size={18} />][i] }))} />
          <Includes title="Juga termasuk:" items={p.includes} />
        </>
      )}
    </PlanCard>
  );
}

function ActivateCard() {
  const s = useS();
  const p = memberPlans(s).tahunan;
  return (
    <PlanCard className="cp-plan">
      {(shown) => (
        <>
          <Head kicker="Perpanjangan" icon={<RefreshCw size={14} aria-hidden="true" />} badge={`${s.yearlyMonths} bulan`} badgeInk />
          <Item><h3>{p.name}</h3><p className="cp-plan__desc">{p.tagline}</p></Item>
          <Item className="cp-plan__proof">
            <span className="cp-plan__proof-ico" aria-hidden="true"><History size={18} /></span>
            <span><strong>± {formatRupiah(Math.round(s.yearlyPrice / s.yearlyMonths / 100) * 100)}/bulan</strong><small>{s.yearlyMonths === 12 ? "Sekali bayar setahun" : `Sekali bayar untuk ${monthsText(s.yearlyMonths)}`}</small></span>
          </Item>
          <Price value={p.price} unit={p.unit} shown={shown} />
          <Item className="cp-plan__note">Saat masa aktif Anda habis</Item>
          <Ctas tone="ink" closed={!s.yearlyOpen} primary={{ label: "Aktivasi member", href: "/daftar?program=member&paket=tahunan" }} secondary={{ label: "Masuk untuk aktivasi", href: "/login?next=%2Fdaftar%3Fprogram%3Dmember%26paket%3Dtahunan" }} />
          <Features items={p.features.map((text, i) => ({ text, icon: [<BadgeCheck key="a" size={18} />, <FlaskConical key="b" size={18} />, <PenLine key="c" size={18} />][i] }))} />
          <Includes title="Juga termasuk:" items={p.includes} />
        </>
      )}
    </PlanCard>
  );
}

function ScopusCard() {
  const s = useS();
  const price = usePublicProgramPrices()["siap-tembus-scopus"].price;
  const p = PROGRAMS["siap-tembus-scopus"];
  const left = STS_MENTORS.reduce((n, m) => n + seatsLeft(m.id, 0), 0);
  return (
    <PlanCard className="cp-plan is-feature">
      {(shown) => (
        <>
          <Head kicker="Mentoring" icon={<Sparkles size={14} aria-hidden="true" />} badge="1-on-1" />
          <Item><h3>{p.short}</h3><p className="cp-plan__desc">{p.tagline}</p></Item>
          <Item className="cp-plan__proof">
            <span className="cp-plan__faces" aria-hidden="true">
              {STS_MENTORS.slice(0, 3).map((m) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={m.id} src={m.photo} alt="" />
              ))}
            </span>
            <span><strong>{STS_MENTORS.length} mentor</strong><small>{left} kursi bulan ini</small></span>
          </Item>
          <Price value={price} unit="sekali bayar" shown={shown} />
          <MemberBonus />
          <Ctas tone="accent" primary={{ label: "Pilih mentor", href: "/daftar?program=siap-tembus-scopus" }} secondary={{ label: "Lihat detail", href: p.href }} />
          <Features items={p.includes.slice(0, 3).map((x, i) => ({ text: x.title, icon: [<Video key="a" size={18} />, <FileSearch key="b" size={18} />, <Users key="c" size={18} />][i] }))} />
          <Includes title="Juga termasuk:" items={[...(s.programBonusMonths ? [`Member ${monthsText(s.programBonusMonths)} tanpa biaya`] : []), "Catatan revisi tiap putaran"]} />
        </>
      )}
    </PlanCard>
  );
}

function BootcampCard() {
  const s = useS();
  const price = usePublicProgramPrices()["bootcamp-menulis"].price;
  const p = PROGRAMS["bootcamp-menulis"];
  const next = BOOTCAMP_BATCHES.find((b) => batchSeatsLeft(b) > 0) ?? BOOTCAMP_BATCHES[0];
  const left = batchSeatsLeft(next);
  return (
    <PlanCard className="cp-plan">
      {(shown) => (
        <>
          <Head kicker="Satu angkatan" icon={<Users size={14} aria-hidden="true" />} badge={left <= 12 ? `Sisa ${left} kursi` : "Dibuka"} badgeInk />
          <Item><h3>{p.short}</h3><p className="cp-plan__desc">{p.tagline}</p></Item>
          <Item className="cp-plan__proof is-batch">
            <span className="cp-plan__batch-top">
              <CalendarDays size={15} aria-hidden="true" />
              <strong>{next.name}</strong>
              <small>mulai {formatDate(next.start, false)}</small>
              <em>{next.booked}/{next.seats}</em>
            </span>
            <span className="cp-plan__seats" aria-label={`${next.booked} dari ${next.seats} kursi terisi`}>
              <i style={{ transform: `scaleX(${shown ? Math.min(1, next.booked / next.seats) : 0})` }} />
            </span>
          </Item>
          <Price value={price} unit="per angkatan" shown={shown} />
          <MemberBonus />
          <Ctas tone="ink" primary={{ label: `Ikut ${next.name}`, href: `/daftar?program=bootcamp-menulis&angkatan=${next.id}` }} secondary={{ label: "Lihat detail", href: p.href }} />
          <Features items={p.includes.slice(0, 3).map((x, i) => ({ text: x.title, icon: [<Presentation key="a" size={18} />, <Wrench key="b" size={18} />, <LineChart key="c" size={18} />][i] }))} />
          <Includes title="Juga termasuk:" items={[...(s.programBonusMonths ? [`Member ${monthsText(s.programBonusMonths)} tanpa biaya`] : []), ...p.includes.slice(3).map((x) => x.title)]} />
        </>
      )}
    </PlanCard>
  );
}

/* ---------- Section ---------- */

export function RegistrationPlans() {
  const reduce = useReducedMotion();
  const s = usePublicSettings();
  const free = s.freeMonths;
  const bonus = s.programBonusMonths ? ` Peserta program otomatis menjadi member ${monthsText(s.programBonusMonths)} tanpa biaya aktivasi.` : "";
  return (
    <Settings.Provider value={s}>
    <section className="cp-plans" aria-labelledby="cp-plans-title">
      <div className="cp-ab-wrap">
        <motion.div className="cp-plans__bar" initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }}>
          <h2 id="cp-plans-title">Mulai dari mana saja</h2>
          <p>Daftar sebagai member gratis, perpanjang keanggotaan, atau langsung ikut program.{bonus}</p>
        </motion.div>

        <motion.div className="cp-plans__grid" variants={gridV} initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          <RegisterCard />
          <ActivateCard />
          <ScopusCard />
          <BootcampCard />
        </motion.div>

        <motion.aside
          className="cp-plans-info"
          aria-label="Masa aktif member"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
          <div className="cp-plans-info__timeline" aria-hidden="true">
            <span className="is-free"><b>{free === 1 ? "Bulan 1" : `Bulan 1–${free}`}</b>Gratis</span>
            <i />
            <span><b>Bulan {free + 1}–{free + s.yearlyMonths}</b>{formatRupiah(s.yearlyPrice)}</span>
          </div>
          <div className="cp-plans-info__copy">
            <h3>Masa aktif member</h3>
            <p>
              Setiap akun baru kami verifikasi sebelum aktif. {free === 1 ? "Bulan pertama" : `${monthsText(free)} pertama`} gratis; saat masa aktif habis, aktifkan lagi {formatRupiah(s.yearlyPrice)} untuk {s.yearlyMonths === 12 ? "satu tahun penuh" : monthsText(s.yearlyMonths)}.
              {s.programBonusMonths ? ` Ikut Siap Tembus Scopus atau Bootcamp? Keanggotaan ${monthsText(s.programBonusMonths)} sudah termasuk.` : ""}
            </p>
          </div>
          <Link href="/daftar?program=member&paket=tahunan" className="cp-plan__btn is-ink cp-plans-info__cta">
            Aktivasi member <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </motion.aside>
      </div>
    </section>
    </Settings.Provider>
  );
}
