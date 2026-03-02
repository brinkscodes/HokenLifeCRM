"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClaim, updateClaim } from "./actions";

interface ClaimFormProps {
  claim?: {
    id: string;
    claim_number: string;
    policy_id: string;
    status: string;
    amount: number;
    description: string | null;
    filed_date: string;
  };
  policies: {
    id: string;
    policy_number: string;
    contacts: { first_name: string; last_name: string } | null;
  }[];
  onSuccess?: () => void;
}

export function ClaimForm({ claim, policies, onSuccess }: ClaimFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      if (claim) {
        await updateClaim(claim.id, formData);
      } else {
        await createClaim(formData);
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="claim_number">Claim Number</Label>
          <Input id="claim_number" name="claim_number" defaultValue={claim?.claim_number} placeholder="CLM-001" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="policy_id">Policy</Label>
          <Select name="policy_id" defaultValue={claim?.policy_id}>
            <SelectTrigger><SelectValue placeholder="Select a policy" /></SelectTrigger>
            <SelectContent>
              {policies.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.policy_number} — {p.contacts ? `${p.contacts.first_name} ${p.contacts.last_name}` : "Unknown"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={claim?.status || "open"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="denied">Denied</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount ($)</Label>
          <Input id="amount" name="amount" type="number" step="0.01" min="0" defaultValue={claim?.amount} placeholder="0.00" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="filed_date">Filed Date</Label>
        <Input id="filed_date" name="filed_date" type="date" defaultValue={claim?.filed_date || new Date().toISOString().split("T")[0]} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} defaultValue={claim?.description ?? ""} />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" className="bg-gradient-to-r from-[#92FE9D] to-[#00C9FF] text-black font-semibold hover:opacity-90" disabled={loading}>
          {loading ? "Saving..." : claim ? "Update Claim" : "File Claim"}
        </Button>
      </div>
    </form>
  );
}
