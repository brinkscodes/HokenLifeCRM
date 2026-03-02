"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPolicy, updatePolicy } from "./actions";

interface PolicyFormProps {
  policy?: {
    id: string;
    policy_number: string;
    contact_id: string;
    type: string;
    status: string;
    premium: number;
    start_date: string;
    end_date: string;
  };
  contacts: { id: string; first_name: string; last_name: string }[];
  onSuccess?: () => void;
}

const policyTypes = [
  "Auto",
  "Home",
  "Life",
  "Health",
  "Business",
  "Umbrella",
  "Disability",
  "Renters",
  "Other",
];

export function PolicyForm({ policy, contacts, onSuccess }: PolicyFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      if (policy) {
        await updatePolicy(policy.id, formData);
      } else {
        await createPolicy(formData);
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
          <Label htmlFor="policy_number">Policy Number</Label>
          <Input
            id="policy_number"
            name="policy_number"
            defaultValue={policy?.policy_number}
            placeholder="POL-001"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_id">Contact</Label>
          <Select name="contact_id" defaultValue={policy?.contact_id}>
            <SelectTrigger>
              <SelectValue placeholder="Select a contact" />
            </SelectTrigger>
            <SelectContent>
              {contacts.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.first_name} {c.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Policy Type</Label>
          <Select name="type" defaultValue={policy?.type || "Auto"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {policyTypes.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={policy?.status || "active"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="premium">Annual Premium ($)</Label>
        <Input
          id="premium"
          name="premium"
          type="number"
          step="0.01"
          min="0"
          defaultValue={policy?.premium}
          placeholder="0.00"
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={policy?.start_date}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            defaultValue={policy?.end_date}
            required
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button type="submit" className="bg-gradient-to-r from-[#92FE9D] to-[#00C9FF] text-black font-semibold hover:opacity-90" disabled={loading}>
          {loading ? "Saving..." : policy ? "Update Policy" : "Add Policy"}
        </Button>
      </div>
    </form>
  );
}
