import { test, expect } from "@playwright/test";

test("secondary details are collapsed until requested", async ({ page }) => {
  await page.goto("/");
  const summary = page.getByText("Additional information", { exact: true });
  const details = page.locator("details.pes-disclosure");
  await expect(details).not.toHaveAttribute("open", "");
  await expect(page.getByText("Optional evidence and advanced context.")).not.toBeVisible();
  await summary.click();
  await expect(details).toHaveAttribute("open", "");
  await expect(page.getByText("Optional evidence and advanced context.")).toBeVisible();
  await summary.click();
  await expect(details).not.toHaveAttribute("open", "");
});

test("disclosure works from keyboard", async ({ page }) => {
  await page.goto("/");
  const summary = page.locator("details.pes-disclosure summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("details.pes-disclosure")).toHaveAttribute("open", "");
});
