"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  tableReservationSchema,
  DINNER_TIME_SLOTS,
  type TableReservationInput,
} from "@/lib/validators/table-reservation";

export function TableReservationForm() {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tableReservationSchema),
    defaultValues: { date: "", time: "19:30" as const, guests: 2, comment: "" },
  });

  async function onSubmit(values: TableReservationInput) {
    if (status !== "authenticated") {
      router.push(`/connexion?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/table-reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Impossible de réserver cette table.");
        return;
      }

      toast.success("Table réservée avec succès !");
      router.push("/mon-compte/tables");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" min={today} {...register("date")} />
        {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Créneau</Label>
        <Controller
          control={control}
          name="time"
          render={({ field }) => (
            <Select value={field.value} onValueChange={(value) => value && field.onChange(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DINNER_TIME_SLOTS.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="guests">Nombre de convives</Label>
        <Input id="guests" type="number" min={1} max={12} {...register("guests")} />
        {errors.guests && <p className="text-xs text-destructive">{errors.guests.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="comment">Commentaire (facultatif)</Label>
        <Textarea id="comment" rows={3} placeholder="Allergies, occasion particulière…" {...register("comment")} />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-olive text-olive-foreground hover:bg-olive/85"
      >
        {isSubmitting
          ? "Réservation en cours…"
          : status === "authenticated"
            ? "Réserver la table"
            : "Se connecter pour réserver"}
      </Button>
    </form>
  );
}
