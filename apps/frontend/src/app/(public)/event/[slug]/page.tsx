import type { Metadata } from "next";
import { getEventBySlug, getEvents } from "@/lib/data/events";
import { EventDetailRoute } from "@/components/event/EventDetailRoute";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return event ? { title: `${event.title} — Agenda CoPublika`, description: event.description } : {};
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Staging: an event made in the admin is not in the built-in data; the client route finds it.
  const event = await getEventBySlug(slug);

  // Other events, nearest date first; the client drops any that have already passed.
  const related = (await getEvents())
    .filter((e) => e.slug !== slug && e.status !== "ended")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return <EventDetailRoute slug={slug} event={event} related={related} />;
}
