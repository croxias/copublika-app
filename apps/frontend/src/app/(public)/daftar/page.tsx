import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { RegisterForm } from "@/components/program/RegisterForm";
import { PROGRAMS, formatRupiah, type ProgramKey } from "@/lib/data/programs";

export const metadata = {
  title: "Daftar program — CoPublika",
  description: "Daftar Siap Tembus Scopus 1-on-1 atau Bootcamp 30 Hari Menulis. Akun member CoPublika dibuat otomatis.",
};

type Search = { program?: string; mentor?: string; bulan?: string; angkatan?: string };

export default async function DaftarPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const key = sp.program && sp.program in PROGRAMS ? (sp.program as ProgramKey) : null;

  return (
    <main className="cp-pg cp-reg-page">
      <section className="cp-reg-head">
        <div className="cp-ab-hero__bg" aria-hidden="true" />
        <div className="cp-ab-wrap">
          {key ? (
            <Link href={PROGRAMS[key].href} className="cp-back">
              <span className="cp-back__icon" aria-hidden="true"><ArrowLeft size={16} /></span>
              Kembali ke {PROGRAMS[key].name}
            </Link>
          ) : (
            <Link href="/" className="cp-back">
              <span className="cp-back__icon" aria-hidden="true"><ArrowLeft size={16} /></span>
              Kembali ke beranda
            </Link>
          )}
          <h1>{key ? <>Daftar <span>{PROGRAMS[key].name}</span></> : <>Pilih <span>program</span></>}</h1>
          <p>{key ? "Dua langkah singkat. Akun member CoPublika Anda dibuat sekaligus." : "CoPublika punya dua program. Pilih yang paling sesuai dengan kebutuhan naskah Anda."}</p>
        </div>
      </section>

      <section className="cp-reg-body">
        <div className="cp-ab-wrap">
          {key ? (
            <RegisterForm program={key} mentor={sp.mentor} month={sp.bulan} batch={sp.angkatan} />
          ) : (
            <div className="cp-reg-pick">
              {Object.values(PROGRAMS).map((p) => (
                <Link key={p.key} href={`/daftar?program=${p.key}`} className="cp-reg-pick__card">
                  <span className="cp-reg-pick__name">{p.name}</span>
                  <p>{p.tagline}</p>
                  <strong>{formatRupiah(p.price)}</strong>
                  <span className="cp-reg-pick__go">Pilih program <ArrowRight size={15} aria-hidden="true" /></span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
