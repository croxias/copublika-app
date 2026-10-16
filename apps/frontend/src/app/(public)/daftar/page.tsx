import Link from "next/link";
import { ArrowLeft, Gift, RefreshCw, UserRoundPlus } from "lucide-react";
import { RegisterForm, type RegKey } from "@/components/program/RegisterForm";
import { RegistrationPlans } from "@/components/program/RegistrationPlans";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { CopublikaMark } from "@/components/brand/CopublikaMark";
import { MEMBER_PLANS, PROGRAMS, PROGRAM_MEMBER_MONTHS, formatRupiah, memberPlanKey, type ProgramKey } from "@/lib/data/programs";

export const metadata = {
  title: "Pendaftaran — CoPublika",
  description: `Gabung member CoPublika gratis satu bulan, aktivasi ${formatRupiah(MEMBER_PLANS.tahunan.price)} per tahun, atau ikut Siap Tembus Scopus 1-on-1 dan Bootcamp 30 Hari Menulis dengan bonus member satu tahun.`,
};

type Search = { program?: string; paket?: string; mentor?: string; bulan?: string; angkatan?: string };

const FACTS = [
  { icon: <UserRoundPlus size={16} aria-hidden="true" />, title: "Registrasi member gratis", text: "Untuk bulan pertama" },
  { icon: <Gift size={16} aria-hidden="true" />, title: `Bonus member ${PROGRAM_MEMBER_MONTHS / 12} tahun`, text: "Untuk setiap peserta program" },
  { icon: <RefreshCw size={16} aria-hidden="true" />, title: `Aktivasi ${formatRupiah(MEMBER_PLANS.tahunan.price)}`, text: "Satu tahun penuh" },
];

export default async function DaftarPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const key: RegKey | null = sp.program === "member" ? "member" : sp.program && sp.program in PROGRAMS ? (sp.program as ProgramKey) : null;

  if (key) {
    const plan = MEMBER_PLANS[memberPlanKey(sp.paket)];
    const isMember = key === "member";
    return (
      <main className="cp-pg cp-reg-page">
        <section className="cp-reg-head">
          <div className="cp-ab-hero__bg" aria-hidden="true" />
          <div className="cp-ab-wrap">
            <Link href={isMember ? "/daftar" : PROGRAMS[key].href} className="cp-back">
              <span className="cp-back__icon" aria-hidden="true"><ArrowLeft size={16} /></span>
              {isMember ? "Kembali ke pendaftaran" : `Kembali ke ${PROGRAMS[key].name}`}
            </Link>
            <h1>{isMember ? (plan.price ? <>Aktivasi <span>member</span></> : <>Registrasi <span>member</span></>) : <>Daftar <span>{PROGRAMS[key].name}</span></>}</h1>
            <p>
              {isMember
                ? plan.price
                  ? `Aktifkan keanggotaan satu tahun seharga ${formatRupiah(plan.price)}, untuk member yang masa aktifnya sudah habis.`
                  : "Gratis untuk bulan pertama. Isi data Anda, akun member CoPublika dibuat sekaligus."
                : `Dua langkah singkat. Keanggotaan CoPublika ${PROGRAM_MEMBER_MONTHS / 12} tahun ikut aktif tanpa biaya.`}
            </p>
          </div>
        </section>
        <section className="cp-reg-body">
          <div className="cp-ab-wrap">
            <RegisterForm program={key} plan={plan.key} mentor={sp.mentor} month={sp.bulan} batch={sp.angkatan} />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="cp-pg cp-reg-page">
      <section className="cp-reg-head cp-plans-hero">
        <div className="cp-ab-hero__bg" aria-hidden="true" />
        <CopublikaMark className="cp-plans-hero__mark" />
        <div className="cp-ab-wrap">
          <span className="cp-plans-hero__tag">Pendaftaran</span>
          <h1 className="cp-plans-hero__title">
            <VerticalCutReveal splitBy="words" staggerDuration={0.12} reverse transition={{ type: "spring", stiffness: 250, damping: 40 }}>
              Pilih cara Anda bergabung.
            </VerticalCutReveal>
          </h1>
          <p>Mulai sebagai member gratis, atau langsung ikut pendampingan menulis. Semua jalur membawa Anda ke komunitas peneliti CoPublika.</p>
          <ul className="cp-plans-facts">
            {FACTS.map((f) => (
              <li key={f.title}>
                <span className="cp-plans-facts__ico">{f.icon}</span>
                <span>
                  <strong>{f.title}</strong>
                  <small>{f.text}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <RegistrationPlans />
    </main>
  );
}
