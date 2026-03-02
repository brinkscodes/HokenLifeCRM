"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthProfile } from "@/lib/auth";
import { canEditData } from "@/lib/permissions";

export async function getPolicies() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("policies")
    .select("*, contacts(first_name, last_name)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getContactsForSelect() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("id, first_name, last_name")
    .order("last_name");

  if (error) throw error;
  return data;
}

export async function createPolicy(formData: FormData) {
  const profile = await getAuthProfile();
  if (!canEditData(profile.role)) throw new Error("Permission denied");

  const supabase = await createClient();
  const { error } = await supabase.from("policies").insert({
    policy_number: formData.get("policy_number") as string,
    contact_id: formData.get("contact_id") as string,
    type: formData.get("type") as string,
    status: (formData.get("status") as string) || "active",
    premium: parseFloat(formData.get("premium") as string) || 0,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    org_id: profile.orgId,
  });

  if (error) throw error;
  revalidatePath("/dashboard/policies");
}

export async function updatePolicy(id: string, formData: FormData) {
  const profile = await getAuthProfile();
  if (!canEditData(profile.role)) throw new Error("Permission denied");

  const supabase = await createClient();
  const { error } = await supabase
    .from("policies")
    .update({
      policy_number: formData.get("policy_number") as string,
      contact_id: formData.get("contact_id") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as string,
      premium: parseFloat(formData.get("premium") as string) || 0,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/dashboard/policies");
}

export async function deletePolicy(id: string) {
  const profile = await getAuthProfile();
  if (!canEditData(profile.role)) throw new Error("Permission denied");

  const supabase = await createClient();
  const { error } = await supabase.from("policies").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/dashboard/policies");
}
