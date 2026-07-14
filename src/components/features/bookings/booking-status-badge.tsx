import { Badge } from "@/components/ui/badge";
import { bookingStatusLabels } from "@/lib/format";
import type { BookingStatus } from "@prisma/client";

const variants: Record<BookingStatus, "default" | "secondary" | "destructive"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  REFUSED: "destructive",
  CANCELLED: "destructive",
  PAID: "default",
};

// PAID et CONFIRMED partagent le variant "default" (olive) ; PAID est distingué par une
// teinte dorée pour rester lisible dans les tableaux de bord admin et client.
const extraClassName: Partial<Record<BookingStatus, string>> = {
  PAID: "bg-gold text-foreground",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge variant={variants[status]} className={extraClassName[status]}>
      {bookingStatusLabels[status]}
    </Badge>
  );
}
