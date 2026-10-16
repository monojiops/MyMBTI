// 운세 탭 카톡 공유 이미지 만들기 (800x400)
//  - fortune/saju/share/<일간id>.png, fortune/saju/og.png
//  - fortune/tarot/share/<카드id>.png, fortune/tarot/og.png
//  - fortune/suneung/share/<부적id>.png, fortune/suneung/og.png
// 실행: 저장소 폴더에서 python3 -m http.server 8765 를 켜고
//       NODE_PATH=$(npm root -g) node tools/make-fortune-images.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = 'http://localhost:8765';

function cp(em) { return Array.from(em).map(c => c.codePointAt(0)).filter(c => c !== 0xfe0f).map(c => c.toString(16)).join('_'); }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
const img = (em, cls) => `<img class="${cls}" src="${BASE}/fun/assets/emoji/${cp(em)}.svg">`;
const HEAD = `<meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&family=Jua&display=swap">`;
const BASE_CSS = `html,body{margin:0} body{width:800px;height:400px;overflow:hidden;position:relative;font-family:'Jua',sans-serif;color:#191919}
  .t{position:absolute;left:0;right:0;top:262px;text-align:center;font-size:44px;line-height:1.2}
  .s{position:absolute;left:0;right:0;top:322px;text-align:center;font-family:'Gowun Dodum',sans-serif;font-size:22px;color:#666}
  .tag{position:absolute;right:22px;bottom:16px;font-family:'Gowun Dodum',sans-serif;font-size:16px}
  .d{position:absolute;width:84px;height:84px}
  .d0{left:64px;top:60px;transform:rotate(-12deg)} .d1{left:44px;top:250px;transform:rotate(8deg)}
  .d2{right:64px;top:56px;transform:rotate(10deg)} .d3{right:44px;top:246px;transform:rotate(-8deg)}`;

function iconPage(bg, accent, main, side, title, sub) {
  return `<!doctype html><html><head>${HEAD}<style>${BASE_CSS}
    body{background:${bg}} .main{position:absolute;left:50%;top:44px;width:200px;height:200px;margin-left:-100px} .tag{color:${accent}}
  </style></head><body>${img(main, 'main')}${side.map((e, k) => img(e, 'd d' + k)).join('')}
  <div class="t">${esc(title)}</div><div class="s">${esc(sub)}</div><div class="tag">monojilab.com</div></body></html>`;
}
// 타로: 왼쪽에 카드 그림, 오른쪽에 이름 (가운데 400px 안에 카드가 오도록)
function cardPage(c) {
  return `<!doctype html><html><head>${HEAD}<style>${BASE_CSS}
    body{background:#f1edff} .tag{color:#5f3dc4}
    .card{position:absolute;left:50%;top:28px;margin-left:-86px;width:172px;height:276px;border-radius:16px;background:#fff;border:2px solid #e2dcf5;box-shadow:inset 0 0 0 8px #fff,inset 0 0 0 9.5px #d9d0f5;display:flex;flex-direction:column;align-items:center;justify-content:center}
    .card .no{position:absolute;top:16px;font-family:'Gowun Dodum';font-size:15px;color:#9a8fc4;letter-spacing:1px}
    .card img{width:104px;height:104px}
    .t{top:318px;font-size:34px} .s{display:none}
    .en{position:absolute;left:0;right:0;top:362px;text-align:center;font-family:'Gowun Dodum';font-size:16px;color:#888}
  </style></head><body>
  <div class="card"><span class="no">${c.no}</span>${img(c.em, '')}</div>
  ${['⭐', '🌙', '✨', '🔮'].map((e, k) => img(e, 'd d' + k)).join('')}
  <div class="t">${esc(c.name)}</div><div class="en">${esc(c.en)}</div><div class="tag">monojilab.com</div></body></html>`;
}

// 수능 부적: 가운데 노란 부적, 아래에 이름
function charmPage(c) {
  return `<!doctype html><html><head>${HEAD}<style>${BASE_CSS}
    body{background:#fff6d6} .tag{color:#c92a2a}
    .ch{position:absolute;left:50%;top:26px;margin-left:-84px;width:168px;height:276px;border-radius:8px;background:#f7d64a;box-shadow:inset 0 0 0 8px #f7d64a,inset 0 0 0 10.5px #c92a2a;display:flex;align-items:center;justify-content:center;color:#c92a2a}
    .ch .ct{position:absolute;top:22px;font-size:17px;letter-spacing:3px}
    .ch img{width:100px;height:100px}
    .ch .seal{position:absolute;bottom:22px;border:2.5px solid #c92a2a;border-radius:5px;padding:0 8px;font-size:18px;transform:rotate(-6deg)}
    .t{top:318px;font-size:34px} .s{display:none}
    .dd{position:absolute;left:0;right:0;top:362px;text-align:center;font-family:'Gowun Dodum';font-size:16px;color:#888}
  </style></head><body>
  <div class="ch"><span class="ct">수능 부적</span>${img(c.em, '')}<span class="seal">합격</span></div>
  ${['🍀', '⭐', '✏️', '🎯'].map((e, k) => img(e, 'd d' + k)).join('')}
  <div class="t">${esc(c.name)}</div><div class="dd">수험생 모두 응원해요</div><div class="tag">monojilab.com</div></body></html>`;
}

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 800, height: 400 } });
  const shot = async (html, out) => {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await p.setContent(html, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: out });
  };
  const load = (dir) => { const w = {}; for (const f of ['config', 'data']) new Function('window', fs.readFileSync(path.join(dir, 'js', f + '.js'), 'utf8'))(w); return w; };

  const sj = load('fortune/saju');
  await shot(iconPage('#fff1e8', '#c2410c', '☯️', ['🌳', '🔥', '💎', '💧'], '오늘의 사주', '생년월일로 보는 내 사주와 오늘의 운세'), 'fortune/saju/og.png');
  for (let i = 0; i < 10; i++) {
    const d = sj.DAY_MASTERS[i], s = sj.STEMS[i];
    await shot(iconPage('#fff1e8', '#c2410c', d.em, [], `${s.ko}${sj.ELEMENTS[s.el].ko} · ${d.name}`, d.keys.map(k => '#' + k).join(' ')), `fortune/saju/share/${d.id}.png`);
  }
  console.log('saju', 10);

  const tr = load('fortune/tarot');
  await shot(iconPage('#f1edff', '#5f3dc4', '🔮', ['⭐', '🌙', '☀️', '🃏'], '타로 한 장', '마음이 가는 카드가 알려주는 오늘'), 'fortune/tarot/og.png');
  for (const c of tr.CARDS) await shot(cardPage(c), `fortune/tarot/share/${c.id}.png`);
  console.log('tarot', tr.CARDS.length);

  const sn = load('fortune/suneung');
  await shot(iconPage('#fff6d6', '#c92a2a', '📜', ['🍀', '⭐', '✏️', '🎯'], '수능 응원 부적', '수험생에게 응원 부적을 보내주세요'), 'fortune/suneung/og.png');
  for (const c of sn.CHARMS) await shot(charmPage(c), `fortune/suneung/share/${c.id}.png`);
  console.log('suneung', sn.CHARMS.length);
  await b.close();
})();
