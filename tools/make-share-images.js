// 메추 카톡 공유 이미지 만들기 (800x400)
//  - fun/<메추>/share/<메뉴id>.png : 메뉴별 이미지 (결과 공유할 때 씀)
//  - fun/<메추>/og.png              : 페이지 대표 이미지
//  - fun/office-mbti/share/<유형>.png, og.png : 직장인 MBTI 유형별 이미지
// 실행: 저장소 폴더에서 python3 -m http.server 8765 를 켜고
//       NODE_PATH=$(npm root -g) node tools/make-share-images.js
// 카톡이 가운데를 잘라도 보이게 그림과 글자는 가운데 400px 안에 둬요.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = 'http://localhost:8765';
const TYPES = ['lunch', 'dinner', 'dessert', 'drink', 'night'];

function cp(em) { return Array.from(em).map(c => c.codePointAt(0)).filter(c => c !== 0xfe0f).map(c => c.toString(16)).join('_'); }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

function page(T, main, side, title, sub, accent) {
  const img = (em, cls) => `<img class="${cls}" src="${BASE}/fun/assets/emoji/${cp(em)}.svg">`;
  return `<!doctype html><html><head><meta charset="utf-8">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&family=Jua&display=swap">
  <style>
    html,body{margin:0}
    body{width:800px;height:400px;overflow:hidden;background:${T.colors ? T.colors.soft : T.soft};position:relative;font-family:'Jua',sans-serif;color:#191919}
    .main{position:absolute;left:50%;top:44px;width:200px;height:200px;margin-left:-100px}
    .t{position:absolute;left:0;right:0;top:262px;text-align:center;font-size:44px;line-height:1.2}
    .s{position:absolute;left:0;right:0;top:322px;text-align:center;font-family:'Gowun Dodum',sans-serif;font-size:22px;color:#666}
    .d{position:absolute;width:84px;height:84px}
    .d0{left:64px;top:60px;transform:rotate(-12deg)} .d1{left:44px;top:250px;transform:rotate(8deg)}
    .d2{right:64px;top:56px;transform:rotate(10deg)} .d3{right:44px;top:246px;transform:rotate(-8deg)}
    .tag{position:absolute;right:22px;bottom:16px;font-family:'Gowun Dodum',sans-serif;font-size:16px;color:${accent || T.colors.b}}
  </style></head><body>
  ${img(main, 'main')}${side.slice(0, 4).map((e, k) => img(e, 'd d' + k)).join('')}
  <div class="t">${esc(title)}</div><div class="s">${esc(sub)}</div><div class="tag">monojilab.com</div>
  </body></html>`;
}

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 800, height: 400 } });
  for (const t of TYPES) {
    const ctx = {};
    for (const f of ['config', 'data']) {
      const code = fs.readFileSync(path.join('fun', t, 'js', f + '.js'), 'utf8');
      new Function('window', code)(ctx);
    }
    const T = ctx.SITE_CONFIG.THEME, M = ctx.MENUS;
    const outDir = path.join('fun', t, 'share');
    fs.mkdirSync(outDir, { recursive: true });
    const shot = async (html, out) => {
      await p.setContent(html, { waitUntil: 'networkidle' });
      await p.evaluate(() => document.fonts.ready);
      await p.screenshot({ path: out });
    };
    const heroSide = (T.heroEmojis || []).filter(e => e !== T.icon);
    await shot(page(T, T.icon, heroSide, T.title, `${T.short} · 질문 ${ctx.QUESTIONS.length}개로 골라드려요`), path.join('fun', t, 'og.png'));
    for (const m of M) {
      // 메뉴 이미지는 그 메뉴 그림 하나만 크게 (아이콘처럼)
      await shot(page(T, m.em, [], m.name, `${T.sharePrefix} 이거 어때요?`), path.join(outDir, m.id + '.png'));
    }
    console.log(t, M.length);
  }

  // 직장인 MBTI
  {
    const ctx = {};
    new Function('window', fs.readFileSync('fun/office-mbti/js/data.js', 'utf8'))(ctx);
    const CH = ctx.CHARACTERS;
    const outDir = path.join('fun', 'office-mbti', 'share');
    fs.mkdirSync(outDir, { recursive: true });
    const tint = hex => { const n = parseInt(hex.slice(1), 16); const mix = c => Math.round(c + (255 - c) * 0.88); return `rgb(${mix(n >> 16)},${mix((n >> 8) & 255)},${mix(n & 255)})`; };
    const shot = async (html, out) => {
      await p.setContent(html, { waitUntil: 'networkidle' });
      await p.evaluate(() => document.fonts.ready);
      await p.screenshot({ path: out });
    };
    const ids = Object.keys(CH);
    await shot(page({ soft: '#eef3ff' }, '💼', ['📊', '🍪', '🚀', '🎤'], '나는 어떤 직장인일까?', `직장인 MBTI · ${ids.length}가지 유형`, '#3b5bdb'), 'fun/office-mbti/og.png');
    for (const id of ids) {
      const c = CH[id];
      const label = c.hidden ? '히든 유형' : id;
      await shot(page({ soft: tint(c.color) }, c.emoji, [], c.name, `${label} · 우리 팀 케미는 몇 점?`, c.color), path.join(outDir, id + '.png'));
    }
    console.log('office-mbti', ids.length);
  }
  await b.close();
})();
