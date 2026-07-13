import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "À propos" };

const values = [
  {
    title: "Accueil sur mesure",
    description: "Chaque séjour est pensé pour répondre aux attentes de nos voyageurs, du week-end en amoureux au voyage d'affaires.",
  },
  {
    title: "Confort et qualité",
    description: "Des chambres soigneusement entretenues, une literie premium et des équipements pensés pour votre confort.",
  },
  {
    title: "Équipe disponible",
    description: "Une réception ouverte 7j/7 pour répondre à toutes vos demandes avant, pendant et après votre séjour.",
  },
];

const venues = [
  {
    title: "Ristorante La Riviera",
    description: "Notre restaurant gastronomique, pour un dîner raffiné ou en famille vue piscine.",
  },
  {
    title: "Bellavita Spa",
    description: "Un espace bien-être pensé pour la détente, entre soins et moments de calme.",
  },
  {
    title: "Terrazza Firenze",
    description: "Notre bar en terrasse, pour un aperitivo au coucher du soleil sur les toits de Florence.",
  },
];

export default function AProposPage() {
  return (
    <div>
      <section className="relative flex h-72 items-center justify-center overflow-hidden bg-foreground text-ivory">
        <Image
          src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1600"
          alt="Hall de l'hôtel Restovio"
          fill
          className="object-cover opacity-45"
        />
        <div className="relative z-10 text-center">
          <p className="text-xs font-medium tracking-[0.3em] text-gold uppercase">Restovio</p>
          <h1 className="mt-3 font-heading text-5xl font-medium">À propos</h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-xs font-medium tracking-[0.2em] text-olive uppercase">Depuis nos débuts</p>
        <h2 className="mt-2 font-heading text-3xl font-medium">Notre histoire</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Restovio est né de la restauration d&apos;une ancienne demeure florentine du
          quartier de l&apos;Oltrarno, rachetée à l&apos;abandon et transformée en hôtel
          boutique. Ses volumes d&apos;origine, ses sols en terre cuite et ses poutres
          apparentes ont été conservés, puis mariés à un confort résolument contemporain.
        </p>
        <p className="mt-4 text-lg text-muted-foreground">
          Restovio est un établissement situé au cœur de Florence, à quelques pas
          du Ponte Vecchio, où chaque détail est pensé pour rendre votre séjour aussi
          agréable que mémorable. Nous accueillons voyageurs d&apos;affaires et touristes
          dans un cadre élégant inspiré des plus belles maisons italiennes.
        </p>
        <p className="mt-4 text-lg text-muted-foreground">
          Notre équipe s&apos;engage à offrir un service attentif et personnalisé, du
          moment de la réservation jusqu&apos;à votre départ.
        </p>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <p className="text-xs font-medium tracking-[0.2em] text-olive uppercase">Sur place</p>
            <h2 className="mt-2 font-heading text-3xl font-medium">Nos adresses</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {venues.map((venue) => (
              <div key={venue.title} className="rounded-lg border border-border/60 bg-card p-6 text-center">
                <h3 className="font-heading font-medium">{venue.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{venue.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <p className="text-xs font-medium tracking-[0.2em] text-olive uppercase">Promesse</p>
            <h2 className="mt-2 font-heading text-3xl font-medium">Nos engagements</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="rounded-lg border border-border/60 p-6">
                <h3 className="font-heading font-medium">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center font-heading text-2xl font-medium">Loisirs et avantages</h2>
          <ul className="mt-8 space-y-4 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Remise longue durée : </span>
              -30 % automatique sur tout séjour de 30 nuits ou plus.
            </li>
            <li>
              <span className="font-medium text-foreground">Salle de cinéma : </span>
              séance ouverte à tous les clients chaque vendredi soir.
            </li>
            <li>
              <span className="font-medium text-foreground">Piscines : </span>
              un bassin adultes et un bassin enfants, en accès libre pour tous les résidents.
            </li>
            <li>
              <span className="font-medium text-foreground">Sorties : </span>
              service de chauffeur disponible sur demande auprès de la réception.
            </li>
            <li>
              <span className="font-medium text-foreground">Restaurant : </span>
              découvrez notre menu et réservez une table en famille avec vue sur la
              piscine depuis la page{" "}
              <Link href="/restaurant" className="underline underline-offset-4 hover:text-foreground">
                Restaurant
              </Link>
              .
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
