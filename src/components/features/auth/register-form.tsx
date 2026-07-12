"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser, type RegisterFormState } from "@/app/(auth)/inscription/actions";

const initialState: RegisterFormState = { success: false, message: "" };

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(registerUser, initialState);
  const [isSigningIn, startSignIn] = useTransition();

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);
      const data = formRef.current ? new FormData(formRef.current) : null;
      const email = data?.get("email") as string | undefined;
      const password = data?.get("password") as string | undefined;
      const callbackUrl = searchParams.get("callbackUrl") ?? "/mon-compte";

      if (email && password) {
        startSignIn(async () => {
          const result = await signIn("credentials", { email, password, redirect: false });
          if (result?.ok) {
            router.push(callbackUrl);
            router.refresh();
          } else {
            router.push("/connexion");
          }
        });
      }
    } else if (!state.fieldErrors) {
      toast.error(state.message);
    }
  }, [state, router, searchParams]);

  return (
    <form id="register-form" ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom complet</Label>
        <Input id="name" name="name" required minLength={2} />
        {state.fieldErrors?.name && (
          <p className="text-sm text-destructive">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" required />
        {state.fieldErrors?.email && (
          <p className="text-sm text-destructive">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" required minLength={8} />
        {state.fieldErrors?.password && (
          <p className="text-sm text-destructive">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending || isSigningIn} className="w-full">
        {isPending || isSigningIn ? "Création en cours…" : "Créer mon compte"}
      </Button>
    </form>
  );
}
