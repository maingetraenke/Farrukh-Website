"use client";

import {
  PackageSearch,
  Plus,
  Search,
  Wine,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  year: string;
  category: string;
  bottleSize: string;
  purchasePrice: number;
  sellingPrice: number;
  deposit: number;
  stock: number;
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Müller-Thurgau",
    year: "2025",
    category: "Weißwein",
    bottleSize: "1 Liter",
    purchasePrice: 3.2,
    sellingPrice: 7.0,
    deposit: 0,
    stock: 0,
  },
  {
    id: 2,
    name: "Bacchus",
    year: "2025",
    category: "Weißwein",
    bottleSize: "1 Liter",
    purchasePrice: 3.2,
    sellingPrice: 7.0,
    deposit: 0,
    stock: 0,
  },
  {
    id: 3,
    name: "Silvaner",
    year: "2025",
    category: "Weißwein",
    bottleSize: "1 Liter",
    purchasePrice: 3.5,
    sellingPrice: 7.0,
    deposit: 0,
    stock: 0,
  },
  {
    id: 4,
    name: "Domina",
    year: "2025",
    category: "Rotwein",
    bottleSize: "1 Liter",
    purchasePrice: 3.5,
    sellingPrice: 7.0,
    deposit: 0,
    stock: 0,
  },
  {
    id: 5,
    name: "Rotling",
    year: "2025",
    category: "Rotling",
    bottleSize: "1 Liter",
    purchasePrice: 3.5,
    sellingPrice: 7.0,
    deposit: 0,
    stock: 0,
  },
  {
    id: 6,
    name: "Secco Weiß",
    year: "",
    category: "Secco",
    bottleSize: "0,75 Liter",
    purchasePrice: 4.5,
    sellingPrice: 9.5,
    deposit: 0,
    stock: 0,
  },
  {
    id: 7,
    name: "Secco Rotling",
    year: "",
    category: "Secco",
    bottleSize: "0,75 Liter",
    purchasePrice: 4.5,
    sellingPrice: 9.5,
    deposit: 0,
    stock: 0,
  },
  {
    id: 8,
    name: "Blanc de Blanc",
    year: "2025",
    category: "Weißwein",
    bottleSize: "0,75 Liter",
    purchasePrice: 4.0,
    sellingPrice: 10.0,
    deposit: 0,
    stock: 0,
  },
  {
    id: 9,
    name: "Sweet M",
    year: "2025",
    category: "Weißwein",
    bottleSize: "0,75 Liter",
    purchasePrice: 4.0,
    sellingPrice: 9.0,
    deposit: 0,
    stock: 0,
  },
  {
    id: 10,
    name: "Rivaner",
    year: "2025",
    category: "Weißwein",
    bottleSize: "0,75 Liter",
    purchasePrice: 4.0,
    sellingPrice: 9.0,
    deposit: 0,
    stock: 0,
  },
  {
    id: 11,
    name: "Bacchus Meisterstück",
    year: "2025",
    category: "Weißwein",
    bottleSize: "0,75 Liter",
    purchasePrice: 4.5,
    sellingPrice: 9.0,
    deposit: 0,
    stock: 0,
  },
  {
    id: 12,
    name: "Kerner Spontanvergoren",
    year: "2024",
    category: "Weißwein",
    bottleSize: "0,75 Liter",
    purchasePrice: 4.5,
    sellingPrice: 9.0,
    deposit: 0,
    stock: 0,
  },
  {
    id: 13,
    name: "Traubensaft aus Bacchus-Trauben",
    year: "2025",
    category: "Alkoholfrei",
    bottleSize: "0,75 Liter",
    purchasePrice: 3.3,
    sellingPrice: 6.5,
    deposit: 0,
    stock: 0,
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Alle");

  const categories = [
    "Alle",
    "Weißwein",
    "Rotwein",
    "Rotling",
    "Secco",
    "Alkoholfrei",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.year.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "Alle" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  function deleteProduct(id: number) {
    setProducts((current) => current.filter((product) => product.id !== id));
  }

  function addProduct() {
    const newProduct: Product = {
      id: Date.now(),
      name: "Neuer Wein",
      year: "2026",
      category: "Weißwein",
      bottleSize: "0,75 Liter",
      purchasePrice: 0,
      sellingPrice: 0,
      deposit: 0,
      stock: 0,
    };

    setProducts((current) => [...current, newProduct]);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
                <Wine size={26} />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">
                Produkte
              </h1>
            </div>
            <p className="text-slate-600">
              Weine, Preise, Einkauf, Verkauf und Lagerbestand verwalten
            </p>
          </div>

          <button
            onClick={addProduct}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus size={20} />
            Produkt hinzufügen
          </button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Produkte insgesamt</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Weinprodukte</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {products.filter((product) => product.category !== "Alkoholfrei").length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Lagerbestand Flaschen</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {products.reduce((sum, product) => sum + product.stock, 0)}
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm md:flex-row">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Produkt suchen ..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-slate-100">
                <tr className="text-left text-sm text-slate-600">
                  <th className="px-5 py-4">Produkt</th>
                  <th className="px-5 py-4">Kategorie</th>
                  <th className="px-5 py-4">Gebinde</th>
                  <th className="px-5 py-4">EK netto</th>
                  <th className="px-5 py-4">VK brutto</th>
                  <th className="px-5 py-4">Marge</th>
                  <th className="px-5 py-4">Bestand</th>
                  <th className="px-5 py-4">Aktionen</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const margin =
                    product.sellingPrice - product.purchasePrice;

                  return (
                    <tr
                      key={product.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">
                          {product.name}
                        </div>
                        {product.year && (
                          <div className="text-sm text-slate-500">
                            Jahrgang {product.year}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                          {product.category}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {product.bottleSize}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-700">
                        {product.purchasePrice.toFixed(2).replace(".", ",")} €
                      </td>

                      <td className="px-5 py-4 font-bold text-slate-900">
                        {product.sellingPrice.toFixed(2).replace(".", ",")} €
                      </td>

                      <td className="px-5 py-4 font-semibold text-green-600">
                        {margin.toFixed(2).replace(".", ",")} €
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-3 py-1 text-slate-700">
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            title="Bearbeiten"
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            title="Löschen"
                            onClick={() => deleteProduct(product.id)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <PackageSearch className="mx-auto mb-3" size={40} />
              Keine Produkte gefunden.
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <strong>Hinweis:</strong> Die Preise sind zunächst als Startwerte
          eingetragen. Der Rotling „Kaltvergoren“ wurde bewusst nicht
          aufgenommen.
        </div>
      </div>
    </main>
  );
}