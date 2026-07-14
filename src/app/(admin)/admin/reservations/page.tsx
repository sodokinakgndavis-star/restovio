import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookingStatusBadge } from "@/components/features/bookings/booking-status-badge";
import { BookingActions } from "@/components/features/admin/booking-actions";
import { BookingFilters } from "@/components/features/admin/booking-filters";
import { getBookingsForAdmin } from "@/lib/data/bookings";
import { formatPrice, refundStatusLabels } from "@/lib/format";
import type { BookingStatus } from "@prisma/client";

export const metadata = { title: "Gestion des réservations" };
export const dynamic = "force-dynamic";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "REFUSED", "CANCELLED", "PAID"];

// Onglets rapides du tableau de bord admin (section 8 du cahier des charges
// d'évolution) : Toutes, En attente, Validées, Refusées, Payées.
const STATUS_TABS: { label: string; status?: BookingStatus }[] = [
  { label: "Toutes" },
  { label: "En attente", status: "PENDING" },
  { label: "Validées", status: "CONFIRMED" },
  { label: "Refusées", status: "REFUSED" },
  { label: "Payées", status: "PAID" },
];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; date?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status =
    params.status && VALID_STATUSES.includes(params.status)
      ? (params.status as BookingStatus)
      : undefined;

  const { bookings, total } = await getBookingsForAdmin({
    search: params.search,
    status,
    date: params.date,
    page: params.page ? Number(params.page) : 1,
  });

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold">Réservations</h1>
      <p className="text-sm text-muted-foreground">{total} réservation(s)</p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {STATUS_TABS.map((tab) => {
          const isActive = status === tab.status;
          const href = tab.status
            ? `/admin/reservations?status=${tab.status}`
            : "/admin/reservations";
          return (
            <Link
              key={tab.label}
              href={href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-olive text-olive-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-4">
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
                <TableHead>Remboursement</TableHead>
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
                    {booking.refundStatus !== "NOT_APPLICABLE" && (
                      <Badge variant={booking.refundStatus === "PENDING" ? "secondary" : "default"}>
                        {refundStatusLabels[booking.refundStatus]}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/reservations/${booking.id}`}
                        className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                      >
                        Détail
                      </Link>
                      <BookingActions
                        bookingId={booking.id}
                        status={booking.status}
                        refundStatus={booking.refundStatus}
                      />
                    </div>
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
