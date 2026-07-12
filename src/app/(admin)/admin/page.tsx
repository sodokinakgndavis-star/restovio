import Link from "next/link";
import { BedDouble, CalendarCheck, Users, TrendingUp, DoorOpen, DoorClosed } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/features/bookings/booking-status-badge";
import { RevenueChart } from "@/components/features/admin/revenue-chart";
import { getDashboardStats } from "@/lib/data/dashboard";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Tableau de bord" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Chambres au total", value: stats.totalRooms, icon: BedDouble },
    { label: "Chambres occupées (aujourd'hui)", value: stats.occupiedRooms, icon: DoorClosed },
    { label: "Chambres disponibles (aujourd'hui)", value: stats.availableRooms, icon: DoorOpen },
    { label: "Réservations du jour", value: stats.bookingsToday, icon: CalendarCheck },
    { label: "Réservations du mois", value: stats.bookingsMonth, icon: CalendarCheck },
    { label: "Clients inscrits", value: stats.totalClients, icon: Users },
  ];

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-full bg-primary/10 p-3">
                <card.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-primary/10 p-3">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatPrice(stats.simulatedRevenue)}</p>
              <p className="text-sm text-muted-foreground">Chiffre d&apos;affaires simulé</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Réservations et revenus (30 derniers jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={stats.chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Réservations récentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recentBookings.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune réservation pour le moment.</p>
            )}
            {stats.recentBookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/admin/reservations?search=${encodeURIComponent(booking.user.name)}`}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted"
              >
                <div>
                  <p className="font-medium">{booking.room.name}</p>
                  <p className="text-xs text-muted-foreground">{booking.user.name}</p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
