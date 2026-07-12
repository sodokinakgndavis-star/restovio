import { prisma } from "@/lib/prisma";

export async function getMenuItems() {
  return prisma.menuItem.findMany({
    where: { available: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
}

export async function getAllMenuItemsForAdmin() {
  return prisma.menuItem.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
}

export async function getMenuItemById(id: string) {
  return prisma.menuItem.findUnique({ where: { id } });
}
