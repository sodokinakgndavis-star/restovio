"use server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validators/contact";

export type ContactFormState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: "Merci de corriger les champs indiqués.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    },
  });

  return {
    success: true,
    message: "Votre message a bien été envoyé, nous vous répondrons rapidement.",
  };
}
