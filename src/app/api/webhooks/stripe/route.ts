import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

// Seul point d'entrée possible vers le statut PAID (section 11 du cahier des charges
// d'évolution : "paiement sécurisé et non modifiable côté client"). Aucune route
// cliente ne peut positionner ce statut directement.
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET manquant.");
    return NextResponse.json({ error: "Configuration serveur incomplète." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Signature Stripe invalide :", err);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const bookingId = checkoutSession.metadata?.bookingId;

    if (bookingId) {
      const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
      // Idempotence : un webhook peut être renvoyé plusieurs fois par Stripe.
      if (booking && booking.status === "CONFIRMED") {
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: "PAID",
            paidAt: new Date(),
            stripeSessionId: checkoutSession.id,
          },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
