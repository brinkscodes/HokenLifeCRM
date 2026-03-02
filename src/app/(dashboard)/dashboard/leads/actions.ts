"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getLeads() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*, contacts(first_name, last_name, email, phone), profiles:assigned_to(full_name)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getContactsForLeads() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("id, first_name, last_name")
    .order("last_name");

  if (error) throw error;
  return data;
}

export async function getAgentsForAssignment() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .order("full_name");

  if (error) throw error;
  return data;
}

export async function createLead(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  if (!profile) throw new Error("Profile not found");

  const assignedTo = formData.get("assigned_to") as string;

  const { error } = await supabase.from("leads").insert({
    contact_id: formData.get("contact_id") as string,
    source: formData.get("source") as string,
    status: (formData.get("status") as string) || "new",
    assigned_to: assignedTo || null,
    value: parseFloat(formData.get("value") as string) || null,
    org_id: profile.org_id,
  });

  if (error) throw error;
  revalidatePath("/dashboard/leads");
}

export async function updateLead(id: string, formData: FormData) {
  const supabase = await createClient();
  const assignedTo = formData.get("assigned_to") as string;

  const { error } = await supabase
    .from("leads")
    .update({
      contact_id: formData.get("contact_id") as string,
      source: formData.get("source") as string,
      status: formData.get("status") as string,
      assigned_to: assignedTo || null,
      value: parseFloat(formData.get("value") as string) || null,
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/dashboard/leads");
}

export async function deleteLead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/dashboard/leads");
}
