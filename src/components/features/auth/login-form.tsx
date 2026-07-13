"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Comptes de démonstration créés par le seed (prisma/seed.ts) — utilisés uniquement
// pour faciliter la présentation du projet (section 12 du cahier des charges de finition).
const DEMO_ACCOUNTS = [
  { label: "Compte client de démonstration", email: "client@restovio.app", password: "Client1234!" },
  { label: "Compte administrateur de démonstration", email: "admin@restovio.app", password: "Admin1234!" },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function fillDemoAccount(email: string, password: string) {
    if (emailRef.current) emailRef.current.value = email;
    if (passwordRef.current) passwordRef.current.value = password;
    setError(null);
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    startTransition(async () => {
      const result = await signIn("credentials", { email, password, redirect: false });

      if (!result || result.error) {
        setError("E-mail ou mot de passe incorrect.");
        toast.error("E-mail ou mot de passe incorrect.");
        return;
      }

      toast.success("Connexion réussie.");
      const callbackUrl = searchParams.get("callbackUrl") ?? "/mon-compte";
      router.push(callbackUrl);
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" ref={emailRef} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" name="password" type="password" ref={passwordRef} required />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={isPending} className="w-full bg-olive text-olive-foreground hover:bg-olive/85">
          {isPending ? "Connexion en cours…" : "Se connecter"}
        </Button>
      </form>

      <div className="rounded-lg border border-border/60 bg-muted/50 p-3.5 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5 font-medium text-foreground/80">
          <Info className="h-3.5 w-3.5" />
          Comptes de démonstration
        </p>
        <p className="mt-1.5">Pour découvrir le site sans créer de compte :</p>
        <div className="mt-2 flex flex-col gap-1.5 sm:flex-row">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => fillDemoAccount(account.email, account.password)}
              className="flex-1 rounded-md border border-border/60 bg-background px-2.5 py-1.5 text-left text-xs font-medium text-foreground transition-colors hover:border-olive hover:text-olive"
            >
              {account.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
