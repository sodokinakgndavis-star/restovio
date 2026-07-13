import Image from "next/image";
import { ChefHat, UtensilsCrossed } from "lucide-react";
import { MenuSection } from "@/components/features/restaurant/menu-section";
import { TableReservationForm } from "@/components/features/restaurant/table-reservation-form";
import { getMenuItems } from "@/lib/data/menu";

export const metadata = { title: "Restaurant" };
export const revalidate = 60;

export default async function RestaurantPage() {
  const items = await getMenuItems();
  const signatureDishes = items.slice(0, 3);

  return (
    <div>
      <section className="relative flex h-80 items-center justify-center overflow-hidden bg-foreground text-ivory">
        <Image
          src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1600"
          alt="Ristorante Restovio"
          fill
          className="object-cover opacity-45"
        />
        <div className="relative z-10 text-center">
          <p className="text-xs font-medium tracking-[0.3em] text-gold uppercase">Ristorante</p>
          <h1 className="mt-3 font-heading text-5xl font-medium">La Riviera</h1>
          <p className="mt-3 text-ivory/85">
            Une cuisine italienne raffinée et une table réservable, vue sur la piscine.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="flex items-start gap-4">
            <ChefHat className="mt-1 h-6 w-6 shrink-0 text-olive" />
            <div>
              <h2 className="font-heading text-lg font-medium">Notre chef</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Formé dans les cuisines de Florence et de Milan, notre chef sublime les
                produits italiens de saison avec une exigence toute personnelle, entre
                tradition et modernité.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <UtensilsCrossed className="mt-1 h-6 w-6 shrink-0 text-olive" />
            <div>
              <h2 className="font-heading text-lg font-medium">Notre histoire</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Née de la passion de l&apos;hôtel pour l&apos;art de recevoir, La Riviera
                propose une carte courte et sincère, renouvelée au fil des saisons.
              </p>
            </div>
          </div>
        </div>

        {signatureDishes.length > 0 && (
          <div className="mt-14">
            <p className="text-center text-xs font-medium tracking-[0.2em] text-olive uppercase">
              Plats signatures
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {signatureDishes.map((dish) => (
                <div key={dish.id} className="rounded-lg border border-border/60 p-4 text-center">
                  <p className="font-heading text-sm font-medium">{dish.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{dish.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="border-y border-border/60 bg-secondary/40 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <p className="text-xs font-medium tracking-[0.2em] text-olive uppercase">Carte</p>
            <h2 className="mt-2 font-heading text-3xl font-medium">Le menu</h2>
          </div>
          <div className="mt-10">
            <MenuSection items={items} />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1780559146299-2cf95a4ffa82?w=1000"
                alt="Table en famille avec vue sur la piscine"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-olive uppercase">Réserver</p>
              <h2 className="mt-2 font-heading text-3xl font-medium">
                Dîner en famille, vue sur la piscine
              </h2>
              <p className="mt-3 text-muted-foreground">
                Réservez une table pour profiter d&apos;un dîner en famille face à la
                piscine, chaque soir de 19h à 22h. La confirmation vous est envoyée dans
                votre espace client.
              </p>
              <div className="mt-8 rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                <TableReservationForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
