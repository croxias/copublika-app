import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fallbackBatch, fallbackKpis } from "./fallbacks";
import type { Batch } from "@/types";

function mapBatchRow(row: Record<string, unknown>): Batch {
  return {
    id: String(row.id ?? ""),
    number: Number(row.number ?? 0),
    status: (String(row.status) as Batch["status"]) ?? "open",
    seatsTotal: Number(row.seats_total ?? row.seatsTotal ?? 0),
    seatsRemaining: Number(row.seats_remaining ?? row.seatsRemaining ?? 0),
    openDate: String(row.open_date ?? row.openDate ?? new Date().toISOString()),
    closeDate: String(row.close_date ?? row.closeDate ?? new Date().toISOString()),
  };
}

export async function getActiveBatch(): Promise<Batch> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackBatch;
  try {
    const { data, error } = await supabase
      .from("batches")
      .select("*")
      .eq("status", "open")
      .order("number", { ascending: false })
      .limit(1)
      .single();
    if (error || !data) return fallbackBatch;
    return mapBatchRow(data as Record<string, unknown>);
  } catch {
    return fallbackBatch;
  }
}

export async function getLandingKpis(): Promise<{ label: string; value: string }[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackKpis;
  try {
    return fallbackKpis;
  } catch {
    return fallbackKpis;
  }
}
