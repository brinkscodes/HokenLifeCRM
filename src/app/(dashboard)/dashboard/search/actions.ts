"use server";

import { createClient } from "@/lib/supabase/server";

export interface SearchResult {
  id: string;
  type: "contact" | "policy" | "claim" | "lead";
  title: string;
  subtitle: string;
  href: string;
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const supabase = await createClient();
  const q = `%${query}%`;

  const [contactsRes, policiesRes, claimsRes, leadsRes] = await Promise.all([
    supabase
      .from("contacts")
      .select("id, first_name, last_name, email")
      .or(`first_name.ilike.${q},last_name.ilike.${q},email.ilike.${q}`)
      .limit(5),
    supabase
      .from("policies")
      .select("id, policy_number, type, contacts(first_name, last_name)")
      .or(`policy_number.ilike.${q},type.ilike.${q}`)
      .limit(5),
    supabase
      .from("claims")
      .select("id, claim_number, description")
      .or(`claim_number.ilike.${q},description.ilike.${q}`)
      .limit(5),
    supabase
      .from("leads")
      .select("id, source, status, contacts(first_name, last_name)")
      .or(`source.ilike.${q},status.ilike.${q}`)
      .limit(5),
  ]);

  const results: SearchResult[] = [];

  (contactsRes.data ?? []).forEach((c) => {
    results.push({
      id: c.id,
      type: "contact",
      title: `${c.first_name} ${c.last_name}`,
      subtitle: c.email || "No email",
      href: "/dashboard/contacts",
    });
  });

  (policiesRes.data ?? []).forEach((p) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contact = Array.isArray(p.contacts) ? (p.contacts as any)[0] : p.contacts;
    results.push({
      id: p.id,
      type: "policy",
      title: p.policy_number,
      subtitle: contact ? `${contact.first_name} ${contact.last_name} — ${p.type}` : p.type,
      href: "/dashboard/policies",
    });
  });

  (claimsRes.data ?? []).forEach((c) => {
    results.push({
      id: c.id,
      type: "claim",
      title: c.claim_number,
      subtitle: c.description?.slice(0, 60) || "No description",
      href: "/dashboard/claims",
    });
  });

  (leadsRes.data ?? []).forEach((l) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contact = Array.isArray(l.contacts) ? (l.contacts as any)[0] : l.contacts;
    results.push({
      id: l.id,
      type: "lead",
      title: contact ? `${contact.first_name} ${contact.last_name}` : "Unknown",
      subtitle: `${l.source} — ${l.status}`,
      href: "/dashboard/leads",
    });
  });

  return results;
}
