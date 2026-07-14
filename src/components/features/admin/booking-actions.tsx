"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { BookingStatus, RefundStatus } from "@prisma/client";

export function BookingActions({
  bookingId,
  status,
  refundStatus,
}: {
  bookingId: string;
  status: BookingStatus;
  refundStatus?: RefundStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function updateStatus(newStatus: "CONFIRMED" | "REFUSED" | "CANCELLED") {
    startTransition(async () => {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Action impossible.");
        return;
      }

      const messages: Record<typeof newStatus, string> = {
        CONFIRMED: "Réservation validée.",
        REFUSED: "Réservation refusée.",
        CANCELLED: "Réservation annulée.",
      };
      toast.success(messages[newStatus]);
      router.refresh();
    });
  }

  function markRefunded() {
    startTransition(async () => {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refundStatus: "REFUNDED" }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Action impossible.");
        return;
      }

      toast.success("Paiement marqué comme remboursé.");
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const res = await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Suppression impossible.");
        return;
      }

      toast.success("Réservation supprimée.");
      router.refresh();
    });
  }

  return (
    <div className="flex justify-end gap-1">
      {status === "PENDING" && (
        <>
          <Button variant="outline" size="sm" disabled={isPending} onClick={() => updateStatus("CONFIRMED")}>
            Valider
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive"
            disabled={isPending}
            onClick={() => updateStatus("REFUSED")}
          >
            Refuser
          </Button>
        </>
      )}
      {(status === "CONFIRMED" || status === "PAID") && (
        <Button variant="outline" size="sm" disabled={isPending} onClick={() => updateStatus("CANCELLED")}>
          Annuler
        </Button>
      )}
      {refundStatus === "PENDING" && (
        <Button variant="outline" size="sm" disabled={isPending} onClick={markRefunded}>
          Marquer remboursé
        </Button>
      )}

      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button variant="ghost" size="sm" className="text-destructive">
              Supprimer
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette réservation ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
