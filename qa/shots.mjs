import { chromium } from 'playwright';
import fs from 'node:fs';

const VIEWPORTS = [
  ['320x568', 320, 568],
  ['360x800', 360, 800],
  ['375x667', 375, 667],
  ['390x844', 390, 844],
  ['402x874', 402, 874],
  ['412x915', 412, 915],
  ['430x932', 430, 932],
  ['768x1024', 768, 1024],
  ['1024x1366', 1024, 1366],
  ['1280x800', 1280, 800],
  ['1440x900', 1440, 900],
  ['1920x1080', 1920, 1080],
];

const base = process.env.BASE ?? 'http://localhost:3100';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const report = [];

for (const [name, width, height] of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const horizontal = doc.scrollWidth > doc.clientWidth + 1;
    const wide = [...document.querySelectorAll('body *')]
      .filter((el) => el.getBoundingClientRect().right > doc.clientWidth + 1 || el.getBoundingClientRect().left < -1)
      .slice(0, 5)
      .map((el) => `${el.tagName}.${el.className?.toString().slice(0, 40)}`);
    return { horizontal, scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, wide };
  });

  const small = await page.evaluate(() => {
    const targets = [...document.querySelectorAll('a,button,input,textarea,[role="button"]')];
    return targets
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && (r.height < 44 || r.width < 44);
      })
      .map((el) => `${el.tagName}:${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 24)}:${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`);
  });

  await page.screenshot({ path: `qa/screenshots/${name}.png`, fullPage: false });
  report.push({ name, ...overflow, small });
  await context.close();
}

await browser.close();
fs.writeFileSync('qa/report.json', JSON.stringify(report, null, 2));
for (const row of report) {
  console.log(`${row.name.padEnd(10)} hscroll=${row.horizontal} (${row.scrollWidth}/${row.clientWidth}) small=${row.small.length ? row.small.join(' | ') : 'none'} ${row.wide.length ? 'WIDE:' + row.wide.join(',') : ''}`);
}
