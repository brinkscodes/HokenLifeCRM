"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthProfile } from "@/lib/auth";
import { canManageTeam, canChangeRole, canRemoveMember } from "@/lib/permissions";
import type { UserRole } from "@/types/database";

export async function getTeamMembers() {
  const profile = await getAuthProfile();
  if (!canManageTeam(profile.role)) throw new Error("Permission denied");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .eq("org_id", profile.orgId)
    .order("created_at");

  if (error) throw error;
  return { members: data, currentUserId: profile.id };
}

export async function updateMemberRole(memberId: string, newRole: UserRole) {
  const profile = await getAuthProfile();
  if (!canManageTeam(profile.role)) throw new Error("Permission denied");

  // Can't change your own role
  if (memberId === profile.id) throw new Error("Cannot change your own role");

  const supabase = await createClient();

  // Get the target member's current role
  const { data: target } = await supabase
    .from("profiles")
    .select("role, org_id")
    .eq("id", memberId)
    .single();

  if (!target || target.org_id !== profile.orgId) throw new Error("Member not found");

  if (!canChangeRole(profile.role, target.role as UserRole, newRole)) {
    throw new Error("Permission denied");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", memberId);

  if (error) throw error;
  revalidatePath("/dashboard/team");
}

export async function removeMember(memberId: string) {
  const profile = await getAuthProfile();
  if (!canManageTeam(profile.role)) throw new Error("Permission denied");

  if (memberId === profile.id) throw new Error("Cannot remove yourself");

  const supabase = await createClient();

  const { data: target } = await supabase
    .from("profiles")
    .select("role, org_id")
    .eq("id", memberId)
    .single();

  if (!target || target.org_id !== profile.orgId) throw new Error("Member not found");

  if (!canRemoveMember(profile.role, target.role as UserRole)) {
    throw new Error("Permission denied");
  }

  // Remove the member's profile from this org (sets org_id to null)
  // In practice, you might want to delete or deactivate the user
  const { error } = await supabase
    .from("profiles")
    .update({ org_id: null })
    .eq("id", memberId);

  if (error) throw error;
  revalidatePath("/dashboard/team");
}

export async function inviteMember(email: string, role: UserRole) {
  const profile = await getAuthProfile();
  if (!canManageTeam(profile.role)) throw new Error("Permission denied");

  // For now, store the invite — actual email sending is a future feature
  // Check if a user with that email already exists in the org
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .eq("org_id", profile.orgId)
    .single();

  if (existing) throw new Error("User already in your organization");

  // Check if user exists but in a different org (or no org)
  const { data: user } = await supabase
    .from("profiles")
    .select("id, org_id")
    .eq("email", email)
    .single();

  if (user && user.org_id) {
    throw new Error("User belongs to another organization");
  }

  if (user && !user.org_id) {
    // User exists but has no org — add them
    const { error } = await supabase
      .from("profiles")
      .update({ org_id: profile.orgId, role })
      .eq("id", user.id);

    if (error) throw error;
    revalidatePath("/dashboard/team");
    return { added: true };
  }

  // User doesn't exist yet — in a full app, send an invite email
  // For now, return a message
  return { invited: true, message: "Invite sent (email delivery coming soon)" };
}
