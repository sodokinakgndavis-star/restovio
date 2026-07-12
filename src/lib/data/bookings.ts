import { prisma } from "@/lib/prisma";
import type { Prisma, BookingStatus } from "@prisma/client";

export {
  DEPOSIT_RATIO,
  REFUND_WINDOW_HOURS,
  LONG_STAY_MIN_NIGHTS,
  LONG_STAY_DISCOUNT_RATIO,
  computeNights,
  isLongStay,
  computeTotalPrice,
  computeDeposit,
  computeRefundDueDate,
} from "@/lib/pricing";

export async function getBookingsByUser(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: { room: { select: { id: true, name: true, images: true, price: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      room: { select: { id: true, name: true, images: true, price: true, capacity: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

export type AdminBookingFilters = {
  status?: BookingStatus;
  search?: string;
  date?: string;
  page?: number;
  pageSize?: number;
};

export async function getBookingsForAdmin(filters: AdminBookingFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? 15;

  const where: Prisma.BookingWhereInput = {};
  if (filters.status) where.status = filters.status;
  if (filters.search) {
    where.OR = [
      { user: { name: { contains: filters.search, mode: "insensitive" } } },
      { user: { email: { contains: filters.search, mode: "insensitive" } } },
      { room: { name: { contains: filters.search, mode: "insensitive" } } },
    ];
  }
  if (filters.date) {
    const day = new Date(filters.date);
    if (!isNaN(day.getTime())) {
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      // Réservations dont le séjour couvre la date sélectionnée.
      where.checkIn = { lt: nextDay };
      where.checkOut = { gt: day };
    }
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        room: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.booking.count({ where }),
  ]);

  return { bookings, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}
