import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères.").max(100),
  email: z.email("Adresse e-mail invalide."),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères.").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;
