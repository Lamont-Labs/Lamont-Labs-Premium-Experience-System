import { test, expect } from "@playwright/test";

test("validation summary appears after submit and its link focuses the invalid field", async ({ page }) => {
  await page.goto("/");
  const email = page.getByRole("textbox", { name: /Email/ });
  await expect(page.getByRole("alert")).toHaveCount(0);

  await page.getByRole("button", { name: "Save locally" }).click();
  const summary = page.getByRole("alert");
  await expect(summary).toContainText("Please review these fields");
  await expect(summary).toContainText("Email: Enter a valid email address.");

  await summary.getByRole("link", { name: /Email: Enter a valid email address/ }).click();
  await expect(email).toBeFocused();

  await email.fill("person@example.com");
  await page.getByRole("button", { name: "Save locally" }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
});
