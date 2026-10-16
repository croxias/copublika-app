import { FileSearch, PenTool, Users, Video, type LucideIcon } from "lucide-react";
import type { Event } from "@/types";

/** Event categories as the public pages show them: label, colour and icon. */
export const CATEGORIES: { id: string; label: string; color: string; Icon: LucideIcon }[] = [
  { id: "webinar", label: "Webinar", color: "#1f1d1a", Icon: Video },
  { id: "workshop", label: "Workshop", color: "#e9711c", Icon: PenTool },
  { id: "clinic", label: "Klinik", color: "#b45309", Icon: FileSearch },
  { id: "forum", label: "Forum", color: "#15803d", Icon: Users },
];

export const categoryOf = (e: Pick<Event, "category" | "type">) =>
  CATEGORIES.find((c) => c.id === (e.category || e.type)) ?? CATEGORIES[0];

const TZ = "Asia/Jakarta";
const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("id-ID", { timeZone: TZ, ...opts });
const DAY = fmt({ day: "numeric" });
const MONTH = fmt({ month: "long" });
const MONTH_SHORT = fmt({ month: "short" });
const WEEKDAY = fmt({ weekday: "long" });
const WEEKDAY_SHORT = fmt({ weekday: "short" });
const YEAR = fmt({ year: "numeric" });
const TIME = fmt({ hour: "2-digit", minute: "2-digit", hour12: false });

/** Date parts in WIB, whatever the visitor's own time zone is. */
export function when(iso: string) {
  const d = new Date(iso);
  return {
    day: DAY.format(d),
    month: MONTH.format(d),
    monthShort: MONTH_SHORT.format(d).replace(".", ""),
    weekday: WEEKDAY.format(d),
    weekdayShort: WEEKDAY_SHORT.format(d).replace(".", ""),
    year: YEAR.format(d),
    time: `${TIME.format(d).replace(":", ".")} WIB`,
  };
}

/** "YYYY-MM-DD" of the event in WIB, for calendar cells. */
export const dayKey = (iso: string) => {
  const parts = fmt({ year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
};

/** Upcoming means it has not started yet; the stored status is only a fallback. */
export const isUpcoming = (e: Event, now: number) => new Date(e.date).getTime() >= now && e.status !== "ended";

export const seatsLeft = (e: Event) => Math.max(0, e.capacity - e.registrantsCount);

/** Event length in minutes from "90 menit" / "2 jam" / "2 hari"; defaults to two hours. */
function minutesOf(e: Event) {
  const m = (e.duration ?? "").match(/(\d+)\s*(menit|jam|hari)/i);
  if (!m) return 120;
  const n = Number(m[1]);
  return m[2].toLowerCase() === "menit" ? n : m[2].toLowerCase() === "jam" ? n * 60 : n * 8 * 60;
}

const icsDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const icsText = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

/** Downloads an .ics file so the visitor can add the event to Google / Apple / Outlook calendars. */
export function downloadIcs(e: Event, origin: string) {
  const start = new Date(e.date);
  const end = new Date(start.getTime() + minutesOf(e) * 60_000);
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CoPublika//Agenda//ID",
    "BEGIN:VEVENT",
    `UID:${e.id}@copublika.id`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsText(e.title)}`,
    `DESCRIPTION:${icsText(`${e.description}\n\n${origin}/event/${e.slug}`)}`,
    `LOCATION:${icsText(e.location)}`,
    `URL:${origin}/event/${e.slug}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([body], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${e.slug}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
