"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/auth-actions";
import type { UserRole } from "@/lib/auth";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Header({
  userName,
  userRole,
}: {
  userName: string;
  userRole: UserRole;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 md:px-6">
      <div className="w-8 md:hidden" />

      <div className="flex-1">
        <h2 className="text-lg font-bold md:hidden text-foreground">Roia</h2>
      </div>

      <div className="flex items-center gap-3">
        <Badge
          variant={userRole === "admin" ? "default" : "secondary"}
          className="text-xs hidden sm:inline-flex"
        >
          {userRole === "admin" ? "Admin" : "Empleado"}
        </Badge>
        <Avatar className="h-8 w-8 ring-2 ring-border">
          <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium hidden lg:inline text-muted-foreground">
          {userName}
        </span>
        <form action={logout}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
