import { test, expect } from "@playwright/test";

test("compact navigation keeps destinations labeled on narrow screens", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(nav).toBeVisible();
  for (const label of ["Court", "Training", "Profile"]) {
    const item = nav.getByRole("button", { name: label });
    await expect(item).toBeVisible();
    await expect(item.locator(".pes-nav__label")).toBeVisible();
  }
  await nav.getByRole("button", { name: "Training" }).click();
  await expect(nav.getByRole("button", { name: "Training" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByTestId("destination")).toHaveText("training");
});

test("compact navigation remains operable from keyboard", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  const profile = nav.getByRole("button", { name: "Profile" });
  await profile.focus();
  await expect(profile).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(profile).toHaveAttribute("aria-current", "page");
  await expect(page.getByTestId("destination")).toHaveText("profile");
});

test("overflow destinations remain reachable without hiding their labels", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  const metrics = await nav.evaluate(element => ({
    scrollWidth: element.scrollWidth,
    clientWidth: element.clientWidth
  }));
  expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
  const settings = nav.getByRole("button", { name: "Settings" });
  await settings.scrollIntoViewIfNeeded();
  await expect(settings.locator(".pes-nav__label")).toBeVisible();
  await settings.click();
  await expect(settings).toHaveAttribute("aria-current", "page");
  await expect(page.getByTestId("destination")).toHaveText("settings");
});
