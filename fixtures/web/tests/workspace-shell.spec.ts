import { test, expect } from "@playwright/test";

test("workspace switches secondary content without duplicating sections", async ({ page }) => {
  await page.goto("/");
  const workspace = page.getByRole("region", { name: "Workspace preview" });
  await expect(workspace).toBeVisible();
  await expect(workspace.getByText("Session overview content")).toBeVisible();
  await expect(workspace.getByText("History content")).toHaveCount(0);
  await workspace.getByRole("button", { name: "History" }).click();
  await expect(workspace.getByRole("button", { name: "History" })).toHaveAttribute("aria-pressed", "true");
  await expect(workspace.getByText("History content")).toBeVisible();
  await expect(workspace.getByText("Session overview content")).toHaveCount(0);
});

test("workspace controls work with keyboard at narrow width", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  const workspace = page.getByRole("region", { name: "Workspace preview" });
  const button = workspace.getByRole("button", { name: "Details" });
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-pressed", "true");
  await expect(workspace.getByText("Details content")).toBeVisible();
});
