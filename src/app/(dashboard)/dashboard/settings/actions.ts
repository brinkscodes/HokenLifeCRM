"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthProfile } from "@/lib/auth";
import { canManageOrg } from "@/lib/permissions";

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
  const profile = await getAuthProfile();

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: formData.get("full_name") as string,
    })
    .eq("id", profile.id);

  if (error) throw error;

  await supabase.auth.updateUser({
    data: { full_name: formData.get("full_name") as string },
  });

  revalidatePath("/dashboard/settings");
}

export async function updateOrganization(formData: FormData) {
  const profile = await getAuthProfile();
  if (!canManageOrg(profile.role)) throw new Error("Permission denied");

  const supabase = await createClient();
  const { error } = await supabase
    .from("organizations")
    .update({
      name: formData.get("org_name") as string,
    })
    .eq("id", profile.orgId);

  if (error) throw error;
  revalidatePath("/dashboard/settings");
}
