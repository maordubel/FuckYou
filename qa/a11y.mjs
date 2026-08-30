import { chromium } from 'playwright';
const B = 'http://localhost:3100';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

const rc = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const rp = await rc.newPage();
await rp.goto(B, { waitUntil: 'networkidle' });
await rp.waitForTimeout(500);
console.log('reduced · dashoffset', await rp.locator('.fy-draw').first().evaluate(e => getComputedStyle(e).strokeDashoffset));
console.log('reduced · swatch clip', await rp.locator('.fy-swatch').first().evaluate(e => getComputedStyle(e).clipPath));
console.log('reduced · cta opacity', await rp.locator('.fy-land').first().evaluate(e => getComputedStyle(e).opacity));
await rp.screenshot({ path: 'qa/screenshots/reduced-motion.png' });
await rc.close();

const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await c.newPage();
await p.goto(B, { waitUntil: 'networkidle' });
await p.waitForTimeout(600);

console.log('focus ring on field:', await p.evaluate(() => {
  const i = document.querySelector('.fy-field');
  i.focus();
  return getComputedStyle(i).outlineWidth;
}));

const stops = [];
for (let i = 0; i < 6; i++) {
  await p.keyboard.press('Tab');
  stops.push(await p.evaluate(() => {
    const el = document.activeElement;
    return `${el.tagName}:${(el.textContent || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').trim().slice(0, 22)}[ring ${getComputedStyle(el).outlineWidth}]`;
  }));
}
console.log('tab order:'); stops.forEach(s => console.log('  ', s));

// the wall is capped at a page, so the proof is the status line, not the count
const fresh = 'Keyboard Test ' + Date.now();
await p.locator('form input[name="name"]').last().fill(fresh);
await p.keyboard.press('Enter');
await p.waitForTimeout(1600);
const said = await p.locator('form p[aria-live="polite"]').last().innerText();
console.log('keyboard submit worked:', said.includes('is on the wall'), '·', said.trim());
await b.close();
