// Registration receipt as a PNG, drawn in the browser so it needs no PDF library or server.

export type ReceiptRow = { label: string; value: string; strong?: boolean };
export type ReceiptData = { code: string; title: string; status: string; issued: string; rows: ReceiptRow[]; total: string; note: string };

const W = 1080;
const PAD = 72;
const INK = "#0a0a0a";
const MUTED = "#6b665e";
const ORANGE = "#E9711C";
const LINE = "#e7e1d7";
const FONT = "Helvetica Neue, Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Wraps `text` to `max` px wide; returns the lines. */
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > max && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

export async function downloadReceipt(d: ReceiptData) {
  const rowH = 64;
  const H = 520 + d.rows.length * rowH + 220;
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(scale, scale);

  // Page and card.
  ctx.fillStyle = "#fbf4ec";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = ORANGE;
  roundRect(ctx, 46, 46, W - 80, H - 80, 36);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  roundRect(ctx, 34, 34, W - 80, H - 80, 36);
  ctx.fill();
  ctx.stroke();

  // Header: logo and document name.
  const logo = await loadImage("/logo-black.png");
  if (logo) ctx.drawImage(logo, PAD, 78, 966 * (44 / 202), 44);
  ctx.textAlign = "right";
  ctx.fillStyle = ORANGE;
  ctx.font = `700 15px ${MONO}`;
  ctx.fillText("BUKTI PENDAFTARAN", W - PAD - 10, 96);
  ctx.fillStyle = MUTED;
  ctx.font = `500 15px ${FONT}`;
  ctx.fillText(d.issued, W - PAD - 10, 120);

  // Title and status.
  ctx.textAlign = "left";
  ctx.fillStyle = INK;
  ctx.font = `800 44px ${FONT}`;
  ctx.fillText(d.title, PAD, 214);
  ctx.font = `700 16px ${FONT}`;
  const sw = ctx.measureText(d.status).width + 32;
  ctx.fillStyle = "#fff3e6";
  roundRect(ctx, PAD, 238, sw, 36, 18);
  ctx.fill();
  ctx.fillStyle = "#b4520e";
  ctx.fillText(d.status, PAD + 16, 262);

  // Code strip.
  ctx.fillStyle = INK;
  roundRect(ctx, PAD, 300, W - PAD * 2 - 10, 84, 18);
  ctx.fill();
  ctx.fillStyle = "#ffb27a";
  ctx.font = `700 14px ${MONO}`;
  ctx.fillText("KODE PENDAFTARAN", PAD + 28, 334);
  ctx.fillStyle = "#fff";
  ctx.font = `800 28px ${MONO}`;
  ctx.fillText(d.code, PAD + 28, 368);

  // Rows.
  let y = 440;
  for (const r of d.rows) {
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(PAD, y - 38);
    ctx.lineTo(W - PAD - 10, y - 38);
    ctx.stroke();
    ctx.textAlign = "left";
    ctx.fillStyle = MUTED;
    ctx.font = `500 18px ${FONT}`;
    ctx.fillText(r.label, PAD, y);
    ctx.textAlign = "right";
    ctx.fillStyle = INK;
    ctx.font = `${r.strong ? 800 : 700} 18px ${FONT}`;
    const value = ctx.measureText(r.value).width > 560 ? `${r.value.slice(0, 52)}…` : r.value;
    ctx.fillText(value, W - PAD - 10, y);
    y += rowH;
  }

  // Total.
  ctx.fillStyle = "#fff8f1";
  roundRect(ctx, PAD, y - 34, W - PAD * 2 - 10, 76, 16);
  ctx.fill();
  ctx.textAlign = "left";
  ctx.fillStyle = INK;
  ctx.font = `700 20px ${FONT}`;
  ctx.fillText("Total", PAD + 24, y + 12);
  ctx.textAlign = "right";
  ctx.fillStyle = "#b4520e";
  ctx.font = `800 30px ${FONT}`;
  ctx.fillText(d.total, W - PAD - 34, y + 14);

  // Note and footer.
  y += 96;
  ctx.textAlign = "left";
  ctx.fillStyle = MUTED;
  ctx.font = `500 16px ${FONT}`;
  for (const line of wrap(ctx, d.note, W - PAD * 2 - 10)) {
    ctx.fillText(line, PAD, y);
    y += 26;
  }
  ctx.fillStyle = "#a39e95";
  ctx.font = `500 14px ${FONT}`;
  ctx.fillText("CoPublika · copublika@gmail.com · Dokumen ini dibuat otomatis dan sah tanpa tanda tangan.", PAD, H - 78);

  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = `bukti-pendaftaran-${d.code}.png`;
  a.click();
}
