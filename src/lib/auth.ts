import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export interface AuthProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  orgId: string;
}

/**
 * Get the authenticated user's profile (including role and org).
 * Throws if not authenticated or profile not found.
 */
export async function getAuthProfile(): Promise<AuthProfile> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, org_id")
    .eq("id", user.id)
    .single();

  if (error || !profile) throw new Error("Profile not found");

  return {
    id: profile.id,
    fullName: profile.full_name,
    email: profile.email,
    role: profile.role as UserRole,
    orgId: profile.org_id,
  };
}

/**
 * Get the authenticated user's profile, or null if not authenticated.
 * Used in layouts where redirect is handled separately.
 */
export async function getAuthProfileOrNull(): Promise<AuthProfile | null> {
  try {
    return await getAuthProfile();
  } catch {
    return null;
  }
}
