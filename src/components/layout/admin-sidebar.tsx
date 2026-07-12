"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
  Home,
  UtensilsCrossed,
  Martini,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/chambres", label: "Chambres", icon: BedDouble },
  { href: "/admin/reservations", label: "Réservations", icon: CalendarCheck },
  { href: "/admin/tables", label: "Tables restaurant", icon: Martini },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-muted/20 md:block">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="text-lg font-bold">
          Reservia <span className="text-muted-foreground font-normal">Admin</span>
        </Link>
      </div>
      <nav className="space-y-1 p-4">
        {links.map((link) => {
          const isActive =
            link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Home className="h-4 w-4" />
          Retour au site
        </Link>
      </nav>
    </aside>
  );
}
