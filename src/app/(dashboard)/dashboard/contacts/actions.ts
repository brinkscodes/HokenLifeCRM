"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthProfile } from "@/lib/auth";
import { canEditData } from "@/lib/permissions";

export async function getContacts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getContact(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createContact(formData: FormData) {
  const profile = await getAuthProfile();
  if (!canEditData(profile.role)) throw new Error("Permission denied");

  const supabase = await createClient();
  const { error } = await supabase.from("contacts").insert({
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    email: (formData.get("email") as string) || null,
    phone: (formData.get("phone") as string) || null,
    type: (formData.get("type") as string) || "individual",
    notes: (formData.get("notes") as string) || null,
    org_id: profile.orgId,
    created_by: profile.id,
  });

  if (error) throw error;
  revalidatePath("/dashboard/contacts");
}

export async function updateContact(id: string, formData: FormData) {
  const profile = await getAuthProfile();
  if (!canEditData(profile.role)) throw new Error("Permission denied");

  const supabase = await createClient();
  const { error } = await supabase
    .from("contacts")
    .update({
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      type: (formData.get("type") as string) || "individual",
      notes: (formData.get("notes") as string) || null,
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/dashboard/contacts");
}

export async function deleteContact(id: string) {
  const profile = await getAuthProfile();
  if (!canEditData(profile.role)) throw new Error("Permission denied");

  const supabase = await createClient();
  const { error } = await supabase.from("contacts").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/dashboard/contacts");
}
