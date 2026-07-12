import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const patchSchema = z.object({
  role: z.enum(["CLIENT", "ADMIN"]),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Rôle invalide." }, { status: 400 });
  }

  // RG-11 : un administrateur ne peut pas retirer son propre rôle ADMIN.
  if (id === session.user.id && parsed.data.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Vous ne pouvez pas retirer votre propre rôle administrateur." },
      { status: 403 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role: parsed.data.role },
    select: { id: true, role: true },
  });

  return NextResponse.json({ user });
}
