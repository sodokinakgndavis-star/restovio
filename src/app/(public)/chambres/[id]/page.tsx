import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BookingForm } from "@/components/features/bookings/booking-form";
import { getRoomById } from "@/lib/data/rooms";
import { categoryLabels, formatPrice } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = await getRoomById(id);
  return { title: room?.name ?? "Chambre introuvable" };
}

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = await getRoomById(id);

  if (!room) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Badge className="bg-olive text-olive-foreground">
            {categoryLabels[room.category] ?? room.category}
          </Badge>
          <h1 className="mt-3 font-heading text-4xl font-medium">{room.name}</h1>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {room.images.map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden rounded-lg bg-muted ${
                  i === 0 ? "col-span-2 aspect-video sm:col-span-3" : "aspect-square"
                }`}
              >
                <Image src={src} alt={room.name} fill className="object-cover" />
              </div>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="font-heading text-xl font-medium">Description</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
              {room.description}
            </p>
          </div>

          <div className="mt-10">
            <h2 className="font-heading text-xl font-medium">Équipements</h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {room.amenities.map((amenity) => (
                <li key={amenity} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-olive" />
                  {amenity}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-border/60 p-5">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-olive" />
                <h3 className="font-heading text-sm font-medium">Arrivée & départ</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Arrivée à partir de 15h00 · Départ avant 11h00. Jusqu&apos;à{" "}
                {room.capacity} personne(s).
              </p>
            </div>
            <div className="rounded-lg border border-border/60 p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-olive" />
                <h3 className="font-heading text-sm font-medium">Conditions</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Paiement intégral, en ligne et sécurisé, une fois votre demande validée par
                notre équipe. Voir notre{" "}
                <Link href="/politique-annulation" className="underline underline-offset-4 hover:text-foreground">
                  politique d&apos;annulation
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        <div id="reserver">
          <div className="sticky top-24 rounded-xl border border-border/60 bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-heading text-2xl font-medium">
                {formatPrice(room.price)}{" "}
                <span className="text-sm font-normal text-muted-foreground">/ nuit</span>
              </p>
              <Badge variant={room.available ? "default" : "secondary"} className={room.available ? "bg-olive text-olive-foreground" : ""}>
                {room.available ? "Disponible" : "En pause commerciale"}
              </Badge>
            </div>
            <div className="mt-6">
              {room.available ? (
                <BookingForm room={{ id: room.id, price: room.price, capacity: room.capacity }} />
              ) : (
                <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                  Cette chambre n&apos;est pas ouverte à la réservation pour le moment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
