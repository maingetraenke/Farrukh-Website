-- Produktbilder für 53 Artikel aus der offiziellen Sortimentsliste,
-- recherchiert 2026-08-10 (Chat, Teil 3) von offiziellen Herstellerseiten
-- (z.B. badbrueckenauer.de, blackforest-still.de, bayla.de, paulaner.de,
-- bitburger.com) bzw. — wo kein Herstellerbild mit exakt passendem
-- Gebinde verfügbar war — von spezialisierten Getränke-Fachhändlern
-- (expressdrinks.de, getraenkedienst.com, getraenkeonline.shop), jeweils
-- ein isoliertes Produkt-/Kistenfoto ohne Lifestyle-Elemente, exakt zum
-- angegebenen Gebinde passend. Quellen-Dokumentation: siehe Chat-Verlauf.
--
-- Bewusst nicht vollständig: 8 Bayla-Artikel und 2 Beck's-Artikel haben
-- kein Bild bekommen, weil keine Quelle ein zweifelsfrei passendes,
-- Gebinde-exaktes offizielles Produktfoto lieferte (Details siehe
-- Kontrollbericht im Chat) — image_url bleibt für diese bewusst null,
-- statt ein falsches/generisches Bild zu erzwingen.

update public.products as p
set image_url = v.image_url
from (values
      ('MG-A-00055', '/products/gerolsteiner-spritzig.jpg'),
      ('MG-A-00056', '/products/gerolsteiner-medium.jpg'),
      ('MG-A-00057', '/products/gerolsteiner-naturell.jpg'),
      ('MG-A-00041', '/products/franken-brunnen-spritzig-07l-glas.jpg'),
      ('MG-A-00042', '/products/franken-brunnen-sanft-07l-glas.jpg'),
      ('MG-A-00043', '/products/franken-brunnen-medium-07l-glas.png'),
      ('MG-A-00044', '/products/franken-brunnen-naturell-07l-glas.jpg'),
      ('MG-A-00045', '/products/franken-brunnen-spritzig-10l-pet.jpg'),
      ('MG-A-00046', '/products/franken-brunnen-sanft-10l-pet.png'),
      ('MG-A-00047', '/products/franken-brunnen-medium-10l-pet.jpg'),
      ('MG-A-00048', '/products/franken-brunnen-naturell-10l-pet.jpg'),
      ('MG-A-00049', '/products/bad-brueckenauer-spritzig-07l-glas.webp'),
      ('MG-A-00050', '/products/bad-brueckenauer-medium-07l-glas.webp'),
      ('MG-A-00051', '/products/bad-brueckenauer-naturell-07l-glas.webp'),
      ('MG-A-00052', '/products/bad-brueckenauer-spritzig-10l-pet.webp'),
      ('MG-A-00053', '/products/bad-brueckenauer-medium-10l-pet.webp'),
      ('MG-A-00054', '/products/bad-brueckenauer-naturell-10l-pet.webp'),
      ('MG-A-00058', '/products/black-forest-spritzig-07l-glas.png'),
      ('MG-A-00059', '/products/black-forest-feinperlig-07l-glas.png'),
      ('MG-A-00060', '/products/black-forest-still-07l-glas.png'),
      ('MG-A-00061', '/products/black-forest-still-05l-pet.png'),
      ('MG-A-00040', '/products/alasia-medium-07l-glas.jpg'),
      ('MG-A-00062', '/products/bayla-sauerkirsch-1l.webp'),
      ('MG-A-00065', '/products/bayla-banane-1l.webp'),
      ('MG-A-00067', '/products/bayla-orange-1l.webp'),
      ('MG-A-00073', '/products/bayla-ananas-1l.webp'),
      ('MG-A-00077', '/products/bayla-traube-rot-02l.webp'),
      ('MG-A-00064', '/products/bayla-maracuja-1l.webp'),
      ('MG-A-00071', '/products/bayla-traube-direktsaft-1l.webp'),
      ('MG-A-00070', '/products/bayla-multivitamin-1l.webp'),
      ('MG-A-00078', '/products/coca-cola-24x033l-glas.png'),
      ('MG-A-00081', '/products/paulaner-cola-24x033l-glas.png'),
      ('MG-A-00083', '/products/paulaner-limo-orange-24x033l-glas.png'),
      ('MG-A-00082', '/products/paulaner-limo-zitrone-24x033l-glas.png'),
      ('MG-A-00080', '/products/paulaner-spezi-24x033l-glas.png'),
      ('MG-A-00084', '/products/augustiner-hell-24x033l-glas.jpg'),
      ('MG-A-00085', '/products/augustiner-dunkel-20x05l-glas.jpg'),
      ('MG-A-00086', '/products/augustiner-alkoholfrei-20x05l-glas.jpg'),
      ('MG-A-00090', '/products/becks-pils-24x033l-glas.jpg'),
      ('MG-A-00087', '/products/becks-pils-20x05l-glas.jpg'),
      ('MG-A-00091', '/products/becks-gold-24x033l-glas.jpg'),
      ('MG-A-00092', '/products/becks-blue-alkoholfrei-24x033l-glas.jpg'),
      ('MG-A-00089', '/products/becks-blue-alkoholfrei-20x05l-glas.jpg'),
      ('MG-A-00094', '/products/becks-green-lemon-24x033l-glas.jpg'),
      ('MG-A-00095', '/products/bitburger-pils-premium-20x05l-glas.jpg'),
      ('MG-A-00096', '/products/bitburger-00-alkoholfrei-20x05l-glas.jpg'),
      ('MG-A-00097', '/products/bitburger-natur-radler-20x05l-glas.webp'),
      ('MG-A-00098', '/products/erdinger-hefe-hell-20x05l-glas.jpg'),
      ('MG-A-00099', '/products/erdinger-urweisse-20x05l-glas.jpg'),
      ('MG-A-00100', '/products/erdinger-alkoholfrei-20x05l-glas.jpg'),
      ('MG-A-00101', '/products/tegernseer-hell-20x05l-glas.png'),
      ('MG-A-00102', '/products/tegernseer-hell-24x033l-glas.png'),
      ('MG-A-00103', '/products/tegernseer-alkoholfrei-20x05l-glas.jpg')
) as v(article_number, image_url)
where p.organization_id = '00000000-0000-0000-0000-000000000001'
  and p.article_number = v.article_number;
