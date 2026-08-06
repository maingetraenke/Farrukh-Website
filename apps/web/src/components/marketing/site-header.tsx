"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LogoMark } from "@/components/marketing/illustrations";
import { CartButton } from "@/components/marketing/cart-button";

const navLinks = [
  { href: "/sortiment", label: "Sortiment" },
  { href: "/#ablauf", label: "So funktioniert's" },
  { href: "/#liefergebiet", label: "Liefergebiet" },
  { href: "/#kontakt", label: "Kontakt" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LogoMark className="size-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-foreground">
              MainGetränke
            </span>
            <span className="hidden text-[11px] text-muted-foreground sm:block">
              Dein Getränkeservice aus der Region
            </span>
          </div>
        </Link>

        <nav className="ml-4 hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground sm:flex">
            <MapPin className="size-3.5 text-primary" />
            Kitzingen &amp; Umgebung
          </div>
          <Button asChild size="lg" className="hidden h-9 sm:inline-flex">
            <Link href="/#kontakt">Kontakt aufnehmen</Link>
          </Button>
          <CartButton />
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Menü öffnen"
          >
            <Menu />
          </Button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Menü</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#kontakt"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground"
            >
              Kontakt aufnehmen
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
