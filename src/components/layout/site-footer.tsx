import Image from "next/image";
import Link from "next/link";
import { MapPin, ShieldCheck, RefreshCcw, BadgePercent, Clock } from "lucide-react";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "@/components/icons/social-icons";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com/restovio.hotel",
    icon: FacebookIcon,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/restovio.hotel",
    icon: InstagramIcon,
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@restovio.hotel",
    icon: TiktokIcon,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@restovio.hotel",
    icon: YoutubeIcon,
  },
];

const badges = [
  { icon: ShieldCheck, label: "Réservation sécurisée" },
  { icon: RefreshCcw, label: "Annulation flexible" },
  { icon: BadgePercent, label: "Meilleur tarif garanti" },
  { icon: Clock, label: "Support 7j/7" },
];

const legalLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Politique de confidentialité" },
  { href: "/cgu", label: "Conditions générales" },
  { href: "/politique-annulation", label: "Politique d'annulation" },
];

const HOTEL_ADDRESS = "Via della Riviera 24, 50122 Firenze, Italia";
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(HOTEL_ADDRESS)}`;
const OSM_EMBED_URL =
  "https://www.openstreetmap.org/export/embed.html?bbox=11.2408%2C43.7616%2C11.2708%2C43.7776&layer=mapnik&marker=43.7696%2C11.2558";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="border-b border-border/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-3">
              <badge.icon className="h-5 w-5 shrink-0 text-olive" />
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Image src="/logo-mark.png" alt="Restovio" width={28} height={28} className="h-7 w-7" />
            <p className="font-heading text-lg font-medium">Restovio</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Un séjour d&apos;exception au cœur de Florence.
          </p>

          <p className="mt-5 text-sm font-semibold">Suivez-nous</p>
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
            <li>+39 055 123 4567</li>
            <li>contact@restovio.app</li>
          </ul>
          <p className="mt-5 text-sm font-semibold">Réception</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Lundi – Dimanche · 7h00 – 22h00</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Informations</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-sm font-semibold">Nous trouver</p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div className="overflow-hidden rounded-lg border border-border/60">
              <iframe
                title="Localisation de l'hôtel Restovio"
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
                className="mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground underline underline-offset-4 hover:text-olive"
              >
                <MapPin className="h-4 w-4" />
                Ouvrir dans Google Maps
              </Link>

              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                <li>Ponte Vecchio — 6 min à pied</li>
                <li>Duomo di Firenze — 10 min à pied</li>
                <li>Gare de Firenze Santa Maria Novella — 12 min à pied</li>
                <li>Aéroport de Florence (A. Vespucci) — 20 min en voiture</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Restovio. Tous droits réservés.
      </div>
    </footer>
  );
}
