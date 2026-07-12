"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactMessage, type ContactFormState } from "@/app/(public)/contact/actions";

const initialState: ContactFormState = { success: false, message: "" };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactMessage, initialState);

  useEffect(() => {
    if (!state.message) return;
    if (state.success) {
      toast.success(state.message);
    } else if (!state.fieldErrors) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4" key={state.success ? "sent" : "form"}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Sujet (facultatif)</Label>
        <Input id="subject" name="subject" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required minLength={10} rows={5} />
        {state.fieldErrors?.message && (
          <p className="text-sm text-destructive">{state.fieldErrors.message[0]}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? "Envoi en cours…" : "Envoyer le message"}
      </Button>
    </form>
  );
}
