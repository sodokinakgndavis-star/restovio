import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="text-lg font-bold">Reservia</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Un séjour d&apos;exception commence par une réservation simple et fiable.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Navigation</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/chambres" className="hover:text-foreground">
                Nos chambres
              </Link>
            </li>
            <li>
              <Link href="/a-propos" className="hover:text-foreground">
                À propos
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Coordonnées</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>12 rue des Voyageurs, 75000 Paris</li>
            <li>+33 1 23 45 67 89</li>
            <li>contact@reservia.app</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Horaires de la réception</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Lundi – Dimanche</li>
            <li>7h00 – 22h00</li>
          </ul>
        </div>
      </div>

      <div className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Reservia. Tous droits réservés.
      </div>
    </footer>
  );
}
