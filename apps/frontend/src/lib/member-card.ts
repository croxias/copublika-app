// Digital member card (front and back), drawn on a canvas in the browser so the preview and the
// downloaded PNG are the same image. Size follows the CR80 card (85.6 × 54 mm).
//
// Who gets one: an active member whose active period is at least 12 months (yearly activation,
// a program bonus, an extension, or a manual membership of 12 months or more).

import { MARK_DOT, MARK_PATH, MARK_RING_PATH, MARK_VIEWBOX } from "@/components/brand/CopublikaMark";
import type { CmsItem } from "@/lib/cms/types";
import { memberState } from "@/lib/cms/members";
import { fraunces } from "@/lib/fonts";

export const CARD_MIN_MONTHS = 12;
export const CARD_W = 1012;
export const CARD_H = 638;
const R = 34;
const ORANGE = "#E9711C";
const HELP = { email: "copublika@gmail.com", phone: "0851-1145-4440" };
const RULES = [
  ["Kartu ini adalah identitas resmi anggota ", "komunitas CoPublika", "."],
  ["Kartu bersifat pribadi dan tidak dapat dipindahtangankan.", "", ""],
  ["Tunjukkan kartu ini saat mengikuti kegiatan dan program CoPublika.", "", ""],
  ["Apabila menemukan kartu ini, mohon hubungi pengurus komunitas CoPublika.", "", ""],
];

export type CardData = { name: string; number: string; since: string; validThru: string };
export type CardSide = "front" | "back";

/** Months covered by the active period (activatedAt → expiresAt). */
export function periodMonths(m: CmsItem) {
  if (!m.activatedAt || !m.expiresAt) return 0;
  const a = new Date(String(m.activatedAt));
  const b = new Date(String(m.expiresAt));
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) - (b.getDate() < a.getDate() ? 1 : 0);
}

/** Whether a member may hold the card today, and why not. */
export function cardEligibility(m: CmsItem, now: number): { ok: boolean; reason: string } {
  const s = memberState(m, now);
  if (s.state === "inactive") return { ok: false, reason: "Member nonaktif." };
  if (s.state === "pending") return { ok: false, reason: "Member belum diaktifkan." };
  if (s.state === "scheduled") return { ok: false, reason: "Masa aktif belum dimulai." };
  if (s.state === "expired") return { ok: false, reason: "Masa aktif sudah habis." };
  if (periodMonths(m) < CARD_MIN_MONTHS) return { ok: false, reason: `Masa aktif ${Math.max(0, periodMonths(m))} bulan; kartu untuk masa aktif minimal ${CARD_MIN_MONTHS} bulan.` };
  return { ok: true, reason: "" };
}

