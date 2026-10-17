"use client";

import { Gift, RefreshCw, UserRoundPlus } from "lucide-react";
import { monthsText, usePublicSettings } from "@/lib/cms/registration-settings";
import { formatRupiah, type MemberPlanKey } from "@/lib/data/programs";

// Bits of /daftar that follow Pengaturan pendaftaran (the page itself is a server component).

/** The three facts under the /daftar hero. */
export function PlanFacts() {
  const s = usePublicSettings();
  const facts = [
    { icon: <UserRoundPlus size={16} aria-hidden="true" />, title: "Registrasi member gratis", text: s.freeMonths === 1 ? "Untuk bulan pertama" : `Untuk ${monthsText(s.freeMonths)} pertama` },
    ...(s.programBonusMonths ? [{ icon: <Gift size={16} aria-hidden="true" />, title: `Bonus member ${monthsText(s.programBonusMonths)}`, text: "Untuk setiap peserta program" }] : []),
    { icon: <RefreshCw size={16} aria-hidden="true" />, title: `Aktivasi ${formatRupiah(s.yearlyPrice)}`, text: s.yearlyMonths === 12 ? "Satu tahun penuh" : monthsText(s.yearlyMonths) },
  ];
  return (
    <ul className="cp-plans-facts">
      {facts.map((f) => (
        <li key={f.title}>
          <span className="cp-plans-facts__ico">{f.icon}</span>
          <span>
            <strong>{f.title}</strong>
            <small>{f.text}</small>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** The lead under the registration form title. */
export function RegLead({ member, plan }: { member: boolean; plan: MemberPlanKey }) {
  const s = usePublicSettings();
  if (!member) return <p>{s.programBonusMonths ? `Dua langkah singkat. Keanggotaan CoPublika ${monthsText(s.programBonusMonths)} ikut aktif tanpa biaya.` : "Dua langkah singkat untuk mengamankan kursi Anda."}</p>;
  if (plan === "tahunan") return <p>{`Aktifkan keanggotaan ${monthsText(s.yearlyMonths)} seharga ${formatRupiah(s.yearlyPrice)}, untuk member yang masa aktifnya sudah habis.`}</p>;
  return <p>{s.freeMonths === 1 ? "Gratis untuk bulan pertama." : `Gratis untuk ${monthsText(s.freeMonths)} pertama.`} Isi data Anda, akun member CoPublika dibuat sekaligus.</p>;
}
