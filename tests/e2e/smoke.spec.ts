import { expect, test } from "@playwright/test";

test("trang chủ hiển thị tên hệ thống, không cuộn ngang", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Minh Kỳ Academy" })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});
