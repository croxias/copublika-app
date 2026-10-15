// Programs sold on the public site: Siap Tembus Scopus 1-on-1 and Bootcamp 30 Hari Menulis.
// Static front-end data until the backend phase; seats and batches are sample values.

import { PEOPLE, type Person } from "@/lib/cms/seed/people";
import { personId } from "@/lib/cms/slug";

export type ProgramKey = "siap-tembus-scopus" | "bootcamp-menulis";

export type Program = {
  key: ProgramKey;
  name: string;
  short: string;
  href: string;
  price: number;
  /** What the price covers, shown under it. */
  unit: string;
  tagline: string;
  includes: { title: string; text: string }[];
};

export const PROGRAMS: Record<ProgramKey, Program> = {
  "siap-tembus-scopus": {
    key: "siap-tembus-scopus",
    name: "Siap Tembus Scopus 1-on-1",
    short: "Siap Tembus Scopus",
    href: "/siap-tembus-scopus",
    price: 600_000,
    unit: "per peserta · sekali bayar",
    tagline: "Pendampingan pribadi bersama satu mentor sampai naskah siap dikirim ke jurnal Scopus.",
    includes: [
      { title: "1 sesi 1-on-1 online", text: "90 menit tatap muka virtual dengan mentor pilihan Anda untuk membedah naskah dan strategi jurnal." },
      { title: "4 kali review artikel", text: "Mentor mengulas naskah Anda empat putaran, lengkap dengan catatan revisi tertulis di tiap putaran." },
      { title: "Maks. 4 peserta per mentor", text: "Satu mentor hanya menerima empat peserta setiap bulan supaya setiap naskah mendapat perhatian penuh." },
    ],
  },
  "bootcamp-menulis": {
    key: "bootcamp-menulis",
    name: "Bootcamp 30 Hari Menulis",
    short: "Bootcamp 30 Hari Menulis",
    href: "/bootcamp-menulis",
    price: 450_000,
    unit: "per peserta · satu angkatan",
    tagline: "Tiga puluh hari menulis bersama satu angkatan, dengan webinar mingguan, tools, dan pelacak progres.",
    includes: [
      { title: "Webinar mingguan", text: "Satu sesi webinar setiap minggu bersama mentor, membahas tahap penulisan yang sedang Anda kerjakan." },
      { title: "Tools pendukung penulisan", text: "Template naskah, kerangka IMRaD, dan checklist jurnal yang bisa langsung dipakai." },
      { title: "Pelacak progres menulis", text: "Catat target dan jumlah kata harian, lihat konsistensi Anda selama 30 hari." },
      { title: "Review gratis oleh mentor", text: "Naskah Anda diulas mentor di akhir bootcamp, tanpa biaya tambahan." },
    ],
  },
};

export const formatRupiah = (n: number) => `Rp. ${n.toLocaleString("id-ID")}`;

/* ---------------------------------------------------------------------------
   Siap Tembus Scopus: mentors and monthly seats
   --------------------------------------------------------------------------- */

export const SEATS_PER_MENTOR = 4;

export type Mentor = Person & { id: string };

/** The six mentors who take 1-on-1 participants (same people as About → Mentors). */
export const STS_MENTORS: Mentor[] = PEOPLE.slice(0, 6).map((p) => ({ ...p, id: personId(p.name) }));

/** Sample bookings per mentor: [this month, next month]. */
export const BOOKED: Record<string, [number, number]> = {
  [personId("Dr. Ade Putranto")]: [4, 2],
  [personId("Dr. Maya Rahmawati")]: [3, 1],
  [personId("Dr. Bayu Setiawan")]: [2, 0],
  [personId("Dr. Lina Kartika")]: [4, 3],
  [personId("Fajar Ramadhan, Ph.D.")]: [1, 0],
  [personId("Dr. Dewi Nirmala")]: [3, 1],
};

const MONTHS_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export type SeatMonth = { key: string; label: string };

/** This month and next, as "2026-10" keys with Indonesian labels. */
export function seatMonths(now = new Date()): SeatMonth[] {
  return [0, 1].map((offset) => {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: `${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}` };
  });
}

export function seatsLeft(mentorId: string, monthIndex: number) {
  const booked = BOOKED[mentorId]?.[monthIndex] ?? 0;
  return Math.max(0, SEATS_PER_MENTOR - booked);
}

export const monthLabel = (key: string) => {
  const [y, m] = key.split("-").map(Number);
  return m ? `${MONTHS_ID[m - 1]} ${y}` : key;
};

/* ---------------------------------------------------------------------------
   Bootcamp 30 Hari Menulis: batches
   --------------------------------------------------------------------------- */

export type BootcampBatch = {
  id: string;
  name: string;
  /** ISO dates. */
  start: string;
  end: string;
  closes: string;
  /** Weekly webinar day and time. */
  webinar: string;
};

export const BOOTCAMP_BATCHES: BootcampBatch[] = [
  { id: "bm-01", name: "Angkatan 1", start: "2026-11-02", end: "2026-12-01", closes: "2026-10-29", webinar: "Setiap Sabtu, 09.00–11.00 WIB" },
  { id: "bm-02", name: "Angkatan 2", start: "2026-12-07", end: "2027-01-05", closes: "2026-12-03", webinar: "Setiap Sabtu, 09.00–11.00 WIB" },
];

export const formatDate = (iso: string, withYear = true) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS_ID[m - 1].slice(0, 3)}${withYear ? ` ${y}` : ""}`;
};

/** The four Saturday webinars of a batch: the first Saturday on or after the start, then weekly. */
export function webinarDates(batch: BootcampBatch): string[] {
  const [y, m, d] = batch.start.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, d));
  first.setUTCDate(first.getUTCDate() + ((6 - first.getUTCDay() + 7) % 7));
  return [0, 1, 2, 3].map((w) => {
    const x = new Date(first);
    x.setUTCDate(first.getUTCDate() + w * 7);
    return x.toISOString().slice(0, 10);
  });
}

