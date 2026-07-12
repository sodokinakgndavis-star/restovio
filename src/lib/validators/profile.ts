import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères.").max(100),
  email: z.email("Adresse e-mail invalide."),
});

export type ProfileInput = z.infer<typeof profileSchema>;
