"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUpcomingRenewals() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("policies")
    .select("*, contacts(first_name, last_name, email, phone)")
    .eq("status", "active")
    .order("end_date", { ascending: true });

  if (error) throw error;
  return data;
}
