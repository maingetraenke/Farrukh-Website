import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-shell/app-sidebar";
import { Topbar } from "@/components/app-shell/topbar";
import { requireUser } from "@/lib/auth/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <SidebarProvider>
      <AppSidebar role={user.role} fullName={user.fullName} />
      <div className="flex min-h-svh flex-1 flex-col">
        <Topbar fullName={user.fullName} role={user.role} />
        <main className="flex-1 bg-background p-4 md:p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
