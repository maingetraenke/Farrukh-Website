# Produktbilder — Übersicht zur Freigabe

Diese Bilder wurden für den Produktkatalog (`supabase/seed.sql`) neu
recherchiert und unter `apps/web/public/products/` abgelegt, verlinkt über
`products.image_url`. **Noch nicht freigegeben** — bitte jedes Bild vor dem
Launch prüfen.

## Zweiter Anlauf — was diesmal anders ist

Die erste Bilder-Runde wurde vom Betrieb abgelehnt: zu viele Motive sahen
wie Kunden-Rezensionsfotos oder Lifestyle-Aufnahmen aus (eine Hand mit
Flasche im Kühlregal, eine Bierflaschen-Reihe auf einer Bartheke, eine Dose
schräg fotografiert) statt wie professionelle Produktfotografie.

Diesmal gilt eine strikte Vorgabe ohne Ausnahme: **jedes Bild ist ein
freigestelltes Packshot-Foto** — durchgehend (nahezu) reinweißer
Hintergrund, Produkt mittig, scharf und gut ausgeleuchtet, ohne Hände,
Bartheken, Regale, Tische oder Außenszenen. Jedes Kandidatenbild wurde vor
der Übernahme visuell geprüft (nicht nur anhand der Dateibeschreibung) und
bei jedem Hinweis auf echten Kontext im Hintergrund verworfen. Zwei
Kandidaten wurden aus genau diesem Grund verworfen, obwohl sie in der
Bildersuche vielversprechend aussahen:

- **Wikimedia Commons "Bocksbeutel bottle.jpg"** (in der ersten Runde für
  den Frankenwein-Platzhalter verwendet): bei visueller Prüfung zeigte sich
  ein Gegenlicht-Foto vor Himmel/Wolken mit einer Holzkante am unteren
  Bildrand — eindeutig eine Außenaufnahme, kein Studio-Packshot. Verworfen.
- **Wikimedia Commons "Bocksbeutel_PS.jpg"**: zeigt die Flasche zwischen
  Weinreben im Weinberg (Trauben, Blätter, Erde im Hintergrund) —
  eindeutige Lifestyle-/Weinberg-Aufnahme. Verworfen.

Als Ersatz für die generischen Wein-/Saft-Platzhalter wurden stattdessen
freigestellte Katalog-Produktfotos eines Glasflaschen-Herstellers
(Wiegand-Glas) verwendet — siehe Abschnitt "Wein & Sekt / Saft" unten.

## Quellen

Bevorzugt wurden offizielle Hersteller-Produktseiten bzw. Presse-/
Markenseiten (Coca-Cola, Paulaner, Krombacher, Erdinger, Distelhäuser,
Würzburger Hofbräu, Gerolsteiner, Bad Brückenauer, Wiegand-Glas
veröffentlichen alle eigene freigestellte Flaschen-Packshots). Wo kein
Hersteller-Packshot auffindbar war, wurden freigestellte Produktfotos von
deutschen Getränkehändlern (Globus, getraenkedienst.com) verwendet — bei
diesen zeigte das Originalfoto teils einen Kasten mit Flaschen; in diesen
Fällen wurde auf eine einzelne Flasche zugeschnitten, sofern das Ausgangsbild
das hergab. Wikimedia Commons wurde geprüft, aber für keines der finalen
Bilder verwendet, da die dort auffindbaren Motive für diese Marken
durchgehend Lifestyle-/Kontext-Aufnahmen waren (siehe oben).

Ein Bild wird jeweils für alle Gebindegrößen derselben Marke/Sorte
wiederverwendet (z. B. teilen sich 1,0L-PET- und 0,75L-Glas-Variante einer
Marke ein Foto).

Alle Bilddateien liegen unter `apps/web/public/products/`, auf max. 900px
Kantenlänge skaliert und als komprimiertes JPEG gespeichert (jeweils unter
200KB, meist deutlich darunter).

## Wasser

