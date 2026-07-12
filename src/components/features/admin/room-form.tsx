"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoomImageUploader } from "@/components/features/admin/room-image-uploader";
import { roomSchema, type RoomInput } from "@/lib/validators/room";
import { categoryLabels } from "@/lib/format";

type RoomFormProps = {
  roomId?: string;
  defaultValues?: Partial<RoomInput>;
};

export function RoomForm({ roomId, defaultValues }: RoomFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RoomInput>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      capacity: 2,
      category: "STANDARD",
      amenities: [],
      images: [],
      available: true,
      ...defaultValues,
    },
  });

  const images = watch("images");

  async function onSubmit(values: RoomInput) {
    setIsSubmitting(true);
    try {
      const res = await fetch(roomId ? `/api/rooms/${roomId}` : "/api/rooms", {
        method: roomId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Une erreur est survenue.");
        return;
      }

      toast.success(roomId ? "Chambre mise à jour." : "Chambre créée.");
      router.push("/admin/chambres");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nom de la chambre</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} {...register("description")} />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Prix par nuit (en centimes)</Label>
          <Input id="price" type="number" min={1} {...register("price")} />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacité (personnes)</Label>
          <Input id="capacity" type="number" min={1} {...register("capacity")} />
          {errors.capacity && (
            <p className="text-sm text-destructive">{errors.capacity.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Catégorie</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amenities">Équipements (séparés par des virgules)</Label>
        <Input
          id="amenities"
          defaultValue={defaultValues?.amenities?.join(", ") ?? ""}
          onChange={(e) =>
            setValue(
              "amenities",
              e.target.value
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean)
            )
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Photos</Label>
        <RoomImageUploader images={images} onChange={(imgs) => setValue("images", imgs)} />
        {errors.images && <p className="text-sm text-destructive">{errors.images.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="available"
          render={({ field }) => (
            <Checkbox
              id="available"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
          )}
        />
        <Label htmlFor="available" className="font-normal">
          Chambre disponible à la vente
        </Label>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enregistrement…" : roomId ? "Enregistrer les modifications" : "Créer la chambre"}
      </Button>
    </form>
  );
}
