import { z } from "zod";

export const DINNER_TIME_SLOTS = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"] as const;

export const tableReservationSchema = z.object({
  date: z.iso.date("Date invalide."),
  time: z.enum(DINNER_TIME_SLOTS, { error: "Créneau invalide." }),
  guests: z
    .coerce.number()
    .int()
    .positive("Le nombre de convives doit être positif.")
    .max(12, "Pour plus de 12 convives, contactez-nous directement."),
  comment: z.string().trim().max(500).optional().or(z.literal("")),
});

export type TableReservationInput = z.infer<typeof tableReservationSchema>;
