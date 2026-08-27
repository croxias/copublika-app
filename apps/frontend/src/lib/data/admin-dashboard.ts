import type { Batch, ResearchProject } from "@/types";
import { requireAdmin } from "@/lib/supabase/require-admin";

export type AdminDashboardResult<T> =
  | { status: "ready"; data: T }
  | { status: "unavailable"; reason: string }
  | { status: "error"; message: string };

export type AdminApplicationStatus = "pending" | "verified" | "rejected";

export type AdminApplication = {
  id: string;
  name: string;
  institution: string;
  expertise: string;
  scholarId: string;
  hIndex: number | null;
  status: AdminApplicationStatus;
  submittedAt: string;
  batchId: string | null;
};

const projectStatuses = new Set<ResearchProject["status"]>(["draft", "pending", "published", "archived"]);
const projectVisibilities = new Set<ResearchProject["visibility"]>(["public", "private"]);
const applicationStatuses = new Set<AdminApplicationStatus>(["pending", "verified", "rejected"]);
const batchStatuses = new Set<Batch["status"]>(["open", "closed", "full"]);

function nonnegativeNumber(value: unknown): number {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}

function mapProjectStatus(value: unknown): ResearchProject["status"] | null {
  return typeof value === "string" && projectStatuses.has(value as ResearchProject["status"])
    ? value as ResearchProject["status"]
    : null;
}

export type AdminDashboardData = {
  batches: AdminDashboardResult<Batch[]>;
  applications: AdminDashboardResult<AdminApplication[]>;
  researchProjects: AdminDashboardResult<ResearchProject[]>;
};

function unavailable(reason: string): AdminDashboardResult<never> {
  return { status: "unavailable", reason };
}

function errorResult(): AdminDashboardResult<never> {
  return {
    status: "error",
    message: "Permintaan data gagal.",
  };
}

function mapBatch(row: Record<string, unknown>): Batch | null {
  const status = typeof row.status === "string" && batchStatuses.has(row.status as Batch["status"])
    ? row.status as Batch["status"]
    : null;
  if (!status) return null;

  return {
    id: String(row.id ?? ""),
    number: Number(row.number ?? 0),
    status,
    seatsTotal: nonnegativeNumber(row.seats_total ?? row.seatsTotal),
    seatsRemaining: Math.min(nonnegativeNumber(row.seats_total ?? row.seatsTotal), nonnegativeNumber(row.seats_remaining ?? row.seatsRemaining)),
    openDate: String(row.open_date ?? row.openDate ?? ""),
    closeDate: String(row.close_date ?? row.closeDate ?? ""),
  };
}

function mapApplication(row: Record<string, unknown>): AdminApplication | null {
  const status = typeof row.status === "string" && applicationStatuses.has(row.status as AdminApplicationStatus)
    ? row.status as AdminApplicationStatus
    : null;
  if (!status) return null;
  const rawHIndex = Number(row.h_index);
  const hIndex = Number.isFinite(rawHIndex) ? rawHIndex : null;

  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    institution: String(row.institution ?? ""),
    expertise: String(row.expertise ?? ""),
    scholarId: String(row.scholar_id ?? ""),
    hIndex,
    status,
    submittedAt: String(row.created_at ?? ""),
    batchId: typeof row.batch_id === "string" ? row.batch_id : null,
  };
}

function mapProject(row: Record<string, unknown>): ResearchProject | null {
  const status = mapProjectStatus(row.status);
  const visibility = typeof row.visibility === "string" && projectVisibilities.has(row.visibility as ResearchProject["visibility"])
    ? row.visibility as ResearchProject["visibility"]
    : null;
  if (!status || !visibility) return null;

  return {
    id: String(row.slug ?? row.id ?? ""),
    title: String(row.title ?? ""),
    abstract: String(row.abstract ?? ""),
    methodology: String(row.methodology ?? ""),
    requiredExpertise: Array.isArray(row.required_expertise) ? row.required_expertise.map(String) : [],
    status,
    visibility,
    leadName: String(row.lead_name ?? ""),
    leadInstitution: String(row.lead_institution ?? ""),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    createdAt: String(row.created_at ?? ""),
  };
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const { supabase } = await requireAdmin();
  if (!supabase) {
    const reason = "Server-side Supabase is not configured.";
    return { batches: unavailable(reason), applications: unavailable(reason), researchProjects: unavailable(reason) };
  }

  const [batches, applications, researchProjects] = await Promise.all([
    supabase.from("batches").select("id, number, status, seats_total, seats_remaining, open_date, close_date").eq("status", "open").order("number", { ascending: false }),
    supabase.from("applications").select("id, batch_id, name:applicant_data->>fullName, institution:applicant_data->>institution, expertise:applicant_data->>expertise, scholar_id:applicant_data->>googleScholarId, h_index:applicant_data->>hIndex, status, created_at").order("created_at", { ascending: false }),
    supabase.from("research_projects").select("id, slug, title, abstract, methodology, required_expertise, status, visibility, lead_name, lead_institution, tags, created_at").order("created_at", { ascending: false }),
  ]);

  return {
    batches: batches.error ? errorResult() : { status: "ready", data: (batches.data ?? []).map((row) => mapBatch(row as Record<string, unknown>)).filter((batch): batch is Batch => batch !== null) },
    applications: applications.error ? errorResult() : { status: "ready", data: (applications.data ?? []).map((row) => mapApplication(row as Record<string, unknown>)).filter((application): application is AdminApplication => application !== null) },
    researchProjects: researchProjects.error ? errorResult() : { status: "ready", data: (researchProjects.data ?? []).map((row) => mapProject(row as Record<string, unknown>)).filter((project): project is ResearchProject => project !== null) },
  };
}
