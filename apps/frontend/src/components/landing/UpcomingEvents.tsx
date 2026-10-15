import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Event } from "@/types";

function toneByStatus(status: Event["status"]) {
  if (status === "live") return "warning" as const;
  if (status === "upcoming") return "accent" as const;
  return "default" as const;
}

export function UpcomingEvents({ events }: { events: Event[] }) {
  return (
    <section className="py-20">
      <div className="cp-wrap w-full max-w-[var(--max)] mx-auto">
        <div className="flex items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Events"
            title="Upcoming sessions and live community forums."
            description="Join workshops, diagnostics, and collaboration sessions designed to accelerate publication outcomes."
          />
          <Link href="/event" className="text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-ink)]">
            View all events
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.slug}>
              <Badge tone={toneByStatus(event.status)}>{event.status}</Badge>
              <h3 className="mt-4 text-xl font-bold tracking-tight text-[var(--foreground)]">{event.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{event.description}</p>
              <p className="mt-4 text-sm text-[var(--foreground)]">{new Date(event.date).toLocaleDateString("id-ID")} · {event.location}</p>
              <Link href={`/event/${event.slug}`} className="mt-5 inline-flex text-sm font-semibold text-[var(--accent)]">
                View event
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
