import { z } from "zod";

export const bookingSchema = z
  .object({
    roomId: z.string().min(1),
    checkIn: z.iso.date("Date d'arrivée invalide."),
    checkOut: z.iso.date("Date de départ invalide."),
    guests: z.coerce.number().int().positive("Le nombre de personnes doit être positif."),
    comment: z.string().trim().max(500).optional().or(z.literal("")),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "La date de départ doit être postérieure à la date d'arrivée.",
    path: ["checkOut"],
  });

export type BookingInput = z.infer<typeof bookingSchema>;
