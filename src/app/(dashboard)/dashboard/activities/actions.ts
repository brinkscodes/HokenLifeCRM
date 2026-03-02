"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthProfile } from "@/lib/auth";
import { canEditData } from "@/lib/permissions";

export async function getActivities(contactId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("activities")
    .select("*, contacts(first_name, last_name), profiles:user_id(full_name)")
    .order("created_at", { ascending: false });

  if (contactId) {
    query = query.eq("contact_id", contactId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createActivity(formData: FormData) {
  const profile = await getAuthProfile();
  if (!canEditData(profile.role)) throw new Error("Permission denied");

  const supabase = await createClient();
  const contactId = formData.get("contact_id") as string;

  const { error } = await supabase.from("activities").insert({
    type: formData.get("type") as string,
    description: formData.get("description") as string,
    contact_id: contactId || null,
    user_id: profile.id,
    org_id: profile.orgId,
  });

  if (error) throw error;
  revalidatePath("/dashboard/activities");
  if (contactId) {
    revalidatePath("/dashboard/contacts");
  }
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
