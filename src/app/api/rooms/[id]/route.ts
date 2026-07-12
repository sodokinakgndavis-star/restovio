import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roomSchema } from "@/lib/validators/room";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 403 });

  const { id } = await params;
  const existing = await prisma.room.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Chambre introuvable." }, { status: 404 });

  const body = await request.json();
  const parsed = roomSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const room = await prisma.room.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ room });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 403 });

  const { id } = await params;
  const existing = await prisma.room.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Chambre introuvable." }, { status: 404 });

  // RG-10 : suppression interdite si des réservations actives référencent la chambre.
  const activeBooking = await prisma.booking.findFirst({
    where: { roomId: id, status: { in: ["PENDING", "CONFIRMED"] } },
    select: { id: true },
  });

  if (activeBooking) {
    return NextResponse.json(
      { error: "Cette chambre a des réservations actives et ne peut pas être supprimée." },
      { status: 409 }
    );
  }

  await prisma.room.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
