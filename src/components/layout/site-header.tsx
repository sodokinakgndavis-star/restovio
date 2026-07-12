"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/chambres", label: "Chambres" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    setMobileOpen(false);
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Reservia
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                pathname === link.href ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {status === "authenticated" && session.user ? (
            <>
              {session.user.role === "ADMIN" && (
                <Button variant="ghost" size="sm" render={<Link href="/admin" />}>
                  Administration
                </Button>
              )}
              <Button variant="ghost" size="sm" render={<Link href="/mon-compte" />}>
                Mon compte
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Déconnexion
              </Button>
            </>
          ) : status === "loading" ? null : (
            <>
              <Button variant="ghost" size="sm" render={<Link href="/connexion" />}>
                Connexion
              </Button>
              <Button size="sm" render={<Link href="/inscription" />}>
                Inscription
              </Button>
            </>
          )}
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Reservia</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-2 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-2 flex flex-col gap-2 border-t p-4">
              {status === "authenticated" && session.user ? (
                <>
                  {session.user.role === "ADMIN" && (
                    <Button
                      variant="outline"
                      render={<Link href="/admin" onClick={() => setMobileOpen(false)} />}
                    >
                      Administration
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    render={<Link href="/mon-compte" onClick={() => setMobileOpen(false)} />}
                  >
                    Mon compte
                  </Button>
                  <Button onClick={handleSignOut}>Déconnexion</Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    render={<Link href="/connexion" onClick={() => setMobileOpen(false)} />}
                  >
                    Connexion
                  </Button>
                  <Button render={<Link href="/inscription" onClick={() => setMobileOpen(false)} />}>
                    Inscription
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
