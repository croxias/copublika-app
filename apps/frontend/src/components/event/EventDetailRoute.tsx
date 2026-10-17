"use client";

import Link from "next/link";
import type { Event } from "@/types";
import { useStagedEvent } from "@/lib/cms/public-staging";
import { EventDetail } from "./EventDetail";

/**
 * /event/[slug] in staging: shows the admin's version of the event (also events created in the
 * admin, which the built-in data does not know), or "not found" when it is a draft or archived.
 */
export function EventDetailRoute({ slug, event, related }: { slug: string; event: Event | null; related: Event[] }) {
  const { event: shown, ready } = useStagedEvent(slug, event);
  if (shown) return <EventDetail key={`${shown.id}-${shown.date}-${shown.title}`} event={shown} related={related.filter((e) => e.id !== shown.id)} />;
  if (!ready) return <main className="cp-pg cp-evd-missing" aria-busy="true" />;
  return (
    <main className="cp-pg cp-evd-missing">
      <div className="cp-ab-wrap">
        <span className="cp-evd-sec__k">Agenda</span>
        <h1>Acara tidak ditemukan</h1>
        <p>Acara ini belum terbit atau sudah diarsipkan.</p>
        <Link href="/event" className="cp-ab-btn cp-ab-btn--primary">Lihat semua agenda</Link>
      </div>
    </main>
  );
}
