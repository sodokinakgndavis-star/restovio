"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Role } from "@prisma/client";

export function UserRoleSelect({
  userId,
  role,
  isCurrentUser,
}: {
  userId: string;
  role: Role;
  isCurrentUser: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(newRole: string | null) {
    if (!newRole) return;
    startTransition(async () => {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Modification impossible.");
        return;
      }

      toast.success("Rôle mis à jour.");
      router.refresh();
    });
  }

  return (
    <Select value={role} onValueChange={handleChange} disabled={isPending || isCurrentUser}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="CLIENT">Client</SelectItem>
        <SelectItem value="ADMIN">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}
