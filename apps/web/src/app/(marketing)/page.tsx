import type { Metadata } from "next";
import Link from "next/link";
import {
  Beer,
  Clock,
  CupSoda,
  GlassWater,
  Mail,
  MapPin,
  PackageSearch,
  Phone,
  Recycle,
  ShieldCheck,
  Users,
  Wine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DeliveryVanIllustration,
  StepDeliverIllustration,
  StepEnjoyIllustration,
  StepOrderIllustration,
  StepSelectIllustration,
} from "@/components/marketing/illustrations";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata: Metadata = {
  title: "MainGetränke — Dein Getränkeservice aus der Region",
  description:
    "Regionaler Getränkelieferdienst in Kitzingen und Umgebung. Wasser, Bier, Wein & Sekt, Saft & Schorlen — kastenweise geliefert.",
};

const steps = [
  {
    icon: StepSelectIllustration,
    title: "Getränke auswählen",
    text: "Sag uns, was du brauchst — unser Sortiment reicht von Wasser über Bier bis Wein & Sekt.",
  },
  {
    icon: StepOrderIllustration,
    title: "Bestellung anfragen",
    text: "Warenkorb füllen und absenden, oder per Telefon/E-Mail — Lieferadresse und Wunschtermin angeben, fertig.",
  },
  {
    icon: StepDeliverIllustration,
    title: "Wir liefern",
    text: "Unser Team packt deine Bestellung und liefert sie zuverlässig zu dir.",
  },
  {
    icon: StepEnjoyIllustration,
    title: "Du genießt",
    text: "Deine Getränke kommen bequem und sicher direkt vor deine Tür.",
  },
];

const reasons = [
  {
    icon: PackageSearch,
    title: "Große Auswahl",
    text: "Wasser, Bier, Wein, Saft & Schorlen und mehr.",
  },
  {
    icon: Recycle,
    title: "Pfand einfach",
    text: "Pfandartikel unkompliziert zurückgeben — wir kümmern uns.",
  },
  {
    icon: Users,
    title: "Persönlich",
    text: "Direkter Ansprechpartner statt anonymer Konzern.",
  },
];

const categories = [
  { icon: GlassWater, title: "Wasser", text: "Natürlich & erfrischend" },
  { icon: Beer, title: "Bier", text: "Konfigurierbares Sortiment" },
  { icon: Wine, title: "Wein & Sekt", text: "Aus der Region und darüber hinaus" },
  { icon: CupSoda, title: "Saft & Schorlen", text: "Fruchtig & vielfältig" },
];

