import { prisma } from "@/lib/prisma";
import type { Prisma, BookingStatus } from "@prisma/client";

export async function getTableReservationsByUser(userId: string) {
  return prisma.tableReservation.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
}

export async function getTableReservationById(id: string) {
  return prisma.tableReservation.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export type AdminTableReservationFilters = {
  status?: BookingStatus;
  search?: string;
  date?: string;
  page?: number;
  pageSize?: number;
};

export async function getTableReservationsForAdmin(filters: AdminTableReservationFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? 15;

  const where: Prisma.TableReservationWhereInput = {};
  if (filters.status) where.status = filters.status;
  if (filters.search) {
    where.OR = [
      { user: { name: { contains: filters.search, mode: "insensitive" } } },
      { user: { email: { contains: filters.search, mode: "insensitive" } } },
    ];
  }
  if (filters.date) {
    const day = new Date(filters.date);
    if (!isNaN(day.getTime())) {
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      where.date = { gte: day, lt: nextDay };
    }
  }

  const [reservations, total] = await Promise.all([
    prisma.tableReservation.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.tableReservation.count({ where }),
  ]);

  return {
    reservations,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
