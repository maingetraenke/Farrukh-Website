"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactMessage, type ContactFormState } from "@/lib/leads/actions";

const initialState: ContactFormState = {};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactMessage,
    initialState,
  );

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="size-8 text-primary" />
        <p className="font-semibold text-foreground">
          Danke für deine Nachricht!
        </p>
        <p className="text-muted-foreground text-sm">
          Wir melden uns so schnell wie möglich bei dir zurück.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <h3 className="font-semibold text-foreground">Nachricht schreiben</h3>
        <p className="text-muted-foreground text-sm">
          Für alles, was nicht in den Warenkorb passt.
        </p>
      </div>
      {/* Honeypot — hidden from real users, bots often fill every field. */}
      <div className="hidden" aria-hidden="true">
        <Label htmlFor="website">Website</Label>
        <Input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">E-Mail</Label>
          <Input id="email" name="email" type="email" required />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Telefon (optional)</Label>
        <Input id="phone" name="phone" type="tel" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Nachricht</Label>
        <Textarea id="message" name="message" rows={4} required />
      </div>
      {state?.error ? (
        <p className="text-destructive text-sm" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="h-10 w-fit px-6">
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        Nachricht senden
      </Button>
    </form>
  );
}
