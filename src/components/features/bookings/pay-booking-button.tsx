"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function PayBookingButton({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();

  function handlePay() {
    startTransition(async () => {
      const res = await fetch(`/api/bookings/${bookingId}/checkout`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Impossible de démarrer le paiement.");
        return;
      }

      window.location.href = data.url;
    });
  }

  return (
    <Button
      className="bg-olive text-olive-foreground hover:bg-olive/85"
      disabled={isPending}
      onClick={handlePay}
    >
      {isPending ? "Redirection vers le paiement…" : "Payer maintenant"}
    </Button>
  );
}
