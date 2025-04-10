const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://www.saucedemo.com/';
const CREDENTIALS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' }
};

test.describe('SauceDemo Test Suite', () => {
  test('TC01 - Login as standard user and assert URL', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('#user-name', CREDENTIALS.standard.username);
    await page.fill('#password', CREDENTIALS.standard.password);
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory.html/);
    console.log('Login Success for standard_user');
  });

  test('TC02 - Login as locked out user and assert error label', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('#user-name', CREDENTIALS.locked.username);
    await page.fill('#password', CREDENTIALS.locked.password);
    await page.click('#login-button');
    const errorLabel = page.locator('[data-test="error"]');
    await expect(errorLabel).toBeVisible();
    await expect(errorLabel).toContainText('locked out');
  });

  test('TC03 - View a product (non-text assertion)', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('#user-name', CREDENTIALS.standard.username);
    await page.fill('#password', CREDENTIALS.standard.password);
    await page.click('#login-button');
    console.log(await page.title())
    await page.click('.inventory_item a');
    const image = page.locator('.inventory_details_img');
    await expect(image).toBeVisible();
  });

  test('TC04 - To add to cart', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('#user-name', CREDENTIALS.standard.username);
    await page.fill('#password', CREDENTIALS.standard.password);
    await page.click('#login-button');
    await page.click('text=Add to cart');
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
    console.log("Added to Cart Successfully")
  });

  test('TC05 - Navigate to About Page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('#user-name', CREDENTIALS.standard.username);
    await page.fill('#password', CREDENTIALS.standard.password);
    await page.click('#login-button');
    await page.click('#react-burger-menu-btn');
    await page.click('#about_sidebar_link');
    await expect(page).toHaveURL(/saucelabs.com/);
    console.log('Navigated to About Page Successfully');

  });

  test('TC06 - Sort', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('#user-name', CREDENTIALS.standard.username);
    await page.fill('#password', CREDENTIALS.standard.password);
    await page.click('#login-button');
    const firstItem = await page.locator('.inventory_item_name').first().textContent();
    console.log('First item price before sort:', firstItem);
    await page.selectOption('.product_sort_container', 'za');
    const firstItemAfterSort = await page.locator('.inventory_item_name').first().textContent();
    console.log('First item price after sort:', firstItemAfterSort);
  });

  // test('TC07 - Sort and Logout', async ({ page }) => {
  //   await page.goto(BASE_URL);
  //   await page.fill('#user-name', CREDENTIALS.standard.username);
  //   await page.fill('#password', CREDENTIALS.standard.password);
  //   await page.click('#login-button');
  //   await page.selectOption('.product_sort_container', 'za');
  //   await page.click('#react-burger-menu-btn');
  //   await page.click('#logout_sidebar_link');
  //   await expect(page).toHaveURL(BASE_URL);
  // });

});