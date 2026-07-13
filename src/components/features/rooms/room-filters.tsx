"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryLabels } from "@/lib/format";

export function RoomFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") ?? "");
  const [guests, setGuests] = useState(searchParams.get("guests") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "all");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  function applyFilters() {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    if (category && category !== "all") params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function resetFilters() {
    setCheckIn("");
    setCheckOut("");
    setGuests("");
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    startTransition(() => {
      router.push(pathname);
    });
  }

  return (
    <div className="grid gap-4 rounded-lg border bg-background p-4 md:grid-cols-6">
      <div className="space-y-1.5">
        <Label htmlFor="checkIn" className="text-xs">
          Arrivée
        </Label>
        <Input
          id="checkIn"
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="checkOut" className="text-xs">
          Départ
        </Label>
        <Input
          id="checkOut"
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="guests" className="text-xs">
          Voyageurs
        </Label>
        <Input
          id="guests"
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Catégorie</Label>
        <Select value={category} onValueChange={(value) => setCategory(value ?? "all")}>
          <SelectTrigger className="w-full">
            <SelectValue>
              {(value: string) =>
                value === "all" ? "Toutes les catégories" : (categoryLabels[value as keyof typeof categoryLabels] ?? value)
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="minPrice" className="text-xs">
          Prix min (€)
        </Label>
        <Input
          id="minPrice"
          type="number"
          min={0}
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="maxPrice" className="text-xs">
          Prix max (€)
        </Label>
        <Input
          id="maxPrice"
          type="number"
          min={0}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <div className="flex gap-2 md:col-span-6">
        <Button onClick={applyFilters} disabled={isPending}>
          {isPending ? "Recherche…" : "Rechercher"}
        </Button>
        <Button variant="ghost" onClick={resetFilters} disabled={isPending}>
          Réinitialiser
        </Button>
      </div>
    </div>
  );
}
