import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Coffee,
  Wifi,
  Clock,
  CircleParking,
  Car,
  Clapperboard,
  Waves,
  UtensilsCrossed,
  Sparkles,
  Award,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RoomCard } from "@/components/features/rooms/room-card";
import { ContactForm } from "@/components/features/home/contact-form";
import { FadeIn } from "@/components/features/home/fade-in";
import { BookingSearchWidget } from "@/components/features/home/booking-search-widget";
import { GalleryLightbox } from "@/components/features/home/gallery-lightbox";
import { getFeaturedRooms } from "@/lib/data/rooms";
import { getTestimonials } from "@/lib/data/testimonials";

// Contenu peu volatile (chambres en vedette, témoignages) : revalidation périodique
// plutôt que du contenu statique figé au build, pour éviter les données obsolètes.
export const revalidate = 60;

const highlights = [
  {
    icon: Award,
    title: "Une adresse d'exception",
    description: "Un établissement pensé dans les moindres détails, au cœur de Florence.",
  },
  {
    icon: Sparkles,
    title: "Un art de recevoir",
    description: "Un service attentif et discret, inspiré des plus belles maisons italiennes.",
  },
  {
    icon: HeartHandshake,
    title: "Une réservation sereine",
    description: "Disponibilité vérifiée en temps réel et acompte de 50 % seulement.",
  },
];

const services = [
  {
    icon: Coffee,
    title: "Petit-déjeuner italien",
    description: "Buffet artisanal offert à tous les clients, servi chaque matin de 7h à 11h.",
  },
  {
    icon: Waves,
    title: "Piscines adultes & enfants",
    description: "Un bassin adultes et un bassin dédié aux enfants, en accès libre.",
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurant gastronomique",
    description: "Une cuisine italienne raffinée et une table réservable vue piscine.",
  },
  {
    icon: Clapperboard,
    title: "Salle de cinéma",
    description: "Séance ouverte à tous les clients chaque vendredi soir.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi haut débit",
    description: "Connexion gratuite et illimitée dans tout l'établissement.",
  },
  {
    icon: CircleParking,
    title: "Parking sécurisé",
    description: "Stationnement privé et surveillé sur place.",
  },
  {
    icon: Clock,
    title: "Réception 24h/24",
    description: "Une équipe disponible à toute heure pour vous accueillir.",
  },
  {
    icon: Car,
    title: "Chauffeur pour vos sorties",
    description: "Disponible pour vos excursions ; tarif négocié directement sans véhicule personnel.",
  },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
  "https://images.unsplash.com/photo-1769490315508-4fe59170e879?w=800",
  "https://images.unsplash.com/photo-1763992108708-59021431508f?w=800",
];

