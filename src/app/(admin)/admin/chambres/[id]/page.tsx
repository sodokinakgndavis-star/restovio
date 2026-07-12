import { notFound } from "next/navigation";
import { RoomForm } from "@/components/features/admin/room-form";
import { getRoomById } from "@/lib/data/rooms";

export const metadata = { title: "Modifier une chambre" };

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = await getRoomById(id);

  if (!room) notFound();

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold">Modifier « {room.name} »</h1>
      <div className="mt-6">
        <RoomForm
          roomId={room.id}
          defaultValues={{
            name: room.name,
            description: room.description,
            price: room.price,
            capacity: room.capacity,
            category: room.category,
            amenities: room.amenities,
            images: room.images,
            available: room.available,
          }}
        />
      </div>
    </div>
  );
}
