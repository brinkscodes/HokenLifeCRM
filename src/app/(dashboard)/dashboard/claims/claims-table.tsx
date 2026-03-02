"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Search, Plus, Download } from "lucide-react";
import { ClaimForm } from "./claim-form";
import { deleteClaim } from "./actions";
import { downloadCSV } from "@/lib/csv";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClaimWithPolicy = any;

interface ClaimsTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  claims: ClaimWithPolicy[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  policies: any[];
}

const statusColors: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  in_review: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  denied: "bg-red-500/10 text-red-500 border-red-500/20",
  closed: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export function ClaimsTable({ claims, policies }: ClaimsTableProps) {
  const [search, setSearch] = useState("");
  const [editClaim, setEditClaim] = useState<ClaimWithPolicy | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const router = useRouter();

  const filtered = claims.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.claim_number.toLowerCase().includes(q) ||
      (c.policies?.policy_number.toLowerCase().includes(q) ?? false) ||
      c.status.toLowerCase().includes(q)
    );
  });

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this claim?")) return;
    await deleteClaim(id);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search claims..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              downloadCSV(
                claims.map((c) => ({
                  claim_number: c.claim_number,
                  policy_number: c.policies?.policy_number || "",
                  status: c.status,
                  amount: c.amount,
                  description: c.description,
                  filed_date: c.filed_date,
                })),
                "claims"
              )
            }
            title="Export CSV"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button onClick={() => setCreateOpen(true)} className="bg-gradient-to-r from-[#92FE9D] to-[#00C9FF] text-black font-semibold hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            File Claim
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Claim #</TableHead>
              <TableHead>Policy</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Filed</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {claims.length === 0 ? "No claims yet." : "No claims match your search."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium font-mono">{claim.claim_number}</TableCell>
                  <TableCell className="font-mono text-sm">{claim.policies?.policy_number ?? "—"}</TableCell>
                  <TableCell>
                    {claim.policies?.contacts
                      ? `${claim.policies.contacts.first_name} ${claim.policies.contacts.last_name}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize ${statusColors[claim.status] || ""}`}>
                      {claim.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>${claim.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(claim.filed_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditClaim(claim)}>
                          <Pencil className="mr-2 h-4 w-4" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(claim.id)}>
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
        <DialogContent><DialogHeader><DialogTitle>File New Claim</DialogTitle></DialogHeader>
          <ClaimForm policies={policies} onSuccess={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editClaim} onOpenChange={() => setEditClaim(null)}>
        <DialogContent><DialogHeader><DialogTitle>Edit Claim</DialogTitle></DialogHeader>
          {editClaim && <ClaimForm claim={editClaim} policies={policies} onSuccess={() => setEditClaim(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
