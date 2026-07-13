"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function BookingSearchWidget() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const today = new Date().toISOString().split("T")[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    router.push(`/chambres?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-xl border border-border/60 bg-card/95 p-5 shadow-xl backdrop-blur sm:flex-row sm:items-end sm:gap-3 sm:p-4"
    >
      <div className="flex-1 space-y-1.5 text-left">
        <Label htmlFor="search-checkin" className="text-xs uppercase tracking-wide text-muted-foreground">
          Arrivée
        </Label>
        <Input
          id="search-checkin"
          type="date"
          min={today}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </div>
      <div className="flex-1 space-y-1.5 text-left">
        <Label htmlFor="search-checkout" className="text-xs uppercase tracking-wide text-muted-foreground">
          Départ
        </Label>
        <Input
          id="search-checkout"
          type="date"
          min={checkIn || today}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>
      <div className="flex-1 space-y-1.5 text-left">
        <Label htmlFor="search-guests" className="text-xs uppercase tracking-wide text-muted-foreground">
          Voyageurs
        </Label>
        <Input
          id="search-guests"
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="bg-olive text-olive-foreground hover:bg-olive/85 sm:w-auto"
      >
        Vérifier les disponibilités
      </Button>
    </form>
  );
}
