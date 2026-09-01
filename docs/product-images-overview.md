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

## Dritter Anlauf — offizielle Sortimentsliste, 2026-08-10

Bilder für die 74 Artikel der neuen offiziellen Preisliste (siehe
`supabase/migrations/20260810120200_official_catalog_2026_08.sql`), soweit
noch kein Bild vorhanden war. Strengere Vorgabe als in Runde 2: **jedes
Bild muss zusätzlich exakt zum angegebenen Gebinde passen** (z.B. 0,7L
Glas vs. 1,0L PET derselben Marke/Sorte bekommen unterschiedliche Bilder,
kein Wiederverwenden über Gebinde hinweg wie in Runde 2). Jedes
Kandidatenbild wurde vor der Übernahme visuell geprüft.

Quellen: bevorzugt offizielle Herstellerseiten (badbrueckenauer.de/downloads,
blackforest-still.de, bayla.de, paulaner.de, bitburger.com); wo dort kein
Gebinde-exaktes Packshot auffindbar war, freigestellte Einzelprodukt-
bzw. Kistenfotos von Fachhändlern (expressdrinks.de, getraenkedienst.com,
getraenkeonline.shop, aktionspreis.de). Ein offizielles Bitburger-Bild
(Radler Naturtrüb) wurde verworfen, weil es die Dose statt der bestellten
Glasflasche zeigte — stattdessen ein Gebinde-korrektes, aber niedriger
aufgelöstes Händlerbild verwendet (siehe Tabelle, MG-A-00097).

**53 von 63 möglichen Artikeln** haben ein Bild bekommen. **10 offene
Lücken**, weil keine Quelle ein zweifelsfrei passendes, Gebinde-exaktes
offizielles Produktfoto lieferte — bewusst ohne Bild gelassen statt ein
falsches/generisches Bild zu erzwingen:

- **Bayla (8):** Apfel-Kirsch Nektar 1L (aktuelles Sortiment hat nur noch
  "Apfel-Kirsch-Zitrone", ein anderes 3-Frucht-Produkt), Wellness
  Blutorange 1L (aktuelles Sortiment hat nur "ACE Blutorange", vermutlich
  aber nicht dasselbe Produkt), Vollwert Apfel 1L (einziges Kandidatenbild
  zeigt eine Hand, die die Flasche hält — laut Vorgabe/früherer
  Betriebs-Ablehnung nicht zulässig), Apfel klar 0,2L, Johannisbeer 0,2L,
  Johannisbeer 1L, Orange 0,2L — für diese vier "-klein"/1L-Varianten
  fanden sich auf bayla.de nur Marketing-/Slogan-Grafiken statt
  Produktfotos.
- **Beck's (2):** Gold 20×0,5L Glas, Blue Lemon 0,0% 24×0,33L Glas — bei
  keinem der geprüften Fachhändler als eigene Produktseite mit Bild
  auffindbar (Blue Lemon 0,0% ist evtl. noch nicht breit gelistet).

| Artikel-Nr. | Bilddatei | Quelle |
|---|---|---|

