export const metadata = { title: "Politique de confidentialité" };

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <p className="text-xs font-medium tracking-[0.2em] text-olive uppercase">Informations</p>
      <h1 className="mt-2 font-heading text-4xl font-medium">Politique de confidentialité</h1>

      <div className="mt-8 space-y-6 text-muted-foreground">
        <section>
          <h2 className="font-heading text-lg font-medium text-foreground">Données collectées</h2>
          <p className="mt-2">
            Lors de la création d&apos;un compte ou d&apos;une réservation, nous collectons
            votre nom, votre adresse e-mail et les informations nécessaires au traitement de
            votre séjour (dates, nombre de personnes, commentaires facultatifs).
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-medium text-foreground">Utilisation</h2>
          <p className="mt-2">
            Ces données sont utilisées exclusivement pour la gestion de votre compte et de
            vos réservations. Votre mot de passe est chiffré et n&apos;est jamais stocké en
            clair.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-medium text-foreground">Vos droits</h2>
          <p className="mt-2">
            Vous pouvez à tout moment consulter et modifier vos informations personnelles
            depuis votre espace client. Pour toute demande de suppression de compte,
            contactez-nous à contact@restovio.app.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-medium text-foreground">Partage des données</h2>
          <p className="mt-2">
            Vos données ne sont jamais vendues ni partagées avec des tiers à des fins
            commerciales.
          </p>
        </section>
      </div>
    </div>
  );
}
