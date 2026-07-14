import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeRefundDueDate } from "@/lib/data/bookings";
import { isRoomAvailable } from "@/lib/data/rooms";

const patchSchema = z.union([
  z.object({ status: z.enum(["CONFIRMED", "REFUSED", "CANCELLED"]) }),
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

  // Marquer le paiement comme remboursé : action réservée à l'admin, une fois le
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
    // Seule une demande EN ATTENTE peut être validée ou refusée par l'admin (section 3
    // du cahier des charges d'évolution) ; les statuts terminaux ne peuvent pas revenir
    // en arrière.
    if (
      (parsed.data.status === "CONFIRMED" || parsed.data.status === "REFUSED") &&
      booking.status !== "PENDING"
    ) {
      return NextResponse.json(
        { error: "Seule une réservation en attente peut être validée ou refusée." },
        { status: 409 }
      );
    }

    if (parsed.data.status === "CONFIRMED") {
      // RG : re-vérifier la disponibilité au moment de la validation, pas seulement à la
      // création — une autre demande sur les mêmes dates a pu être validée entre-temps.
      const stillAvailable = await isRoomAvailable(
        booking.roomId,
        booking.checkIn,
        booking.checkOut,
        booking.id
      );
      if (!stillAvailable) {
        return NextResponse.json(
          {
            error:
              "Cette chambre n'est plus disponible sur ces dates (une autre réservation a été validée entre-temps). Refusez cette demande.",
          },
          { status: 409 }
        );
      }
    }
  } else {
    // RG-08 : le client ne peut qu'annuler sa propre réservation, tant qu'elle n'est pas déjà
    // terminée (annulée, refusée) ni déjà passée.
    if (parsed.data.status !== "CANCELLED") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }
    if (booking.status === "CANCELLED" || booking.status === "REFUSED") {
      return NextResponse.json({ error: "Cette réservation est déjà terminée." }, { status: 409 });
    }
    if (new Date(booking.checkIn) < new Date()) {
      return NextResponse.json(
        { error: "Cette réservation est déjà passée et ne peut plus être annulée." },
        { status: 409 }
      );
    }
  }

  // Annulation d'une réservation déjà payée : remboursement (simulé, hors plateforme)
  // sous 24h. Une réservation encore en attente ou validée-non-payée n'a rien prélevé,
  // donc rien à rembourser.
  const isCancellingPaidBooking =
    parsed.data.status === "CANCELLED" && booking.status === "PAID";

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status: parsed.data.status,
      ...(isCancellingPaidBooking && {
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
