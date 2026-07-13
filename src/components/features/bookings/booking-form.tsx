"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bookingSchema, type BookingInput } from "@/lib/validators/booking";
import { formatPrice } from "@/lib/format";
import { computeTotalPrice, computeDeposit, LONG_STAY_MIN_NIGHTS } from "@/lib/pricing";

type BookingFormProps = {
  room: { id: string; price: number; capacity: number };
};

type AvailabilityState = "idle" | "checking" | "available" | "unavailable" | "error";

export function BookingForm({ room }: BookingFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityState>("idle");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    // Les dates/voyageurs peuvent arriver via l'URL (retour de la page de connexion,
    // section 4 du cahier des charges de finition) afin de ne pas faire ressaisir
    // au visiteur les informations déjà renseignées avant qu'on lui demande de se connecter.
    defaultValues: {
      roomId: room.id,
      checkIn: searchParams.get("checkIn") ?? "",
      checkOut: searchParams.get("checkOut") ?? "",
      guests: searchParams.get("guests") ? Number(searchParams.get("guests")) : 1,
      comment: searchParams.get("comment") ?? "",
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  const estimate = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const nights = Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return null;
    const { subtotal, total, discounted } = computeTotalPrice(room.price, nights);
    const deposit = computeDeposit(total);
    return { nights, subtotal, total, discounted, deposit, remaining: total - deposit };
  }, [checkIn, checkOut, room.price]);

  // Vérification de la disponibilité réelle de la chambre sur la période choisie
  // (section 11 du cahier des charges), avant même la tentative de réservation.
  useEffect(() => {
    if (!checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
      setAvailability("idle");
      return;
    }

    let cancelled = false;
    setAvailability("checking");

    const timeout = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ checkIn, checkOut });
        const res = await fetch(`/api/rooms/${room.id}/availability?${params.toString()}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setAvailability("error");
          return;
        }
        setAvailability(data.available ? "available" : "unavailable");
      } catch {
        if (!cancelled) setAvailability("error");
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [checkIn, checkOut, room.id]);

  async function onSubmit(values: BookingInput) {
    if (status !== "authenticated") {
      const params = new URLSearchParams();
      if (values.checkIn) params.set("checkIn", values.checkIn);
      if (values.checkOut) params.set("checkOut", values.checkOut);
      if (values.guests) params.set("guests", String(values.guests));
      if (values.comment) params.set("comment", values.comment);
      const query = params.toString();
      const callbackUrl = `${pathname}${query ? `?${query}` : ""}#reserver`;
      router.push(`/connexion?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    if (availability === "unavailable") {
      toast.error("Cette chambre n'est pas disponible sur les dates sélectionnées.");
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

      {availability !== "idle" && (
        <div
          className={`flex items-center gap-2 rounded-md p-2.5 text-sm ${
            availability === "available"
              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
              : availability === "unavailable"
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {availability === "checking" && (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Vérification de la disponibilité…
            </>
          )}
          {availability === "available" && (
            <>
              <CheckCircle2 className="h-4 w-4" /> Chambre disponible sur ces dates.
            </>
          )}
          {availability === "unavailable" && (
            <>
              <XCircle className="h-4 w-4" /> Chambre indisponible sur ces dates.
            </>
          )}
          {availability === "error" && <>Impossible de vérifier la disponibilité.</>}
        </div>
      )}

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
        <div className="space-y-2 rounded-md bg-muted p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Prix par nuit</span>
            <span>{formatPrice(room.price)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Nombre de nuits</span>
            <span>{estimate.nights}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border/60 pt-2">
            <span className="text-muted-foreground">Sous-total</span>
            <span className={estimate.discounted ? "text-muted-foreground line-through" : ""}>
              {formatPrice(estimate.subtotal)}
            </span>
          </div>
          {estimate.discounted ? (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Réduction longue durée (-30 %)</span>
              <span className="font-medium text-olive">
                -{formatPrice(estimate.subtotal - estimate.total)}
              </span>
            </div>
          ) : (
            checkIn &&
            checkOut && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Réduction éventuelle</span>
                <span className="text-xs text-muted-foreground">
                  Aucune (à partir de {LONG_STAY_MIN_NIGHTS} nuits)
                </span>
              </div>
            )
          )}
          <div className="flex items-center justify-between border-t border-border/60 pt-2">
            <span className="font-medium text-foreground">Montant total</span>
            <span className="font-semibold">{formatPrice(estimate.total)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Acompte à régler (50 %)</span>
            <span className="font-semibold">{formatPrice(estimate.deposit)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Solde restant sur place</span>
            <span>{formatPrice(estimate.remaining)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Montant définitif vérifié et confirmé à l&apos;étape suivante. En cas
            d&apos;annulation, l&apos;acompte est remboursé sous 24h.
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || availability === "unavailable" || availability === "checking"}
        className="w-full bg-olive text-olive-foreground hover:bg-olive/85"
      >
        {isSubmitting
          ? "Réservation en cours…"
          : status === "authenticated"
            ? "Réserver"
            : "Se connecter pour réserver"}
      </Button>
    </form>
  );
}
