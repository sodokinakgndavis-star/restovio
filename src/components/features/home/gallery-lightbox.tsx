"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function GalleryLightbox({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  function showPrev() {
    setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }
  function showNext() {
    setActiveIndex((i) => (i === null ? null : (i + 1) % images.length));
  }

  return (
    <>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setActiveIndex(0)}
          className="group relative block aspect-video w-full overflow-hidden rounded-lg"
        >
          <Image
            src={images[0]}
            alt="Photo de l'hôtel Restovio"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </button>
        <div className="grid grid-cols-4 gap-3">
          {images.slice(1).map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(i + 1)}
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={src}
                alt="Photo de l'hôtel Restovio"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      <Dialog open={activeIndex !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none ring-0 sm:max-w-4xl">
          <DialogTitle className="sr-only">Galerie photo Restovio</DialogTitle>
          {activeIndex !== null && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={images[activeIndex]}
                alt="Photo de l'hôtel Restovio"
                fill
                className="object-cover"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={showPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={showNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
