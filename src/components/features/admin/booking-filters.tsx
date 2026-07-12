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

export function BookingFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");

  function applyFilters(nextSearch: string, nextStatus: string) {
    const params = new URLSearchParams();
    if (nextSearch) params.set("search", nextSearch);
    if (nextStatus && nextStatus !== "all") params.set("status", nextStatus);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Input
        placeholder="Rechercher un client, une chambre…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && applyFilters(search, status)}
        className="sm:max-w-xs"
      />
      <Select
        value={status}
        onValueChange={(value) => {
          setStatus(value);
          applyFilters(search, value);
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
      <Button variant="outline" disabled={isPending} onClick={() => applyFilters(search, status)}>
        Rechercher
      </Button>
    </div>
  );
}
