import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTableReservationsByUser } from "@/lib/data/table-reservations";
import { BookingStatusBadge } from "@/components/features/bookings/booking-status-badge";
import { CancelTableReservationButton } from "@/components/features/restaurant/cancel-table-reservation-button";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Mes tables" };

function canCancel(status: string, date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (status === "PENDING" || status === "CONFIRMED") && new Date(date) >= today;
}

export default async function MesTablesPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const reservations = await getTableReservationsByUser(session.user.id);

  if (reservations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <p className="font-medium">Vous n&apos;avez pas encore réservé de table.</p>
        <Button className="mt-4" render={<Link href="/restaurant" />}>
          Découvrir le restaurant
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <div
          key={reservation.id}
          className="flex flex-col gap-4 rounded-lg border bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">
                {new Date(reservation.date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                à {reservation.time}
              </p>
              <BookingStatusBadge status={reservation.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {reservation.guests} convive(s)
              {reservation.comment ? ` — ${reservation.comment}` : ""}
            </p>
          </div>

          {canCancel(reservation.status, reservation.date) && (
            <CancelTableReservationButton reservationId={reservation.id} />
          )}
        </div>
      ))}
    </div>
  );
}
