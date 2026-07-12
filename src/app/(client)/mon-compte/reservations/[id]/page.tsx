import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { getBookingById } from "@/lib/data/bookings";
import { BookingStatusBadge } from "@/components/features/bookings/booking-status-badge";
import { CancelBookingButton } from "@/components/features/bookings/cancel-booking-button";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Détail de la réservation" };

function canCancel(status: string, checkIn: Date) {
  return (status === "PENDING" || status === "CONFIRMED") && new Date(checkIn) >= new Date();
}

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const { id } = await params;
  const booking = await getBookingById(id);

  // Contrôle de propriété : un client ne peut consulter que ses propres réservations.
  if (!booking || booking.userId !== session.user.id) notFound();

  return (
    <div>
      <Link
        href="/mon-compte/reservations"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à mes réservations
      </Link>

      <div className="mt-4 flex flex-col gap-6 rounded-lg border bg-background p-6 sm:flex-row">
        <div className="relative h-40 w-full shrink-0 overflow-hidden rounded sm:w-56">
          {booking.room.images[0] && (
            <Image src={booking.room.images[0]} alt="" fill className="object-cover" />
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">{booking.room.name}</h2>
            <BookingStatusBadge status={booking.status} />
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Arrivée</dt>
              <dd>{new Date(booking.checkIn).toLocaleDateString("fr-FR")}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Départ</dt>
              <dd>{new Date(booking.checkOut).toLocaleDateString("fr-FR")}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Voyageurs</dt>
              <dd>{booking.guests} personne(s)</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Prix total</dt>
              <dd className="font-semibold">{formatPrice(booking.totalPrice)}</dd>
            </div>
          </dl>

          {booking.comment && (
            <div>
              <p className="text-sm text-muted-foreground">Commentaire</p>
              <p className="text-sm">{booking.comment}</p>
            </div>
          )}

          {canCancel(booking.status, booking.checkIn) && (
            <div className="pt-2">
              <CancelBookingButton bookingId={booking.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
