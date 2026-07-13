import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <Link href="/" className="flex items-center gap-2.5">
        <Image src="/logo-mark.png" alt="Restovio" width={34} height={34} className="h-8 w-8" />
        <span className="font-heading text-xl font-semibold tracking-wide">Restovio</span>
      </Link>
      <p className="mt-10 text-xs font-medium tracking-[0.3em] text-olive uppercase">404</p>
      <h1 className="mt-2 font-heading text-3xl font-medium">Page introuvable</h1>
      <p className="mt-2 text-muted-foreground">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Button className="mt-8 bg-olive text-olive-foreground hover:bg-olive/85" render={<Link href="/" />}>
        Retour à l&apos;accueil
      </Button>
    </div>
  );
}
