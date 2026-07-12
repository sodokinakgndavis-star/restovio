import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/features/bookings/profile-form";

export const metadata = { title: "Mon profil" };

export default async function MonComptePage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });
  if (!user) redirect("/connexion");

  return <ProfileForm name={user.name} email={user.email} />;
}
