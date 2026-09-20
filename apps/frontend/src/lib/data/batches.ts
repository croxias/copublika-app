import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fallbackBatch, fallbackBatches, fallbackKpis } from "./fallbacks";
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

/** Ambil semua batch OPEN — untuk Join Batch selector & sinkron publik */
export async function getOpenBatches(): Promise<Batch[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackBatches.filter((b) => b.status === "open");
  try {
    const { data, error } = await supabase
      .from("batches")
      .select("*")
      .eq("status", "open")
      .order("number", { ascending: false });
    if (error || !data || data.length === 0) return fallbackBatches.filter((b) => b.status === "open");
    return (data as Record<string, unknown>[]).map(mapBatchRow);
  } catch {
    return fallbackBatches.filter((b) => b.status === "open");
  }
}

export async function getBatchById(id: string): Promise<Batch | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackBatches.find((b) => b.id === id) ?? null;
  try {
    const { data, error } = await supabase.from("batches").select("*").eq("id", id).single();
    if (error || !data) return fallbackBatches.find((b) => b.id === id) ?? null;
    return mapBatchRow(data as Record<string, unknown>);
  } catch {
    return fallbackBatches.find((b) => b.id === id) ?? null;
  }
}

/** Legacy — single batch (dipakai hero lama) */
export async function getActiveBatch(): Promise<Batch> {
  const batches = await getOpenBatches();
  return batches[0] ?? fallbackBatch;
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
