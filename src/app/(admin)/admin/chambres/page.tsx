import Link from "next/link";
import Image from "next/image";
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
import { DeleteRoomButton } from "@/components/features/admin/delete-room-button";
import { getAllRoomsForAdmin } from "@/lib/data/rooms";
import { categoryLabels, formatPrice } from "@/lib/format";

export const metadata = { title: "Gestion des chambres" };
export const dynamic = "force-dynamic";

export default async function AdminRoomsPage() {
  const rooms = await getAllRoomsForAdmin();

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chambres</h1>
          <p className="text-sm text-muted-foreground">{rooms.length} chambre(s) au total</p>
        </div>
        <Button render={<Link href="/admin/chambres/nouvelle" />}>Nouvelle chambre</Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border bg-background">
        {rooms.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Aucune chambre pour le moment. Créez-en une pour commencer.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chambre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix / nuit</TableHead>
                <TableHead>Capacité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Réservations actives</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="flex items-center gap-3">
                    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-muted">
                      {room.images[0] && (
                        <Image src={room.images[0]} alt="" fill className="object-cover" />
                      )}
                    </div>
                    <span className="font-medium">{room.name}</span>
                  </TableCell>
                  <TableCell>{categoryLabels[room.category] ?? room.category}</TableCell>
                  <TableCell>{formatPrice(room.price)}</TableCell>
                  <TableCell>{room.capacity} pers.</TableCell>
                  <TableCell>
                    <Badge variant={room.available ? "default" : "secondary"}>
                      {room.available ? "Disponible" : "En pause"}
                    </Badge>
                  </TableCell>
                  <TableCell>{room._count.bookings}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Modifier ${room.name}`}
                        render={<Link href={`/admin/chambres/${room.id}`} />}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteRoomButton roomId={room.id} roomName={room.name} />
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
