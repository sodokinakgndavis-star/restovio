import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeRefundDueDate } from "@/lib/data/bookings";

const patchSchema = z.union([
  z.object({ status: z.enum(["CONFIRMED", "CANCELLED"]) }),
  z.object({ refundStatus: z.literal("REFUNDED") }),
]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  }

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const isOwner = booking.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  // Marquer l'acompte comme remboursé : action réservée à l'admin, une fois le
  // remboursement (hors plateforme) effectué sous 24h.
  if ("refundStatus" in parsed.data) {
    if (!isAdmin) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }
    if (booking.refundStatus !== "PENDING") {
      return NextResponse.json(
        { error: "Aucun remboursement en attente pour cette réservation." },
        { status: 409 }
      );
    }
    const updated = await prisma.booking.update({
      where: { id },
      data: { refundStatus: "REFUNDED" },
    });
    return NextResponse.json({ booking: updated });
  }

  if (isAdmin) {
    // RG-09 : une réservation CANCELLED ne peut plus être reconfirmée.
    if (booking.status === "CANCELLED" && parsed.data.status === "CONFIRMED") {
      return NextResponse.json(
        { error: "Une réservation annulée ne peut pas être reconfirmée." },
        { status: 409 }
      );
    }
  } else {
    // RG-08 : le client ne peut qu'annuler sa propre réservation, tant qu'elle n'est pas déjà
    // passée ni déjà annulée.
    if (parsed.data.status !== "CANCELLED") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }
    if (booking.status === "CANCELLED") {
      return NextResponse.json({ error: "Cette réservation est déjà annulée." }, { status: 409 });
    }
    if (new Date(booking.checkIn) < new Date()) {
      return NextResponse.json(
        { error: "Cette réservation est déjà passée et ne peut plus être annulée." },
        { status: 409 }
      );
    }
  }

  // Annulation : l'acompte de 50 % déjà versé est remboursé sous 24h (politique simulée,
  // hors plateforme de paiement — voir section 8 du cahier des charges).
  const isCancelling = parsed.data.status === "CANCELLED" && booking.status !== "CANCELLED";

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status: parsed.data.status,
      ...(isCancelling && {
        refundStatus: "PENDING",
        refundDueAt: computeRefundDueDate(),
      }),
    },
  });

  return NextResponse.json({ booking: updated });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { id } = await params;
  const existing = await prisma.booking.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  }

  await prisma.booking.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