/** "CP-000001" from a stored card number. */
export const cardNumber = (n: unknown) => `CP-${String(Number(n) || 0).padStart(6, "0")}`;
/** Next free card number among the members. */
export const nextCardNo = (members: CmsItem[]) => Math.max(0, ...members.map((m) => Number(m.cardNo) || 0)) + 1;
const mmYyyy = (iso: unknown) => {
  const d = new Date(String(iso));
  return Number.isNaN(d.getTime()) ? "--/----" : `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};
export const cardData = (m: CmsItem): CardData => ({ name: String(m.name ?? "").trim(), number: cardNumber(m.cardNo), since: mmYyyy(m.activatedAt), validThru: mmYyyy(m.expiresAt) });

// ---------- fonts and images ----------

const cssVar = (name: string, fallback: string) => (typeof document === "undefined" ? fallback : getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
const fonts = () => ({
  sans: cssVar("--font-geist", "Helvetica Neue, Arial, sans-serif"),
  mono: cssVar("--font-geist-mono", "ui-monospace, Menlo, Consolas, monospace"),
  serif: `${fraunces.style.fontFamily}, Georgia, serif`,
});

const images = new Map<string, Promise<HTMLImageElement | null>>();
const loadImage = (src: string) => {
  if (!images.has(src)) {
    images.set(src, new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    }));
  }
  return images.get(src)!;
};

async function ready() {
  const f = fonts();
  if (typeof document !== "undefined" && document.fonts) {
    await Promise.all([`700 40px ${f.sans}`, `600 40px ${f.mono}`, `700 40px ${f.serif}`].map((spec) => document.fonts.load(spec).catch(() => undefined)));
  }
  const white = await loadImage("/logo-white.png");
  return { f, white };
}

// ---------- drawing helpers ----------

/** Small deterministic random numbers, so the brushed texture is the same on every render. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function rounded(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Fine horizontal streaks like brushed metal. */
function brush(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, light: boolean, seed: number, strength = 1) {
  const rand = rng(seed);
  for (let i = 0; i < h * 1.6; i++) {
    const yy = y + rand() * h;
    const a = (light ? 0.04 : 0.03) * strength * rand();
    ctx.fillStyle = light ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
    ctx.fillRect(x + rand() * w * 0.3, yy, w * (0.4 + rand() * 0.7), 1);
  }
}

const [, , VB_W, VB_H] = MARK_VIEWBOX.split(" ").map(Number);

/** The brand mark (ring, disc and dot) at (x, y) with height h. */
function mark(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, fill: string | CanvasGradient, dot: string | CanvasGradient, ringOnly = false) {
  const s = h / VB_H;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = fill;
  ctx.fill(new Path2D(ringOnly ? MARK_RING_PATH : MARK_PATH));
  if (!ringOnly) {
    ctx.fillStyle = dot;
    ctx.beginPath();
    ctx.arc(MARK_DOT.x, MARK_DOT.y, MARK_DOT.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Largest font size (down to min) that fits text in max px. */
function fit(ctx: CanvasRenderingContext2D, text: string, font: (px: number) => string, start: number, min: number, max: number) {
  let px = start;
  ctx.font = font(px);
  while (px > min && ctx.measureText(text).width > max) {
    px -= 2;
    ctx.font = font(px);
  }
  if (ctx.measureText(text).width <= max) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > max) t = t.slice(0, -1);
  return `${t.trimEnd()}…`;
}

/** Greedy word wrap at the current font; returns the lines. */
function wrapWords(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const lines: string[] = [];
  let line = "";
  for (const w of text.split(/\s+/)) {
    const next = line ? `${line} ${w}` : w;
    if (line && ctx.measureText(next).width > max) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Name on one line when it fits at a readable size; long names (many titles) wrap to two, then
 * three lines, shrinking only as much as needed. Returns the lines and the font size used.
 */
function nameLines(ctx: CanvasRenderingContext2D, text: string, font: (px: number) => string, max: number) {
  const tries: [number, number, number][] = [[1, 74, 54], [2, 54, 36], [3, 42, 30]];
  for (const [rows, from, to] of tries) {
    for (let px = from; px >= to; px -= 2) {
      ctx.font = font(px);
      const lines = wrapWords(ctx, text, max);
      if (lines.length <= rows && lines.every((l) => ctx.measureText(l).width <= max)) return { lines, px };
    }
  }
  return { lines: [fit(ctx, text, font, 30, 30, max)], px: 30 };
}

function spaced(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) {
  ctx.save();
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${spacing}px`;
  ctx.fillText(text, x, y);
  ctx.restore();
}

// ---------- Code 128 (set B) ----------

const C128 = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112",
];

/** Module widths (bar, space, bar, …) of a Code 128-B barcode for text. */
export function code128(text: string) {
  const values = [...text].map((ch) => Math.min(94, Math.max(0, ch.charCodeAt(0) - 32)));
  const check = (104 + values.reduce((sum, v, i) => sum + v * (i + 1), 0)) % 103;
  return [104, ...values, check, 106].flatMap((v) => [...C128[v]].map(Number));
}

