import { prisma } from "@/lib/prisma";
import type { Prisma, RoomCategory } from "@prisma/client";

export type RoomFilters = {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  category?: RoomCategory;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
};

const DEFAULT_PAGE_SIZE = 9;

const roomListSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  price: true,
  capacity: true,
  category: true,
  amenities: true,
  images: true,
  available: true,
} satisfies Prisma.RoomSelect;

export async function getAvailableRoomIds(checkIn: Date, checkOut: Date) {
  const overlappingBookings = await prisma.booking.findMany({
    where: {
      status: { in: ["PENDING", "CONFIRMED"] },
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
    },
    select: { roomId: true },
  });
  return new Set(overlappingBookings.map((b) => b.roomId));
}

export async function getRooms(filters: RoomFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;

  const where: Prisma.RoomWhereInput = {
    available: true,
  };

  if (filters.category) where.category = filters.category;
  if (filters.guests) where.capacity = { gte: filters.guests };
  if (filters.minPrice || filters.maxPrice) {
    where.price = {
      ...(filters.minPrice ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice ? { lte: filters.maxPrice } : {}),
    };
  }

  let excludedIds: Set<string> | null = null;
  if (filters.checkIn && filters.checkOut) {
    const checkIn = new Date(filters.checkIn);
    const checkOut = new Date(filters.checkOut);
    if (!isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime()) && checkOut > checkIn) {
      excludedIds = await getAvailableRoomIds(checkIn, checkOut);
      if (excludedIds.size > 0) {
        where.id = { notIn: Array.from(excludedIds) };
      }
    }
  }

  const [rooms, total] = await Promise.all([
    prisma.room.findMany({
      where,
      select: roomListSelect,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.room.count({ where }),
  ]);

  return {
    rooms,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getFeaturedRooms(limit = 3) {
  return prisma.room.findMany({
    where: { available: true },
    select: roomListSelect,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getRoomById(id: string) {
  return prisma.room.findUnique({ where: { id } });
}

export async function getAllRoomsForAdmin() {
  return prisma.room.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { bookings: { where: { status: { in: ["PENDING", "CONFIRMED"] } } } },
      },
    },
  });
}

export async function isRoomAvailable(
  roomId: string,
  checkIn: Date,
  checkOut: Date,
  excludeBookingId?: string
) {
  const conflict = await prisma.booking.findFirst({
    where: {
      roomId,
      status: { in: ["PENDING", "CONFIRMED"] },
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
    },
    select: { id: true },
  });
  return !conflict;
}
