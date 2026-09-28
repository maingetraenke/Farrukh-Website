import { expect, test } from "@playwright/test";

// Direct navigations to /login and /dashboard wait for DOMContentLoaded,
// not the full "load" event: these tests assert on routing and the form,
// not on assets. On GitHub runners the full load of the login page (eager
// logo via /_next/image) intermittently never fired within 30s, while the
// same build passes locally.

test("root shows the public marketing homepage", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", { name: /Deine Lieblingsgetränke/ }),
  ).toBeVisible();
});

test("marketing footer links to the staff login", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Mitarbeiter-Login" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByText("Bitte mit deinem MainGetränke-Konto anmelden."),
  ).toBeVisible();
});

test("login form validates and shows a server-side error", async ({
  page,
}) => {
  await page.goto("/login", { waitUntil: "domcontentloaded" });

  await page.getByLabel("E-Mail").fill("test@maingetraenke.de");
  await page.getByLabel("Passwort").fill("wrong-password");
  await page.getByRole("button", { name: "Anmelden" }).click();

  await expect(page.getByText("Anmeldung fehlgeschlagen")).toBeVisible();
});

test("visiting a protected route while signed out redirects to /login", async ({
  page,
}) => {
  await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/login/);
});
