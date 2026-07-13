import { ContactForm } from "@/components/features/home/contact-form";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <p className="text-xs font-medium tracking-[0.2em] text-olive uppercase">Restovio · Firenze</p>
      <h1 className="mt-2 font-heading text-4xl font-medium">Contactez-nous</h1>
      <p className="mt-2 text-muted-foreground">
        Une question sur une réservation, un séjour ou nos chambres ? Écrivez-nous, notre
        équipe vous répond dans les meilleurs délais.
      </p>

      <div className="mt-8">
        <ContactForm />
      </div>

      <div className="mt-10 grid gap-4 border-t border-border/60 pt-8 text-sm sm:grid-cols-3">
        <div>
          <p className="font-heading font-medium">Adresse</p>
          <p className="text-muted-foreground">Via della Riviera 24, 50122 Firenze, Italia</p>
        </div>
        <div>
          <p className="font-heading font-medium">Téléphone</p>
          <p className="text-muted-foreground">+39 055 123 4567</p>
        </div>
        <div>
          <p className="font-heading font-medium">E-mail</p>
          <p className="text-muted-foreground">contact@restovio.app</p>
        </div>
      </div>
    </div>
  );
}
