import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function getUsersForAdmin(search?: string) {
  const where: Prisma.UserWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  return prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
