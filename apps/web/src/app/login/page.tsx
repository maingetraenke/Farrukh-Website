import { redirect } from "next/navigation";
import { Droplet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Droplet className="size-6" />
          </div>
          <span className="text-lg font-semibold text-foreground">
            MainGetränke
          </span>
          <span className="text-muted-foreground text-sm">
            Interne Warenwirtschaft
          </span>
        </div>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Anmelden</CardTitle>
            <CardDescription>
              Bitte mit deinem MainGetränke-Konto anmelden.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
        <p className="text-muted-foreground text-center text-xs">
          Zugangsdaten vergessen? Bitte an die Administration wenden.
        </p>
      </div>
    </div>
  );
}
