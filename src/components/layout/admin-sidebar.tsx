"use client";

import { useState } from "react";
import Image from "next/image";
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
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/chambres", label: "Chambres", icon: BedDouble },
  { href: "/admin/reservations", label: "Réservations", icon: CalendarCheck },
  { href: "/admin/tables", label: "Tables restaurant", icon: Martini },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-1 p-4">
      {links.map((link) => {
        const isActive =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-olive text-olive-foreground"
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
        onClick={onNavigate}
        className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Home className="h-4 w-4" />
        Retour au site
      </Link>
    </nav>
  );
}

function AdminBrand() {
  return (
    <>
      <Image src="/logo-mark.png" alt="Restovio" width={28} height={28} className="h-7 w-7" />
      <span className="font-heading text-lg font-semibold tracking-wide">
        Restovio <span className="text-muted-foreground font-normal">Admin</span>
      </span>
    </>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Barre mobile */}
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <AdminBrand />
        </Link>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <AdminBrand />
              </SheetTitle>
            </SheetHeader>
            <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-border bg-card md:block">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <AdminBrand />
          </Link>
        </div>
        <NavLinks pathname={pathname} />
      </aside>
    </>
  );
}
