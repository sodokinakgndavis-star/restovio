import { ContactForm } from "@/components/features/home/contact-form";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold">Contactez-nous</h1>
      <p className="mt-2 text-muted-foreground">
        Une question sur une réservation, un séjour ou nos chambres ? Écrivez-nous, notre
        équipe vous répond dans les meilleurs délais.
      </p>

      <div className="mt-8">
        <ContactForm />
      </div>

      <div className="mt-10 grid gap-4 border-t pt-8 text-sm sm:grid-cols-3">
        <div>
          <p className="font-semibold">Adresse</p>
          <p className="text-muted-foreground">12 rue des Voyageurs, 75000 Paris</p>
        </div>
        <div>
          <p className="font-semibold">Téléphone</p>
          <p className="text-muted-foreground">+33 1 23 45 67 89</p>
        </div>
        <div>
          <p className="font-semibold">E-mail</p>
          <p className="text-muted-foreground">contact@reservia.app</p>
        </div>
      </div>
    </div>
  );
}
