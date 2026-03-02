"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createLead, updateLead } from "./actions";

interface LeadFormProps {
  lead?: {
    id: string;
    contact_id: string;
    source: string;
    status: string;
    assigned_to: string | null;
    value: number | null;
  };
  contacts: { id: string; first_name: string; last_name: string }[];
  agents: { id: string; full_name: string }[];
  onSuccess?: () => void;
}

const leadSources = ["Referral", "Website", "Cold Call", "Social Media", "Event", "Advertisement", "Other"];

export function LeadForm({ lead, contacts, agents, onSuccess }: LeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      if (lead) {
        await updateLead(lead.id, formData);
      } else {
        await createLead(formData);
      }
      router.refresh();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contact_id">Contact</Label>
        <Select name="contact_id" defaultValue={lead?.contact_id}>
          <SelectTrigger><SelectValue placeholder="Select a contact" /></SelectTrigger>
          <SelectContent>
            {contacts.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.first_name} {c.last_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Select name="source" defaultValue={lead?.source || "Referral"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {leadSources.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={lead?.status || "new"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="won">Won</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="assigned_to">Assigned To</Label>
          <Select name="assigned_to" defaultValue={lead?.assigned_to ?? ""}>
            <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
            <SelectContent>
              {agents.map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.full_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="value">Estimated Value ($)</Label>
          <Input id="value" name="value" type="number" step="0.01" min="0" defaultValue={lead?.value ?? ""} placeholder="0.00" />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" className="bg-gradient-to-r from-[#92FE9D] to-[#00C9FF] text-black font-semibold hover:opacity-90" disabled={loading}>
          {loading ? "Saving..." : lead ? "Update Lead" : "Add Lead"}
        </Button>
      </div>
    </form>
  );
}
