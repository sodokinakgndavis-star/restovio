export const metadata = { title: "Mentions légales" };

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <p className="text-xs font-medium tracking-[0.2em] text-olive uppercase">Informations</p>
      <h1 className="mt-2 font-heading text-4xl font-medium">Mentions légales</h1>

      <div className="mt-8 space-y-6 text-muted-foreground">
        <section>
          <h2 className="font-heading text-lg font-medium text-foreground">Éditeur du site</h2>
          <p className="mt-2">
            Restovio — Via della Riviera 24, 50122 Firenze, Italia.
            <br />
            Contact : contact@restovio.app
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-medium text-foreground">Hébergement</h2>
          <p className="mt-2">
            Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789,
            États-Unis.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-medium text-foreground">Propriété intellectuelle</h2>
          <p className="mt-2">
            L&apos;ensemble des contenus présents sur ce site (textes, visuels, identité
            visuelle) est protégé et ne peut être reproduit sans autorisation préalable.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-medium text-foreground">Contexte du projet</h2>
          <p className="mt-2">
            Restovio est un projet de démonstration réalisé dans un cadre pédagogique
            (formation Développeur Natif IA Web). Il ne s&apos;agit pas d&apos;un
            établissement hôtelier réel.
          </p>
        </section>
      </div>
    </div>
  );
}
