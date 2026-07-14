// Fonctions de calcul pures (aucune dépendance serveur), utilisables aussi bien
// côté client (estimation live) que côté serveur (source de vérité).

// Le paiement (Stripe) n'intervient qu'après validation de la demande par l'admin, et
// porte sur 100 % du montant : plus d'acompte partiel (évolution du système de
// réservation — section 6 du cahier des charges).
export const DEPOSIT_RATIO = 1;
// Délai de remboursement annoncé en cas d'annulation.
export const REFUND_WINDOW_HOURS = 24;
// Remise séjour longue durée : -30 % à partir de 30 nuits consécutives.
export const LONG_STAY_MIN_NIGHTS = 30;
export const LONG_STAY_DISCOUNT_RATIO = 0.3;

export function computeNights(checkIn: Date, checkOut: Date) {
  const msPerNight = 1000 * 60 * 60 * 24;
  const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / msPerNight);
  return Math.max(1, nights);
}

export function isLongStay(nights: number) {
  return nights >= LONG_STAY_MIN_NIGHTS;
}

export function computeTotalPrice(pricePerNight: number, nights: number) {
  const subtotal = pricePerNight * nights;
  const discounted = isLongStay(nights);
  const total = discounted ? Math.round(subtotal * (1 - LONG_STAY_DISCOUNT_RATIO)) : subtotal;
  return { subtotal, total, discounted };
}

export function computeDeposit(totalPrice: number) {
  return Math.round(totalPrice * DEPOSIT_RATIO);
}

export function computeRefundDueDate(from: Date = new Date()) {
  return new Date(from.getTime() + REFUND_WINDOW_HOURS * 60 * 60 * 1000);
}
