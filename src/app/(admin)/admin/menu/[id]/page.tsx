import { notFound } from "next/navigation";
import { MenuItemForm } from "@/components/features/admin/menu-item-form";
import { getMenuItemById } from "@/lib/data/menu";

export const metadata = { title: "Modifier un plat" };

export default async function EditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getMenuItemById(id);

  if (!item) notFound();

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold">Modifier « {item.name} »</h1>
      <div className="mt-6">
        <MenuItemForm
          itemId={item.id}
          defaultValues={{
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            available: item.available,
          }}
        />
      </div>
    </div>
  );
}
