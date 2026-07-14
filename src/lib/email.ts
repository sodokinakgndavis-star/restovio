import { Resend } from "resend";
import { formatPrice } from "@/lib/format";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM ?? "Restovio <onboarding@resend.dev>";

type BookingEmailData = {
  id: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  room: { name: string };
  user: { email: string; name: string };
};

function emailShell(title: string, bodyHtml: string) {
  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; background-color: #f7f3ec; padding: 32px 16px;">
      <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #3c4a2e; color: #f7f3ec; padding: 24px 32px; text-align: center;">
          <p style="margin: 0; font-size: 20px; letter-spacing: 0.05em;">Restovio</p>
        </div>
        <div style="padding: 32px;">
          <h1 style="font-size: 20px; margin: 0 0 16px; color: #2b2b28;">${title}</h1>
          ${bodyHtml}
        </div>
        <div style="padding: 16px 32px; background-color: #f7f3ec; text-align: center; font-size: 12px; color: #8a8578;">
          Restovio — Via della Riviera 24, 50122 Firenze, Italia
        </div>
      </div>
    </div>
  `;
}

// Les échecs d'envoi sont volontairement non bloquants : la mise à jour du statut de
// réservation ne doit jamais échouer parce que Resend est indisponible.
async function sendSafely(params: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.error("RESEND_API_KEY manquant : e-mail non envoyé.", params.subject);
    return;
  }
  try {
    // Le SDK Resend ne lève pas d'exception sur une erreur API (ex. destinataire non
    // autorisé en mode sandbox) : il faut explicitement vérifier `error` dans la réponse.
    const { error } = await resend.emails.send({ from: FROM, ...params });
    if (error) {
      console.error("Échec d'envoi de l'e-mail (réponse Resend) :", error);
    }
  } catch (error) {
    console.error("Échec d'envoi de l'e-mail :", error);
  }
}

export async function sendBookingValidatedEmail(booking: BookingEmailData, origin: string) {
  const checkIn = booking.checkIn.toLocaleDateString("fr-FR");
  const checkOut = booking.checkOut.toLocaleDateString("fr-FR");
  const payUrl = `${origin}/mon-compte/reservations/${booking.id}`;

  await sendSafely({
    to: booking.user.email,
    subject: "Votre réservation Restovio est validée",
    html: emailShell(
      "Votre réservation est validée",
      `
        <p style="color: #4a4a45; line-height: 1.6;">Bonjour ${booking.user.name},</p>
        <p style="color: #4a4a45; line-height: 1.6;">
          Bonne nouvelle : votre demande de réservation pour <strong>${booking.room.name}</strong>
          a été validée par notre équipe.
        </p>
        <table style="width: 100%; margin: 20px 0; font-size: 14px; color: #2b2b28;">
          <tr><td style="padding: 4px 0; color: #8a8578;">Arrivée</td><td style="text-align: right;">${checkIn}</td></tr>
          <tr><td style="padding: 4px 0; color: #8a8578;">Départ</td><td style="text-align: right;">${checkOut}</td></tr>
          <tr><td style="padding: 4px 0; color: #8a8578;">Montant total</td><td style="text-align: right; font-weight: bold;">${formatPrice(booking.totalPrice)}</td></tr>
        </table>
        <p style="color: #4a4a45; line-height: 1.6;">
          Il ne reste qu'une étape : régler le montant en ligne pour confirmer définitivement
          votre séjour.
        </p>
        <a href="${payUrl}" style="display: inline-block; margin-top: 12px; padding: 12px 24px; background-color: #3c4a2e; color: #f7f3ec; text-decoration: none; border-radius: 6px; font-size: 14px;">
          Payer maintenant
        </a>
      `
    ),
  });
}

export async function sendBookingRefusedEmail(booking: BookingEmailData, origin: string) {
  const checkIn = booking.checkIn.toLocaleDateString("fr-FR");
  const checkOut = booking.checkOut.toLocaleDateString("fr-FR");
  const roomsUrl = `${origin}/chambres`;

  await sendSafely({
    to: booking.user.email,
    subject: "Votre demande de réservation Restovio",
    html: emailShell(
      "Votre demande n'a pas pu être acceptée",
      `
        <p style="color: #4a4a45; line-height: 1.6;">Bonjour ${booking.user.name},</p>
        <p style="color: #4a4a45; line-height: 1.6;">
          Nous sommes désolés : votre demande pour <strong>${booking.room.name}</strong> du
          ${checkIn} au ${checkOut} n'a pas pu être acceptée, la chambre n'étant plus
          disponible sur ces dates.
        </p>
        <p style="color: #4a4a45; line-height: 1.6;">
          Aucun montant n'a été prélevé. N'hésitez pas à consulter nos autres chambres
          disponibles.
        </p>
        <a href="${roomsUrl}" style="display: inline-block; margin-top: 12px; padding: 12px 24px; background-color: #3c4a2e; color: #f7f3ec; text-decoration: none; border-radius: 6px; font-size: 14px;">
          Voir nos chambres
        </a>
      `
    ),
  });
}
