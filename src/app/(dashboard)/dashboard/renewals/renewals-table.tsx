"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface Renewal {
  id: string;
  policy_number: string;
  type: string;
  premium: number;
  start_date: string;
  end_date: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contacts: any;
}

function getDaysUntil(endDate: string) {
  return Math.ceil(
    (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
}

function getUrgencyBadge(days: number) {
  if (days <= 0) return <Badge variant="destructive">Expired</Badge>;
  if (days <= 7) return <Badge variant="destructive">{days}d left</Badge>;
  if (days <= 30) return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">{days}d left</Badge>;
  if (days <= 90) return <Badge variant="secondary">{days}d left</Badge>;
  return <Badge variant="outline">{days}d left</Badge>;
}

type FilterRange = "all" | "expired" | "7days" | "30days" | "90days";

export function RenewalsTable({ renewals }: { renewals: Renewal[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterRange>("all");

  const filtered = renewals.filter((r) => {
    const days = getDaysUntil(r.end_date);
    const contact = Array.isArray(r.contacts) ? r.contacts[0] : r.contacts;
    const contactName = contact
      ? `${contact.first_name} ${contact.last_name}`.toLowerCase()
      : "";
    const matchesSearch =
      r.policy_number.toLowerCase().includes(search.toLowerCase()) ||
      contactName.includes(search.toLowerCase());

    let matchesFilter = true;
    switch (filter) {
      case "expired":
        matchesFilter = days <= 0;
        break;
      case "7days":
        matchesFilter = days > 0 && days <= 7;
        break;
      case "30days":
        matchesFilter = days > 0 && days <= 30;
        break;
      case "90days":
        matchesFilter = days > 0 && days <= 90;
        break;
    }

    return matchesSearch && matchesFilter;
  });

  const expiredCount = renewals.filter((r) => getDaysUntil(r.end_date) <= 0).length;
  const urgentCount = renewals.filter((r) => {
    const d = getDaysUntil(r.end_date);
    return d > 0 && d <= 30;
  }).length;

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-muted-foreground">Expired</p>
          <p className="text-2xl font-bold text-destructive">{expiredCount}</p>
        </div>
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
          <p className="text-sm text-muted-foreground">Due within 30 days</p>
          <p className="text-2xl font-bold text-yellow-400">{urgentCount}</p>
        </div>
        <div className="rounded-lg border border-border/50 bg-card/80 p-4">
          <p className="text-sm text-muted-foreground">Total active</p>
          <p className="text-2xl font-bold">{renewals.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by policy number or contact..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as FilterRange)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All renewals</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="7days">Next 7 days</SelectItem>
            <SelectItem value="30days">Next 30 days</SelectItem>
            <SelectItem value="90days">Next 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Policy #</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Premium</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No renewals match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => {
                const days = getDaysUntil(r.end_date);
                const contact = Array.isArray(r.contacts)
                  ? r.contacts[0]
                  : r.contacts;
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-sm">
                      {r.policy_number}
                    </TableCell>
                    <TableCell>
                      {contact
                        ? `${contact.first_name} ${contact.last_name}`
                        : "—"}
                    </TableCell>
                    <TableCell className="capitalize">{r.type.replace(/_/g, " ")}</TableCell>
                    <TableCell className="text-right">
                      ${r.premium.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(r.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getUrgencyBadge(days)}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