export default async function HomePage() {
  const [featuredRooms, testimonials] = await Promise.all([
    getFeaturedRooms(3),
    getTestimonials(3),
  ]);

  return (
    <div>
      {/* HERO + moteur de réservation */}
      <section className="relative -mt-20 flex min-h-[92vh] flex-col items-center justify-center overflow-hidden bg-foreground text-ivory">
        <Image
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920"
          alt="Vue de l'hôtel Restovio à Florence"
          fill
          priority
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/30 to-foreground/10" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 pt-24 text-center">
          <FadeIn>
            <p className="font-heading text-sm tracking-[0.3em] text-gold uppercase">
              Restovio · Firenze
            </p>
            <h1 className="mt-4 font-heading text-5xl font-medium tracking-tight sm:text-7xl">
              Votre séjour commence ici
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ivory/85">
              Une adresse intimiste au cœur de Florence, où chaque détail est pensé pour
              votre confort.
            </p>
          </FadeIn>
        </div>

        <div className="relative z-10 mt-12 w-full px-4 pb-16 sm:pb-10">
          <FadeIn delay={0.15}>
            <BookingSearchWidget />
          </FadeIn>
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 sm:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="text-center">
              <item.icon className="mx-auto h-7 w-7 text-olive" />
              <h3 className="mt-4 font-heading text-lg font-medium">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chambres en vedette */}
      {featuredRooms.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-olive uppercase">
                Nos chambres
              </p>
              <h2 className="mt-2 font-heading text-3xl font-medium">Un confort sur mesure</h2>
            </div>
            <Button variant="ghost" className="hidden sm:inline-flex" render={<Link href="/chambres" />}>
              Voir tout le catalogue →
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
          <Button
            variant="ghost"
            className="mt-8 flex w-full justify-center sm:hidden"
            render={<Link href="/chambres" />}
          >
            Voir tout le catalogue →
          </Button>
        </section>
      )}

      {/* Services */}
      <section className="bg-secondary/60 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <p className="text-xs font-medium tracking-[0.2em] text-olive uppercase">L'expérience</p>
            <h2 className="mt-2 font-heading text-3xl font-medium">Nos services</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card key={service.title} className="border-border/60">
                <CardContent className="pt-6">
                  <service.icon className="h-6 w-6 text-olive" />
                  <h3 className="mt-3 font-heading text-base font-medium">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bienvenue */}
      <section className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-xs font-medium tracking-[0.2em] text-olive uppercase">
          L&apos;établissement
        </p>
        <h2 className="mt-2 font-heading text-3xl font-medium">Bienvenue chez Restovio</h2>
        <p className="mt-4 text-muted-foreground">
          Au cœur de Florence, à quelques pas du Ponte Vecchio, Restovio vous accueille dans
          un cadre élégant inspiré des plus belles maisons italiennes. Que vous voyagiez pour
          affaires ou pour le plaisir, notre équipe met tout en œuvre pour rendre votre
          séjour mémorable.
        </p>
        <Button
          className="mt-6 bg-olive text-olive-foreground hover:bg-olive/85"
          render={<Link href="/a-propos" />}
        >
          Découvrir Restovio
        </Button>
      </section>

      {/* Galerie */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="text-center">
          <p className="text-xs font-medium tracking-[0.2em] text-olive uppercase">Galerie</p>
          <h2 className="mt-2 font-heading text-3xl font-medium">L&apos;esprit Restovio</h2>
        </div>
        <div className="mt-10">
          <GalleryLightbox images={galleryImages} />
        </div>
      </section>

      {/* Restaurant */}
      <section className="bg-foreground py-20 text-ivory">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center">
          <div className="relative aspect-video overflow-hidden rounded-lg md:order-2">
            <Image
              src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1000"
              alt="Restaurant de l'hôtel Restovio"
              fill
              className="object-cover"
            />
          </div>
          <div className="md:order-1">
            <p className="text-xs font-medium tracking-[0.2em] text-gold uppercase">Ristorante</p>
            <h2 className="mt-2 font-heading text-3xl font-medium">Une table gastronomique</h2>
            <p className="mt-4 text-ivory/80">
              Une cuisine italienne raffinée pensée par notre chef, et une table réservable
              pour vos dîners en famille avec vue sur la piscine.
            </p>
            <Button className="mt-6 bg-gold text-foreground hover:bg-gold/85" render={<Link href="/restaurant" />}>
              Découvrir le restaurant
            </Button>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center">
            <p className="text-xs font-medium tracking-[0.2em] text-olive uppercase">Avis</p>
            <h2 className="mt-2 font-heading text-3xl font-medium">Ce que disent nos hôtes</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-border/60">
                <CardContent className="pt-6">
                  <div className="flex gap-0.5 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4"
                        fill={i < testimonial.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <p className="mt-4 font-heading text-sm font-medium">{testimonial.authorName}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="relative overflow-hidden bg-secondary/60 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-heading text-3xl font-medium">Une question avant de réserver ?</h2>
          <p className="mt-2 text-muted-foreground">
            Notre équipe vous répond dans les meilleurs délais.
          </p>
          <div className="mt-8 text-left">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
