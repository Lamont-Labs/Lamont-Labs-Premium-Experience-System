import { test, expect } from "@playwright/test";

test("secondary details are collapsed until requested", async ({ page }) => {
  await page.goto("/");
  const details = page.locator("details.pes-disclosure");
  const summary = details.locator("summary");
  const content = details.getByText("Optional evidence and advanced context.");

  await expect(details).toHaveCount(1);
  await expect(summary).toBeVisible();
  await expect(details).not.toHaveAttribute("open", "");
  await expect(content).toBeHidden();

  await summary.click();
  await expect(details).toHaveAttribute("open", "");
  await expect(content).toBeVisible();

  await summary.click();
  await expect(details).not.toHaveAttribute("open", "");
  await expect(content).toBeHidden();
});

test("disclosure works from keyboard", async ({ page }) => {
  await page.goto("/");
  const details = page.locator("details.pes-disclosure");
  const summary = details.locator("summary");

  await expect(summary).toBeVisible();
  await summary.focus();
  await expect(summary).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(details).toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(details).not.toHaveAttribute("open", "");
});
