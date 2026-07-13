export const metadata = { title: "Conditions générales d'utilisation" };

export default function CguPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <p className="text-xs font-medium tracking-[0.2em] text-olive uppercase">Informations</p>
      <h1 className="mt-2 font-heading text-4xl font-medium">Conditions générales d&apos;utilisation</h1>

      <div className="mt-8 space-y-6 text-muted-foreground">
        <section>
          <h2 className="font-heading text-lg font-medium text-foreground">Objet</h2>
          <p className="mt-2">
            Les présentes conditions régissent l&apos;utilisation de la plateforme Restovio,
            qui permet de consulter les chambres disponibles, de réserver un séjour et de
            réserver une table au restaurant.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-medium text-foreground">Compte utilisateur</h2>
          <p className="mt-2">
            La création d&apos;un compte est nécessaire pour réserver. Vous vous engagez à
            fournir des informations exactes et à conserver la confidentialité de vos
            identifiants.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-medium text-foreground">Réservations</h2>
          <p className="mt-2">
            Toute réservation est soumise à la disponibilité réelle de la chambre sur les
            dates demandées et au respect de la capacité maximale indiquée. Le prix affiché
            est calculé et vérifié par nos systèmes au moment de la réservation.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-medium text-foreground">Responsabilité</h2>
          <p className="mt-2">
            Restovio met tout en œuvre pour assurer la disponibilité et la fiabilité de la
            plateforme, sans garantie d&apos;absence d&apos;interruption.
          </p>
        </section>
      </div>
    </div>
  );
}
