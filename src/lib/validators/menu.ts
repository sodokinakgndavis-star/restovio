import { z } from "zod";

export const menuCategoryEnum = z.enum(["ENTREE", "PLAT", "DESSERT", "BOISSON"]);

export const menuItemSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères.").max(150),
  description: z.string().trim().min(5, "La description doit contenir au moins 5 caractères."),
  price: z.coerce.number().int().positive("Le prix doit être positif."),
  category: menuCategoryEnum,
  available: z.boolean().default(true),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;
