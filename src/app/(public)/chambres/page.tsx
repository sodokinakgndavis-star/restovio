import { RoomCard } from "@/components/features/rooms/room-card";
import { RoomFilters } from "@/components/features/rooms/room-filters";
import { RoomPagination } from "@/components/features/rooms/room-pagination";
import { getRooms } from "@/lib/data/rooms";
import type { RoomCategory } from "@prisma/client";

export const metadata = { title: "Nos chambres" };

type SearchParams = {
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
};

const VALID_CATEGORIES = ["STANDARD", "SUPERIEURE", "SUITE", "FAMILIALE"];

export default async function ChambresPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const category =
    params.category && VALID_CATEGORIES.includes(params.category)
      ? (params.category as RoomCategory)
      : undefined;

  const { rooms, page, totalPages, total } = await getRooms({
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    guests: params.guests ? Number(params.guests) : undefined,
    category,
    minPrice: params.minPrice ? Number(params.minPrice) * 100 : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) * 100 : undefined,
    page: params.page ? Number(params.page) : 1,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Nos chambres</h1>
      <p className="mt-2 text-muted-foreground">{total} chambre(s) disponible(s)</p>

      <div className="mt-6">
        <RoomFilters />
      </div>

      {rooms.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium">Aucune chambre ne correspond à votre recherche.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Essayez de modifier vos filtres ou vos dates de séjour.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>

          <div className="mt-10">
            <RoomPagination page={page} totalPages={totalPages} searchParams={params} />
          </div>
        </>
      )}
    </div>
  );
}
