import { test, expect } from '@playwright/test';
import { login, setupE2eTest, signUp } from './utils';

test.describe('User Auth', () => {
  const userEmail = 'test@test.io';
  const userPassword = 'test123456';
  const userName = 'testuser';

  test.beforeEach(setupE2eTest);
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:1337');
  });

  test('new user can sign up', async ({ browser, page}) => {
    await signUp(page, userEmail, userPassword, userName);
  });

  test('after signing up, user can login from another machine', async ({
    browser,
    page,
  }) => {
    await signUp(page, userEmail, userPassword, userName);
    const newMachine = await browser.newPage();
    await newMachine.goto('http://localhost:1337');
    await login(newMachine, userEmail, userPassword, userName);
  });

  test('after signing up, user is logged in on a new tab', async ({
    context,
    page,
  }) => {
    await signUp(page, userEmail, userPassword, userName);
    const newTab = await context.newPage();
    await newTab.goto('http://localhost:1337');
    const logoutButton = newTab.locator('button', { hasText: 'Logout' });
    await expect(logoutButton).toHaveCount(1);
  });

  test('user without a username gets redirected to "/welcome"', async ({
    page,
  }) => {
    await signUp(page, userEmail, userPassword, userName, true);
    await page.goto('http://localhost:1337');
    const welcomeNotice = page.locator('h2', { hasText: 'Welcome to Supaship!' });
    await expect(welcomeNotice).toHaveCount(1);
  });

  test('a user with a username gets sent back home if they visit "/welcome"', async ({
    page,
  }) => {
    await signUp(page, userEmail, userPassword, userName);
    await page.goto('http://localhost:1337/welcome');
    const welcomeNotice = page.locator('h2', { hasText: 'Welcome to Supaship!' });
    await expect(welcomeNotice).toHaveCount(0);

    const logoutButton = page.locator('button', { hasText: 'Logout' });
    await expect(logoutButton).toHaveCount(1);
  });

  test('a logged out user goes to "/" if they visit "/welcome"', async ({
    page
  }) => {
    await page.goto('http://localhost:1337/welcome');
    await page.waitForURL('http://localhost:1337', {
      timeout: 2000
    });
    const welcomeNotice = page.locator('h2', { hasText: 'Welcome to Supaship!' });
    await expect(welcomeNotice).toHaveCount(0);
  });
})