export default function MarketingHomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-accent/60 to-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:px-6 md:py-24">
          <div className="flex flex-col gap-5">
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
              So einfach geht&apos;s
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Deine Lieblingsgetränke{" "}
              <span className="text-primary">zu dir nach Hause</span>
            </h1>
            <p className="max-w-md text-base text-muted-foreground">
              Wir sind ein <strong className="text-foreground">regionaler</strong>{" "}
              Getränkelieferdienst aus Kitzingen. Sag uns, was du brauchst — wir
              liefern es dir <strong className="text-foreground">zuverlässig</strong>{" "}
              nach Hause, kastenweise.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-11 px-6 text-base">
                <Link href="/sortiment">Jetzt bestellen</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 px-6 text-base"
              >
                <Link href="/#kontakt">Kontakt aufnehmen</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto grid w-full max-w-sm grid-cols-2 gap-4">
            {categories.map((category) => (
              <Link
                key={category.title}
                href="/sortiment"
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-white p-6 text-center shadow-sm transition-colors hover:border-primary"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
                  <category.icon className="size-6" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {category.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Regional & Zuverlässig — the two things we want to lead with */}
      <section className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:px-6 md:py-16">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <MapPin className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Regional</h2>
              <p className="mt-1 text-sm text-primary-foreground/85">
                Wir sind ein Getränkelieferdienst aus Kitzingen — kein
                anonymer Konzern. Kurze Wege, direkter Draht, Ware aus der
                Region und von regionalen Lieferanten.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Zuverlässig</h2>
              <p className="mt-1 text-sm text-primary-foreground/85">
                Feste Liefertage, klare Kommunikation, kein Verschwinden nach
                der Bestellung. Auf uns kannst du dich verlassen — Bestellung
                für Bestellung.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sortiment teaser */}
      <section id="sortiment" className="scroll-mt-16 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Unser Sortiment
            </h2>
            <p className="mt-2 text-muted-foreground">
              Kastenweise geliefert — von Wasser bis Wein & Sekt.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.title} href="/sortiment">
                <Card className="h-full shadow-sm transition-colors hover:border-primary">
                  <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
                    <div className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
                      <category.icon className="size-7" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">
                        {category.title}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {category.text}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="h-11 px-6 text-base">
              <Link href="/sortiment">Alle Produkte ansehen</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Ablauf */}
      <section
        id="ablauf"
        className="scroll-mt-16 border-t border-border bg-white py-16 md:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              So funktioniert&apos;s
            </h2>
            <p className="mt-2 text-muted-foreground">
              In wenigen Schritten zu deinen Getränken.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center gap-3 rounded-2xl border border-border bg-background p-6 text-center"
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <div className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
                  <step.icon className="size-7" />
                </div>
                <span className="font-semibold text-foreground">
                  {step.title}
                </span>
                <p className="text-muted-foreground text-sm">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weitere Gründe */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Und sonst?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Weil guter Service den Unterschied macht.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-white p-6 text-center shadow-sm"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
                  <reason.icon className="size-6" />
                </div>
                <span className="font-semibold text-foreground">
                  {reason.title}
                </span>
                <p className="text-muted-foreground text-xs">{reason.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Liefergebiet */}
      <section
        id="liefergebiet"
        className="scroll-mt-16 border-t border-border bg-white py-16 md:py-24"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center md:px-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Unser Liefergebiet
            </h2>
            <p className="text-muted-foreground">
              Wir liefern in Kitzingen und der Umgebung — ob
              Privathaushalt, Firma, Verein oder Gastronomie.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MapPin className="size-4 text-primary" />
              Kitzingen &amp; Umgebung
            </div>
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="relative mx-auto flex size-56 items-center justify-center rounded-full border-2 border-dashed border-primary/30 sm:size-72">
              <div className="absolute size-36 rounded-full border-2 border-dashed border-primary/40 sm:size-48" />
              <div className="flex flex-col items-center gap-1 rounded-full bg-primary p-4 text-primary-foreground shadow-sm">
                <MapPin className="size-6" />
                <span className="text-xs font-semibold">Kitzingen</span>
              </div>
            </div>
            <DeliveryVanIllustration className="h-auto w-48 text-primary sm:w-56" />
          </div>
        </div>
      </section>

      {/* Kontakt */}
      <section id="kontakt" className="scroll-mt-16 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Kontakt &amp; Service
            </h2>
            <p className="mt-2 text-muted-foreground">
              Wir sind für dich da — persönlich, schnell und unkompliziert.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <a
              href="mailto:info@maingetraenke.de"
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-white p-6 text-center shadow-sm transition-colors hover:border-primary"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
                <Mail className="size-6" />
              </div>
              <span className="font-semibold text-foreground">E-Mail</span>
              <span className="text-muted-foreground text-sm">
                info@maingetraenke.de
              </span>
            </a>
            <a
              href="tel:+491778085911"
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-white p-6 text-center shadow-sm transition-colors hover:border-primary"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
                <Phone className="size-6" />
              </div>
              <span className="font-semibold text-foreground">Telefon</span>
              <span className="text-muted-foreground text-sm">
                0177 8085911
              </span>
            </a>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-white p-6 text-center shadow-sm">
              <div className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
                <Clock className="size-6" />
              </div>
              <span className="font-semibold text-foreground">
                Erreichbarkeit
              </span>
              <span className="text-muted-foreground text-sm">
                Ruf uns an, schreib uns oder nutze das Kontaktformular — wir
                melden uns zeitnah zurück.
              </span>
            </div>
          </div>
          <div className="mx-auto mt-10 max-w-xl">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
