import Image from "next/image";
import { MenuSection } from "@/components/features/restaurant/menu-section";
import { TableReservationForm } from "@/components/features/restaurant/table-reservation-form";
import { getMenuItems } from "@/lib/data/menu";

export const metadata = { title: "Restaurant" };
export const revalidate = 60;

export default async function RestaurantPage() {
  const items = await getMenuItems();

  return (
    <div>
      <section className="relative flex h-64 items-center justify-center overflow-hidden bg-[#1F3864] text-white">
        <Image
          src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1600"
          alt="Restaurant Reservia"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold">Notre restaurant</h1>
          <p className="mt-2 text-white/90">
            Un menu varié et une table réservable en famille, vue sur la piscine.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">Le menu</h2>
        <div className="mt-10">
          <MenuSection items={items} />
        </div>
      </section>

      <section className="bg-muted/30 py-16">
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
              <h2 className="text-3xl font-bold">Dîner en famille, vue sur la piscine</h2>
              <p className="mt-3 text-muted-foreground">
                Réservez une table pour profiter d&apos;un dîner en famille face à la
                piscine, chaque soir de 19h à 22h. La confirmation vous est envoyée dans
                votre espace client.
              </p>
              <div className="mt-8 rounded-xl border bg-background p-6 shadow-sm">
                <TableReservationForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
