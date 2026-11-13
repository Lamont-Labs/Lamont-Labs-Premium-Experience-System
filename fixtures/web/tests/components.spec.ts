import { test, expect } from "@playwright/test";

test("navigation and action state work", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "LL-PES component fixture" })).toBeVisible();
  await page.getByRole("button", { name: "Training" }).click();
  await expect(page.getByTestId("destination")).toHaveText("training");
  await expect(page.getByRole("button", { name: "Training" })).toHaveAttribute("aria-current", "page");
  await page.getByRole("button", { name: "Record attempt" }).click();
  await expect(page.getByTestId("attempts")).toHaveText("1");
});

test("fixture has no horizontal document overflow", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});

test("capture screenshot for review", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Record attempt" })).toBeVisible();
  await page.screenshot({ path: `test-results/${test.info().project.name}-fixture.png`, fullPage: true });
});
