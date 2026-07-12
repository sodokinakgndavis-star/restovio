import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validators/booking";
import { isRoomAvailable } from "@/lib/data/rooms";
import { computeNights } from "@/lib/data/bookings";

export async function POST(request: Request) {
  // RG-05 : une réservation ne peut être créée que par un utilisateur authentifié.
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Vous devez être connecté pour réserver." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const room = await prisma.room.findUnique({ where: { id: parsed.data.roomId } });
  if (!room) {
    return NextResponse.json({ error: "Chambre introuvable." }, { status: 404 });
  }

  // RG-04 : le nombre de personnes ne peut pas dépasser la capacité de la chambre.
  if (parsed.data.guests > room.capacity) {
    return NextResponse.json(
      { error: `Cette chambre accueille au maximum ${room.capacity} personne(s).` },
      { status: 400 }
    );
  }

  const checkIn = new Date(parsed.data.checkIn);
  const checkOut = new Date(parsed.data.checkOut);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (checkIn < today) {
    return NextResponse.json(
      { error: "La date d'arrivée ne peut pas être dans le passé." },
      { status: 400 }
    );
  }

  // RG-06 : pas de réservation active en chevauchement sur la même chambre.
  const available = await isRoomAvailable(room.id, checkIn, checkOut);
  if (!available) {
    return NextResponse.json(
      { error: "Cette chambre n'est pas disponible sur les dates sélectionnées." },
      { status: 409 }
    );
  }

  // RG-07 : le prix total est calculé et vérifié côté serveur.
  const nights = computeNights(checkIn, checkOut);
  const totalPrice = room.price * nights;

  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id,
      roomId: room.id,
      checkIn,
      checkOut,
      guests: parsed.data.guests,
      comment: parsed.data.comment || null,
      totalPrice,
      status: "PENDING",
    },
  });

  return NextResponse.json({ booking }, { status: 201 });
}
