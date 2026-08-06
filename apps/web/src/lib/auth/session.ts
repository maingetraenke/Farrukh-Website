import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/types";

export interface CurrentUser {
  id: string;
  email: string | null;
  fullName: string;
  role: UserRole;
  organizationId: string | null;
  organizationName: string | null;
}

// Server-side session + profile lookup. Every protected page/layout should
// call this (directly or via requireRole) rather than trusting client
// state — permissions are enforced here and by RLS, never client-only.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, organization_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;

  let organizationName: string | null = null;
  if (profile.organization_id) {
    const { data: organization } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", profile.organization_id)
      .maybeSingle();
    organizationName = organization?.name ?? null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
    fullName: profile.full_name,
    role: profile.role,
    organizationId: profile.organization_id,
    organizationName,
  };
}

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.organizationId) redirect("/login?error=no-organization");
  return user;
}

export async function requireRole(...roles: UserRole[]): Promise<CurrentUser> {
  const user = await requireUser();
  if (!roles.includes(user.role) && user.role !== "ADMIN") {
    redirect("/dashboard?error=forbidden");
  }
  return user;
}
