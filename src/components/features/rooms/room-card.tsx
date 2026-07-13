import Image from "next/image";
import Link from "next/link";
import { Check, Users } from "lucide-react";
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
  amenities?: string[];
  available?: boolean;
};

export function RoomCard({ room }: { room: RoomCardData }) {
  const image = room.images[0];
  const topAmenities = (room.amenities ?? []).slice(0, 3);

  return (
    <Card className="group overflow-hidden gap-0 border-border/60 py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={room.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Aucune photo
          </div>
        )}
        <Badge className="absolute left-3 top-3 bg-foreground/85 text-ivory">
          {categoryLabels[room.category] ?? room.category}
        </Badge>
        {room.available === false && (
          <Badge variant="secondary" className="absolute right-3 top-3">
            En pause
          </Badge>
        )}
      </div>

      <CardContent className="space-y-3 pt-5">
        <h3 className="font-heading text-lg font-medium">{room.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{room.description}</p>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          Jusqu&apos;à {room.capacity} personnes
        </div>

        {topAmenities.length > 0 && (
          <ul className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
            {topAmenities.map((amenity) => (
              <li key={amenity} className="flex items-center gap-1 text-xs text-muted-foreground">
                <Check className="h-3 w-3 text-olive" />
                {amenity}
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 pb-5 pt-2">
        <span className="font-heading text-lg font-medium">
          {formatPrice(room.price)}{" "}
          <span className="text-xs font-normal text-muted-foreground">/ nuit</span>
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" render={<Link href={`/chambres/${room.id}`} />}>
            Voir
          </Button>
          <Button
            size="sm"
            className="bg-olive text-olive-foreground hover:bg-olive/85"
            render={<Link href={`/chambres/${room.id}#reserver`} />}
          >
            Réserver
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
