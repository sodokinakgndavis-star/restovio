import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const patchSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED"]),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const reservation = await prisma.tableReservation.findUnique({ where: { id } });
  if (!reservation) {
    return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  }

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const isOwner = reservation.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  if (isAdmin) {
    if (reservation.status === "CANCELLED" && parsed.data.status === "CONFIRMED") {
      return NextResponse.json(
        { error: "Une réservation annulée ne peut pas être reconfirmée." },
        { status: 409 }
      );
    }
  } else {
    if (parsed.data.status !== "CANCELLED") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }
    if (reservation.status === "CANCELLED") {
      return NextResponse.json({ error: "Cette réservation est déjà annulée." }, { status: 409 });
    }
    if (new Date(reservation.date) < new Date(new Date().setHours(0, 0, 0, 0))) {
      return NextResponse.json(
        { error: "Cette réservation est déjà passée et ne peut plus être annulée." },
        { status: 409 }
      );
    }
  }

  const updated = await prisma.tableReservation.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ reservation: updated });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { id } = await params;
  const existing = await prisma.tableReservation.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  }

  await prisma.tableReservation.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
