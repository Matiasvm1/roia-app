"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  ClipboardList,
  DollarSign,
  Receipt,
  Package,
  Menu,
  X,
  Scissors,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/lib/auth";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  adminOnly?: boolean;
}

const navGroups: NavGroup[] = [
  {
    label: "Principal",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, adminOnly: true },
      { name: "Órdenes", href: "/orders", icon: ClipboardList },
      { name: "Clientes", href: "/clients", icon: Users, adminOnly: true },
      { name: "Artículos", href: "/articles", icon: ShoppingBag, adminOnly: true },
    ],
  },
  {
    label: "Finanzas",
    adminOnly: true,
    items: [
      { name: "Compras", href: "/purchases", icon: Package },
      { name: "Gastos", href: "/expenses", icon: Receipt },
      { name: "Resumen", href: "/finances", icon: DollarSign },
    ],
  },
  {
    label: "Administración",
    adminOnly: true,
    items: [
      { name: "Equipo", href: "/team", icon: UsersRound },
    ],
  },
];

export function Sidebar({ userRole }: { userRole: UserRole }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = userRole === "admin";

  const filteredGroups = navGroups
    .filter((group) => !group.adminOnly || isAdmin)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.adminOnly || isAdmin),
    }))
    .filter((group) => group.items.length > 0);

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Scissors className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground tracking-wide">ROIA</h1>
          <p className="text-[10px] text-sidebar-foreground/40 uppercase tracking-widest leading-none">Gestión Textil</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
        {filteredGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/30">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-sidebar-primary/15 text-sidebar-primary"
                        : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="h-4.5 w-4.5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <p className="text-[11px] text-sidebar-foreground/25 text-center">
          Roia © 2026
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 shadow-2xl transform transition-transform duration-200 ease-in-out md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col shadow-xl">
        <SidebarContent />
      </aside>
    </>
  );
}
