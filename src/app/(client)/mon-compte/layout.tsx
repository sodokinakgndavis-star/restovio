import Link from "next/link";

export default function MonCompteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold">Mon compte</h1>
      <nav className="mt-4 flex gap-4 border-b text-sm font-medium">
        <Link href="/mon-compte" className="border-b-2 border-transparent px-1 pb-3 hover:border-foreground">
          Profil
        </Link>
        <Link
          href="/mon-compte/reservations"
          className="border-b-2 border-transparent px-1 pb-3 hover:border-foreground"
        >
          Mes réservations
        </Link>
        <Link
          href="/mon-compte/tables"
          className="border-b-2 border-transparent px-1 pb-3 hover:border-foreground"
        >
          Mes tables
        </Link>
      </nav>
      <div className="mt-8">{children}</div>
    </div>
  );
}
