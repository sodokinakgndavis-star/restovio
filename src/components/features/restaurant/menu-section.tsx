import { formatPrice, menuCategoryLabels } from "@/lib/format";
import type { MenuItem } from "@prisma/client";

const CATEGORY_ORDER = ["ENTREE", "PLAT", "DESSERT", "BOISSON"] as const;

export function MenuSection({ items }: { items: MenuItem[] }) {
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);

  if (grouped.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Le menu sera bientôt disponible.
      </p>
    );
  }

  return (
    <div className="grid gap-10 sm:grid-cols-2">
      {grouped.map((group) => (
        <div key={group.category}>
          <h3 className="border-b pb-2 text-lg font-semibold">
            {menuCategoryLabels[group.category]}
          </h3>
          <ul className="mt-4 space-y-4">
            {group.items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <span className="shrink-0 font-semibold">{formatPrice(item.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
