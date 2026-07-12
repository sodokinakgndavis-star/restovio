import { prisma } from "@/lib/prisma";

export async function getTestimonials(limit = 6) {
  return prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
