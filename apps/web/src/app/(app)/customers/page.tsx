"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Users,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  X,
} from "lucide-react";

type CustomerType = "PRIVATE" | "COMPANY";

type Customer = {
  id: string;
  customerNumber: string;
  customerType: CustomerType;
  name: string;
  companyName?: string;
  phone: string;
  email: string;
  address: string;
  active: boolean;
};

const initialCustomers: Customer[] = [];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [customerType, setCustomerType] =
    useState<CustomerType>("PRIVATE");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");

  const filteredCustomers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return customers;
    }

    return customers.filter((customer) =>
      [
        customer.customerNumber,
        customer.name,
        customer.companyName,
        customer.phone,
        customer.email,
        customer.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(value),
    );
  }, [customers, search]);

  function resetForm() {
    setCustomerType("PRIVATE");
    setFirstName("");
    setLastName("");
    setCompanyName("");
    setPhone("");
    setEmail("");
    setStreet("");
    setPostalCode("");
    setCity("");
  }

  function handleCreateCustomer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextNumber = `MG-K-${String(customers.length + 1).padStart(
      6,
      "0",
    )}`;

    const fullName =
      customerType === "COMPANY"
        ? companyName
        : `${firstName} ${lastName}`.trim();

    const newCustomer: Customer = {
      id: crypto.randomUUID(),
      customerNumber: nextNumber,
      customerType,
      name: fullName,
      companyName: customerType === "COMPANY" ? companyName : undefined,
      phone,
      email,
      address: `${street}, ${postalCode} ${city}`,
      active: true,
    };

    setCustomers((current) => [...current, newCustomer]);
    resetForm();
    setShowForm(false);
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Kunden
              </h1>
              <p className="text-sm text-muted-foreground">
                Privat- und Firmenkunden verwalten
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Neuer Kunde
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Kunden insgesamt</p>
          <p className="mt-2 text-2xl font-semibold">{customers.length}</p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Privatkunden</p>
          <p className="mt-2 text-2xl font-semibold">
            {customers.filter((customer) => customer.customerType === "PRIVATE")
              .length}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Firmenkunden</p>
          <p className="mt-2 text-2xl font-semibold">
            {customers.filter((customer) => customer.customerType === "COMPANY")
              .length}
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="border-b p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Kunden suchen..."
              className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="text-lg font-semibold">
              Noch keine Kunden vorhanden
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Lege deinen ersten Kunden an. Die Kundennummer wird automatisch
              vergeben.
            </p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              <Plus className="h-4 w-4" />
              Ersten Kunden anlegen
            </button>
          </div>
        ) : (
          <div className="divide-y">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex flex-col gap-4 p-4 transition hover:bg-muted/40 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    {customer.customerType === "COMPANY" ? (
                      <Building2 className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">{customer.name}</h3>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                        {customer.customerNumber}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5" />
                        {customer.phone || "Keine Telefonnummer"}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5" />
                        {customer.email || "Keine E-Mail-Adresse"}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        {customer.address}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="w-fit rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                  Aktiv
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-background shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-lg font-semibold">Neuen Kunden anlegen</h2>
                <p className="text-sm text-muted-foreground">
                  Die Kundennummer wird automatisch erstellt.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="rounded-lg p-2 hover:bg-muted"
                aria-label="Formular schließen"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-5 p-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Kundentyp
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCustomerType("PRIVATE")}
                    className={`rounded-lg border p-3 text-sm ${
                      customerType === "PRIVATE"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "hover:bg-muted"
                    }`}
                  >
                    Privatkunde
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomerType("COMPANY")}
                    className={`rounded-lg border p-3 text-sm ${
                      customerType === "COMPANY"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "hover:bg-muted"
                    }`}
                  >
                    Firmenkunde
                  </button>
                </div>
              </div>

              {customerType === "COMPANY" ? (
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Firmenname
                  </label>
                  <input
                    required
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="z. B. Muster GmbH"
                  />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Vorname
                    </label>
                    <input
                      required
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Max"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Nachname
                    </label>
                    <input
                      required
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Mustermann"
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Telefonnummer
                  </label>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="09321 123456"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    E-Mail-Adresse
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="kunde@example.de"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Straße und Hausnummer
                  </label>
                  <input
                    required
                    value={street}
                    onChange={(event) => setStreet(event.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Musterstraße 1"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      PLZ
                    </label>
                    <input
                      required
                      value={postalCode}
                      onChange={(event) => setPostalCode(event.target.value)}
                      className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="97318"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">
                      Ort
                    </label>
                    <input
                      required
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Kitzingen"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  Abbrechen
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Kunde speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
