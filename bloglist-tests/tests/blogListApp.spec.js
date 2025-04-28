const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const loginInput = await page.getByTestId('username')
    await expect(loginInput).toBeVisible();

    const passwordInput = await page.getByTestId('password')
    await expect(passwordInput).toBeVisible();
  })
})