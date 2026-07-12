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
import type { BookingStatus } from "@prisma/client";

export function TableReservationActions({
  reservationId,
  status,
}: {
  reservationId: string;
  status: BookingStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function updateStatus(newStatus: "CONFIRMED" | "CANCELLED") {
    startTransition(async () => {
      const res = await fetch(`/api/table-reservations/${reservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Action impossible.");
        return;
      }

      toast.success(newStatus === "CONFIRMED" ? "Table confirmée." : "Table annulée.");
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const res = await fetch(`/api/table-reservations/${reservationId}`, { method: "DELETE" });
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
      {status !== "CONFIRMED" && status !== "CANCELLED" && (
        <Button variant="outline" size="sm" disabled={isPending} onClick={() => updateStatus("CONFIRMED")}>
          Confirmer
        </Button>
      )}
      {status !== "CANCELLED" && (
        <Button variant="outline" size="sm" disabled={isPending} onClick={() => updateStatus("CANCELLED")}>
          Annuler
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
            <AlertDialogTitle>Supprimer cette réservation de table ?</AlertDialogTitle>
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
