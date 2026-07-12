"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGES = 8;

export function RoomImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} photos par chambre.`);
      return;
    }

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          toast.error(`${file.name} : type non autorisé (jpg, png, webp).`);
          continue;
        }
        if (file.size > MAX_SIZE_BYTES) {
          toast.error(`${file.name} dépasse 5 Mo.`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error ?? "Échec de l'upload.");
          continue;
        }

        onChange([...images, data.url]);
      }
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(url: string) {
    onChange(images.filter((img) => img !== url));
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((url) => (
          <div key={url} className="relative aspect-square overflow-hidden rounded-md border">
            <Image src={url} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground hover:bg-muted disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Upload className="h-5 w-5" />
            )}
            <span className="text-xs">Ajouter</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="text-xs text-muted-foreground">
        jpg, png ou webp — 5 Mo max par photo, {MAX_IMAGES} photos maximum.
      </p>
    </div>
  );
}
