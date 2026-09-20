import { expect, test } from "@playwright/test";

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
  await page.goto("/login");

  await page.getByLabel("E-Mail").fill("test@maingetraenke.de");
  await page.getByLabel("Passwort").fill("wrong-password");
  await page.getByRole("button", { name: "Anmelden" }).click();

  await expect(page.getByText("Anmeldung fehlgeschlagen")).toBeVisible();
});

test("visiting a protected route while signed out redirects to /login", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});
