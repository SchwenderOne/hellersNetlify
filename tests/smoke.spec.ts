import { test, expect } from '@playwright/test';

const pages = {
  index: '/index.html',
  menu: '/menu.html',
  events: '/events.html',
  frenchPress: '/french-press.html'
} as const;

test('landing page renders hero and navigation', async ({ page }) => {
  await page.goto(pages.index);
  await expect(page.locator('.card-hero .hero-overlay h2')).toHaveText('Hellers Kaffees');
  const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });
  await expect(nav.getByRole('link', { name: 'Menü' })).toBeVisible();
  await nav.getByRole('link', { name: 'Menü' }).click();
  await expect(page).toHaveURL(/menu\.html$/);
});

test('dark mode toggle updates theme attribute', async ({ page }) => {
  await page.goto(pages.index);
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', /light|dark/);
  const initial = await html.getAttribute('data-theme');
  await page.getByRole('button', { name: 'Dunkelmodus umschalten' }).click();
  await expect(html).not.toHaveAttribute('data-theme', initial ?? 'light');
});

test('recipe calculator recalculates amounts', async ({ page }) => {
  await page.goto(pages.frenchPress);
  const input = page.locator('.recipe-calculator input[type="number"]');
  await input.fill('4');
  const coffeeResult = page.locator('#calc-coffee');
  const waterResult = page.locator('#calc-water');
  await expect(coffeeResult).toHaveText(/70g/i);
  await expect(waterResult).toHaveText(/1000ml/i);
});

test('recipe timer starts and updates display', async ({ page }) => {
  await page.goto(pages.frenchPress);
  const display = page.locator('#timer-time');
  const initial = (await display.textContent())?.trim();
  await page.locator('#timer-start').click();
  await page.waitForTimeout(1500);
  const afterStart = (await display.textContent())?.trim();
  expect(afterStart).not.toEqual(initial);
  await page.locator('#timer-reset').click();
  if (initial) {
    await expect(display).toHaveText(initial);
  }
});

test('events modal opens and validates required fields', async ({ page }) => {
  await page.goto(pages.events);
  const eventButton = page.getByRole('link', { name: /Jetzt anmelden/i }).first();
  await eventButton.waitFor();
  await eventButton.click();
  const modal = page.locator('#event-registration-modal');
  await expect(modal).toHaveAttribute('aria-hidden', 'false');
  await page.fill('#reg-name', 'Test Nutzer');
  await page.fill('#reg-email', 'test@example.com');
  await page.locator('#event-registration-form button[type="submit"]').click();
  const message = page.locator('#form-message');
  await expect(message).toHaveText(/Vielen Dank/i);
});
