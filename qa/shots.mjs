import { chromium } from 'playwright';
import fs from 'node:fs';

const VIEWPORTS = [
  ['320x568',320,568],['360x800',360,800],['375x667',375,667],['390x844',390,844],
  ['402x874',402,874],['412x915',412,915],['430x932',430,932],
  ['768x1024',768,1024],['1024x1366',1024,1366],
  ['1280x800',1280,800],['1440x900',1440,900],['1920x1080',1920,1080],
];
const base = process.env.BASE ?? 'http://localhost:3100';
const paths = ['/', '/n/demo-1'];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
let fails = 0;

for (const [name,width,height] of VIEWPORTS) {
  for (const path of paths) {
    const context = await browser.newContext({ viewport:{width,height}, deviceScaleFactor: 2 });
    const page = await context.newPage();
    await page.goto(base+path, { waitUntil:'networkidle' });
    await page.waitForTimeout(500);

    const report = await page.evaluate(() => {
      const doc = document.documentElement;
      const horizontal = doc.scrollWidth > doc.clientWidth + 1;
      const small = [...document.querySelectorAll('a,button,input,textarea,[role="button"]')]
        .filter(el => { const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && (r.height < 44 || r.width < 44) && !el.closest('.sr-only') && el.className.toString().indexOf('sr-only') < 0; })
        .map(el => `${el.tagName}:${(el.textContent||el.getAttribute('aria-label')||'').trim().slice(0,18)}:${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`);
      const spill = [...document.querySelectorAll('li.fy-cut, .fy-cut')].flatMap(card => {
        const cr = card.getBoundingClientRect();
        return [...card.querySelectorAll('*')].filter(el => {
          const r = el.getBoundingClientRect();
          return r.right > cr.right + 1.5 || r.left < cr.left - 1.5;
        }).map(el => el.tagName);
      });
      return { horizontal, small: [...new Set(small)], spill: [...new Set(spill)] };
    });

    if (path === '/') await page.screenshot({ path: `qa/screenshots/m-${name}.png` });
    const bad = report.horizontal || report.small.length || report.spill.length;
    if (bad) fails++;
    console.log(`${name.padEnd(10)} ${path.padEnd(11)} hscroll=${report.horizontal} small=${report.small.length?report.small.join('|'):'ok'} spill=${report.spill.length?report.spill.join(','):'ok'}`);
    await context.close();
  }
}
console.log(fails === 0 ? 'ALL VIEWPORTS PASS' : `${fails} viewport checks failed`);
await browser.close();
