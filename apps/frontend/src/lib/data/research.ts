import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fallbackResearch } from "./fallbacks";
import type { ResearchProject } from "@/types";

function mapResearchRow(row: Record<string, unknown>): ResearchProject {
  return {
    id: String(row.slug ?? row.id ?? ""),
    title: String(row.title ?? ""),
    abstract: String(row.abstract ?? ""),
    methodology: String(row.methodology ?? ""),
    requiredExpertise: Array.isArray(row.required_expertise)
      ? (row.required_expertise as unknown[]).map((e) => String(e))
      : Array.isArray(row.requiredExpertise)
        ? (row.requiredExpertise as unknown[]).map((e) => String(e))
        : [],
    status: (String(row.status) as ResearchProject["status"]) ?? "published",
    visibility: (String(row.visibility) as ResearchProject["visibility"]) ?? "public",
    leadName: String(row.lead_name ?? row.leadName ?? ""),
    leadInstitution: String(row.lead_institution ?? row.leadInstitution ?? ""),
    tags: Array.isArray(row.tags)
      ? (row.tags as unknown[]).map((t) => String(t))
      : [],
    createdAt: String(row.created_at ?? row.createdAt ?? new Date().toISOString()),
  };
}

export async function getResearchProjects(): Promise<ResearchProject[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackResearch;
  try {
    const { data, error } = await supabase
      .from("research_projects")
      .select("*")
      .eq("visibility", "public")
      .order("created_at", { ascending: false });
    if (error || !data) return fallbackResearch;
    const rows = (data ?? []) as Record<string, unknown>[];
    return rows.map(mapResearchRow);
  } catch {
    return fallbackResearch;
  }
}

export async function getResearchProjectBySlug(slug: string): Promise<ResearchProject | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackResearch.find((p) => p.id === slug) ?? null;
  try {
    const { data, error } = await supabase
      .from("research_projects")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error || !data) {
      return fallbackResearch.find((p) => p.id === slug) ?? null;
    }
    return mapResearchRow(data as Record<string, unknown>);
  } catch {
    return fallbackResearch.find((p) => p.id === slug) ?? null;
  }
}

export async function getLatestResearchProjects(limit = 3): Promise<ResearchProject[]> {
  const all = await getResearchProjects();
  return all.slice(0, limit);
}
