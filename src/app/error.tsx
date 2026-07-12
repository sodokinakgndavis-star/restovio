"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold text-destructive">Erreur</p>
      <h1 className="mt-2 text-3xl font-bold">Une erreur est survenue</h1>
      <p className="mt-2 text-muted-foreground">
        Merci de réessayer. Si le problème persiste, contactez notre équipe.
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={reset}>
          Réessayer
        </Button>
        <Button render={<Link href="/" />}>Retour à l&apos;accueil</Button>
      </div>
    </div>
  );
}
