"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bookingSchema, type BookingInput } from "@/lib/validators/booking";
import { formatPrice } from "@/lib/format";

type BookingFormProps = {
  room: { id: string; price: number; capacity: number };
};

export function BookingForm({ room }: BookingFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: { roomId: room.id, checkIn: "", checkOut: "", guests: 1, comment: "" },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  const estimate = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const nights = Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return null;
    return { nights, total: nights * room.price };
  }, [checkIn, checkOut, room.price]);

  async function onSubmit(values: BookingInput) {
    if (status !== "authenticated") {
      router.push(`/connexion?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Impossible de créer la réservation.");
        return;
      }

      toast.success("Réservation créée avec succès !");
      router.push("/mon-compte/reservations");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="checkIn">Arrivée</Label>
          <Input id="checkIn" type="date" min={today} {...register("checkIn")} />
          {errors.checkIn && (
            <p className="text-xs text-destructive">{errors.checkIn.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="checkOut">Départ</Label>
          <Input id="checkOut" type="date" min={checkIn || today} {...register("checkOut")} />
          {errors.checkOut && (
            <p className="text-xs text-destructive">{errors.checkOut.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="guests">Nombre de personnes</Label>
        <Input id="guests" type="number" min={1} max={room.capacity} {...register("guests")} />
        {errors.guests && <p className="text-xs text-destructive">{errors.guests.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="comment">Commentaire (facultatif)</Label>
        <Textarea id="comment" rows={3} {...register("comment")} />
      </div>

      {estimate && (
        <div className="rounded-md bg-muted p-3 text-sm">
          <p>
            {estimate.nights} nuit(s) — estimation :{" "}
            <span className="font-semibold">{formatPrice(estimate.total)}</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Montant définitif vérifié et confirmé à l&apos;étape suivante.
          </p>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting
          ? "Réservation en cours…"
          : status === "authenticated"
            ? "Réserver"
            : "Se connecter pour réserver"}
      </Button>
    </form>
  );
}
