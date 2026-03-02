"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthProfile } from "@/lib/auth";
import { canEditData } from "@/lib/permissions";

export async function getClaims() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("claims")
    .select("*, policies(policy_number, contacts(first_name, last_name))")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPoliciesForSelect() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("policies")
    .select("id, policy_number, contacts(first_name, last_name)")
    .order("policy_number");

  if (error) throw error;
  return data;
}

export async function createClaim(formData: FormData) {
  const profile = await getAuthProfile();
  if (!canEditData(profile.role)) throw new Error("Permission denied");

  const supabase = await createClient();
  const { error } = await supabase.from("claims").insert({
    claim_number: formData.get("claim_number") as string,
    policy_id: formData.get("policy_id") as string,
    status: (formData.get("status") as string) || "open",
    amount: parseFloat(formData.get("amount") as string) || 0,
    description: (formData.get("description") as string) || null,
    filed_date: formData.get("filed_date") as string,
    org_id: profile.orgId,
  });

  if (error) throw error;
  revalidatePath("/dashboard/claims");
}

export async function updateClaim(id: string, formData: FormData) {
  const profile = await getAuthProfile();
  if (!canEditData(profile.role)) throw new Error("Permission denied");

  const supabase = await createClient();
  const { error } = await supabase
    .from("claims")
    .update({
      claim_number: formData.get("claim_number") as string,
      policy_id: formData.get("policy_id") as string,
      status: formData.get("status") as string,
      amount: parseFloat(formData.get("amount") as string) || 0,
      description: (formData.get("description") as string) || null,
      filed_date: formData.get("filed_date") as string,
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/dashboard/claims");
}

export async function deleteClaim(id: string) {
  const profile = await getAuthProfile();
  if (!canEditData(profile.role)) throw new Error("Permission denied");

  const supabase = await createClient();
  const { error } = await supabase.from("claims").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/dashboard/claims");
}
