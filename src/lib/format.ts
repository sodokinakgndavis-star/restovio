export function formatMonthYear(date: Date) {
  const formatted = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

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
  CONFIRMED: "Validée",
  REFUSED: "Refusée",
  CANCELLED: "Annulée",
  PAID: "Payée",
};

export const refundStatusLabels: Record<string, string> = {
  NOT_APPLICABLE: "Sans objet",
  PENDING: "Remboursement en attente",
  REFUNDED: "Remboursé",
};

export const menuCategoryLabels: Record<string, string> = {
  ENTREE: "Entrées",
  PLAT: "Plats",
  DESSERT: "Desserts",
  BOISSON: "Boissons",
};
