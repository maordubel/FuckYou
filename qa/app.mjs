import { chromium } from 'playwright';
const B='http://localhost:3100';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const errs=[];
const c=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});
const p=await c.newPage();
p.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
p.on('response',r=>{ if(r.status()>=400 && !r.url().includes('/api/bot')) errs.push('HTTP '+r.status()+' '+r.url()); });

await p.goto(B,{waitUntil:'networkidle'});
await p.waitForTimeout(1200);
await p.screenshot({path:'qa/screenshots/app-home.png'});
console.log('form on the page (no button first):', await p.locator('form input[name="name"]').first().isVisible());

await p.locator('form input[name="name"]').first().fill('דוד לוי');
await p.getByRole('button',{name:'Ruined my day'}).click();
await p.getByRole('button',{name:'Fuck them',exact:true}).click();
await p.waitForTimeout(1600);
await p.screenshot({path:'qa/screenshots/app-after-add.png'});
console.log('rows after add:', await p.locator('li.fy-cut').count());

await p.locator('form input[name="name"]').first().fill('דוד לוי!!');
await p.waitForTimeout(900);
console.log('dupe shown:', await p.locator('section[aria-live="polite"]').first().isVisible().catch(()=>false));
await p.screenshot({path:'qa/screenshots/app-dupe.png'});

await p.locator('.fy-metoo').nth(1).click();
await p.waitForTimeout(1000);
console.log('backed label:', await p.locator('.fy-metoo').nth(1).innerText());

await p.locator('li.fy-cut a').first().click();
await p.waitForTimeout(1400);
await p.screenshot({path:'qa/screenshots/app-entry.png'});
console.log('entry url:', p.url());
console.log('share buttons:', await p.locator('a[href^="https://wa.me"], button:has-text("Save for story")').count());

await p.goto(B+'/hq',{waitUntil:'networkidle'});
await p.waitForTimeout(500);
await p.screenshot({path:'qa/screenshots/app-hq.png'});
console.log('hq gate:', await p.locator('input[name="password"]').isVisible());

console.log('mobile hscroll:', await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1));
await c.close();

const c2=await b.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:2});
const p2=await c2.newPage();
await p2.goto(B,{waitUntil:'networkidle'});
await p2.waitForTimeout(1400);
await p2.screenshot({path:'qa/screenshots/app-desktop.png'});
console.log('desktop hscroll:', await p2.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1));
await c2.close();
console.log('errors:', errs.length?errs.slice(0,4).join(' | '):'none');
await b.close();
