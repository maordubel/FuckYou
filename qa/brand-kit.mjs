import { chromium } from 'playwright';
import fs from 'node:fs';

const LIME='#d8f32b', INK='#121110', PAPER='#efebe3', PINK='#f5216b';
const here = (rel) => new URL(rel, import.meta.url);
const logo = fs.readFileSync(here('../brand/logo/logo-primary.svg'),'utf8');
const logoH = fs.readFileSync(here('../brand/logo/logo-horizontal.svg'),'utf8');
const markSvg = fs.readFileSync(here('../brand/logo/mark.svg'),'utf8');

const grain = `background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.09'/%3E%3C/svg%3E")`;

// the kit must build from a clean checkout, so the faces are inlined here
const FACES = {
  Anton: 'anton-latin-400-normal.woff2',
  Marker: 'permanent-marker-latin-400-normal.woff2',
  ArchivoB: 'archivo-latin-700-normal.woff2',
  Courier: 'courier-prime-latin-400-normal.woff2',
};
const fontCss = Object.entries(FACES)
  .map(([name, file]) => {
    const data = fs.readFileSync(new URL(`../src/fonts/${file}`, import.meta.url)).toString('base64');
    return `@font-face{font-family:${name};src:url(data:font/woff2;base64,${data}) format('woff2')}`;
  })
  .join('\n');

function page(w,h,inner,extra=''){
 return `<!doctype html><meta charset=utf-8><style>${fontCss}
 *{box-sizing:border-box;margin:0}
 body{width:${w}px;height:${h}px;background:${PAPER};${grain};overflow:hidden;font-family:ArchivoB,sans-serif;color:${INK}}
 ${extra}</style>${inner}`;
}

const shots = [
  { file:'avatar-1080.png', w:1080, h:1080, html: page(1080,1080,
    `<div style="width:100%;height:100%;background:${LIME};display:flex;align-items:center;justify-content:center">
       <div style="width:620px">${markSvg.replace('width="128" height="128"','width="620" height="620"')}</div>
     </div>`) },

  { file:'avatar-square-wordmark-1080.png', w:1080, h:1080, html: page(1080,1080,
    `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:110px">
       <div style="width:100%">${logo.replace(/width="\d+" height="\d+"/,'width="100%"')}</div>
     </div>`) },

  { file:'instagram-post-1080.png', w:1080, h:1080, html: page(1080,1080,
    `<div style="width:100%;height:100%;padding:90px;display:flex;flex-direction:column;justify-content:space-between">
       <div style="width:330px">${logo.replace(/width="\d+" height="\d+"/,'width="100%"')}</div>
       <div>
         <div style="font-family:Courier;font-size:26px;letter-spacing:4px;text-transform:uppercase;color:#514d47">Ruined my day</div>
         <div style="font-family:ArchivoB;font-size:88px;line-height:1;letter-spacing:-3px;margin-top:16px">The guy on the<br>7:40 train</div>
         <div style="display:flex;align-items:flex-end;gap:26px;margin-top:34px">
           <div style="font-family:Anton;font-size:170px;line-height:.8">214</div>
           <div style="font-family:Marker;font-size:38px;color:${PINK};margin-bottom:18px">people said it too</div>
         </div>
       </div>
       <div style="display:flex;justify-content:space-between;align-items:center">
         <div style="height:10px;width:280px;background:${INK}"></div>
         <div style="font-family:Courier;font-size:24px;letter-spacing:5px;text-transform:uppercase">fuckyou.dubelteam.com</div>
       </div>
     </div>`) },

  { file:'instagram-story-1080x1920.png', w:1080, h:1920, html: page(1080,1920,
    `<div style="width:100%;height:100%;padding:110px 90px;display:flex;flex-direction:column;justify-content:space-between">
       <div style="display:flex;justify-content:space-between;align-items:flex-start">
         <div style="width:340px">${logo.replace(/width="\d+" height="\d+"/,'width="100%"')}</div>
         <div style="font-family:Marker;font-size:34px;line-height:1.15;text-align:right;transform:rotate(-4deg)">Say it.<br>Don't send it.</div>
       </div>
       <div>
         <div style="font-family:Courier;font-size:30px;letter-spacing:5px;text-transform:uppercase;color:#514d47">Who pissed you off?</div>
         <div style="font-family:Anton;font-size:132px;line-height:.92;text-transform:uppercase;margin-top:24px">Put their<br>name up.</div>
         <div style="font-family:Marker;font-size:44px;color:${PINK};margin-top:34px">— anonymously</div>
       </div>
       <div style="display:flex;justify-content:space-between;align-items:center">
         <div style="height:12px;width:340px;background:${INK}"></div>
         <div style="font-family:Courier;font-size:28px;letter-spacing:6px;text-transform:uppercase">fuckyou.dubelteam.com</div>
       </div>
     </div>`) },

  { file:'x-banner-1500x500.png', w:1500, h:500, html: page(1500,500,
    `<div style="width:100%;height:100%;padding:60px 70px;display:flex;align-items:center;justify-content:space-between;gap:50px">
       <div style="width:560px">${logoH.replace(/width="\d+" height="\d+"/,'width="100%"')}</div>
       <div style="text-align:right">
         <div style="font-family:Marker;font-size:40px;line-height:1.15">Say it. Don't send it.</div>
         <div style="font-family:Courier;font-size:22px;letter-spacing:5px;text-transform:uppercase;margin-top:16px;color:#514d47">fuckyou.dubelteam.com</div>
       </div>
     </div>`) },

  { file:'tiktok-avatar-720.png', w:720, h:720, html: page(720,720,
    `<div style="width:100%;height:100%;background:${INK};display:flex;align-items:center;justify-content:center">
       <div style="background:${LIME};padding:26px 40px 44px">
         <div style="font-family:Anton;font-size:150px;line-height:.84;text-transform:uppercase">Fuck<br>You.</div>
       </div>
     </div>`) },

  { file:'apple-icon-180.png', w:180, h:180, html: page(180,180,
    `<div style="width:100%;height:100%;background:${LIME};display:flex;align-items:center;justify-content:center">
       <div style="width:132px">${markSvg.replace('width="128" height="128"','width="132" height="132"')}</div>
     </div>`) },
];

const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
for (const s of shots) {
  const c = await b.newContext({viewport:{width:s.w,height:s.h}, deviceScaleFactor:1});
  const p = await c.newPage();
  await p.setContent(s.html, {waitUntil:'networkidle'});
  await p.waitForTimeout(350);
  await p.screenshot({path: new URL(`../brand/social/${s.file}`, import.meta.url).pathname});
  await c.close();
  console.log('made', s.file);
}
await b.close();
