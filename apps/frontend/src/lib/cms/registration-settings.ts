// Pengaturan pendaftaran (staging): prices, periods, review target, transfer accounts, message
// templates and member-card rules. Stored as the CMS section "settings.registration" so the
// backend can take the same shape later. Public pages read it straight from localStorage.

"use client";

import { useEffect, useState } from "react";
import { MEMBER_PLANS, PROGRAMS, type MemberPlan, type MemberPlanKey, type ProgramKey } from "@/lib/data/programs";

export const SETTINGS_KEY = "settings.registration";
const STORAGE_KEY = "copublika-cms-v1";

export type BankAccount = { id: string; bank: string; number: string; holder: string; primary: boolean };
export type TemplateKey = "activation" | "rejection" | "payReminder" | "expiryReminder" | "invite";

export type RegistrationSettings = {
  // Harga & masa aktif
  yearlyPrice: number;
  yearlyMonths: number;
  freeMonths: number;
  programBonusMonths: number;
  expiringDays: number;
  freeOpen: boolean;
  yearlyOpen: boolean;
  // Tinjauan
  reviewHours: number;
  // Pembayaran
  accounts: BankAccount[];
  payDeadlineHours: number;
  payNote: string;
  confirmWhatsapp: string;
  // Pesan
  templates: Record<TemplateKey, string>;
  // Kartu member
  cardMinMonths: number;
  helpEmail: string;
  helpPhone: string;
};

export const DEFAULT_SETTINGS: RegistrationSettings = {
  yearlyPrice: 75_000,
  yearlyMonths: 12,
  freeMonths: 1,
  programBonusMonths: 12,
  expiringDays: 14,
  freeOpen: true,
  yearlyOpen: true,
  reviewHours: 24,
  accounts: [{ id: "acc-1", bank: "BCA", number: "", holder: "CoPublika", primary: true }],
  payDeadlineHours: 48,
  payNote: "Cantumkan ID pendaftaran di berita transfer, lalu kirim bukti transfer ke WhatsApp konfirmasi.",
  confirmWhatsapp: "0851-1145-4440",
  templates: {
    activation:
      "Halo {nama},\n\nPendaftaran member CoPublika Anda ({kode}) sudah disetujui. Aktifkan akun lewat link berikut:\n{link}\n\nMasa aktif {masa_aktif} dimulai saat akun diaktifkan.\n\nSalam,\nTim Admin CoPublika",
    rejection:
      "Halo {nama},\n\nTerima kasih sudah mendaftar di CoPublika. Pendaftaran {kode} belum dapat kami setujui karena: {alasan}.\n\nAnda dapat mendaftar kembali setelah data diperbaiki.\n\nSalam,\nTim Admin CoPublika",
    payReminder:
      "Halo {nama}, pendaftaran {kode} ({jenis}) menunggu pembayaran {nominal}. Silakan transfer ke {rekening} dan kirim bukti ke nomor ini. — Tim Admin CoPublika",
    expiryReminder:
      "Halo {nama}, keanggotaan CoPublika Anda berakhir {berlaku}. Perpanjang {harga} untuk {masa_aktif} di copublika.id/daftar. — Tim Admin CoPublika",
    invite:
      "Halo {nama}, terima kasih sudah mengikuti {kegiatan} bersama CoPublika. Gabung jadi member gratis {masa_gratis} pertama untuk akses proyek riset, harga khusus event, dan info program lebih dulu: {link} — Tim Admin CoPublika",
  },
  cardMinMonths: 12,
  helpEmail: "copublika@gmail.com",
  helpPhone: "0851-1145-4440",
};

