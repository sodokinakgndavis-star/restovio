import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/features/auth/login-form";

export const metadata = { title: "Connexion" };

export default function ConnexionPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Connexion</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Accédez à votre espace personnel Reservia.
      </p>

      <div className="mt-6">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-medium text-foreground underline underline-offset-4">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
