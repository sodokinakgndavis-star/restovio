import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tableReservationSchema } from "@/lib/validators/table-reservation";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: "Vous devez être connecté pour réserver une table." },
      { status: 401 }
    );
  }

  const body = await request.json();
  const parsed = tableReservationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const date = new Date(parsed.data.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    return NextResponse.json(
      { error: "La date de réservation ne peut pas être dans le passé." },
      { status: 400 }
    );
  }

  const reservation = await prisma.tableReservation.create({
    data: {
      userId: session.user.id,
      date,
      time: parsed.data.time,
      guests: parsed.data.guests,
      comment: parsed.data.comment || null,
      status: "PENDING",
    },
  });

  return NextResponse.json({ reservation }, { status: 201 });
}
