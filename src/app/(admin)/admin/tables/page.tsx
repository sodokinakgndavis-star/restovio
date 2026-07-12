import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookingStatusBadge } from "@/components/features/bookings/booking-status-badge";
import { TableReservationActions } from "@/components/features/admin/table-reservation-actions";
import { BookingFilters } from "@/components/features/admin/booking-filters";
import { getTableReservationsForAdmin } from "@/lib/data/table-reservations";
import type { BookingStatus } from "@prisma/client";

export const metadata = { title: "Réservations de table" };
export const dynamic = "force-dynamic";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED"];

export default async function AdminTablesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; date?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status =
    params.status && VALID_STATUSES.includes(params.status)
      ? (params.status as BookingStatus)
      : undefined;

  const { reservations, total } = await getTableReservationsForAdmin({
    search: params.search,
    status,
    date: params.date,
    page: params.page ? Number(params.page) : 1,
  });

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold">Réservations de table</h1>
      <p className="text-sm text-muted-foreground">{total} réservation(s)</p>

      <div className="mt-6">
        <BookingFilters searchPlaceholder="Rechercher un client…" />
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border bg-background">
        {reservations.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Aucune réservation de table trouvée.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Créneau</TableHead>
                <TableHead>Convives</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    <p className="font-medium">{reservation.user.name}</p>
                    <p className="text-xs text-muted-foreground">{reservation.user.email}</p>
                  </TableCell>
                  <TableCell>{new Date(reservation.date).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>{reservation.time}</TableCell>
                  <TableCell>{reservation.guests}</TableCell>
                  <TableCell>
                    <BookingStatusBadge status={reservation.status} />
                  </TableCell>
                  <TableCell>
                    <TableReservationActions
                      reservationId={reservation.id}
                      status={reservation.status}
                    />
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
