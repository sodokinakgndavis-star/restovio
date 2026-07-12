"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bookingStatusLabels } from "@/lib/format";

export function BookingFilters({
  searchPlaceholder = "Rechercher un client, une chambre…",
}: {
  searchPlaceholder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");
  const [date, setDate] = useState(searchParams.get("date") ?? "");

  function applyFilters(nextSearch: string, nextStatus: string, nextDate: string) {
    const params = new URLSearchParams();
    if (nextSearch) params.set("search", nextSearch);
    if (nextStatus && nextStatus !== "all") params.set("status", nextStatus);
    if (nextDate) params.set("date", nextDate);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  function resetFilters() {
    setSearch("");
    setStatus("all");
    setDate("");
    startTransition(() => router.push(pathname));
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Input
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && applyFilters(search, status, date)}
        className="sm:max-w-xs"
      />
      <Select
        value={status}
        onValueChange={(value) => {
          const nextStatus = value ?? "all";
          setStatus(nextStatus);
          applyFilters(search, nextStatus, date);
        }}
      >
        <SelectTrigger className="sm:w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          {Object.entries(bookingStatusLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          applyFilters(search, status, e.target.value);
        }}
        className="sm:w-44"
      />
      <div className="flex gap-2">
        <Button variant="outline" disabled={isPending} onClick={() => applyFilters(search, status, date)}>
          Rechercher
        </Button>
        <Button variant="ghost" disabled={isPending} onClick={resetFilters}>
          Réinitialiser
        </Button>
      </div>
    </div>
  );
}