/** Placeholders each template understands, with sample values for the preview. */
export const TEMPLATE_VARS: Record<TemplateKey, { key: string; label: string; sample: string }[]> = {
  activation: [
    { key: "nama", label: "Nama depan", sample: "Rina" },
    { key: "kode", label: "ID pendaftaran", sample: "CP-MBR-37X" },
    { key: "link", label: "Link aktivasi", sample: "https://copublika.id/aktivasi/7f3a…" },
    { key: "masa_aktif", label: "Masa aktif", sample: "1 bulan" },
  ],
  rejection: [
    { key: "nama", label: "Nama depan", sample: "Hendra" },
    { key: "kode", label: "ID pendaftaran", sample: "CP-MBR-39E" },
    { key: "alasan", label: "Alasan", sample: "data identitas tidak valid" },
  ],
  payReminder: [
    { key: "nama", label: "Nama depan", sample: "Fitri" },
    { key: "kode", label: "ID pendaftaran", sample: "CP-STS-3DT" },
    { key: "jenis", label: "Jenis", sample: "Siap Tembus Scopus" },
    { key: "nominal", label: "Nominal", sample: "Rp. 600.000" },
    { key: "rekening", label: "Rekening utama", sample: "BCA 1234567890 a.n. CoPublika" },
  ],
  invite: [
    { key: "nama", label: "Nama depan", sample: "Rina" },
    { key: "kegiatan", label: "Kegiatan terakhir", sample: "Workshop Academic Writing" },
    { key: "masa_gratis", label: "Masa gratis", sample: "1 bulan" },
    { key: "link", label: "Link daftar", sample: "copublika.id/daftar" },
  ],
  expiryReminder: [
    { key: "nama", label: "Nama depan", sample: "Nurul" },
    { key: "berlaku", label: "Tanggal berakhir", sample: "24 Okt 2026" },
    { key: "harga", label: "Harga aktivasi", sample: "Rp. 75.000" },
    { key: "masa_aktif", label: "Masa aktivasi", sample: "12 bulan" },
  ],
};

/** "{nama}" → value; unknown placeholders stay as they are. */
export const fillTemplate = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? vars[k] : m));

const num = (v: unknown, fallback: number, min: number, max: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
};
const str = (v: unknown, fallback: string) => (typeof v === "string" ? v : fallback);

/** Stored values on top of the defaults, clamped to sane ranges. */
export function normalizeSettings(raw: unknown): RegistrationSettings {
  const r = (raw && typeof raw === "object" ? raw : {}) as Partial<Record<keyof RegistrationSettings, unknown>>;
  const d = DEFAULT_SETTINGS;
  const t = (r.templates && typeof r.templates === "object" ? r.templates : {}) as Partial<Record<TemplateKey, unknown>>;
  const accounts = Array.isArray(r.accounts)
    ? (r.accounts as Partial<BankAccount>[]).map((a, i) => ({ id: str(a.id, `acc-${i + 1}`), bank: str(a.bank, ""), number: str(a.number, ""), holder: str(a.holder, ""), primary: !!a.primary }))
    : d.accounts;
  if (accounts.length && !accounts.some((a) => a.primary)) accounts[0].primary = true;
  return {
    yearlyPrice: num(r.yearlyPrice, d.yearlyPrice, 0, 10_000_000),
    yearlyMonths: num(r.yearlyMonths, d.yearlyMonths, 1, 60),
    freeMonths: num(r.freeMonths, d.freeMonths, 1, 12),
    programBonusMonths: num(r.programBonusMonths, d.programBonusMonths, 0, 60),
    expiringDays: num(r.expiringDays, d.expiringDays, 1, 60),
    freeOpen: typeof r.freeOpen === "boolean" ? r.freeOpen : d.freeOpen,
    yearlyOpen: typeof r.yearlyOpen === "boolean" ? r.yearlyOpen : d.yearlyOpen,
    reviewHours: num(r.reviewHours, d.reviewHours, 1, 168),
    accounts,
    payDeadlineHours: num(r.payDeadlineHours, d.payDeadlineHours, 1, 336),
    payNote: str(r.payNote, d.payNote),
    confirmWhatsapp: str(r.confirmWhatsapp, d.confirmWhatsapp),
    templates: {
      activation: str(t.activation, d.templates.activation),
      rejection: str(t.rejection, d.templates.rejection),
      payReminder: str(t.payReminder, d.templates.payReminder),
      expiryReminder: str(t.expiryReminder, d.templates.expiryReminder),
      invite: str(t.invite, d.templates.invite),
    },
    cardMinMonths: num(r.cardMinMonths, d.cardMinMonths, 1, 60),
    helpEmail: str(r.helpEmail, d.helpEmail),
    helpPhone: str(r.helpPhone, d.helpPhone),
  };
}

/** Settings from the CMS sections (admin, inside CmsProvider). */
export const settingsFrom = (sections: Record<string, unknown>) => normalizeSettings(sections[SETTINGS_KEY]);

