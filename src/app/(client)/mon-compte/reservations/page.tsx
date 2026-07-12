import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBookingsByUser } from "@/lib/data/bookings";
import { BookingStatusBadge } from "@/components/features/bookings/booking-status-badge";
import { CancelBookingButton } from "@/components/features/bookings/cancel-booking-button";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Mes réservations" };

function canCancel(status: string, checkIn: Date) {
  return (status === "PENDING" || status === "CONFIRMED") && new Date(checkIn) >= new Date();
}

export default async function MesReservationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const bookings = await getBookingsByUser(session.user.id);

  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <p className="font-medium">Vous n&apos;avez pas encore de réservation.</p>
        <Button className="mt-4" render={<Link href="/chambres" />}>
          Découvrir nos chambres
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="flex flex-col gap-4 rounded-lg border bg-background p-4 sm:flex-row sm:items-center"
        >
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded bg-muted">
            {booking.room.images[0] && (
              <Image src={booking.room.images[0]} alt="" fill className="object-cover" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Link href={`/mon-compte/reservations/${booking.id}`} className="font-semibold hover:underline">
                {booking.room.name}
              </Link>
              <BookingStatusBadge status={booking.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Du {new Date(booking.checkIn).toLocaleDateString("fr-FR")} au{" "}
              {new Date(booking.checkOut).toLocaleDateString("fr-FR")} — {booking.guests} pers.
            </p>
            <p className="mt-1 text-sm font-medium">{formatPrice(booking.totalPrice)}</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              render={<Link href={`/mon-compte/reservations/${booking.id}`} />}
            >
              Détail
            </Button>
            {canCancel(booking.status, booking.checkIn) && (
              <CancelBookingButton bookingId={booking.id} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
