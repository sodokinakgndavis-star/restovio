import { Check, Clock, CreditCard, X } from "lucide-react";
import type { BookingStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

type StepState = "done" | "current" | "upcoming" | "refused";

function Step({
  icon: Icon,
  label,
  state,
  isLast,
}: {
  icon: typeof Check;
  label: string;
  state: StepState;
  isLast?: boolean;
}) {
  return (
    <div className="flex flex-1 items-center">
      <div className="flex flex-col items-center gap-1.5">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
            state === "done" && "border-olive bg-olive text-olive-foreground",
            state === "current" && "border-olive bg-background text-olive",
            state === "refused" && "border-destructive bg-destructive/10 text-destructive",
            state === "upcoming" && "border-border bg-background text-muted-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <span
          className={cn(
            "text-center text-xs font-medium",
            state === "upcoming" ? "text-muted-foreground" : "text-foreground"
          )}
        >
          {label}
        </span>
      </div>
      {!isLast && (
        <div
          className={cn(
            "mx-2 mb-5 h-0.5 flex-1",
            state === "done" ? "bg-olive" : "bg-border"
          )}
        />
      )}
    </div>
  );
}

export function BookingTimeline({ status }: { status: BookingStatus }) {
  if (status === "REFUSED") {
    return (
      <div className="flex items-center gap-2 py-2">
        <Step icon={Check} label="Demande envoyée" state="done" />
        <Step icon={X} label="Refusée" state="refused" isLast />
      </div>
    );
  }

  const validationState: StepState = status === "PENDING" ? "current" : "done";
  const paymentState: StepState =
    status === "PAID"
      ? "done"
      : status === "CONFIRMED"
        ? "current"
        : // PENDING ou CANCELLED : le paiement n'a pas (encore) eu lieu.
          "upcoming";

  return (
    <div className="flex items-center gap-2 py-2">
      <Step icon={Check} label="Demande envoyée" state="done" />
      <Step
        icon={validationState === "current" ? Clock : Check}
        label="Validée"
        state={validationState}
      />
      <Step
        icon={paymentState === "upcoming" ? CreditCard : paymentState === "current" ? Clock : Check}
        label="Payée"
        state={paymentState}
        isLast
      />
    </div>
  );
}
