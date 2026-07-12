"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validators/profile";

export type ProfileFormState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, message: "Vous devez être connecté." };
  }

  const raw = { name: formData.get("name"), email: formData.get("email") };
  const parsed = profileSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: "Merci de corriger les champs indiqués.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (parsed.data.email !== session.user.email) {
    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    });
    if (existing) {
      return {
        success: false,
        message: "Cette adresse e-mail est déjà utilisée.",
        fieldErrors: { email: ["Cette adresse e-mail est déjà utilisée."] },
      };
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name, email: parsed.data.email },
  });

  return { success: true, message: "Profil mis à jour." };
}
