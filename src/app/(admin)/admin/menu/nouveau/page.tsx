import { MenuItemForm } from "@/components/features/admin/menu-item-form";

export const metadata = { title: "Ajouter un plat" };

export default function NewMenuItemPage() {
  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold">Ajouter un plat</h1>
      <div className="mt-6">
        <MenuItemForm />
      </div>
    </div>
  );
}
