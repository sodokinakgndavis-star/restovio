export const metadata = { title: "FAQ" };

const faqs = [
  {
    question: "Comment réserver une chambre ?",
    answer:
      "Choisissez vos dates depuis le moteur de recherche en page d'accueil ou depuis le catalogue des chambres, sélectionnez une chambre disponible, puis connectez-vous ou créez un compte pour finaliser votre réservation.",
  },
  {
    question: "Un acompte est-il demandé ?",
    answer:
      "Oui, un acompte de 50 % du montant total est dû à la réservation. Le solde est réglé directement sur place, à votre arrivée.",
  },
  {
    question: "Puis-je annuler ma réservation ?",
    answer:
      "Oui, depuis votre espace client, tant que la date d'arrivée n'est pas passée. L'acompte versé vous est remboursé sous 24 heures.",
  },
  {
    question: "Existe-t-il une réduction pour les longs séjours ?",
    answer:
      "Oui, une remise automatique de 30 % s'applique à tout séjour de 30 nuits consécutives ou plus, calculée directement au moment de la réservation.",
  },
  {
    question: "Comment réserver une table au restaurant ?",
    answer:
      "Rendez-vous sur la page Restaurant, choisissez une date et un créneau entre 19h et 22h, puis confirmez depuis votre espace client.",
  },
  {
    question: "Le petit-déjeuner est-il inclus ?",
    answer:
      "Oui, le petit-déjeuner italien est offert à tous les clients de l'hôtel, servi chaque matin de 7h à 11h.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <p className="text-xs font-medium tracking-[0.2em] text-olive uppercase">Informations</p>
      <h1 className="mt-2 font-heading text-4xl font-medium">Questions fréquentes</h1>

      <div className="mt-8 divide-y divide-border/60">
        {faqs.map((faq) => (
          <div key={faq.question} className="py-5">
            <h2 className="font-heading text-base font-medium">{faq.question}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
