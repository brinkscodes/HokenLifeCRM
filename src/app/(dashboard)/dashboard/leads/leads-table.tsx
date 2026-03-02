"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Search, Plus } from "lucide-react";
import { LeadForm } from "./lead-form";
import { deleteLead } from "./actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LeadWithRelations = any;

interface LeadsTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leads: LeadWithRelations[];
  contacts: { id: string; first_name: string; last_name: string }[];
  agents: { id: string; full_name: string }[];
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  contacted: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  qualified: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  proposal: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  won: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  lost: "bg-red-500/10 text-red-500 border-red-500/20",
};

export function LeadsTable({ leads, contacts, agents }: LeadsTableProps) {
  const [search, setSearch] = useState("");
  const [editLead, setEditLead] = useState<LeadWithRelations | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const router = useRouter();

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const contactName = l.contacts ? `${l.contacts.first_name} ${l.contacts.last_name}`.toLowerCase() : "";
    return contactName.includes(q) || l.source.toLowerCase().includes(q) || l.status.toLowerCase().includes(q);
  });

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    await deleteLead(id);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-gradient-to-r from-[#92FE9D] to-[#00C9FF] text-black font-semibold hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" />Add Lead
        </Button>
      </div>

      <div className="rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {leads.length === 0 ? "No leads yet. Add contacts first, then create leads." : "No leads match your search."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    {lead.contacts ? `${lead.contacts.first_name} ${lead.contacts.last_name}` : "—"}
                  </TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize ${statusColors[lead.status] || ""}`}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{lead.profiles?.full_name ?? <span className="text-muted-foreground">Unassigned</span>}</TableCell>
                  <TableCell>{lead.value ? `$${lead.value.toLocaleString()}` : "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditLead(lead)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(lead.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
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
        <DialogContent><DialogHeader><DialogTitle>Add New Lead</DialogTitle></DialogHeader>
          <LeadForm contacts={contacts} agents={agents} onSuccess={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editLead} onOpenChange={() => setEditLead(null)}>
        <DialogContent><DialogHeader><DialogTitle>Edit Lead</DialogTitle></DialogHeader>
          {editLead && <LeadForm lead={editLead} contacts={contacts} agents={agents} onSuccess={() => setEditLead(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
