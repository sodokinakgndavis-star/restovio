import { z } from "zod";

export const roomCategoryEnum = z.enum(["STANDARD", "SUPERIEURE", "SUITE", "FAMILIALE"]);

export const roomSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères.").max(150),
  description: z.string().trim().min(10, "La description doit contenir au moins 10 caractères."),
  price: z.coerce.number().int().positive("Le prix doit être positif."),
  capacity: z.coerce.number().int().positive("La capacité doit être positive."),
  category: roomCategoryEnum,
  amenities: z.array(z.string().trim().min(1)).default([]),
  images: z.array(z.url()).min(1, "Ajoutez au moins une photo."),
  available: z.boolean().default(true),
});

export type RoomInput = z.infer<typeof roomSchema>;
