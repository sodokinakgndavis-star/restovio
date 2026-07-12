"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators/auth";

export type RegisterFormState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function registerUser(
  _prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Merci de corriger les champs indiqués.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

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

  const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

  // RG-02 : tout compte créé via ce formulaire public reçoit le rôle CLIENT par défaut.
  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashedPassword,
      role: "CLIENT",
    },
  });

  return { success: true, message: "Compte créé avec succès. Vous pouvez vous connecter." };
}
