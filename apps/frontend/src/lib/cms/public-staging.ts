"use client";

// Public pages read a few admin-staged values from this browser (staging phase): event access
// and prices, and whether an email belongs to an active member. Defaults come from the page's
// own data so the server render and the first paint match.

import { useEffect, useState } from "react";
import type { Event } from "@/types";
import { MEMBER_SEED, memberState } from "./members";
import { eventPhase } from "./config/events";
import { PEOPLE } from "./seed/people";
import { personId } from "./slug";
import type { CmsItem } from "./types";

const STORAGE_KEY = "copublika-cms-v1";
/** Built-in price of a paid event that has none set (matches the admin seed). */
export const DEFAULT_EVENT_PRICE = 150_000;
/** Built-in member price of a paid public event (matches the admin seed). */
export const DEFAULT_EVENT_MEMBER_PRICE = 100_000;

type Stored = { collections?: Record<string, CmsItem[]>; sections?: Record<string, unknown> };
const readStored = (): Stored => {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") ?? {};
  } catch {
    return {};
  }
};

export type EventOffer = { isPaid: boolean; price: number; memberPrice: number | null; memberOnly: boolean; capacity: number };

const offerOf = (e: Event, staged?: CmsItem): EventOffer => {
  const isPaid = staged ? !!staged.isPaid : e.isPaid;
  const price = Number(staged?.price);
  const memberPrice = Number(staged?.memberPrice);
  return {
    isPaid,
    price: isPaid ? (Number.isFinite(price) && price > 0 ? price : DEFAULT_EVENT_PRICE) : 0,
    // Not edited in the admin yet: the seed's member price; edited and left empty: no member price.
    memberPrice: !isPaid ? null : !staged ? DEFAULT_EVENT_MEMBER_PRICE : staged.memberPrice !== "" && staged.memberPrice != null && Number.isFinite(memberPrice) && memberPrice >= 0 ? memberPrice : null,
    memberOnly: staged ? !!staged.memberOnly : !!e.memberOnly,
    capacity: Number(staged?.capacity) || e.capacity,
  };
};

/** Access, prices and capacity of an event as the admin set them. */
export function useEventOffer(e: Event): EventOffer {
  const [o, setO] = useState<EventOffer>(() => offerOf(e));
  useEffect(() => {
    const staged = readStored().collections?.events?.find((x) => x.id === e.id);
    // Reading browser storage has to wait for the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setO(offerOf(e, staged));
  }, [e]);
  return o;
}

/** Sign-ups already stored for an event (staging), counted on top of the page's own number. */
export function useStagedRegistrations(eventId: string) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const regs = readStored().collections?.registrations ?? [];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setN(regs.filter((r) => r.eventId === eventId && r.source === "public").length);
  }, [eventId]);
  return n;
}

/** Whether the email belongs to a member who is active today. */
export function isActiveMember(email: string, now: number) {
  const e = email.trim().toLowerCase();
  if (!e) return false;
  const members = readStored().collections?.members ?? MEMBER_SEED;
  return members.some((m) => String(m.email).toLowerCase() === e && ["active", "expiring"].includes(memberState(m, now).state));
}

/** Ticket code of an earlier sign-up for this event with the same email (not cancelled). */
export function existingTicket(eventId: string, email: string) {
  const e = email.trim().toLowerCase();
  const regs = readStored().collections?.registrations ?? [];
  const hit = regs.find((r) => r.eventId === eventId && String(r.email).toLowerCase() === e && r.status !== "cancelled");
  return hit ? String(hit.code ?? "") || "terdaftar" : null;
}

// ---------- Events from the admin (Agenda Event) ----------

const FORMAT_LABEL: Record<string, string> = { online: "Daring", offline: "Luring", hybrid: "Hybrid" };
const TYPE_LABEL: Record<string, string> = { webinar: "Webinar", clinic: "Klinik", workshop: "Workshop", forum: "Forum", bootcamp: "Bootcamp" };
const strip = (html: string) => html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>\s*<p[^>]*>/gi, "\n\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();

