"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Users, FileText, ShieldAlert, Target } from "lucide-react";
import { globalSearch, type SearchResult } from "@/app/(dashboard)/dashboard/search/actions";

const typeIcons = {
  contact: Users,
  policy: FileText,
  claim: ShieldAlert,
  lead: Target,
};

const typeLabels = {
  contact: "Contacts",
  policy: "Policies",
  claim: "Claims",
  lead: "Leads",
};

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Cmd+K to toggle
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  // Clear query when closing
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await globalSearch(query);
      setResults(res);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      onOpenChange(false);
      router.push(result.href);
    },
    [router, onOpenChange]
  );

  // Group results by type
  const grouped = results.reduce(
    (acc, r) => {
      if (!acc[r.type]) acc[r.type] = [];
      acc[r.type].push(r);
      return acc;
    },
    {} as Record<string, SearchResult[]>
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search contacts, policies, claims, leads..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {loading && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Searching...
          </div>
        )}
        {!loading && query.length >= 2 && results.length === 0 && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {!loading &&
          Object.entries(grouped).map(([type, items]) => {
            const Icon = typeIcons[type as keyof typeof typeIcons];
            return (
              <CommandGroup
                key={type}
                heading={typeLabels[type as keyof typeof typeLabels]}
              >
                {items.map((item) => (
                  <CommandItem
                    key={`${item.type}-${item.id}`}
                    onSelect={() => handleSelect(item)}
                    className="cursor-pointer"
                  >
                    <Icon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm">{item.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.subtitle}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
      </CommandList>
    </CommandDialog>
  );
}
