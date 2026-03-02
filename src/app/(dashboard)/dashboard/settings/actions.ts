"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*, organizations(*)")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return { profile, email: user.email };
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: formData.get("full_name") as string,
    })
    .eq("id", user.id);

  if (error) throw error;

  // Also update auth metadata
  await supabase.auth.updateUser({
    data: { full_name: formData.get("full_name") as string },
  });

  revalidatePath("/dashboard/settings");
}

export async function updateOrganization(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  if (!profile) throw new Error("Profile not found");

  const { error } = await supabase
    .from("organizations")
    .update({
      name: formData.get("org_name") as string,
    })
    .eq("id", profile.org_id);

  if (error) throw error;
  revalidatePath("/dashboard/settings");
}
