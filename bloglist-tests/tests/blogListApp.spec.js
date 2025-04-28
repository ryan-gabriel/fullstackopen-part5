const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "John Doe",
        username: "john",
        password: "12345678",
      },
    });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    const loginInput = await page.getByTestId("username");
    await expect(loginInput).toBeVisible();

    const passwordInput = await page.getByTestId("password");
    await expect(passwordInput).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
        await page.getByTestId("username").fill("john")
        await page.getByTestId("password").fill("12345678");
        await page.getByText("login").click();

        await expect(page.getByText("John Doe logged in")).toBeVisible();
        await expect(page.getByText("Wrong username or password")).not.toBeVisible()
    });

    test("fails with wrong credentials", async ({ page }) => {
        await page.getByTestId("username").fill("john")
        await page.getByTestId("password").fill("wrong");
        await page.getByText("login").click();
        
        await expect(page.getByText("Wrong username or password")).toBeVisible()
        await expect(page.getByText("John Doe logged in")).not.toBeVisible()
    });
  });
});
