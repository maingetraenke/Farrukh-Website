import { expect, test } from "@playwright/test";

test("unauthenticated visitor is redirected to /login", async ({ page }) => {
  await page.goto("/");
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

  await expect(page.getByRole("alert")).toContainText(
    "Anmeldung fehlgeschlagen",
  );
});

test("visiting a protected route while signed out redirects to /login", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});
