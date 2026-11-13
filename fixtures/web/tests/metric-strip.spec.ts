import { test, expect } from "@playwright/test";

test("metric strip presents real caller-provided labels and values", async ({ page }) => {
  await page.goto("/");
  const metrics = page.getByRole("region", { name: "Fixture metrics" });
  await expect(metrics).toBeVisible();
  await expect(metrics.getByText("Recorded attempts")).toBeVisible();
  await expect(metrics.getByTestId("metric-attempts")).toHaveText("0");
  await page.getByRole("button", { name: "Record attempt" }).click();
  await expect(metrics.getByTestId("metric-attempts")).toHaveText("1");
});

test("metric strip remains within viewport at 320px and large text", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  await page.locator("body").evaluate(element => { element.style.fontSize = "200%"; });
  const metrics = page.getByRole("region", { name: "Fixture metrics" });
  await expect(metrics).toBeVisible();
  const boxes = await metrics.locator(".pes-metrics__item").all();
  for (const item of boxes) {
    const rect = await item.boundingBox();
    expect(rect).not.toBeNull();
    expect(rect!.x).toBeGreaterThanOrEqual(0);
    expect(rect!.x + rect!.width).toBeLessThanOrEqual(321);
  }
});
