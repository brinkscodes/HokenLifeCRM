"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Search, Plus } from "lucide-react";
import { PolicyForm } from "./policy-form";
import { deletePolicy } from "./actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PolicyWithContact = any;

interface PoliciesTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  policies: PolicyWithContact[];
  contacts: { id: string; first_name: string; last_name: string }[];
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  expired: "bg-red-500/10 text-red-500 border-red-500/20",
  cancelled: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export function PoliciesTable({ policies, contacts }: PoliciesTableProps) {
  const [search, setSearch] = useState("");
  const [editPolicy, setEditPolicy] = useState<PolicyWithContact | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const router = useRouter();

  const filtered = policies.filter((p) => {
    const q = search.toLowerCase();
    const contactName = p.contacts
      ? `${p.contacts.first_name} ${p.contacts.last_name}`.toLowerCase()
      : "";
    return (
      p.policy_number.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      contactName.includes(q)
    );
  });

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this policy?")) return;
    await deletePolicy(id);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search policies..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-gradient-to-r from-[#92FE9D] to-[#00C9FF] text-black font-semibold hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" />
          Add Policy
        </Button>
      </div>

      <div className="rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Policy #</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Premium</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {policies.length === 0
                    ? "No policies yet. Add contacts first, then create policies."
                    : "No policies match your search."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium font-mono">{policy.policy_number}</TableCell>
                  <TableCell>
                    {policy.contacts
                      ? `${policy.contacts.first_name} ${policy.contacts.last_name}`
                      : "—"}
                  </TableCell>
                  <TableCell>{policy.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize ${statusColors[policy.status] || ""}`}>
                      {policy.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${policy.premium.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(policy.end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditPolicy(policy)}>
                          <Pencil className="mr-2 h-4 w-4" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(policy.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Policy</DialogTitle></DialogHeader>
          <PolicyForm contacts={contacts} onSuccess={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editPolicy} onOpenChange={() => setEditPolicy(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Policy</DialogTitle></DialogHeader>
          {editPolicy && <PolicyForm policy={editPolicy} contacts={contacts} onSuccess={() => setEditPolicy(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