function barcode(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, w: number, h: number) {
  const widths = code128(text);
  const total = widths.reduce((a, b) => a + b, 0);
  const unit = w / total;
  let cx = x;
  ctx.fillStyle = "#0a0a0a";
  widths.forEach((wd, i) => {
    if (i % 2 === 0) ctx.fillRect(cx, y, wd * unit, h);
    cx += wd * unit;
  });
}

// ---------- the two sides ----------

function front(ctx: CanvasRenderingContext2D, d: CardData, f: ReturnType<typeof fonts>, logo: HTMLImageElement | null) {
  const W = CARD_W;
  const H = CARD_H;
  rounded(ctx, 0, 0, W, H, R);
  ctx.save();
  ctx.clip();

  // Black brushed metal with a soft diagonal sheen.
  const base = ctx.createLinearGradient(0, 0, W, H);
  base.addColorStop(0, "#1b1b1c");
  base.addColorStop(0.45, "#0c0c0d");
  base.addColorStop(1, "#151516");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);
  brush(ctx, 0, 0, W, H, true, 7, 0.85);
  const sheen = ctx.createLinearGradient(W * 0.35, 0, W * 0.85, H);
  sheen.addColorStop(0, "rgba(255,255,255,0)");
  sheen.addColorStop(0.5, "rgba(255,255,255,0.06)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, W, H);

  // The mark in brushed silver, embossed: a dark drop below, a light edge above.
  const mh = 470;
  const mx = W - (VB_W * mh) / VB_H - 34;
  const my = (H - mh) / 2 - 6;
  const silver = ctx.createLinearGradient(mx, my, mx + 300, my + mh);
  silver.addColorStop(0, "#f7f7f5");
  silver.addColorStop(0.55, "#d9d9d6");
  silver.addColorStop(1, "#b9b9b5");
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.7)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 9;
  mark(ctx, mx, my, mh, silver, silver);
  ctx.restore();
  // Light top edge, then the silver face brushed inside the mark only.
  mark(ctx, mx, my - 1.5, mh, "rgba(255,255,255,0.55)", "rgba(255,255,255,0.55)");
  mark(ctx, mx, my, mh, silver, silver);
  ctx.save();
  const path = new Path2D();
  const m = new DOMMatrix().translate(mx, my).scale(mh / VB_H);
  path.addPath(new Path2D(MARK_PATH), m);
  const dotPath = new Path2D();
  dotPath.arc(MARK_DOT.x, MARK_DOT.y, MARK_DOT.r, 0, Math.PI * 2);
  path.addPath(dotPath, m);
  ctx.clip(path);
  brush(ctx, mx, my, 420, mh, false, 11, 0.7);
  ctx.restore();

  // Wordmark.
  if (logo) ctx.drawImage(logo, 62, 56, (logo.width / logo.height) * 60, 60);
  else {
    ctx.fillStyle = "#fff";
    ctx.font = `800 40px ${f.sans}`;
    ctx.fillText("CoPublika", 64, 98);
  }

  // Name, auto-sized to the space left of the mark.
  const left = 64;
  const textMax = mx - left - 40;
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "alphabetic";
  const serif = (px: number) => `700 ${px}px ${f.serif}`;
  const { lines, px } = nameLines(ctx, d.name || "Nama Anggota", serif, textMax);
  ctx.font = serif(px);
  lines.forEach((line, i) => ctx.fillText(line, left, 334 - (lines.length - 1 - i) * px * 1.08));

  // ID number.
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = `500 18px ${f.sans}`;
  spaced(ctx, "ID NUMBER", left, 388, 2.4);
  const idX = left + ctx.measureText("ID NUMBER").width + 9 * 2.4 + 22;
  ctx.fillStyle = "#ffffff";
  ctx.font = `600 34px ${f.mono}`;
  spaced(ctx, d.number, idX, 390, 3);

  // Divider, then dates and the badge.
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.fillRect(left, 432, textMax, 1.5);
  const label = (t: string, x: number) => {
    ctx.fillStyle = "rgba(255,255,255,0.58)";
    ctx.font = `600 15px ${f.sans}`;
    spaced(ctx, t, x, 486, 2.2);
  };
  const value = (t: string, x: number) => {
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 30px ${f.mono}`;
    spaced(ctx, t, x, 526, 1.5);
  };
  label("MEMBER SINCE", left);
  value(d.since, left);
  label("VALID THRU", left + 196);
  value(d.validThru, left + 196);

  const bx = left;
  const by = 560;
  ctx.font = `700 17px ${f.sans}`;
  const badgeText = "MEMBER CARD";
  const bw = ctx.measureText(badgeText).width + badgeText.length * 2.6 + 54;
  rounded(ctx, bx, by - 4, bw, 40, 9);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.fillStyle = "#0a0a0a";
  ctx.beginPath();
  ctx.arc(bx + 20, by + 16, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0a0a0a";
  spaced(ctx, badgeText, bx + 34, by + 22, 2.6);

  ctx.restore();
  // Hairline edge.
  rounded(ctx, 0.75, 0.75, W - 1.5, H - 1.5, R);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function back(ctx: CanvasRenderingContext2D, d: CardData, f: ReturnType<typeof fonts>) {
  const W = CARD_W;
  const H = CARD_H;
  rounded(ctx, 0, 0, W, H, R);
  ctx.save();
  ctx.clip();

  // Warm white with a faint brushed grain.
  ctx.fillStyle = "#f5f4f1";
  ctx.fillRect(0, 0, W, H);
  brush(ctx, 0, 0, W, H, false, 3, 0.4);

  // Watermark: the whole mark (ring, disc and dot), large and light, cropped at the bottom right.
  mark(ctx, W - 400, H - 330, 560, "rgba(10,10,10,0.065)", "rgba(10,10,10,0.065)");

  // Magnetic stripe.
  const sy = 50;
  const sh = 82;
  const stripe = ctx.createLinearGradient(0, sy, 0, sy + sh);
  stripe.addColorStop(0, "#1a1a1b");
  stripe.addColorStop(0.5, "#0b0b0c");
  stripe.addColorStop(1, "#18181a");
  ctx.fillStyle = stripe;
  ctx.fillRect(0, sy, W, sh);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, sy, W, sh);
  ctx.clip();
  brush(ctx, 0, sy, W, sh, true, 5);
  ctx.restore();

  // Signature panel with the name.
  const px = 64;
  const pw = W - 128;
  const py = 164;
  const ph = 50;
  rounded(ctx, px, py, pw, ph, 8);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.fillStyle = "rgba(10,10,10,0.035)";
  for (let yy = py + 6; yy < py + ph; yy += 6) ctx.fillRect(px, yy, pw, 1);
  ctx.restore();
  rounded(ctx, px, py, pw, ph, 8);
  ctx.strokeStyle = "#d7d3cc";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "#6b665e";
  ctx.font = `600 14px ${f.mono}`;
  const tag = "COPUBLIKA · MEMBER";
  ctx.textAlign = "right";
  spaced(ctx, tag, px + pw - 18, py + 31, 1.6);
  ctx.textAlign = "left";
  ctx.fillStyle = "#0a0a0a";
  const signName = fit(ctx, d.name || "Nama Anggota", (s) => `italic 700 ${s}px ${f.sans}`, 24, 16, pw - 260);
  ctx.fillText(signName, px + 18, py + 33);

  // Terms.
  ctx.fillStyle = "#0a0a0a";
  ctx.font = `800 19px ${f.sans}`;
  spaced(ctx, "KETENTUAN KEANGGOTAAN", px, 262, 0.6);
  RULES.forEach(([a, b, c], i) => {
    const y = 298 + i * 30;
    ctx.fillStyle = ORANGE;
    ctx.beginPath();
    ctx.arc(px + 5, y - 6, 3.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#24221f";
    ctx.font = `400 17.5px ${f.sans}`;
    ctx.fillText(a, px + 20, y);
    if (b) {
      const ax = px + 20 + ctx.measureText(a).width;
      ctx.font = `700 17.5px ${f.sans}`;
      ctx.fillText(b, ax, y);
      const bx = ax + ctx.measureText(b).width;
      ctx.font = `400 17.5px ${f.sans}`;
      ctx.fillText(c, bx, y);
    }
  });

  // Barcode, centred.
  const bw = 340;
  const bh = 116;
  const bx = (W - bw) / 2;
  const by = 424;
  rounded(ctx, bx, by, bw, bh, 10);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#d7d3cc";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  barcode(ctx, d.number, bx + 26, by + 16, bw - 52, 62);
  ctx.fillStyle = "#0a0a0a";
  ctx.font = `600 16px ${f.mono}`;
  ctx.textAlign = "center";
  spaced(ctx, d.number, W / 2, by + 102, 3);
  ctx.textAlign = "left";

  // Help desk.
  ctx.fillStyle = "#6b665e";
  ctx.font = `700 12.5px ${f.mono}`;
  spaced(ctx, "LAYANAN BANTUAN", px, 528, 1.8);
  ctx.strokeStyle = "#0a0a0a";
  ctx.lineWidth = 1.8;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  // envelope
  rounded(ctx, px, 545, 22, 16, 3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(px + 1, 547);
  ctx.lineTo(px + 11, 555);
  ctx.lineTo(px + 21, 547);
  ctx.stroke();
  // phone
  ctx.save();
  ctx.translate(px + 1, 574);
  ctx.scale(0.92, 0.92);
  ctx.stroke(new Path2D("M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"));
  ctx.restore();
  ctx.fillStyle = "#0a0a0a";
  ctx.font = `500 17px ${f.sans}`;
  ctx.fillText(HELP.email, px + 34, 559);
  ctx.fillText(HELP.phone, px + 34, 593);

  // The CoPublika icon, bottom right.
  const ih = 62;
  mark(ctx, W - 64 - (VB_W * ih) / VB_H, 540, ih, "#0a0a0a", "#0a0a0a");

  ctx.restore();
  rounded(ctx, 0.75, 0.75, W - 1.5, H - 1.5, R);
  ctx.strokeStyle = "#d9d5ce";
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

/** One side as a canvas at `scale` × the base size (2 → 2024 × 1276 px, about 600 dpi). */
export async function renderCard(d: CardData, side: CardSide, scale = 2) {
  const { f, white } = await ready();
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W * scale;
  canvas.height = CARD_H * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.scale(scale, scale);
  if (side === "front") front(ctx, d, f, white);
  else back(ctx, d, f);
  return canvas;
}

const save = (canvas: HTMLCanvasElement, file: string) =>
  new Promise<void>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
      }
      resolve();
    }, "image/png");
  });

const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "member";

/** Downloads one side, or both sides stacked on one sheet. */
export async function downloadCard(d: CardData, which: CardSide | "both") {
  const base = `kartu-member-${d.number.toLowerCase()}-${slug(d.name)}`;
  if (which !== "both") {
    await save(await renderCard(d, which, 2), `${base}-${which === "front" ? "depan" : "belakang"}.png`);
    return;
  }
  const scale = 2;
  const gap = 56;
  const pad = 56;
  const [a, b] = await Promise.all([renderCard(d, "front", scale), renderCard(d, "back", scale)]);
  const sheet = document.createElement("canvas");
  sheet.width = a.width + pad * 2 * scale;
  sheet.height = a.height * 2 + (gap + pad * 2) * scale;
  const ctx = sheet.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#ece9e3";
  ctx.fillRect(0, 0, sheet.width, sheet.height);
  ctx.drawImage(a, pad * scale, pad * scale);
  ctx.drawImage(b, pad * scale, (pad + gap) * scale + a.height);
  await save(sheet, `${base}.png`);
}
