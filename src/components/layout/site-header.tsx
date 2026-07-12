import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/chambres", label: "Chambres" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
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
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" render={<Link href="/connexion" />}>
            Connexion
          </Button>
          <Button size="sm" render={<Link href="/inscription" />}>
            Inscription
          </Button>
        </div>
      </div>
    </header>
  );
}
