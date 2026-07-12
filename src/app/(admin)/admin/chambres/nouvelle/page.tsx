import { RoomForm } from "@/components/features/admin/room-form";

export const metadata = { title: "Nouvelle chambre" };

export default function NewRoomPage() {
  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold">Nouvelle chambre</h1>
      <div className="mt-6">
        <RoomForm />
      </div>
    </div>
  );
}
