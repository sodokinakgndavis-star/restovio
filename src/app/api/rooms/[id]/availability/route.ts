import { NextResponse } from "next/server";
import { isRoomAvailable } from "@/lib/data/rooms";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");

  if (!checkInParam || !checkOutParam) {
    return NextResponse.json({ error: "Dates manquantes." }, { status: 400 });
  }

  const checkIn = new Date(checkInParam);
  const checkOut = new Date(checkOutParam);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkOut <= checkIn) {
    return NextResponse.json({ error: "Dates invalides." }, { status: 400 });
  }

  const available = await isRoomAvailable(id, checkIn, checkOut);
  return NextResponse.json({ available });
}
