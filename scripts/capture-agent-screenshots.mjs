import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'public', 'lovable-uploads');
const baseUrl = process.env.PREVIEW_URL || 'http://localhost:5173';

const screens = [
  { query: 'dashboard', selector: '#screenshot-dashboard', filename: 'app-dashboard.png' },
  { query: 'menu', selector: '#screenshot-menu', filename: 'app-menu.png' },
  { query: 'growers', selector: '#screenshot-growers', filename: 'app-grower-directory.png' },
];

async function waitForServer(page) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await page.goto(`${baseUrl}/agent-mobile-preview?screen=dashboard`, {
        waitUntil: 'domcontentloaded',
        timeout: 5000,
      });
      if (response && response.ok()) return;
    } catch {
      // retry
    }
    await page.waitForTimeout(1000);
  }
  throw new Error(`Dev server not reachable at ${baseUrl}`);
}

async function captureScreenshots() {
  await mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 430, height: 900 },
    deviceScaleFactor: 2,
  });

    await page.addInitScript(() => {
      localStorage.setItem('agrilync_cookie_consent', 'accepted');
    });

  for (const screen of screens) {
    await page.goto(`${baseUrl}/agent-mobile-preview?screen=${screen.query}`, {
      waitUntil: 'networkidle',
    });
    await page.waitForSelector(screen.selector, { state: 'visible' });
    await page.waitForTimeout(800);
    const element = page.locator(screen.selector);
    await element.screenshot({
      path: path.join(outputDir, screen.filename),
      type: 'png',
    });
    console.log(`Saved ${screen.filename}`);
  }

  await browser.close();
}

captureScreenshots().catch((error) => {
  console.error(error);
  process.exit(1);
});
