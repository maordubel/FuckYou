import { chromium } from 'playwright';

const base = 'http://localhost:3100';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const log = (...a) => console.log(...a);

// --- mobile: sheet + add ---
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const m = await mobile.newPage();
m.on('console', (msg) => { if (msg.type() === 'error') log('CONSOLE ERROR:', msg.text()); });
await m.goto(base, { waitUntil: 'networkidle' });
await m.getByRole('button', { name: 'Add someone to the list' }).click();
await m.waitForTimeout(300);
await m.screenshot({ path: 'qa/screenshots/flow-sheet-390.png' });
await m.locator('dialog input[name="name"]').fill('QA Tester');
await m.locator('dialog textarea[name="reason"]').fill('Broke my build');
await m.getByRole('button', { name: 'Stamp them' }).click();
await m.waitForTimeout(1200);
await m.screenshot({ path: 'qa/screenshots/flow-added-390.png' });
log('after add, contains name:', await m.getByText('QA Tester').first().isVisible().catch(() => false));

// duplicate add -> should say already/voted
await m.getByRole('button', { name: 'Add someone to the list' }).click();
await m.locator('dialog input[name="name"]').fill('qa tester!!');
await m.getByRole('button', { name: 'Stamp them' }).click();
await m.waitForTimeout(1000);
log('dup message:', await m.locator('dialog [aria-live="polite"]').innerText());
await m.keyboard.press('Escape');

// search
await m.locator('input[type="search"]').fill('QA');
await m.waitForTimeout(900);
log('search results text:', await m.locator('p[aria-live="polite"]').first().innerText());
await m.screenshot({ path: 'qa/screenshots/flow-search-390.png' });

// vote
await m.locator('input[type="search"]').fill('');
await m.waitForTimeout(900);
const before = await m.locator('article').first().innerText();
await m.locator('article').first().getByRole('button', { name: /Same here|Add your signature/ }).click();
await m.waitForTimeout(1200);
const after = await m.locator('article').first().innerText();
log('vote changed:', before !== after);

// keyboard pass
await m.keyboard.press('Tab');
log('focus after tab:', await m.evaluate(() => document.activeElement?.tagName + ':' + (document.activeElement?.textContent || '').trim().slice(0, 20)));

// landscape
const land = await browser.newContext({ viewport: { width: 844, height: 390 } });
const l = await land.newPage();
await l.goto(base, { waitUntil: 'networkidle' });
await l.screenshot({ path: 'qa/screenshots/flow-landscape-844x390.png' });
log('landscape hscroll:', await l.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1));

// dark / reduced motion
const rm = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', colorScheme: 'dark' });
const r = await rm.newPage();
await r.goto(base, { waitUntil: 'networkidle' });
await r.screenshot({ path: 'qa/screenshots/flow-dark-reduced-390.png' });

await browser.close();
