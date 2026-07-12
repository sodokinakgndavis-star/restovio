import Image from "next/image";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Badge>{categoryLabels[room.category] ?? room.category}</Badge>
          <h1 className="mt-2 text-3xl font-bold">{room.name}</h1>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
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

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="mt-3 whitespace-pre-line text-muted-foreground">{room.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Équipements</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {room.amenities.map((amenity) => (
                <li key={amenity} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {amenity}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex gap-6 text-sm text-muted-foreground">
            <span>Jusqu&apos;à {room.capacity} personnes</span>
          </div>
        </div>

        <div>
          <div className="sticky top-24 rounded-xl border bg-background p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-2xl font-bold">
                {formatPrice(room.price)}{" "}
                <span className="text-sm font-normal text-muted-foreground">/ nuit</span>
              </p>
              <Badge variant={room.available ? "default" : "secondary"}>
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