| Produkt(e) | Bilddatei | Quelle/Lizenz | Status |
|---|---|---|---|
| Gerolsteiner (beide Gebinde) | `gerolsteiner.jpg` | [gerolsteiner.de – Produktseite "Naturell"](https://www.gerolsteiner.de/produkte/mineralwasser/naturell), Bild-Asset "Naturell-Frontshot.png" (Herstellerseite, Bildmaterial des Unternehmens). Freigestelltes Flaschenfoto (0,75L Glas) mit transparentem Hintergrund. | Gefunden — offizielles Herstellerfoto |
| Alasia PUR (beide Gebinde) | `alasia-pur.jpg` | [Globus – "Mineralwasser, Pur von Alasia"](https://produkte.globus.de/getraenke/wasser/mineralwasser/4102560080099/mineralwasser-pur), Produktabbildung des Onlineshops. Freigestelltes Einzelflaschen-Packshot. | Gefunden |
| Alasia Medium (beide Gebinde) | `alasia-medium.jpg` | [Globus – "Mineralwasser, Medium von Alasia"](https://produkte.globus.de/getraenke/wasser/mineralwasser/4102560180041/mineralwasser-medium-12x-0-700-liter), Produktabbildung. Ausgangsfoto zeigte Kasten + 2 Flaschen; auf die beiden Flaschen zugeschnitten (Kasten entfernt). | Gefunden |
| Alasia Spritzig (beide Gebinde) | `alasia-spritzig.jpg` | [Globus – "Mineralwasser, Spritzig von Alasia"](https://produkte.globus.de/getraenke/wasser/mineralwasser/4102560100506/mineralwasser-spritzig-12x-0-700-liter), Produktabbildung. Gleicher Zuschnitt wie Medium. | Gefunden |
| Franken Brunnen (beide Gebinde) | `franken-brunnen.jpg` | [Globus – "Mineralwasser, Naturelle von Franken Brunnen"](https://produkte.globus.de/getraenke/wasser/mineralwasser/4002627001831/mineralwasser-naturelle-12x-1-000-liter), Produktabbildung. Zeigt den vollen 12x1,0L-Kasten (kein Einzelflaschen-Ausschnitt im Quellbild möglich), reinweißer Studiohintergrund, keine Lifestyle-Elemente. | Gefunden |
| Bad Brückenauer (beide Gebinde) | `bad-brueckenauer.jpg` | [badbrueckenauer.de – Downloads/Flaschen](https://www.badbrueckenauer.de/downloads/flaschen/) ("NATURELL 0,75L Individual"), offizielles Handelspartner-Bildmaterial des Herstellers (Staatl. Mineralbrunnen AG Bad Brückenau) zum Download. Freigestelltes Einzelflaschenfoto. | Gefunden — vorher nicht gefunden |

## Softdrinks

| Produkt(e) | Bilddatei | Quelle/Lizenz | Status |
|---|---|---|---|
| Coca-Cola Original (beide Gebinde) | `coca-cola-original.jpg` | [coca-cola.com/at/de – Markenseite Coca-Cola](https://www.coca-cola.com/at/de/brands/coca-cola), offizielles Bildmaterial der The Coca-Cola Company. Freigestelltes Flaschen-Packshot. | Gefunden |
| Coca-Cola Zero (beide Gebinde) | `coca-cola-zero.jpg` | [coca-cola.com/at/de – Markenseite Coca-Cola](https://www.coca-cola.com/at/de/brands/coca-cola), offizielles Bildmaterial. | Gefunden |
| Coca-Cola Light (beide Gebinde) | `coca-cola-light.jpg` | [coca-cola.com/at/de – Markenseite Coca-Cola](https://www.coca-cola.com/at/de/brands/coca-cola), offizielles Bildmaterial. | Gefunden |
| Fanta (beide Gebinde) | `fanta.jpg` | [coca-cola.com/de/de – Markenseite Fanta](https://www.coca-cola.com/de/de/brands/fanta/fanta), offizielles Bildmaterial ("fanta_orange_pet.png", 1,5L-PET-Flasche). | Gefunden |
| Sprite (beide Gebinde) | `sprite.jpg` | [coca-cola.com/at/de – Markenseite Sprite](https://www.coca-cola.com/at/de/brands/sprite), offizielles Bildmaterial. | Gefunden |
| Mezzo Mix (beide Gebinde) | `mezzo-mix.jpg` | [coca-cola.com/at/de – Markenseite Mezzo Mix](https://www.coca-cola.com/at/de/brands/mezzo-mix), offizielles Bildmaterial, Glasflasche. | Gefunden |
| Paulaner Spezi | `paulaner-spezi.jpg` | [paulaner.de – Produktseite "Spezi"](https://www.paulaner.de/produkte/spezi/spezi/), offizielles Bildmaterial der Paulaner Brauerei München. | Gefunden |
| Paulaner Spezi Zero | `paulaner-spezi-zero.jpg` | [paulaner.de – Produktseite "Spezi Zero"](https://www.paulaner.de/produkte/spezi/spezi-zero/), offizielles Bildmaterial. | Gefunden — vorher nicht gefunden |

## Bier

| Produkt(e) | Bilddatei | Quelle/Lizenz | Status |
|---|---|---|---|
| Augustiner Hell | `augustiner-hell.jpg` | [getraenkedienst.com – "Augustiner Lagerbier Hell 20 x 0,5l"](https://www.getraenkedienst.com/bier/helles/augustiner-lagerbier-hell-20-x-0-5l), Produktabbildung des Händlers (Einzelflasche + Kasten, auf Flasche zugeschnitten). | Gefunden |
| Augustiner Edelstoff | `augustiner-edelstoff.jpg` | [getraenkedienst.com – "Augustiner Lagerbier Edelstoff 20 x 0,5l"](https://www.getraenkedienst.com/bier/export-maerzen/augustiner-lagerbier-edelstoff-20-x-0-5l), gleiche Bildquelle/Zuschnitt wie Hell. | Gefunden |
| Paulaner Helles | `paulaner-helles.jpg` | [paulaner.de – Produktseite "Münchner Hell"](https://www.paulaner.de/produkte/hellbiere/muenchner-hell/), offizielles Bildmaterial. | Gefunden |
| Paulaner Hefe-Weißbier | `paulaner-hefeweissbier.jpg` | [paulaner.de – Produktseite "Hefe-Weißbier Naturtrüb"](https://www.paulaner.de/produkte/weissbiere/hefe-weissbier-naturtrueb), offizielles Bildmaterial. | Gefunden |
| Erdinger Weißbier | `erdinger-weissbier.jpg` | [erdinger.de – Sortimentsseite](https://erdinger.de/en-US), offizielles Bildmaterial der Erdinger Weißbräu. | Gefunden |
| Krombacher Pils | `krombacher-pils.jpg` | [Globus – "Pils, 4,8 % von Krombacher"](https://produkte.globus.de/getraenke/bier-mischgetraenke/bier/4008287053623/pils-4-8), Produktabbildung, freigestellte Einzelflasche. | Gefunden |
| Bitburger Pils | `bitburger-pils.jpg` | [bitburger-international.com – Produktseite "Bitburger Premium Pils"](https://www.bitburger-international.com/en/our-brands/bitburger/our-products/bitburger-premium-pils), offizielles Bildmaterial. Hinweis: Quellbild ist niedrig aufgelöst (86×350px, hochskaliert) — Motiv ist ein sauberes Einzelflaschen-Packshot, aber die Bildschärfe ist geringer als bei den übrigen Bildern. | Gefunden — Auflösung geringer, ggf. bessere Quelle nachpflegen |
| Distelhäuser Pils | `distelhaeuser-pils.jpg` | [distelhaeuser.de – "Pils-Familie"](https://www.distelhaeuser.de/unser-bier/pils-familie/), offizielles Bildmaterial der Distelhäuser Brauerei. Freigestelltes Einzelflaschen-Packshot (0,3L). | Gefunden — vorher zurückgestellt, jetzt sauberes Einzelfoto |
| Würzburger Hofbräu Pils | `wuerzburger-hofbraeu-pils.jpg` | [wuerzburger-hofbraeu.de – "Biervielfalt"](https://www.wuerzburger-hofbraeu.de/biervielfalt/), offizielles Bildmaterial. Zeigt Flasche und ein befülltes Glas nebeneinander (Serviervorschlag), reinweißer Hintergrund, kein Tisch/keine Bartheke sichtbar — bewusst mitverwendet statt zu einem Ausschnitt zugeschnitten, der Teile des Etiketts abgeschnitten hätte. | Gefunden — bitte prüfen, ob Glas im Bild stört |

## Wein & Sekt / Saft (generische Platzhalter-Motive)

`Winzer Region Kitzingen` und `Regionaler Safthersteller` sind laut
`seed.sql`-Kommentar Platzhalter-Lieferantennamen, keine echten Kellereien
bzw. Keltereien. Es wurde daher bewusst kein Etikett einer echten,
namentlich anderen Kellerei/Kelterei verwendet — stattdessen unbeschriftete,
freigestellte Flaschen-Packshots aus dem Produktkatalog eines
Glasflaschen-Herstellers (Wiegand-Glas), die genau für diesen Zweck (leere,
markenneutrale Flaschenform) gedacht sind.

| Produkt(e) | Bilddatei | Quelle/Lizenz | Status |
|---|---|---|---|
| Fränkischer Müller-Thurgau, Fränkischer Silvaner (gemeinsames generisches Bild) | `fraenkischer-wein.jpg` | [wiegand-glas.de – Weinflaschen-Katalog, Artikel "0,75l Bocksbeutel PS BVS grün" (046-01-4E)](https://www.wiegand-glas.de/de/glas-produkte/weinflaschen/0-75-l-bocksbeutel-ps-bvs-gruen-046-01-4e), Katalog-Produktfoto des Glasherstellers Wiegand-Glas. Unbeschriftete grüne Bocksbeutel-Flasche (die für Frankenwein typische Flaschenform), reinweißer Studiohintergrund. | Gefunden — Ersatz für zwei in dieser Runde verworfene Wikimedia-Motive (siehe oben) |
| Apfelschorle | `apfelschorle.jpg` | [wiegand-glas.de – Saft-/Fruchtsaftflaschen-Katalog, Artikel "1,0l Schorle extra weiß" (2053-X7-4Z)](https://www.wiegand-glas.de/de/glas-produkte/saft-fruchtsaft-sirupflaschen/1-00-l-schorle-extra-weiss-2053-x7-4z), Katalog-Produktfoto. Unbeschriftete klare 1,0L-Flasche, reinweißer Studiohintergrund. | Gefunden |
| Orangensaft | `orangensaft.jpg` | [wiegand-glas.de – Saft-/Fruchtsaftflaschen-Katalog, Artikel "1,0l Saft F extra weiß" (1746-X7-392)](https://www.wiegand-glas.de/de/glas-produkte/saft-fruchtsaft-sirupflaschen/1-00-l-saft-f-extra-weiss-1746-x7-392), Katalog-Produktfoto. Unbeschriftete klare 1,0L-Flasche, reinweißer Studiohintergrund. | Gefunden |

## Zusammenfassung

- **27 von 27** Produktfamilien haben diesmal ein verlinktes, freigestelltes
  Packshot-Bild erhalten (26 Bilddateien in `seed.sql` verlinkt, da sich die
  beiden Frankenwein-Positionen ein Bild teilen). **0 offene Lücken.**
- Alle sieben Produkte, die in der vorherigen Runde als "nicht gefunden"
  bzw. "zurückgestellt" galten, haben jetzt ein echtes Bild: Gerolsteiner,
  Alasia PUR, Alasia Medium, Alasia Spritzig, Bad Brückenauer, Paulaner
  Spezi Zero, Distelhäuser Pils.
- **Zur Kenntnisnahme, kein Ablehnungsgrund, aber beim Review anschauen:**
  - `bitburger-pils.jpg` — Quellbild niedrig aufgelöst (von 86×350px
    hochskaliert), Motiv selbst ist ein sauberes Einzelflaschen-Packshot.
  - `wuerzburger-hofbraeu-pils.jpg` — zeigt Flasche + volles Glas als
    Serviervorschlag (kein Tisch/keine Bartheke, reinweißer Hintergrund),
    kein reines Einzelflaschenfoto wie bei den übrigen Bieren.
  - `franken-brunnen.jpg` — Quellbild zeigt den vollen 12er-Kasten statt
    einer Einzelflasche (kein Zuschnitt auf Einzelflasche möglich, da keine
    einzelne Flasche im Quellbild freistand); Hintergrund ist aber
    durchgehend reinweiß, kein Bar-/Regal-Kontext.
  - `alasia-medium.jpg` / `alasia-spritzig.jpg` — auf zwei Flaschen aus
    einem Kasten-Foto zugeschnitten; am rechten Bildrand ist ein schmaler
    Streifen des (unbeschrifteten) Kastenrands sichtbar.
- Alle Bilder wurden vor der Übernahme visuell (nicht nur anhand von
  Dateinamen/Beschreibungen) auf einen echten weißen Hintergrund ohne
  Personen, Möbel oder Außenkontext geprüft.
