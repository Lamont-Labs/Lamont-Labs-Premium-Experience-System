import { test, expect } from "@playwright/test";

test("filterable list searches supplied data and keeps single selection caller-controlled", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("searchbox", { name: "Search Saved sessions" });
  const group = page.getByRole("group", { name: "Saved sessions" });
  await expect(group.getByRole("radio")).toHaveCount(3);
  await expect(group.getByRole("radio", { name: /Court session/ })).toBeChecked();

  await search.fill("video");
  await expect(group.getByRole("radio")).toHaveCount(1);
  await expect(group.getByRole("radio", { name: /Review session/ })).toBeVisible();
  await group.getByRole("radio", { name: /Review session/ }).check();
  await expect(page.getByTestId("selected-session")).toHaveText("review-session");

  await search.fill("no local match");
  await expect(group.getByRole("status")).toContainText("No matching items.");
});
