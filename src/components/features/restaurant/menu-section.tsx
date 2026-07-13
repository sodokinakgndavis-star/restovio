import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
    <Tabs defaultValue={grouped[0].category} className="items-center">
      <TabsList variant="line" className="border-b border-border/60">
        {grouped.map((group) => (
          <TabsTrigger key={group.category} value={group.category} className="px-4 py-2 text-sm">
            {menuCategoryLabels[group.category]}
          </TabsTrigger>
        ))}
      </TabsList>

      {grouped.map((group) => (
        <TabsContent key={group.category} value={group.category} className="mt-8 w-full">
          <ul className="mx-auto max-w-2xl space-y-5">
            {group.items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-heading text-base font-medium">{item.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
                <span className="shrink-0 font-heading font-medium">
                  {formatPrice(item.price)}
                </span>
              </li>
            ))}
          </ul>
        </TabsContent>
      ))}
    </Tabs>
  );
}