/** An admin event in the shape the public pages render; fields the admin does not hold come from `base`. */
export function eventFromCms(x: CmsItem, people: CmsItem[], regs: CmsItem[], now: number, base?: Event): Event {
  const date = String(x.date ?? "");
  const time = /^\d{2}:\d{2}$/.test(String(x.time ?? "")) ? String(x.time) : "09:00";
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T${time}:00+07:00` : base?.date ?? new Date(now).toISOString();
  const phase = eventPhase(x, now);
  const fmt = FORMAT_LABEL[String(x.format)] ?? "";
  const paragraphs = strip(String(x.about ?? "")).split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const gains = Array.isArray(x.gains) ? (x.gains as string[]) : [];
  const person = !x.guestSpeaker ? people.find((p) => p.id === x.speakerId) : undefined;
  const speakerName = person ? String(person.name ?? "") : String(x.speakerName ?? "");
  const held = regs.filter((r) => r.eventId === x.id && ["registered", "attended", "noshow"].includes(String(r.status))).length;
  const type = String(x.type ?? base?.type ?? "webinar");
  return {
    ...(base ?? {}),
    id: String(x.id),
    slug: String(x.slug ?? base?.slug ?? x.id),
    title: String(x.title ?? base?.title ?? ""),
    description: String(x.summary ?? base?.description ?? ""),
    date: iso,
    time: base?.time && base.date === iso ? base.time : time.replace(":", "."),
    duration: String(x.duration ?? base?.duration ?? ""),
    location: [fmt, String(x.location ?? "")].filter(Boolean).join(" · ") || base?.location || "",
    format: fmt ? `${fmt}${x.location ? ` · ${String(x.location)}` : ""}` : base?.format,
    language: String(x.language ?? base?.language ?? "Indonesia"),
    status: phase,
    isPaid: !!x.isPaid,
    memberOnly: !!x.memberOnly,
    capacity: Number(x.capacity) || base?.capacity || 0,
    // The built-in demo count, or the staged sign-ups for events made in the admin.
    registrantsCount: base ? base.registrantsCount : held,
    type,
    category: type,
    tags: base?.tags ?? [TYPE_LABEL[type] ?? "Event", fmt, String(x.duration ?? "")].filter(Boolean),
    blocks: paragraphs.length || gains.length ? [{ heading: "Apa yang akan dibahas", paragraphs, checkmarks: gains }] : base?.blocks ?? [],
    schedule: Array.isArray(x.schedule) ? (x.schedule as { time: string; title: string; description: string }[]) : base?.schedule ?? [],
    speaker: speakerName
      ? {
          name: speakerName,
          role: person ? [person.role, person.affiliation].filter(Boolean).map(String).join(" · ") : String(x.speakerRole ?? ""),
          avatar: person ? String(person.photo ?? "") : String(x.speakerAvatar ?? ""),
          badges: person ? [String(person.badge ?? "")].filter(Boolean) : Array.isArray(x.speakerBadges) ? (x.speakerBadges as string[]) : [],
        }
      : base?.speaker,
    benefits: Array.isArray(x.benefits) ? (x.benefits as string[]) : base?.benefits,
    targetAudience: Array.isArray(x.targetAudience) ? (x.targetAudience as string[]) : base?.targetAudience,
  };
}

const stagedPeople = (s: Stored) => s.collections?.people ?? PEOPLE.map((p) => ({ ...p, id: personId(p.name) }) as unknown as CmsItem);

/** The public agenda: the admin's published events once the admin has saved any, else the page's own. */
export function useStagedEvents(server: Event[]): Event[] {
  const [list, setList] = useState(server);
  useEffect(() => {
    const s = readStored();
    const events = s.collections?.events;
    if (!events) return;
    const now = Date.now();
    const people = stagedPeople(s);
    const regs = s.collections?.registrations ?? [];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setList(events.filter((x) => x.status === "published").map((x) => eventFromCms(x, people, regs, now, server.find((e) => e.id === x.id))));
  }, [server]);
  return list;
}

/** One event by slug: the admin's version when staged (also events made in the admin), else the page's own. */
export function useStagedEvent(slug: string, server: Event | null): { event: Event | null; ready: boolean } {
  const [state, setState] = useState<{ event: Event | null; ready: boolean }>({ event: server, ready: false });
  useEffect(() => {
    const s = readStored();
    const events = s.collections?.events;
    const x = events?.find((e) => e.slug === slug || e.id === server?.id);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!events) setState({ event: server, ready: true });
    else if (!x || x.status !== "published") setState({ event: null, ready: true });
    else setState({ event: eventFromCms(x, stagedPeople(s), s.collections?.registrations ?? [], Date.now(), server ?? undefined), ready: true });
  }, [slug, server]);
  return state;
}
