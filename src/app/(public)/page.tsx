import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RoomCard } from "@/components/features/rooms/room-card";
import { ContactForm } from "@/components/features/home/contact-form";
import { getFeaturedRooms } from "@/lib/data/rooms";
import { getTestimonials } from "@/lib/data/testimonials";

const services = [
  { title: "Petit-déjeuner inclus", description: "Buffet frais servi chaque matin de 7h à 11h." },
  { title: "Wi-Fi haut débit", description: "Connexion gratuite et illimitée dans tout l'établissement." },
  { title: "Réception 24h/24", description: "Une équipe disponible à toute heure pour vous accueillir." },
  { title: "Parking sécurisé", description: "Stationnement privé et surveillé sur place." },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
];

export default async function HomePage() {
  const [featuredRooms, testimonials] = await Promise.all([
    getFeaturedRooms(3),
    getTestimonials(3),
  ]);

  return (
    <div>
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#1F3864] text-white">
        <Image
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600"
          alt="Vue de l'hôtel Reservia"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Votre séjour commence ici
          </h1>
          <p className="mt-4 text-lg text-white/90">
            Découvrez nos chambres et suites, réservez en quelques clics et vivez une
            expérience hôtelière sur mesure.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" render={<Link href="/chambres" />}>
              Voir les chambres
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white hover:bg-white/20"
              render={<Link href="/contact" />}
            >
              Nous contacter
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold">Bienvenue chez Reservia</h2>
            <p className="mt-4 text-muted-foreground">
              Au cœur de la ville, Reservia vous accueille dans un cadre élégant et
              chaleureux. Que vous voyagiez pour affaires ou pour le plaisir, notre équipe
              met tout en œuvre pour rendre votre séjour mémorable.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {galleryImages.map((src) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-lg">
                <Image src={src} alt="Photo de l'hôtel" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold">Nos services</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card key={service.title}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {featuredRooms.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Chambres en vedette</h2>
            <Button variant="ghost" render={<Link href="/chambres" />}>
              Voir tout le catalogue →
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-3xl font-bold">Ce que disent nos clients</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="pt-6">
                    <div className="flex gap-0.5 text-amber-500">
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
                    <p className="mt-4 text-sm font-semibold">{testimonial.authorName}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="mx-auto max-w-2xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">Une question ?</h2>
        <p className="mt-2 text-center text-muted-foreground">
          Contactez-nous, notre équipe vous répond dans les meilleurs délais.
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
