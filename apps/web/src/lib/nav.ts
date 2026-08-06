import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  ClipboardList,
  CreditCard,
  FileText,
  Folder,
  LayoutDashboard,
  PackageSearch,
  Recycle,
  Route,
  Settings,
  ShoppingCart,
  Truck,
  UserCog,
  Users,
  Warehouse,
} from "lucide-react";
import type { UserRole } from "@/lib/supabase/types";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  // Roles allowed to see this nav item. ADMIN always sees everything.
  roles: UserRole[];
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "DISPOSITION", "LAGER", "FAHRER", "BUCHHALTUNG"],
  },
  {
    title: "Bestellungen",
    href: "/orders",
    icon: ClipboardList,
    // Matches the order_inquiries RLS policy (order_inquiries_select_staff):
    // LAGER has no visibility into customer contact/delivery data or
    // pricing here, unlike the eventual Phase 2 picking-oriented order view.
    roles: ["ADMIN", "DISPOSITION", "BUCHHALTUNG"],
  },
  {
    title: "Kunden",
    href: "/customers",
    icon: Users,
    roles: ["ADMIN", "DISPOSITION", "LAGER", "BUCHHALTUNG"],
  },
  {
    title: "Produkte",
    href: "/products",
    icon: PackageSearch,
    roles: ["ADMIN", "DISPOSITION", "LAGER", "BUCHHALTUNG"],
  },
  {
    title: "Lager",
    href: "/inventory",
    icon: Warehouse,
    roles: ["ADMIN", "DISPOSITION", "LAGER"],
  },
  {
    title: "Einkauf/Lieferanten",
    href: "/suppliers",
    icon: ShoppingCart,
    roles: ["ADMIN", "DISPOSITION", "LAGER", "BUCHHALTUNG"],
  },
  {
    title: "Touren",
    href: "/routes",
    icon: Route,
    roles: ["ADMIN", "DISPOSITION", "FAHRER"],
  },
  {
    title: "Fahrer/Fahrzeuge",
    href: "/fleet",
    icon: Truck,
    roles: ["ADMIN", "DISPOSITION"],
  },
  {
    title: "Leergut/Pfand",
    href: "/deposits",
    icon: Recycle,
    roles: ["ADMIN", "DISPOSITION", "FAHRER", "BUCHHALTUNG"],
  },
  {
    title: "Rechnungen",
    href: "/invoices",
    icon: FileText,
    roles: ["ADMIN", "BUCHHALTUNG"],
  },
  {
    title: "Zahlungen",
    href: "/payments",
    icon: CreditCard,
    roles: ["ADMIN", "BUCHHALTUNG"],
  },
  {
    title: "Dokumente",
    href: "/documents",
    icon: Folder,
    roles: ["ADMIN", "DISPOSITION", "BUCHHALTUNG"],
  },
  {
    title: "Auswertungen",
    href: "/reports",
    icon: BarChart3,
    roles: ["ADMIN", "DISPOSITION", "BUCHHALTUNG"],
  },
  {
    title: "Einstellungen",
    href: "/settings",
    icon: Settings,
    roles: ["ADMIN"],
  },
  {
    title: "Benutzer",
    href: "/users",
    icon: UserCog,
    roles: ["ADMIN"],
  },
];

export function navItemsForRole(role: UserRole): NavItem[] {
  if (role === "ADMIN") return navItems;
  return navItems.filter((item) => item.roles.includes(role));
}

export const roleLabels: Record<UserRole, string> = {
  ADMIN: "Administrator",
  DISPOSITION: "Disposition",
  LAGER: "Lager",
  FAHRER: "Fahrer",
  BUCHHALTUNG: "Buchhaltung",
};
