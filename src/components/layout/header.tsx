"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SearchCommand } from "./search-command";
import { useState } from "react";
import type { UserRole } from "@/types/database";

interface HeaderProps {
  userName?: string;
  userRole?: UserRole;
}

export function Header({ userName = "User", userRole }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-sm">
        {/* Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex w-full max-w-md items-center gap-2 rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search contacts, policies, leads...</span>
          <kbd className="hidden rounded border border-border/50 bg-background px-1.5 py-0.5 text-xs font-mono text-muted-foreground md:inline-block">
            ⌘K
          </kbd>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-border/50">
              <AvatarFallback className="bg-gradient-to-br from-[#92FE9D] to-[#00C9FF] text-xs font-semibold text-black">
                {initials}
              </AvatarFallback>
            </Avatar>
            {userRole && (
              <Badge variant="outline" className="hidden text-xs capitalize md:inline-flex">
                {userRole}
              </Badge>
            )}
          </div>
        </div>
      </header>
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
