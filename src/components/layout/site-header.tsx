"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

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

  async function handleSignOut() {
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

        <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
}
