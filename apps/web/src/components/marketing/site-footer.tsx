import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[#0b1e39] text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-white p-1">
              <Image
                src="/logo.png"
                alt="MainGetränke"
                width={28}
                height={28}
                className="size-7 object-contain"
              />
            </div>
            <span className="font-bold">MainGetränke</span>
          </div>
          <p className="text-sm text-white/60">
            Dein Getränkeservice aus der Region.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-white/90">
            Sortiment
          </span>
          <Link href="/#sortiment" className="text-sm text-white/60 hover:text-white">
            Wasser
          </Link>
          <Link href="/#sortiment" className="text-sm text-white/60 hover:text-white">
            Bier
          </Link>
          <Link href="/#sortiment" className="text-sm text-white/60 hover:text-white">
            Wein &amp; Sekt
          </Link>
          <Link href="/#sortiment" className="text-sm text-white/60 hover:text-white">
            Saft &amp; Schorlen
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-white/90">
            Rechtliches
          </span>
          <Link href="/impressum" className="text-sm text-white/60 hover:text-white">
            Impressum
          </Link>
          <Link href="/datenschutz" className="text-sm text-white/60 hover:text-white">
            Datenschutz
          </Link>
          <Link href="/agb" className="text-sm text-white/60 hover:text-white">
            AGB
          </Link>
          <Link href="/widerrufsrecht" className="text-sm text-white/60 hover:text-white">
            Widerrufsrecht
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-white/90">Kontakt</span>
          <a
            href="mailto:info@maingetraenke.de"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white"
          >
            <Mail className="size-4 shrink-0" />
            info@maingetraenke.de
          </a>
          <a
            href="tel:+491778085911"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white"
          >
            <Phone className="size-4 shrink-0" />
            0177 8085911
          </a>
          <span className="flex items-center gap-2 text-sm text-white/60">
            <MapPin className="size-4 shrink-0" />
            Kitzingen &amp; Umgebung
          </span>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <span>&copy; {new Date().getFullYear()} MainGetränke. Alle Rechte vorbehalten.</span>
          <Link href="/login" className="text-white/40 hover:text-white/70">
            Mitarbeiter-Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
