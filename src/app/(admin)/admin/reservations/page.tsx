import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookingStatusBadge } from "@/components/features/bookings/booking-status-badge";
import { BookingActions } from "@/components/features/admin/booking-actions";
import { BookingFilters } from "@/components/features/admin/booking-filters";
import { getBookingsForAdmin } from "@/lib/data/bookings";
import { formatPrice } from "@/lib/format";
import type { BookingStatus } from "@prisma/client";

export const metadata = { title: "Gestion des réservations" };

const VALID_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED"];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status =
    params.status && VALID_STATUSES.includes(params.status)
      ? (params.status as BookingStatus)
      : undefined;

  const { bookings, total } = await getBookingsForAdmin({
    search: params.search,
    status,
    page: params.page ? Number(params.page) : 1,
  });

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold">Réservations</h1>
      <p className="text-sm text-muted-foreground">{total} réservation(s)</p>

      <div className="mt-6">
        <BookingFilters />
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border bg-background">
        {bookings.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">Aucune réservation trouvée.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Chambre</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <p className="font-medium">{booking.user.name}</p>
                    <p className="text-xs text-muted-foreground">{booking.user.email}</p>
                  </TableCell>
                  <TableCell>{booking.room.name}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(booking.checkIn).toLocaleDateString("fr-FR")} →{" "}
                    {new Date(booking.checkOut).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>{formatPrice(booking.totalPrice)}</TableCell>
                  <TableCell>
                    <BookingStatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell>
                    <BookingActions bookingId={booking.id} status={booking.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
