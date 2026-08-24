import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, institution, subject, message, sourcePage } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    if (supabase) {
      const { data, error } = await supabase
        .from("contact_inquiries")
        .insert([{ name, email, institution, subject, message, source_page: sourcePage }])
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ message: "Message sent", id: data.id });
      }
    }

    const isMockMode = process.env.MOCK_SUBMIT === "true";
    if (!isMockMode && !supabase) {
      return NextResponse.json({ message: "Service unavailable" }, { status: 503 });
    }

    return NextResponse.json({ message: "Message sent (mock mode)" });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}