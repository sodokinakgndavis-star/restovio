"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
  { href: "/restaurant", label: "Restaurant" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    if (!isHome) return;
    function onScroll() {
      setScrolled(window.scrollY > 48);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  async function handleSignOut() {
    setMobileOpen(false);
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }

  const linkColor = transparent
    ? "text-ivory/85 hover:text-ivory"
    : "text-foreground/70 hover:text-foreground";
  const linkColorActive = transparent ? "text-ivory" : "text-foreground";
  const ghostBtn = transparent
    ? "text-ivory hover:bg-white/10 hover:text-ivory"
    : "text-foreground/80 hover:bg-muted hover:text-foreground";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src={transparent ? "/logo-mark-light.png" : "/logo-mark.png"}
            alt="Restovio"
            width={34}
            height={34}
            className="h-8 w-8 transition-opacity duration-300"
            priority
          />
          <span
            className={`font-heading text-xl font-semibold tracking-wide transition-colors duration-300 ${
              transparent ? "text-ivory" : "text-foreground"
            }`}
          >
            Restovio
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13px] font-medium tracking-wide uppercase transition-colors ${
                pathname === link.href ? linkColorActive : linkColor
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
                <Button
                  variant="ghost"
                  size="sm"
                  className={ghostBtn}
                  render={<Link href="/admin" />}
                >
                  Administration
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className={ghostBtn}
                render={<Link href="/mon-compte" />}
              >
                Mon compte
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={ghostBtn}
                onClick={handleSignOut}
              >
                Déconnexion
              </Button>
            </>
          ) : status === "loading" ? null : (
            <Button variant="ghost" size="sm" className={ghostBtn} render={<Link href="/connexion" />}>
              Connexion
            </Button>
          )}
          <Button
            size="sm"
            className="bg-olive text-olive-foreground hover:bg-olive/85"
            render={<Link href="/chambres" />}
          >
            Réserver
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            size="sm"
            className="bg-olive text-olive-foreground hover:bg-olive/85"
            render={<Link href="/chambres" />}
          >
            Réserver
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className={ghostBtn}>
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Image src="/logo-mark.png" alt="Restovio" width={28} height={28} className="h-7 w-7" />
                  Restovio
                </SheetTitle>
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
      </div>
    </header>
  );
}
