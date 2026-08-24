import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fallbackEvents } from "./fallbacks";
import type { Event } from "@/types";

function mapEventRow(row: Record<string, unknown>): Event {
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    date: String(row.date ?? new Date().toISOString()),
    location: String(row.location ?? ""),
    status: (String(row.status) as Event["status"]) ?? "upcoming",
    isPaid: Boolean(row.is_paid ?? row.isPaid ?? false),
    capacity: Number(row.capacity ?? 0),
    registrantsCount: Number(row.registrants_count ?? row.registrantsCount ?? 0),
  };
}

export async function getEvents(): Promise<Event[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackEvents;
  try {
    const { data, error } = await supabase
      .from("content_events")
      .select("*")
      .order("date", { ascending: true });
    if (error || !data) return fallbackEvents;
    const rows = (data ?? []) as Record<string, unknown>[];
    return rows.map(mapEventRow);
  } catch {
    return fallbackEvents;
  }
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackEvents.find((e) => e.slug === slug) ?? null;
  try {
    const { data, error } = await supabase
      .from("content_events")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error || !data) {
      return fallbackEvents.find((e) => e.slug === slug) ?? null;
    }
    return mapEventRow(data as Record<string, unknown>);
  } catch {
    return fallbackEvents.find((e) => e.slug === slug) ?? null;
  }
}

export async function getUpcomingEvents(limit = 3): Promise<Event[]> {
  const all = await getEvents();
  return all.filter((e) => e.status !== "ended").slice(0, limit);
}
