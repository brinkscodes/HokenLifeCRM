export type UserRole = "owner" | "admin" | "agent" | "viewer";
export type PlanTier = "free" | "starter" | "professional" | "enterprise";
export type PolicyStatus = "active" | "expired" | "cancelled" | "pending";
export type ClaimStatus = "open" | "in_review" | "approved" | "denied" | "closed";
export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
export type ActivityType = "call" | "email" | "meeting" | "note" | "task";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: PlanTier;
  trial_ends_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  org_id: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  type: string;
  notes: string | null;
  org_id: string;
  created_by: string;
  created_at: string;
}

export interface Policy {
  id: string;
  policy_number: string;
  contact_id: string;
  type: string;
  status: PolicyStatus;
  premium: number;
  start_date: string;
  end_date: string;
  org_id: string;
  created_at: string;
}

export interface Claim {
  id: string;
  claim_number: string;
  policy_id: string;
  status: ClaimStatus;
  amount: number;
  description: string | null;
  filed_date: string;
  org_id: string;
  created_at: string;
}

export interface Lead {
  id: string;
  contact_id: string;
  source: string;
  status: LeadStatus;
  assigned_to: string | null;
  value: number | null;
  org_id: string;
  created_at: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  contact_id: string | null;
  user_id: string;
  org_id: string;
  created_at: string;
}
