import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "@/components/icons/social-icons";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com/reservia.hotel",
    icon: FacebookIcon,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/reservia.hotel",
    icon: InstagramIcon,
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@reservia.hotel",
    icon: TiktokIcon,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@reservia.hotel",
    icon: YoutubeIcon,
  },
];

const partners = [
  "Air Voyage",
  "CityPass Découverte",
  "Prestige Auto Location",
  "Le Comptoir Gourmand",
  "SpaZen Bien-être",
];

const HOTEL_ADDRESS = "12 rue des Voyageurs, 75000 Paris";
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(HOTEL_ADDRESS)}`;
const OSM_EMBED_URL =
  "https://www.openstreetmap.org/export/embed.html?bbox=2.3372%2C48.8486%2C2.3672%2C48.8646&layer=mapnik&marker=48.8566%2C2.3522";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Image src="/logo-mark.png" alt="Reservia" width={28} height={28} className="h-7 w-7" />
            <p className="text-lg font-bold">Reservia</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Un séjour d&apos;exception commence par une réservation simple et fiable.
          </p>

          <p className="mt-5 text-sm font-semibold">Suivez-nous</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Actualités, offres et coulisses de l&apos;hôtel sur nos réseaux.
          </p>
          <div className="mt-3 flex items-center gap-3">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="text-foreground/70 transition-colors hover:text-foreground"
              >
                <social.icon className="h-6 w-6" />
              </Link>
            ))}
          </div>
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
              <Link href="/restaurant" className="hover:text-foreground">
                Restaurant
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
            <li>{HOTEL_ADDRESS}</li>
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

      <div className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-sm font-semibold">Nous trouver</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-lg border">
              <iframe
                title="Localisation de l'hôtel Reservia"
                src={OSM_EMBED_URL}
                className="h-56 w-full"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm text-muted-foreground">{HOTEL_ADDRESS}</p>
              <Link
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                <MapPin className="h-4 w-4" />
                Ouvrir dans Google Maps
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Nos partenaires
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {partners.map((partner) => (
              <span
                key={partner}
                className="text-sm font-medium text-muted-foreground/70 grayscale transition hover:text-muted-foreground hover:grayscale-0"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Reservia. Tous droits réservés.
      </div>
    </footer>
  );
}
