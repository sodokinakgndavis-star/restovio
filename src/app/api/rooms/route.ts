import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { roomSchema } from "@/lib/validators/room";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const body = await request.json();
  const parsed = roomSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const room = await prisma.room.create({ data: parsed.data });

  return NextResponse.json({ room }, { status: 201 });
}
