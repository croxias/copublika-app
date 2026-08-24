import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, googleScholarId, institution, role, expertise, statementOfIntent, targetJournalTier, orcid, hIndex, scopusOrLinkedIn, motivation } = body;

    if (!fullName || !email || !googleScholarId || !institution || !role || !expertise || !statementOfIntent || !targetJournalTier) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    if (supabase) {
      const { data, error } = await supabase
        .from("applications")
        .insert([{
          applicant_data: { fullName, email, googleScholarId, institution, role, expertise, statementOfIntent, targetJournalTier, orcid, hIndex, scopusOrLinkedIn, motivation },
          status: "pending",
        }])
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ message: "Application submitted", id: data.id });
      }
    }

    const isMockMode = process.env.MOCK_SUBMIT === "true";
    if (!isMockMode && !supabase) {
      return NextResponse.json({ message: "Service unavailable" }, { status: 503 });
    }

    return NextResponse.json({
      message: "Application submitted (mock mode)",
      id: `mock-${Date.now()}`,
    });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}