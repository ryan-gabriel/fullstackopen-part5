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
    await expect(page.getByTestId("username")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByTestId("username").fill("john");
      await page.getByTestId("password").fill("12345678");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("John Doe logged in")).toBeVisible();
      await expect(page.getByText("Wrong username or password")).not.toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("username").fill("john");
      await page.getByTestId("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Wrong username or password")).toBeVisible();
      await expect(page.getByText("John Doe logged in")).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId("username").fill("john");
      await page.getByTestId("password").fill("12345678");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("John Doe logged in")).toBeVisible();
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: "new blog" }).click();
      await page.getByTestId("title").fill("Testing blog title");
      await page.getByTestId("author").fill("John Doe");
      await page.getByTestId("url").fill("http://example.com");

      await page.getByRole("button", { name: "Create" }).click();
      await expect(page.getByText("Testing blog title John Doe")).toBeVisible();
    });

    describe("and a blog exists", () => {
      beforeEach(async ({ page }) => {
        await page.getByRole("button", { name: "new blog" }).click();
        await page.getByTestId("title").fill("Testing blog title");
        await page.getByTestId("author").fill("John Doe");
        await page.getByTestId("url").fill("http://example.com");

        await page.getByRole("button", { name: "Create" }).click();
        await expect(page.getByText("Testing blog title John Doe")).toBeVisible();
      });

      test("it can be liked", async ({ page }) => {
        const button = page.getByRole("button", { name: "view" });
        await expect(button).toBeVisible();
        await button.click();

        const blogDetail = page.getByText("Testing blog title John Doe");
        const div = blogDetail.locator("..").locator(".blogDetail");
        await expect(div).toContainText("likes 0");

        const likeButton = page.getByRole("button", { name: "like" });
        await expect(likeButton).toBeVisible();
        await likeButton.click();

        await expect(div).toContainText("likes 1");
      });

      test("it can be deleted by the user who created it", async ({ page }) => {
        const button = page.getByRole("button", { name: "view" });
        await expect(button).toBeVisible();
        await button.click();

        const blogDetail = page.getByText("Testing blog title John Doe");
        const div = blogDetail.locator("..").locator(".blogDetail");
        await expect(div).toContainText("likes");
        page.once("dialog", async (dialog) => {
          console.log(dialog.message());
          await dialog.accept();
        });
        const deleteButton = page.getByRole("button", { name: "remove" });
        await expect(deleteButton).toBeVisible();
        await deleteButton.click();
        await expect(page.getByText("Testing blog title John Doe")).not.toBeVisible();
      });

      describe("and another user is logged in", () => {
        beforeEach(async ({ page, request }) => {
          await page.getByRole("button", { name: "Log Out" }).click();
          await expect(page.getByText("John Doe logged in")).not.toBeVisible();

          await request.post("/api/users", {
            data: {
              name: "Jane Doe",
              username: "jane",
              password: "12345678",
            },
          });

          await page.getByTestId("username").fill("jane");
          await page.getByTestId("password").fill("12345678");
          await page.getByRole("button", { name: "login" }).click();
          await expect(page.getByText("Jane Doe logged in")).toBeVisible();
        });

        test("it cannot be deleted by another user", async ({ page }) => {
          const button = page.getByRole("button", { name: "view" });
          await expect(button).toBeVisible();
          await button.click();

          const deleteButton = page.getByRole("button", { name: "remove" });
          await expect(deleteButton).not.toBeVisible();
        });
      });
    });
  });
});
