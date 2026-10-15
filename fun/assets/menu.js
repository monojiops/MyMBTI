// ==============================================
//  메추 시리즈 공통 엔진 (점메추, 저메추, 디메추, 술메추, 야메추, 오늘의 스트레칭)
//  THEME.noMap이면 지도 버튼을 숨기고, 항목에 steps가 있으면 따라 하기 순서를 보여줘요
//  각 페이지는 js/config.js(THEME)와 js/data.js(QUESTIONS, MENUS)만 다르게 둡니다.
//
//  질문 type
//   - kind   : 메뉴의 kind와 같으면 크게 가산 (opt.soft가 true면 다른 종류도 덜 감점)
//   - level  : 메뉴의 q.field 값(0~2)과 가까울수록 가산(q.w배). key가 -1이면 무시
//   - budget : 메뉴 price가 예산을 넘으면 감점
//   - tag    : opt.boost 태그(기본: [key])가 있으면 가산, opt.avoid 태그가 있으면 감점
//  opt.why  : 그 선택이 메뉴와 맞았을 때 결과 화면에 보여줄 이유
// ==============================================
(() => {
  const cfg = window.SITE_CONFIG;
  const T = cfg.THEME;
  const Q = window.QUESTIONS;
  const MENUS = window.MENUS;
  const app = document.getElementById('app');

  // 시리즈 목록 (다른 메추로 가는 링크)
  const FAMILY = [
    { path: 'lunch', em: '🍱', title: '점메추', sub: '오늘의 점심메뉴는?' },
    { path: 'dinner', em: '🍖', title: '저메추', sub: '오늘의 저녁메뉴는?' },
    { path: 'dessert', em: '🍰', title: '디메추', sub: '오늘 먹고 싶은 디저트는?' },
    { path: 'drink', em: '🍻', title: '술메추', sub: '오늘 한잔, 뭐 마실까?' },
    { path: 'night', em: '🌙', title: '야메추', sub: '오늘 밤 야식은?' },
    { path: 'stretch', em: '🧘', title: '스트레칭', sub: '오늘 몸 풀기는?' },
  ];

  const state = {
    name: '',
    answers: {},
    idx: 0,
    ranked: [],
    pos: 0,
    shared: readShared(),
  };

  // 테마 색
  document.documentElement.style.setProperty('--primary', T.colors.b);
  document.documentElement.style.setProperty('--tint', T.colors.soft);

  // ---------- 유틸 ----------
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('show'), 1800);
  }
  function render(html) {
    const top = `<div class="topbar"><a href="../">← monojilab fun</a><span>${T.short}</span></div>`;
    app.innerHTML = `<div class="fade-in">${top}${html}</div>`;
    window.scrollTo({ top: 0 });
  }
  // 이모지를 그림(Noto Emoji SVG, ../assets/emoji/)으로 보여줘요. 파일이 없으면 글자 이모지로 대체
  function ic(em, cls) {
    const cp = Array.from(em).map(c => c.codePointAt(0)).filter(c => c !== 0xfe0f).map(c => c.toString(16)).join('_');
    return `<img class="ic ${cls || ''}" src="../assets/emoji/${cp}.svg" alt="${esc(em)}" draggable="false" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:this.className,textContent:this.alt}))">`;
  }
  function byId(id) { return MENUS.find(m => m.id === id); }
  function mapUrl(m) { return `https://map.kakao.com/link/search/${encodeURIComponent(m.q || m.name.split(/[·+]/)[0])}`; }
  function placeLabel(m) { return `근처 ${esc([m.q || m.name, T.placeWord].filter(Boolean).join(' '))} 찾기`; }
  // 따라 하기 순서가 있는 항목(스트레칭 등)은 결과에 순서를 보여줘요
  function stepsHtml(m) {
    if (!m.steps) return '';
    return `<div class="steps"><p class="steps-h">이렇게 해보세요</p><ol>${m.steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol></div>`;
  }
  function optOf(q) { return q.opts.find(o => o.key === state.answers[q.id]); }

  // ---------- 추천 ----------
  function score(m) {
    let s = 0;
    Q.forEach(q => {
      const o = optOf(q);
      if (!o) return;
      if (q.type === 'kind') {
        if (o.key === 'any') return;
        s += m.kind === o.key ? 8 : (o.soft ? -2 : -4);
      } else if (q.type === 'level') {
        if (o.key >= 0) s += (q.w || 1) * (4 - 3 * Math.abs((m[q.field] || 0) - o.key));
      } else if (q.type === 'budget') {
        if (m.price > o.key) s -= 6 * (m.price - o.key);
        if (o.key === 3 && m.price === 3) s += 3;
      } else {
        (o.boost || [o.key]).forEach(t => { if (m.tags.includes(t)) s += o.w || 3; });
        (o.avoid || []).forEach(t => { if (m.tags.includes(t)) s -= 4; });
      }
    });
    return s;
  }
  function rank() {
    // 같은 답이어도 매번 조금씩 다르게 나오도록 약간의 랜덤을 섞어요
    return MENUS
      .map(m => ({ m, s: score(m) + Math.random() * 2.5 }))
      .sort((x, y) => y.s - x.s)
      .map(x => x.m);
  }
  function reasons(m) {
    const out = [];
    Q.forEach(q => {
      const o = optOf(q);
      if (!o || !o.why) return;
      let hit = false;
      if (q.type === 'kind') hit = m.kind === o.key;
      else if (q.type === 'level') hit = o.key >= 0 && (m[q.field] || 0) === o.key;
      else if (q.type === 'budget') hit = m.price <= o.key;
      else hit = (o.boost || [o.key]).some(t => m.tags.includes(t));
      if (hit) out.push(o.why);
    });
    return out.slice(0, 3);
  }

  // ---------- 공유 ----------
  function readShared() {
    const q = new URLSearchParams(location.search);
    const m = byId(q.get('m') || '');
    return m ? { menu: m, name: (q.get('fn') || '').slice(0, 10) } : null;
  }
  function baseUrl() {
    if (cfg.SITE_URL) return cfg.SITE_URL.replace(/\/$/, '') + '/';
    return location.href.split(/[?#]/)[0];
  }
  function shareUrl(m) {
    const q = new URLSearchParams({ m: m.id });
    if (state.name) q.set('fn', state.name);
    return `${baseUrl()}?${q}`;
  }
  function initKakao() {
    if (cfg.KAKAO_JS_KEY && window.Kakao && !window.Kakao.isInitialized()) {
      try { window.Kakao.init(cfg.KAKAO_JS_KEY); } catch (e) { console.warn('Kakao init 실패', e); }
    }
  }
  function shareKakao(m) {
    const url = shareUrl(m);
    initKakao();
    if (!window.Kakao || !window.Kakao.isInitialized()) { copyLink(url, '카카오톡을 열 수 없어 링크를 복사했어요!'); return; }
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${T.sharePrefix} ${m.em} ${m.name} 어때요?`,
        description: `${state.name ? state.name + '님이' : '친구가'} ${T.short} 받은 ${T.itemWord || '메뉴'}예요. ${m.desc}`,
        imageUrl: `${cfg.SITE_URL}/share/${m.id}.png`,
        imageWidth: 800,
        imageHeight: 400,
        link: { mobileWebUrl: url, webUrl: url },
      },
      buttons: [{ title: `나도 ${T.short} 받기`, link: { mobileWebUrl: url, webUrl: url } }],
    });
  }
  async function copyLink(url, msg) {
    try {
      await navigator.clipboard.writeText(url);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e2) { /* ignore */ }
      ta.remove();
    }
    toast(msg || '링크를 복사했어요!');
  }

  // ---------- 화면: 시작 ----------
  function viewHome() {
    const sh = state.shared;
    const invite = sh ? `
      <section class="result">
        <p class="label">${sh.name ? esc(sh.name) + '님의' : '친구의'} ${T.inviteWord}</p>
        <div class="plate">${ic(sh.menu.em)}</div>
        <div class="menu-name">${esc(sh.menu.name)} 어때요?</div>
        <p class="menu-desc">${esc(sh.menu.desc)}</p>
        ${stepsHtml(sh.menu)}
        ${T.noMap ? '' : `<a class="btn dark" style="margin-top:20px" href="${mapUrl(sh.menu)}" target="_blank" rel="noopener">${placeLabel(sh.menu)}</a>`}
      </section>` : '';

    render(`
      ${invite}
      <div class="hero">
        ${heroPics().map((e, k) => ic(e, 'h' + k)).join('')}
      </div>
      <section style="padding-top:20px">
        <p class="label">${T.short}</p>
        <h1>${T.title}</h1>
        <p class="muted">${T.tagline} 질문 ${Q.length}개에 답하면 ${MENUS.length}가지 중에서 골라드려요.</p>
        <input class="input" id="name" maxlength="10" placeholder="닉네임 (선택)" value="${esc(state.name)}">
        <button class="btn" data-act="start">${sh ? '나도 추천받기' : '시작하기'}</button>
        <button class="btn ghost" data-act="random">그냥 아무거나 골라줘</button>
        ${T.notice ? `<p class="muted notice center">${T.notice}</p>` : ''}
      </section>
      ${moreHtml()}
    `);
    const readName = () => { state.name = document.getElementById('name').value.trim().slice(0, 10); };
    app.querySelector('[data-act="start"]').onclick = () => { readName(); preload(); state.answers = {}; state.idx = 0; viewQuiz(); };
    app.querySelector('[data-act="random"]').onclick = () => {
      readName(); preload();
      state.answers = {};
      state.ranked = MENUS.slice().sort(() => Math.random() - 0.5);
      state.pos = 0;
      viewRoulette();
    };
  }

  // ---------- 화면: 질문 ----------
  function viewQuiz() {
    const i = state.idx;
    const q = Q[i];
    const cur = state.answers[q.id];
    render(`
      <div class="progress"><div style="width:${((i + 1) / Q.length) * 100}%"></div></div>
      <section style="border:0">
        <p class="q-meta">${i + 1} / ${Q.length}</p>
        <div class="q-pic">${ic(q.em)}</div>
        <p class="q-text">${esc(q.text)}</p>
        <div class="choices">
          ${q.opts.map((o, k) => `<button class="choice${cur === o.key ? ' on' : ''}" data-k="${k}">${ic(o.em, 'em')}${esc(o.label)}</button>`).join('')}
        </div>
        <button class="btn ghost" data-act="back" style="margin-top:16px">${i === 0 ? '처음으로' : '이전 질문'}</button>
      </section>
    `);
    app.querySelectorAll('.choice').forEach(b => {
      b.onclick = () => {
        state.answers[q.id] = q.opts[Number(b.dataset.k)].key;
        b.classList.add('on');
        setTimeout(() => {
          if (i < Q.length - 1) { state.idx++; viewQuiz(); }
          else { state.ranked = rank(); state.pos = 0; viewRoulette(); }
        }, 140);
      };
    });
    app.querySelector('[data-act="back"]').onclick = () => {
      if (i === 0) viewHome(); else { state.idx--; viewQuiz(); }
    };
  }

  // ---------- 화면: 고르는 중 ----------
  function viewRoulette() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { viewResult(); return; }
    render(`
      <section class="roulette">
        <div class="slot" id="slot"></div>
        <div class="slot-name" id="slot-name"></div>
        <p class="muted" style="margin-top:8px">${T.picking}</p>
      </section>
    `);
    const slot = document.getElementById('slot');
    const nm = document.getElementById('slot-name');
    let n = 0, delay = 60;
    const tick = () => {
      const m = MENUS[Math.floor(Math.random() * MENUS.length)];
      slot.innerHTML = ic(m.em); nm.textContent = m.name;
      n++; delay *= 1.12;
      if (n < 14) setTimeout(tick, delay); else viewResult();
    };
    tick();
  }

  // ---------- 화면: 결과 ----------
  function viewResult() {
    const pool = state.ranked.slice(0, 8);
    const m = pool[state.pos % pool.length];
    const alts = [1, 2].map(d => pool[(state.pos + d) % pool.length]);
    const why = Object.keys(state.answers).length ? reasons(m) : ['고민 없이 운에 맡겼어요.'];

    render(`
      <section class="result">
        <p class="label">${state.name ? esc(state.name) + '님의' : '오늘의'} ${T.resultWord}</p>
        <div class="plate">${ic(m.em)}</div>
        <div class="menu-name">${esc(m.name)}</div>
        <p class="menu-desc">${esc(m.desc)}</p>
        ${why.length ? `<ul class="reasons">${why.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
        ${stepsHtml(m)}
        ${T.noMap ? '' : `<a class="btn dark" href="${mapUrl(m)}" target="_blank" rel="noopener" style="margin-top:16px">${placeLabel(m)}</a>`}
        <button class="btn secondary" data-act="next">${T.nextWord || '다른 메뉴 보기'}</button>
      </section>

      <section>
        <h3>이것도 괜찮아요</h3>
        <div class="alts">${alts.map((x, k) => `<button class="alt" data-alt="${k + 1}">${ic(x.em, 'em')}${esc(x.name)}</button>`).join('')}</div>
      </section>

      <section>
        <h3>${T.callWord}</h3>
        <p class="muted" style="margin:-8px 0 12px">"${T.sharePrefix} ${esc(m.name)} 어때요?" 하고 보내져요.</p>
        <button class="btn kakao" data-act="kakao">카카오톡으로 보내기</button>
        <button class="btn secondary" data-act="copy">링크 복사</button>
        <button class="btn ghost" data-act="retry">처음부터 다시</button>
      </section>
      ${moreHtml()}
    `);
    const on = (act, fn) => { const el = app.querySelector(`[data-act="${act}"]`); if (el) el.onclick = fn; };
    on('next', () => { state.pos++; viewResult(); });
    on('kakao', () => shareKakao(m));
    on('copy', () => copyLink(shareUrl(m)));
    on('retry', () => { state.shared = null; viewHome(); });
    app.querySelectorAll('[data-alt]').forEach(b => {
      b.onclick = () => { state.pos += Number(b.dataset.alt); viewResult(); };
    });
  }

  // 시작 화면 그림: 대표 그림 1개 + 메뉴 그림 4개
  // 고르는 중 화면에서 그림이 비지 않게 메뉴 그림을 미리 받아둬요
  function preload() {
    if (preload.done) return; preload.done = true;
    const box = document.createElement('div');
    box.innerHTML = MENUS.map(m => ic(m.em)).join('');
    box.querySelectorAll('img').forEach(i => { new Image().src = i.src; });
  }

  function heroPics() {
    const pics = (T.heroEmojis || []).filter(e => e !== T.icon).slice(0, 4);
    MENUS.forEach(m => { if (pics.length < 4 && !pics.includes(m.em)) pics.push(m.em); });
    return [T.icon].concat(pics);
  }

  function moreHtml() {
    const here = location.pathname.split('/').filter(Boolean).pop();
    const items = FAMILY.filter(f => f.path !== here).map(f => `
        <a class="more-card" href="../${f.path}/">${ic(f.em, 'em')}<b>${f.title}</b><small>${f.sub}</small></a>`).join('');
    return `
      <section>
        <h3>이것도 해보세요</h3>
        <div class="more-grid">${items}</div>
        <a class="more-wide" href="../office-mbti/">${ic('💼', 'em')}<div><b>MBTI 직장인 유형 테스트</b><small>회사에서 나는 어떤 직장인일까?</small></div></a>
      </section>
      <p class="foot"><a href="../">monojilab fun</a> · <a href="/privacy/">개인정보처리방침</a> · <a href="/contact/">문의</a></p>`;
  }

  // ---------- 광고 ----------
  function renderAds() {
    const side = document.getElementById('ad-side');
    const bottom = document.getElementById('ad-bottom');
    const p = cfg.AD_PROVIDER;
    if (!p || p === 'none') { side.style.display = 'none'; bottom.style.display = 'none'; return; }
    if (p === 'adsense') {
      side.innerHTML = `<ins class="adsbygoogle" style="display:inline-block;width:160px;height:600px" data-ad-client="${cfg.ADSENSE.CLIENT}" data-ad-slot="${cfg.ADSENSE.SIDE_SLOT}"></ins>`;
      bottom.innerHTML = `<ins class="adsbygoogle" style="display:inline-block;width:320px;height:50px" data-ad-client="${cfg.ADSENSE.CLIENT}" data-ad-slot="${cfg.ADSENSE.BOTTOM_SLOT}"></ins>`;
      // 화면 크기에 맞는 쪽만 채움 (숨겨진 슬롯은 광고 오류가 남)
      const visible = window.matchMedia('(min-width: 900px)').matches ? side : bottom;
      visible.querySelectorAll('.adsbygoogle').forEach(() => (window.adsbygoogle = window.adsbygoogle || []).push({}));
    } else if (p === 'preview') {
      side.innerHTML = '<div class="ad-placeholder" style="width:160px;height:600px">광고 영역<br>160 × 600</div>';
      bottom.innerHTML = '<div class="ad-placeholder" style="width:320px;height:50px">광고 영역 320 × 50</div>';
    }
  }

  // ---------- 시작 ----------
  renderAds();
  initKakao();
  viewHome();
})();
