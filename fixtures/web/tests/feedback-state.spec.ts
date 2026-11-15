import { test, expect } from "@playwright/test";

test("feedback states announce status and expose recovery actions", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".pes-feedback-state")).toContainText("No sessions yet");
  await page.getByRole("button", { name: "Error" }).click();
  await expect(page.getByRole("alert")).toContainText("Session could not be opened");
  await page.getByRole("button", { name: "Show recovery" }).click();
  await expect(page.locator(".pes-feedback-state")).toContainText("Session is ready");
});

test("loading is marked busy and has a non-animated reduced-motion fallback", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Loading" }).click();
  const state = page.locator(".pes-feedback-state");
  await expect(state).toHaveAttribute("role", "status");
  await expect(state).toHaveAttribute("aria-busy", "true");
  await expect(state).toContainText("Loading saved sessions");
  await expect(state.locator(".pes-feedback-state__mark")).toHaveAttribute("aria-hidden", "true");
});

test("offline and empty states keep their meanings visible without color", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Offline" }).click();
  await expect(page.locator(".pes-feedback-state")).toContainText("Offline");
  await page.getByRole("button", { name: "Empty" }).click();
  await expect(page.locator(".pes-feedback-state")).toContainText("No results");
});

test("form field links validation errors to its label and input", async ({ page }) => {
  await page.goto("/");
  const email = page.getByRole("textbox", { name: /Email/ });
  await expect(email).toHaveAttribute("required", "");
  await email.fill("not-an-email");
  await page.getByRole("button", { name: "Save locally" }).click();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toHaveAccessibleDescription(/Enter a valid email address/);
  await email.fill("user@example.com");
  await page.getByRole("button", { name: "Save locally" }).click();
  await expect(page.getByText("Saved locally.")).toBeVisible();
});
