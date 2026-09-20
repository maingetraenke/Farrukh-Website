import Image from "next/image";
import { redirect } from "next/navigation";
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
          <Image
            src="/logo.png"
            alt="MainGetränke"
            width={64}
            height={64}
            className="size-16 object-contain"
            priority
          />
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
