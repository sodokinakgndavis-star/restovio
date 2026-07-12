import { prisma } from "@/lib/prisma";
import type { Prisma, BookingStatus } from "@prisma/client";

export function computeNights(checkIn: Date, checkOut: Date) {
  const msPerNight = 1000 * 60 * 60 * 24;
  const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / msPerNight);
  return Math.max(1, nights);
}

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
