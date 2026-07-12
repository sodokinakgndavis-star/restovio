import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteMenuItemButton } from "@/components/features/admin/delete-menu-item-button";
import { getAllMenuItemsForAdmin } from "@/lib/data/menu";
import { formatPrice, menuCategoryLabels } from "@/lib/format";

export const metadata = { title: "Gestion du menu" };
export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const items = await getAllMenuItemsForAdmin();

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Menu du restaurant</h1>
          <p className="text-sm text-muted-foreground">{items.length} plat(s) au total</p>
        </div>
        <Button render={<Link href="/admin/menu/nouveau" />}>Ajouter un plat</Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border bg-background">
        {items.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Aucun plat pour le moment.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plat</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {item.description}
                    </p>
                  </TableCell>
                  <TableCell>{menuCategoryLabels[item.category]}</TableCell>
                  <TableCell>{formatPrice(item.price)}</TableCell>
                  <TableCell>
                    <Badge variant={item.available ? "default" : "secondary"}>
                      {item.available ? "Visible" : "Masqué"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        render={<Link href={`/admin/menu/${item.id}`} />}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteMenuItemButton itemId={item.id} itemName={item.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
