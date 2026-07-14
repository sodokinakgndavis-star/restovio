import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Vous devez être connecté." }, { status: 401 });
  }

  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { room: { select: { name: true } } },
  });

  if (!booking) {
    return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  }

  // Seul le propriétaire de la réservation peut la payer (section 11 du cahier des
  // charges d'évolution).
  if (booking.userId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  if (booking.status !== "CONFIRMED") {
    return NextResponse.json(
      { error: "Cette réservation n'est pas (ou plus) en attente de paiement." },
      { status: 409 }
    );
  }

  // Le montant vient exclusivement de la réservation en base, jamais du client
  // (section 11 : "calcul des montants côté serveur").
  const origin = new URL(request.url).origin;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: booking.totalPrice,
          product_data: {
            name: `Réservation — ${booking.room.name}`,
            description: `Du ${booking.checkIn.toLocaleDateString("fr-FR")} au ${booking.checkOut.toLocaleDateString("fr-FR")}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { bookingId: booking.id },
    success_url: `${origin}/mon-compte/reservations/${booking.id}?payment=success`,
    cancel_url: `${origin}/mon-compte/reservations/${booking.id}?payment=cancelled`,
  });

  if (!checkoutSession.url) {
    return NextResponse.json({ error: "Impossible de créer la session de paiement." }, { status: 500 });
  }

  return NextResponse.json({ url: checkoutSession.url });
}
