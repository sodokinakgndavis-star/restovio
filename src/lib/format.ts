export function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export const categoryLabels: Record<string, string> = {
  STANDARD: "Standard",
  SUPERIEURE: "Supérieure",
  SUITE: "Suite",
  FAMILIALE: "Familiale",
};

export const bookingStatusLabels: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  CANCELLED: "Annulée",
};

export const refundStatusLabels: Record<string, string> = {
  NOT_APPLICABLE: "Sans objet",
  PENDING: "Remboursement en attente",
  REFUNDED: "Remboursé",
};
