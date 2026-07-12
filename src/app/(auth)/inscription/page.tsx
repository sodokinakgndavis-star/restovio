import Link from "next/link";
import { Suspense } from "react";
import { RegisterForm } from "@/components/features/auth/register-form";

export const metadata = { title: "Inscription" };

export default function InscriptionPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Créer un compte</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Inscrivez-vous pour réserver une chambre et suivre vos séjours.
      </p>

      <div className="mt-6">
        <Suspense>
          <RegisterForm />
        </Suspense>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-medium text-foreground underline underline-offset-4">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
