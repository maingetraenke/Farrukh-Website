"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
    <header className="sticky top-0 z-40">
      {/* Solid, fully opaque white — not a translucent/blurred backdrop —
          so the logo overlapping past the nav row always sits on real white
          paint, not on whatever happens to be scrolled underneath. Tall
          enough to fully contain the logo; the soft fade below (rather than
          a hard border) is what actually transitions into the page. */}
      <div className="relative bg-white pb-[68px]">
        {/* Full-bleed divider at the logo's vertical midpoint, separating
            the nav row from the fade below. Placed before the row in DOM
            order (and the logo has no z-index of its own) so the row —
            logo included — naturally paints on top of it. */}
        <div className="absolute inset-x-0 top-[74px] h-px bg-border" />
        <div className="mx-auto flex h-20 max-w-6xl items-center gap-4 px-4 md:px-6">
          <Link href="/" className="flex min-w-0 items-center">
            {/* Reserves normal-flow space for the logo; the actual image is
                taller and absolutely positioned. It's sized (132px) to stay
                fully within the solid white zone (80px row + 68px padding
                below = 148px), so it never touches the fade/page content —
                that's what actually eliminates the box artifact. */}
            <span className="relative block h-16 w-52 shrink-0">
              <Image
                src="/logo-full.png"
                alt="MainGetränke"
                width={396}
                height={264}
                className="pointer-events-none absolute top-0 left-0 h-[132px] w-auto object-contain object-left"
                priority
              />
            </span>
          </Link>

          <nav className="ml-4 hidden translate-y-[34px] items-center gap-6 whitespace-nowrap md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-nowrap text-foreground/80 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex translate-y-[34px] items-center gap-2">
            <div className="hidden items-center gap-1.5 text-nowrap rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium whitespace-nowrap text-muted-foreground sm:flex">
              <MapPin className="size-3.5 shrink-0 text-primary" />
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

        {/* Soft dissolve instead of a hard border-b — this is the actual
            transition into the page background the logo crosses over. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-9 translate-y-full bg-gradient-to-b from-white to-transparent" />
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
