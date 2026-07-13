import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function MonCompteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 pt-20">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <p className="text-xs font-medium tracking-[0.2em] text-olive uppercase">Restovio</p>
          <h1 className="mt-2 font-heading text-3xl font-medium">Mon compte</h1>
          <nav className="mt-6 flex gap-6 border-b border-border/60 text-sm font-medium">
            <Link
              href="/mon-compte"
              className="border-b-2 border-transparent px-1 pb-3 text-muted-foreground hover:border-olive hover:text-foreground"
            >
              Profil
            </Link>
            <Link
              href="/mon-compte/reservations"
              className="border-b-2 border-transparent px-1 pb-3 text-muted-foreground hover:border-olive hover:text-foreground"
            >
              Mes réservations
            </Link>
            <Link
              href="/mon-compte/tables"
              className="border-b-2 border-transparent px-1 pb-3 text-muted-foreground hover:border-olive hover:text-foreground"
            >
              Mes tables
            </Link>
          </nav>
          <div className="mt-8">{children}</div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
