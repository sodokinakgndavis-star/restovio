export const metadata = { title: "Politique d'annulation" };

export default function PolitiqueAnnulationPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <p className="text-xs font-medium tracking-[0.2em] text-olive uppercase">Informations</p>
      <h1 className="mt-2 font-heading text-4xl font-medium">Politique d&apos;annulation</h1>

      <div className="mt-8 space-y-6 text-muted-foreground">
        <section>
          <h2 className="font-heading text-lg font-medium text-foreground">Demande et paiement</h2>
          <p className="mt-2">
            Chaque réservation de chambre commence par une demande, sans paiement. Une fois
            validée par notre équipe (généralement sous 24 heures), un e-mail vous invite à
            régler le montant total en une seule fois, en ligne et de façon sécurisée.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-medium text-foreground">Annulation</h2>
          <p className="mt-2">
            Vous pouvez annuler votre réservation depuis votre espace client tant que la
            date d&apos;arrivée n&apos;est pas passée. Aucun frais d&apos;annulation
            n&apos;est appliqué.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-medium text-foreground">Remboursement</h2>
          <p className="mt-2">
            En cas d&apos;annulation d&apos;une réservation déjà payée, le montant versé
            vous est intégralement remboursé sous 24 heures. Le statut du remboursement est
            visible à tout moment dans votre espace client, dans le détail de la réservation
            concernée.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-medium text-foreground">Réservations de table</h2>
          <p className="mt-2">
            Les réservations de table au restaurant peuvent être annulées librement depuis
            votre espace client, sans acompte ni frais.
          </p>
        </section>
      </div>
    </div>
  );
}
