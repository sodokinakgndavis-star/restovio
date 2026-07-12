import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { categoryLabels, formatPrice } from "@/lib/format";

type RoomCardData = {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  category: string;
  images: string[];
};

export function RoomCard({ room }: { room: RoomCardData }) {
  const image = room.images[0];

  return (
    <Card className="overflow-hidden py-0 gap-0">
      <div className="relative aspect-[4/3] w-full bg-muted">
        {image ? (
          <Image
            src={image}
            alt={room.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Aucune photo
          </div>
        )}
        <Badge className="absolute left-3 top-3">{categoryLabels[room.category] ?? room.category}</Badge>
      </div>

      <CardContent className="space-y-2 pt-4">
        <h3 className="text-lg font-semibold">{room.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{room.description}</p>
        <p className="text-sm text-muted-foreground">Jusqu&apos;à {room.capacity} personnes</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between pb-4">
        <span className="text-lg font-bold">
          {formatPrice(room.price)} <span className="text-sm font-normal text-muted-foreground">/ nuit</span>
        </span>
        <Button size="sm" render={<Link href={`/chambres/${room.id}`} />}>
          Voir la chambre
        </Button>
      </CardFooter>
    </Card>
  );
}
