import { prisma } from "@/lib/prisma";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { startOfDay, endOfDay, startOfMonth, endOfMonth, subDays, format } from "date-fns";

const TIMEZONE = "Europe/Paris";

function parisDayRange(date: Date) {
  const zoned = toZonedTime(date, TIMEZONE);
  return {
    start: fromZonedTime(startOfDay(zoned), TIMEZONE),
    end: fromZonedTime(endOfDay(zoned), TIMEZONE),
  };
}

function parisMonthRange(date: Date) {
  const zoned = toZonedTime(date, TIMEZONE);
  return {
    start: fromZonedTime(startOfMonth(zoned), TIMEZONE),
    end: fromZonedTime(endOfMonth(zoned), TIMEZONE),
  };
}

export async function getDashboardStats() {
  const now = new Date();
  const { start: todayStart, end: todayEnd } = parisDayRange(now);
  const { start: monthStart, end: monthEnd } = parisMonthRange(now);

  const [
    totalRooms,
    occupiedRoomsRaw,
    bookingsToday,
    bookingsMonth,
    totalClients,
    revenueAgg,
    recentBookings,
  ] = await Promise.all([
    prisma.room.count(),
    prisma.booking.findMany({
      where: {
        status: { in: ["PENDING", "CONFIRMED"] },
        checkIn: { lte: now },
        checkOut: { gt: now },
      },
      select: { roomId: true },
      distinct: ["roomId"],
    }),
    prisma.booking.count({ where: { createdAt: { gte: todayStart, lte: todayEnd } } }),
    prisma.booking.count({ where: { createdAt: { gte: monthStart, lte: monthEnd } } }),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.booking.aggregate({
      where: { status: "CONFIRMED" },
      _sum: { totalPrice: true },
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        room: { select: { name: true } },
        user: { select: { name: true } },
      },
    }),
  ]);

  const occupiedRooms = occupiedRoomsRaw.length;

  // Agrégation des 30 derniers jours pour le graphique réservations/revenus.
  const rangeStart = subDays(now, 29);
  const confirmedBookingsInRange = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      createdAt: { gte: startOfDay(rangeStart) },
    },
    select: { createdAt: true, totalPrice: true },
  });

  const dailyMap = new Map<string, { revenue: number; count: number }>();
  for (let i = 0; i < 30; i++) {
    const day = subDays(now, 29 - i);
    dailyMap.set(format(day, "yyyy-MM-dd"), { revenue: 0, count: 0 });
  }
  for (const booking of confirmedBookingsInRange) {
    const key = format(booking.createdAt, "yyyy-MM-dd");
    const entry = dailyMap.get(key);
    if (entry) {
      entry.revenue += booking.totalPrice;
      entry.count += 1;
    }
  }

  const chartData = Array.from(dailyMap.entries()).map(([date, values]) => ({
    date: format(new Date(date), "dd/MM"),
    revenue: values.revenue / 100,
    reservations: values.count,
  }));

  return {
    totalRooms,
    occupiedRooms,
    availableRooms: totalRooms - occupiedRooms,
    bookingsToday,
    bookingsMonth,
    totalClients,
    simulatedRevenue: revenueAgg._sum.totalPrice ?? 0,
    chartData,
    recentBookings,
  };
}
