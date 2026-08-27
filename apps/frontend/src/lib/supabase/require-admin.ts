import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirect("/admin/login");
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/admin/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    redirect("/admin/login");
  }

  return { supabase, user, profile };
}