| MG-A-00040 | `alasia-medium-07l-glas.jpg` | [https://getraenkeonline.shop/wasser/medium/398/alasia-medium-12x0-7l](https://getraenkeonline.shop/wasser/medium/398/alasia-medium-12x0-7l) |
| MG-A-00041 | `franken-brunnen-spritzig-07l-glas.jpg` | [https://www.getraenkedienst.com/wasser/spritzig-viel-kohlensaeure/franken-brunnen-hochstein-spritzig-12-x-0-7l](https://www.getraenkedienst.com/wasser/spritzig-viel-kohlensaeure/franken-brunnen-hochstein-spritzig-12-x-0-7l) |
| MG-A-00042 | `franken-brunnen-sanft-07l-glas.jpg` | [https://www.getraenkedienst.com/wasser/medium-wenig-kohlensaeure/franken-brunnen-sanft-12-x-0-75l](https://www.getraenkedienst.com/wasser/medium-wenig-kohlensaeure/franken-brunnen-sanft-12-x-0-75l) |
| MG-A-00043 | `franken-brunnen-medium-07l-glas.png` | [https://www.getraenkedienst.com/wasser/medium/franken-brunnen-medium-12-x-0-75l](https://www.getraenkedienst.com/wasser/medium/franken-brunnen-medium-12-x-0-75l) |
| MG-A-00044 | `franken-brunnen-naturell-07l-glas.jpg` | [https://www.getraenkedienst.com/wasser/still-ohne-kohlensaeure/franken-brunnen-naturell-12-x-0-7l](https://www.getraenkedienst.com/wasser/still-ohne-kohlensaeure/franken-brunnen-naturell-12-x-0-7l) |
| MG-A-00045 | `franken-brunnen-spritzig-10l-pet.jpg` | [https://expressdrinks.de/wasser/spritzig/4549/franken-brunnen-mineralwasser-spritzig-12x1-0l-pet](https://expressdrinks.de/wasser/spritzig/4549/franken-brunnen-mineralwasser-spritzig-12x1-0l-pet) |
| MG-A-00046 | `franken-brunnen-sanft-10l-pet.png` | [https://www.getraenkedienst.com/wasser/medium-wenig-kohlensaeure/franken-brunnen-sanft-12-x-1l](https://www.getraenkedienst.com/wasser/medium-wenig-kohlensaeure/franken-brunnen-sanft-12-x-1l) |
| MG-A-00047 | `franken-brunnen-medium-10l-pet.jpg` | [https://expressdrinks.de/wasser/medium/4551/franken-brunnen-mineralwasser-medium-12x1-0l-pet](https://expressdrinks.de/wasser/medium/4551/franken-brunnen-mineralwasser-medium-12x1-0l-pet) |
| MG-A-00048 | `franken-brunnen-naturell-10l-pet.jpg` | [https://expressdrinks.de/wasser/still-naturell/4552/franken-brunnen-mineralwasser-naturell-12x1-0l-pet](https://expressdrinks.de/wasser/still-naturell/4552/franken-brunnen-mineralwasser-naturell-12x1-0l-pet) |
| MG-A-00049 | `bad-brueckenauer-spritzig-07l-glas.webp` | [https://www.badbrueckenauer.de/downloads/flaschen/](https://www.badbrueckenauer.de/downloads/flaschen/) |
| MG-A-00050 | `bad-brueckenauer-medium-07l-glas.webp` | [https://www.badbrueckenauer.de/downloads/flaschen/](https://www.badbrueckenauer.de/downloads/flaschen/) |
| MG-A-00051 | `bad-brueckenauer-naturell-07l-glas.webp` | [https://www.badbrueckenauer.de/downloads/flaschen/](https://www.badbrueckenauer.de/downloads/flaschen/) |
| MG-A-00052 | `bad-brueckenauer-spritzig-10l-pet.webp` | [https://www.badbrueckenauer.de/downloads/flaschen/](https://www.badbrueckenauer.de/downloads/flaschen/) |
| MG-A-00053 | `bad-brueckenauer-medium-10l-pet.webp` | [https://www.badbrueckenauer.de/downloads/flaschen/](https://www.badbrueckenauer.de/downloads/flaschen/) |
| MG-A-00054 | `bad-brueckenauer-naturell-10l-pet.webp` | [https://www.badbrueckenauer.de/downloads/flaschen/](https://www.badbrueckenauer.de/downloads/flaschen/) |
| MG-A-00055 | `gerolsteiner-spritzig.jpg` | [https://www.getraenkedienst.com/wasser/spritzig-viel-kohlensaeure/gerolsteiner-sprudel-12-x-1l](https://www.getraenkedienst.com/wasser/spritzig-viel-kohlensaeure/gerolsteiner-sprudel-12-x-1l) |
| MG-A-00056 | `gerolsteiner-medium.jpg` | [https://expressdrinks.de/wasser/medium/4657/gerolsteiner-mineralwasser-medium-12x1-0-pet](https://expressdrinks.de/wasser/medium/4657/gerolsteiner-mineralwasser-medium-12x1-0-pet) |
| MG-A-00057 | `gerolsteiner-naturell.jpg` | [https://expressdrinks.de/wasser/still-naturell/4656/gerolsteiner-mineralwasser-naturell-12x1-0-pet](https://expressdrinks.de/wasser/still-naturell/4656/gerolsteiner-mineralwasser-naturell-12x1-0-pet) |
| MG-A-00058 | `black-forest-spritzig-07l-glas.png` | [https://www.blackforest-still.de/produkte/black-forest-spritzig.html](https://www.blackforest-still.de/produkte/black-forest-spritzig.html) |
| MG-A-00059 | `black-forest-feinperlig-07l-glas.png` | [https://www.blackforest-still.de/produkte/fein-perlend.html](https://www.blackforest-still.de/produkte/fein-perlend.html) |
| MG-A-00060 | `black-forest-still-07l-glas.png` | [https://www.blackforest-still.de/produkte/black-forest-still.html](https://www.blackforest-still.de/produkte/black-forest-still.html) |
| MG-A-00061 | `black-forest-still-05l-pet.png` | [https://www.blackforest-still.de/produkte/black-forest-still.html](https://www.blackforest-still.de/produkte/black-forest-still.html) |
| MG-A-00062 | `bayla-sauerkirsch-1l.webp` | [https://bayla.de/sauerkirsch/](https://bayla.de/sauerkirsch/) |
| MG-A-00064 | `bayla-maracuja-1l.webp` | [https://bayla.de/maracuja/](https://bayla.de/maracuja/) |
| MG-A-00065 | `bayla-banane-1l.webp` | [https://bayla.de/banane/](https://bayla.de/banane/) |
| MG-A-00067 | `bayla-orange-1l.webp` | [https://bayla.de/orangensaft/](https://bayla.de/orangensaft/) |
| MG-A-00070 | `bayla-multivitamin-1l.webp` | [https://bayla.de/multi-mehrfrucht/](https://bayla.de/multi-mehrfrucht/) |
| MG-A-00071 | `bayla-traube-direktsaft-1l.webp` | [https://bayla.de/traube/](https://bayla.de/traube/) |
| MG-A-00073 | `bayla-ananas-1l.webp` | [https://bayla.de/ananas/](https://bayla.de/ananas/) |
| MG-A-00077 | `bayla-traube-rot-02l.webp` | [https://bayla.de/traube-klein/](https://bayla.de/traube-klein/) |
| MG-A-00078 | `coca-cola-24x033l-glas.png` | [https://expressdrinks.de/limo-schorlen/cola/373/coca-cola-24x0-33l](https://expressdrinks.de/limo-schorlen/cola/373/coca-cola-24x0-33l) |
| MG-A-00080 | `paulaner-spezi-24x033l-glas.png` | [https://www.paulaner.de/produkte/spezi/spezi/](https://www.paulaner.de/produkte/spezi/spezi/) |
| MG-A-00081 | `paulaner-cola-24x033l-glas.png` | [https://www.paulaner.de/produkte/cola/cola](https://www.paulaner.de/produkte/cola/cola) |
| MG-A-00082 | `paulaner-limo-zitrone-24x033l-glas.png` | [https://www.paulaner.de/produkte/limo/paulaner-limo-zitrone/](https://www.paulaner.de/produkte/limo/paulaner-limo-zitrone/) |
| MG-A-00083 | `paulaner-limo-orange-24x033l-glas.png` | [https://www.paulaner.de/produkte/limo/limo/](https://www.paulaner.de/produkte/limo/limo/) |
| MG-A-00084 | `augustiner-hell-24x033l-glas.jpg` | [https://expressdrinks.de/bier/helles/2519/augustiner-hell-24x0-33l](https://expressdrinks.de/bier/helles/2519/augustiner-hell-24x0-33l) |
| MG-A-00085 | `augustiner-dunkel-20x05l-glas.jpg` | [https://expressdrinks.de/bier/spezial-biere/2851/augustiner-dunkel-20x0-5l](https://expressdrinks.de/bier/spezial-biere/2851/augustiner-dunkel-20x0-5l) |
| MG-A-00086 | `augustiner-alkoholfrei-20x05l-glas.jpg` | [https://expressdrinks.de/bier/alkoholfrei/4464/augustiner-hell-alkoholfrei-20x0-5l](https://expressdrinks.de/bier/alkoholfrei/4464/augustiner-hell-alkoholfrei-20x0-5l) |
| MG-A-00087 | `becks-pils-20x05l-glas.jpg` | [https://www.getraenkedienst.com/bier/pils/becks-pils-20-x-0-5l](https://www.getraenkedienst.com/bier/pils/becks-pils-20-x-0-5l) |
| MG-A-00089 | `becks-blue-alkoholfrei-20x05l-glas.jpg` | [https://www.getraenkedienst.com/muenchen/de/bier/alkoholfreies-bier/becks-blue-alkoholfrei-20-x-0-5l](https://www.getraenkedienst.com/muenchen/de/bier/alkoholfreies-bier/becks-blue-alkoholfrei-20-x-0-5l) |
| MG-A-00090 | `becks-pils-24x033l-glas.jpg` | [https://expressdrinks.de/bier/pils/307/becks-pils-24x0-33l](https://expressdrinks.de/bier/pils/307/becks-pils-24x0-33l) |
| MG-A-00091 | `becks-gold-24x033l-glas.jpg` | [https://www.getraenkedienst.com/bier/pils/becks-gold-24-x-0-33l](https://www.getraenkedienst.com/bier/pils/becks-gold-24-x-0-33l) |
| MG-A-00092 | `becks-blue-alkoholfrei-24x033l-glas.jpg` | [https://www.getraenkedienst.com/bier/alkoholfreies-bier/becks-blue-alkoholfrei-24-x-0-33l](https://www.getraenkedienst.com/bier/alkoholfreies-bier/becks-blue-alkoholfrei-24-x-0-33l) |
| MG-A-00094 | `becks-green-lemon-24x033l-glas.jpg` | [https://expressdrinks.de/bier/biermischgetraenke/34/becks-green-lemon-24x0-33l](https://expressdrinks.de/bier/biermischgetraenke/34/becks-green-lemon-24x0-33l) |
| MG-A-00095 | `bitburger-pils-premium-20x05l-glas.jpg` | [https://www.getraenkedienst.com/bier/pils/bitburger-pils-20-x-0-5l](https://www.getraenkedienst.com/bier/pils/bitburger-pils-20-x-0-5l) |
| MG-A-00096 | `bitburger-00-alkoholfrei-20x05l-glas.jpg` | [https://www.getraenkedienst.com/bier/alkoholfreies-bier/bitburger-pils-0-0-alkoholfrei-20-x-0-5l](https://www.getraenkedienst.com/bier/alkoholfreies-bier/bitburger-pils-0-0-alkoholfrei-20-x-0-5l) |
| MG-A-00097 | `bitburger-natur-radler-20x05l-glas.webp` | [https://www.aktionspreis.de/sorte/bitburger-radler-naturtrueb-kasten-20-x-0-5l-angebote](https://www.aktionspreis.de/sorte/bitburger-radler-naturtrueb-kasten-20-x-0-5l-angebote) |
| MG-A-00098 | `erdinger-hefe-hell-20x05l-glas.jpg` | [https://expressdrinks.de/bier/weissbier/615/erdinger-weissbier-hell-20x0-5l](https://expressdrinks.de/bier/weissbier/615/erdinger-weissbier-hell-20x0-5l) |
| MG-A-00099 | `erdinger-urweisse-20x05l-glas.jpg` | [https://www.getraenkedienst.com/muenchen/de/bier/weissbier/erdinger-urweisse-20-x-0-5l](https://www.getraenkedienst.com/muenchen/de/bier/weissbier/erdinger-urweisse-20-x-0-5l) |
| MG-A-00100 | `erdinger-alkoholfrei-20x05l-glas.jpg` | [https://expressdrinks.de/bier/alkoholfrei/745/erdinger-weissbier-alkoholfrei-20x0-5l](https://expressdrinks.de/bier/alkoholfrei/745/erdinger-weissbier-alkoholfrei-20x0-5l) |
| MG-A-00101 | `tegernseer-hell-20x05l-glas.png` | [https://expressdrinks.de/bier/helles/154/tegernseer-hell-20x0-5l](https://expressdrinks.de/bier/helles/154/tegernseer-hell-20x0-5l) |
| MG-A-00102 | `tegernseer-hell-24x033l-glas.png` | [https://expressdrinks.de/bier/helles/153/tegernseer-hell-24x0-33l](https://expressdrinks.de/bier/helles/153/tegernseer-hell-24x0-33l) |
| MG-A-00103 | `tegernseer-alkoholfrei-20x05l-glas.jpg` | [https://expressdrinks.de/bier/alkoholfrei/5014/tegernseer-hell-alkoholfrei-20x0-5l-mhd-29.01.2026](https://expressdrinks.de/bier/alkoholfrei/5014/tegernseer-hell-alkoholfrei-20x0-5l-mhd-29.01.2026) |

## Vierter Anlauf — Kundenpreisliste 93 neue Produkte, 2026-09-01

Bilder für die 93 Artikel aus `MainGetraenke_Kundenpreisliste_93_Neue_Produkte.pdf`
(siehe `supabase/migrations/20260901090000_kundenpreisliste_93_produkte.sql` und
`..._produktbilder.sql`) — drei neue Marken: Rhön, Bad Brückenauer/Schatzquelle
(Sortimentserweiterung neben den bereits vorhandenen 6 Bad-Brückenauer-Bildern),
Adelholzener. Wie in Runde 3 gilt: ein Bild pro Marke+Sorte, wiederverwendet über
alle Gebinde-Größen derselben Sorte hinweg (Ausnahme: Adelholzener Apfelschorle,
wo Glas- und PET-Gebinde echte unterschiedliche Produktfotos haben und daher
beide behalten wurden). Jedes Kandidatenbild wurde vor der Übernahme visuell
geprüft (nicht nur anhand von Dateinamen).

**Quellen — durchgehend offizielle Herstellerseiten für alle drei Marken**,
kein Rückgriff auf Fachhändler nötig in dieser Runde:
- Rhön: [rhoensprudel.de](https://www.rhoensprudel.de) — pro Sorte ein Hero-Packshot,
  wiederverwendet über Individualglas/PET/Kasten-Formate hinweg (die Seite selbst
  führt nur eine Produktseite pro Geschmacksrichtung).
- Bad Brückenauer / Schatzquelle: [badbrueckenauer.de/downloads/flaschen/](https://www.badbrueckenauer.de/downloads/flaschen/)
  und [badbrueckenauer.de/downloads/schatzquelle/](https://www.badbrueckenauer.de/downloads/schatzquelle/) —
  offizielle Handelspartner-Downloadseite mit einem Foto pro Flasche/Format.
- Adelholzener: [adelholzener.de/marken-produkte/](https://www.adelholzener.de/marken-produkte/) —
  freigestellte, transparente Produktfotos (PNG) aus dem dortigen Produktfinder,
  beim Verarbeiten auf weißem Hintergrund freigestellt (vorher probeweise über
  einen Recherche-Agenten versucht, der die Seite nicht erreichen konnte und
  ersatzweise niedrig aufgelöste Kasten+Flasche-Fotos von getraenkedienst.com
  gefunden hatte — beim direkten Abruf war die Seite aber erreichbar, daher
  wurden die besseren offiziellen Fotos verwendet und die Händlerbilder verworfen).

**60 von 62 möglichen Sorten-Gruppen** (Marke+Geschmack, unabhängig vom Gebinde)
haben ein Bild bekommen. **2 offene Lücken:**

- **Bad Brückenauer INDI Zitro-Limette** und **INDI Orangen-Limette** — beide
  Positionen aus der PDF-Preisliste konnten nicht im aktuellen offiziellen
  Sortiment auf badbrueckenauer.de wiedergefunden werden (das Download-Portal
  scheint vollständig zu sein und listet diese Namen nicht). Nächstliegende
  aktuelle Entsprechungen wären "Limette Minze" bzw. "Orange Ingwer" — bewusst
  nicht automatisch zugeordnet, da nicht sicher dieselbe Sorte. `image_url`
  bleibt NULL, bitte mit der tatsächlichen Rhön/Brückenauer-Bestellliste
  abgleichen.

Zusätzliche Anmerkungen:
- **Adelholzener INDI Sanft / INDI Naturell / INDI Miwa+Lemon** (12×0,75L Glas):
  keine eigene 0,75L-Glasflaschen-Aufnahme auf adelholzener.de gefunden — das
  jeweilige 0,5L-PET-Foto derselben Geschmacksrichtung wird ersatzweise
  verwendet (gleiche Konvention wie bei Rhön/Bad Brückenauer, ein Foto pro
  Marke+Sorte über Gebinde hinweg).
- **Rhön A.Ki.-Granatapfel**: Abkürzung aus der PDF war unklar; die
  Herstellerseite führt das Produkt als "Apfel-Kirsche-Granatapfel" — Bild
  dieser Sorte zugeordnet.
- **Rhön A.Tr.- / Apfel-Traube (inkl. der als Dublette inaktiv gesetzten
  "ZZZRhön APF-TRAUBE")**: Herstellerseite führt kein Produkt namens exakt
  "Apfel-Traube", nur "Apfel-Rote Traube" — als nächstliegende Entsprechung
  verwendet.
- Alle neuen Dateien wurden auf max. 900px Kantenlänge skaliert und als JPEG
  komprimiert (durchgehend unter 100KB); die transparenten Adelholzener-PNGs
  wurden dabei auf einen reinweißen Hintergrund reduziert.