/** Settings straight from localStorage (public pages, which have no CmsProvider). */
export function readSettings(): RegistrationSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    return normalizeSettings(stored?.sections?.[SETTINGS_KEY]);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Public pages: defaults on the server and the first paint (so hydration matches), then the
 * staged settings once mounted.
 */
export function usePublicSettings() {
  const [s, setS] = useState<RegistrationSettings>(DEFAULT_SETTINGS);
  useEffect(() => {
    // Reading browser storage has to wait for the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setS(readSettings());
  }, []);
  return s;
}

export const primaryAccount = (s: RegistrationSettings) => s.accounts.find((a) => a.primary) ?? s.accounts[0];
export const accountText = (a: BankAccount | undefined) => (a && a.number ? `${a.bank} ${a.number} a.n. ${a.holder}` : "rekening CoPublika");
export const monthsText = (m: number) => (m % 12 === 0 && m >= 12 ? `${m / 12} tahun` : `${m} bulan`);

/** "per tahun" for 12 months, otherwise "per N bulan". */
export const perUnit = (m: number) => (m === 12 ? "per tahun" : `per ${monthsText(m)}`);

/** The two member plans with the configured prices and periods. */
export function memberPlans(s: RegistrationSettings): Record<MemberPlanKey, MemberPlan> {
  const g = MEMBER_PLANS.gratis;
  const t = MEMBER_PLANS.tahunan;
  const first = s.freeMonths === 1 ? "satu bulan pertama" : `${monthsText(s.freeMonths)} pertama`;
  return {
    gratis: {
      ...g,
      months: s.freeMonths,
      unit: s.freeMonths === 1 ? "bulan pertama" : `${s.freeMonths} bulan pertama`,
      tagline: `Buat akun member dan kenali komunitas peneliti CoPublika selama ${first}.`,
    },
    tahunan: {
      ...t,
      price: s.yearlyPrice,
      months: s.yearlyMonths,
      unit: perUnit(s.yearlyMonths),
      tagline: `Lanjutkan keanggotaan ${s.yearlyMonths === 12 ? "satu tahun penuh" : monthsText(s.yearlyMonths)} saat masa aktif ${first} Anda habis.`,
      features: [`Member aktif ${s.yearlyMonths} bulan`, ...t.features.slice(1)],
    },
  };
}

// ---------- Program prices ----------
// Set in Konfigurasi Website Publik → Siap Tembus Scopus ("Harga & kursi") and Bootcamp 30 Hari
// ("Harga & angkatan"); read here so every page shows the same price.

export type ProgramPrice = { price: number; unit: string };
export type ProgramPrices = Record<ProgramKey, ProgramPrice>;
export const OFFER_KEYS: Record<ProgramKey, string> = { "siap-tembus-scopus": "program.sts.offer", "bootcamp-menulis": "program.btm.offer" };
export const OFFER_EDITORS: Record<ProgramKey, string> = { "siap-tembus-scopus": "/admin/website/siap-tembus-scopus", "bootcamp-menulis": "/admin/website/bootcamp-menulis" };

/** Program prices from CMS sections, falling back to the built-in ones. */
export function programPrices(sections: Record<string, unknown> | undefined): ProgramPrices {
  const one = (k: ProgramKey): ProgramPrice => {
    const o = (sections?.[OFFER_KEYS[k]] ?? {}) as { price?: unknown; unit?: unknown };
    const price = Number(o.price);
    return { price: Number.isFinite(price) && price >= 0 ? Math.round(price) : PROGRAMS[k].price, unit: typeof o.unit === "string" && o.unit.trim() ? o.unit : PROGRAMS[k].unit };
  };
  return { "siap-tembus-scopus": one("siap-tembus-scopus"), "bootcamp-menulis": one("bootcamp-menulis") };
}

const DEFAULT_PRICES = programPrices(undefined);

/** Public pages: built-in prices on the server and first paint, then the staged ones. */
export function usePublicProgramPrices() {
  const [p, setP] = useState<ProgramPrices>(DEFAULT_PRICES);
  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
      // Reading browser storage has to wait for the client.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setP(programPrices(stored?.sections));
    } catch {
      /* keep the built-in prices */
    }
  }, []);
  return p;
}
