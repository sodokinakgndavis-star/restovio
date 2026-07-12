import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BookingStatusBadge } from "@/components/features/bookings/booking-status-badge";
import { BookingActions } from "@/components/features/admin/booking-actions";
import { getBookingById } from "@/lib/data/bookings";
import { formatPrice, refundStatusLabels } from "@/lib/format";

export const metadata = { title: "Détail de la réservation" };

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBookingById(id);

  if (!booking) notFound();

  return (
    <div className="p-6 md:p-10">
      <Link
        href="/admin/reservations"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux réservations
      </Link>

      <div className="mt-4 flex flex-col gap-6 rounded-lg border bg-background p-6 sm:flex-row">
        <div className="relative h-40 w-full shrink-0 overflow-hidden rounded sm:w-56">
          {booking.room.images[0] && (
            <Image src={booking.room.images[0]} alt="" fill className="object-cover" />
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold">{booking.room.name}</h1>
            <BookingStatusBadge status={booking.status} />
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Client</dt>
              <dd className="font-medium">{booking.user.name}</dd>
              <dd className="text-xs text-muted-foreground">{booking.user.email}</dd>
            </div>
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
              <dt className="text-muted-foreground">Capacité de la chambre</dt>
              <dd>{booking.room.capacity} personne(s)</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Prix total</dt>
              <dd className="font-semibold">{formatPrice(booking.totalPrice)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Acompte (50 %)</dt>
              <dd>{formatPrice(booking.depositAmount)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Solde sur place</dt>
              <dd>{formatPrice(booking.totalPrice - booking.depositAmount)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Créée le</dt>
              <dd>{new Date(booking.createdAt).toLocaleString("fr-FR")}</dd>
            </div>
            {booking.refundStatus !== "NOT_APPLICABLE" && (
              <div>
                <dt className="text-muted-foreground">Remboursement</dt>
                <dd>
                  {refundStatusLabels[booking.refundStatus]}
                  {booking.refundStatus === "PENDING" && booking.refundDueAt && (
                    <span className="block text-xs text-muted-foreground">
                      Avant le {new Date(booking.refundDueAt).toLocaleString("fr-FR")}
                    </span>
                  )}
                </dd>
              </div>
            )}
          </dl>

          {booking.comment && (
            <div>
              <p className="text-sm text-muted-foreground">Commentaire</p>
              <p className="text-sm">{booking.comment}</p>
            </div>
          )}

          <div className="pt-2">
            <BookingActions
              bookingId={booking.id}
              status={booking.status}
              refundStatus={booking.refundStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
