import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve('.');
const outputDir = resolve(root, 'docs/baseline');
const siteRoot = resolve(root, 'dist');

const scenarios = [
  {
    name: 'index-light.png',
    url: 'file://' + resolve(siteRoot, 'index.html'),
    actions: []
  },
  {
    name: 'index-dark.png',
    url: 'file://' + resolve(siteRoot, 'index.html'),
    actions: [async (page) => {
      await page.getByRole('button', { name: 'Dunkelmodus umschalten' }).click();
    }]
  },
  {
    name: 'events-light.png',
    url: 'file://' + resolve(siteRoot, 'events/index.html'),
    actions: []
  },
  {
    name: 'events-dark.png',
    url: 'file://' + resolve(siteRoot, 'events/index.html'),
    actions: [async (page) => {
      await page.getByRole('button', { name: 'Dunkelmodus umschalten' }).click();
    }]
  },
  {
    name: 'french-press-light.png',
    url: 'file://' + resolve(siteRoot, 'french-press/index.html'),
    actions: []
  },
  {
    name: 'french-press-dark.png',
    url: 'file://' + resolve(siteRoot, 'french-press/index.html'),
    actions: [async (page) => {
      await page.getByRole('button', { name: 'Dunkelmodus umschalten' }).click();
    }]
  }
];

const launchOptions = {
  headless: true,
};

(async () => {
  await mkdir(outputDir, { recursive: true });

  for (const scenario of scenarios) {
    const browser = await chromium.launch(launchOptions);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    console.log(`Capturing ${scenario.name}`);
    await page.goto(scenario.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    for (const action of scenario.actions) {
      await action(page);
      await page.waitForTimeout(500);
    }

    const outputPath = resolve(outputDir, scenario.name);
    await page.screenshot({ path: outputPath, fullPage: true });

    await browser.close();
  }
})();
