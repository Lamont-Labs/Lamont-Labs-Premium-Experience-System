import { test, expect } from "@playwright/test";

test("filterable list searches supplied data and keeps single selection caller-controlled", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("searchbox", { name: "Search Saved sessions" });
  const group = page.getByRole("group", { name: "Saved sessions" });
  await expect(group.getByRole("radio")).toHaveCount(2);
  await expect(group.getByRole("radio", { name: /Court session/ })).toBeChecked();
  await expect(page.getByText("Page 1 of 3")).toBeVisible();

  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("Page 2 of 3")).toBeVisible();
  await expect(group.getByRole("radio", { name: /Review session/ })).toBeVisible();

  await page.getByLabel("Filter Saved sessions").selectOption("practice");
  await expect(page.getByText("Page 1 of 2")).toBeVisible();
  await expect(page.getByText("3 items")).toBeVisible();

  await page.getByRole("button", { name: "Sort Saved sessions Z to A" }).click();
  await expect(group.getByRole("radio", { name: /Warmup session/ })).toBeVisible();
  await expect(group.getByRole("radio", { name: /Court session/ })).toHaveCount(0);

  await page.getByLabel("Filter Saved sessions").selectOption("all");
  await search.fill("recorded");
  await expect(group.getByRole("radio")).toHaveCount(1);
  await expect(group.getByRole("radio", { name: /Video session/ })).toBeVisible();
  await group.getByRole("radio", { name: /Video session/ }).check();
  await expect(page.getByTestId("selected-session")).toHaveText("video-session");

  await search.fill("no local match");
  await expect(group.getByRole("status")).toContainText("No matching items.");
});
