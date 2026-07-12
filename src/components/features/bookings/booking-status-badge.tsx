import { Badge } from "@/components/ui/badge";
import { bookingStatusLabels } from "@/lib/format";
import type { BookingStatus } from "@prisma/client";

const variants: Record<BookingStatus, "default" | "secondary" | "destructive"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  CANCELLED: "destructive",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge variant={variants[status]}>{bookingStatusLabels[status]}</Badge>;
}
