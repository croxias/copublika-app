import { getEvents } from "@/lib/data/events";
import { EventsPage } from "@/components/event/EventsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agenda — CoPublika",
  description: "Webinar, klinik manuskrip, workshop, dan forum doktoral bersama editor dan reviewer jurnal.",
};

export default async function EventPage() {
  const events = await getEvents();
  return <EventsPage events={events} />;
}
