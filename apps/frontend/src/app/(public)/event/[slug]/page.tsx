import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEventBySlug, getEvents } from "@/lib/data/events";
import { EventDetail } from "@/components/event/EventDetail";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return event ? { title: `${event.title} — Agenda CoPublika`, description: event.description } : {};
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  // Other events, nearest date first; the client drops any that have already passed.
  const related = (await getEvents())
    .filter((e) => e.slug !== event.slug && e.status !== "ended")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return <EventDetail event={event} related={related} />;
}
