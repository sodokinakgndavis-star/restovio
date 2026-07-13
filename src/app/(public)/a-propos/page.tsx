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

export default function AProposPage() {
  return (
    <div>
      <section className="relative flex h-64 items-center justify-center overflow-hidden bg-[#1F3864] text-white">
        <Image
          src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1600"
          alt="Hall de l'hôtel Restovio"
          fill
          className="object-cover opacity-40"
        />
        <h1 className="relative z-10 text-4xl font-bold">À propos de Restovio</h1>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-lg text-muted-foreground">
          Restovio est un établissement hôtelier situé au cœur de la ville, où chaque détail
          est pensé pour rendre votre séjour aussi agréable que mémorable. Depuis notre
          ouverture, nous accueillons voyageurs d&apos;affaires et touristes dans un cadre
          élégant et chaleureux.
        </p>
        <p className="mt-4 text-lg text-muted-foreground">
          Notre équipe s&apos;engage à offrir un service attentif et personnalisé, du moment
          de la réservation jusqu&apos;à votre départ.
        </p>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold">Nos engagements</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="rounded-lg border bg-background p-6">
                <h3 className="font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold">Loisirs et avantages</h2>
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
            un chauffeur est disponible pour vos excursions ; sans véhicule personnel, le
            tarif se négocie directement avec lui.
          </li>
          <li>
            <span className="font-medium text-foreground">Restaurant : </span>
            découvrez notre menu et réservez une table en famille avec vue sur la piscine
            depuis la page{" "}
            <Link href="/restaurant" className="underline underline-offset-4 hover:text-foreground">
              Restaurant
            </Link>
            .
          </li>
        </ul>
      </section>
    </div>
  );
}
