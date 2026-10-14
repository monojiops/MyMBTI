(() => {
  const cfg = window.SITE_CONFIG;
  const Q = window.QUESTIONS;
  const MENUS = window.MENUS;
  const app = document.getElementById('app');

  const state = {
    name: '',
    answers: {},
    idx: 0,
    ranked: [],   // 점수 순 메뉴
    pos: 0,       // 지금 보여주는 순위 (다른 메뉴 누를 때마다 +1)
    shared: readShared(),
  };

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
    app.innerHTML = `<div class="fade-in">${html}</div>`;
    window.scrollTo({ top: 0 });
  }
  function byId(id) { return MENUS.find(m => m.id === id); }
  function mapUrl(m) { return `https://map.kakao.com/link/search/${encodeURIComponent(m.name.split(/[·+]/)[0])}`; }

  // ---------- 추천 ----------
  function score(m, a) {
    let s = 0;
    // 당기는 종류
    s += m.kind === a.kind ? 8 : (a.kind === 'quick' ? -2 : -4);
    // 맵기 (상관없음이면 무시)
    if (a.spicy >= 0) s += 4 - 3 * Math.abs(m.spicy - a.spicy);
    // 예산
    if (m.price > a.budget) s -= 6 * (m.price - a.budget);
    if (a.budget === 3 && m.price === 3) s += 3;
    // 날씨
    if (a.weather === 'cold') s += m.tags.includes('warm') ? 4 : (m.tags.includes('cool') ? -5 : 0);
    if (a.weather === 'hot') s += m.tags.includes('cool') ? 6 : (m.kind === 'soup' ? -3 : 0);
    if (a.weather === 'rain') s += m.tags.includes('rain') ? 5 : (m.tags.includes('cool') ? -3 : 0);
    // 기분, 누구랑
    if (m.tags.includes(a.mood)) s += 3;
    if (m.tags.includes(a.with)) s += 3;
    if (a.with === 'boss' && m.spicy === 2) s -= 2;
    return s;
  }
  function rank() {
    const a = state.answers;
    // 같은 답이어도 매번 조금씩 다르게 나오도록 약간의 랜덤을 섞어요
    return MENUS
      .map(m => ({ m, s: score(m, a) + Math.random() * 2.5 }))
      .sort((x, y) => y.s - x.s)
      .map(x => x.m);
  }
  function reasons(m, a) {
    const out = [];
    if (a.weather === 'cold' && m.tags.includes('warm')) out.push('🥶 추운 날엔 뜨끈한 게 최고예요.');
    if (a.weather === 'hot' && m.tags.includes('cool')) out.push('🧊 더위를 싹 식혀줄 메뉴예요.');
    if (a.weather === 'rain' && m.tags.includes('rain')) out.push('☔ 비 오는 날 딱 생각나는 메뉴예요.');
    if (a.mood === 'stress' && m.tags.includes('stress')) out.push('😤 스트레스 풀기 딱 좋은 맛이에요.');
    if (a.mood === 'tired' && m.tags.includes('tired')) out.push('😩 지친 몸을 든든하게 달래줘요.');
    if (a.mood === 'good' && m.tags.includes('good')) out.push('😊 좋은 기분을 더 좋게 만들어줘요.');
    const kindText = { soup: '🍲 당기던 국물 메뉴예요.', rice: '🍚 든든한 밥 메뉴예요.', noodle: '🍜 후루룩 면 메뉴예요.', quick: '🥪 가볍고 빠르게 먹을 수 있어요.' };
    if (m.kind === a.kind) out.push(kindText[m.kind]);
    const withText = { solo: '🙋 혼밥하기 편한 메뉴예요.', two: '👫 둘이 먹기 딱 좋아요.', group: '👥 여럿이 나눠 먹기 좋아요.', boss: '👔 상사랑 가도 무난한 메뉴예요.' };
    if (m.tags.includes(a.with)) out.push(withText[a.with]);
    if (m.price <= a.budget) out.push(m.price === 1 ? '🪙 지갑도 가볍게 지켜줘요.' : '💵 예산 안에서 해결돼요.');
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
        title: `오늘 점심 ${m.em} ${m.name} 어때요?`,
        description: `${state.name ? state.name + '님이' : '동료가'} 점메추 받은 메뉴예요. ${m.desc}`,
        imageUrl: cfg.SHARE_IMAGE,
        link: { mobileWebUrl: url, webUrl: url },
      },
      buttons: [{ title: '나도 점메추 받기', link: { mobileWebUrl: url, webUrl: url } }],
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
      <section class="card center">
        <p class="muted">${sh.name ? esc(sh.name) + '님이' : '동료가'} 오늘 점심으로</p>
        <div class="menu-badge">${sh.menu.em}</div>
        <div class="menu-name">${esc(sh.menu.name)}</div>
        <p class="menu-desc">어때요? 래요! ${esc(sh.menu.desc)}</p>
        <a class="btn map" href="${mapUrl(sh.menu)}" target="_blank" rel="noopener" style="text-decoration:none">📍 근처 ${esc(sh.menu.name)} 맛집 찾기</a>
      </section>` : '';

    render(`
      ${invite}
      <section class="card center">
        <div class="hero-emojis">🍜🍱🍔🍣🥘</div>
        <h1>오늘의 점심메뉴는?</h1>
        <p class="muted">점심 고민은 이제 그만!<br>질문 ${Q.length}개에 답하면 오늘 메뉴를 골라드려요.</p>
        <input class="input" id="name" maxlength="10" placeholder="닉네임 (선택, 공유할 때 표시돼요)" value="${esc(state.name)}">
        <button class="btn" data-act="start">${sh ? '나도 점메추 받기' : '점메추 받기'}</button>
        <button class="btn ghost" data-act="random">🎲 고민 없이 아무거나 골라줘</button>
      </section>
      ${moreHtml()}
    `);
    const readName = () => { state.name = document.getElementById('name').value.trim().slice(0, 10); };
    app.querySelector('[data-act="start"]').onclick = () => { readName(); state.answers = {}; state.idx = 0; viewQuiz(); };
    app.querySelector('[data-act="random"]').onclick = () => {
      readName();
      state.answers = {};
      state.ranked = MENUS.slice().sort(() => Math.random() - 0.5);
      state.pos = 0;
      viewResult();
    };
  }

  // ---------- 화면: 질문 ----------
  function viewQuiz() {
    const i = state.idx;
    const q = Q[i];
    const cur = state.answers[q.id];
    render(`
      <section class="card">
        <div class="progress"><div style="width:${(i / Q.length) * 100}%"></div></div>
        <div class="q-meta"><span>Q${i + 1}</span><span>${i + 1} / ${Q.length}</span></div>
        <p class="q-text">${esc(q.text)}</p>
        <div class="choices">
          ${q.opts.map((o, k) => `<button class="choice${cur === o.key ? ' on' : ''}" data-k="${k}"><span class="em">${o.em}</span>${esc(o.label)}</button>`).join('')}
        </div>
        <div class="row" style="margin-top:18px">
          <button class="btn ghost" data-act="back">${i === 0 ? '처음으로' : '← 이전 질문'}</button>
        </div>
      </section>
    `);
    app.querySelectorAll('.choice').forEach(b => {
      b.onclick = () => {
        state.answers[q.id] = q.opts[Number(b.dataset.k)].key;
        b.classList.add('on');
        setTimeout(() => {
          if (i < Q.length - 1) { state.idx++; viewQuiz(); }
          else { state.ranked = rank(); state.pos = 0; viewResult(); }
        }, 160);
      };
    });
    app.querySelector('[data-act="back"]').onclick = () => {
      if (i === 0) viewHome(); else { state.idx--; viewQuiz(); }
    };
  }

  // ---------- 화면: 결과 ----------
  function viewResult() {
    const pool = state.ranked.slice(0, 8);
    const m = pool[state.pos % pool.length];
    const alts = [1, 2].map(d => pool[(state.pos + d) % pool.length]);
    const why = Object.keys(state.answers).length ? reasons(m, state.answers) : ['🎲 고민 없이 운명에 맡겼어요!'];

    render(`
      <section class="card center">
        <p class="muted">${state.name ? esc(state.name) + '님의' : '오늘의'} 점심 메뉴는</p>
        <div class="menu-badge">${m.em}</div>
        <div class="menu-name">${esc(m.name)}</div>
        <p class="menu-desc">${esc(m.desc)}</p>
        <ul class="reasons">${why.map(r => `<li>${r}</li>`).join('')}</ul>
        <a class="btn map" href="${mapUrl(m)}" target="_blank" rel="noopener" style="text-decoration:none;margin-top:16px">📍 근처 ${esc(m.name)} 맛집 찾기</a>
        <button class="btn secondary" data-act="next">🔄 이건 별로, 다른 메뉴</button>
      </section>

      <section class="card center">
        <h3>이것도 괜찮아요</h3>
        <div class="alts">${alts.map((x, k) => `<button class="alt" data-alt="${k + 1}">${x.em} ${esc(x.name)}</button>`).join('')}</div>
      </section>

      <section class="card center">
        <h3>같이 먹을 동료에게 보내기</h3>
        <p class="muted">"오늘 점심 ${esc(m.name)} 어때요?" 하고 보내져요.</p>
        <button class="btn kakao" data-act="kakao">💬 카카오톡으로 보내기</button>
        <button class="btn secondary" data-act="copy">🔗 링크 복사</button>
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

  function moreHtml() {
    return `
      <section class="card">
        <a class="more" href="../office-mbti/">
          <span class="em">💼</span>
          <div><b>MBTI 직장인 유형 테스트</b><br><span class="muted">회사에서 나는 어떤 직장인일까?</span></div>
        </a>
      </section>
      <p class="muted center"><a href="../" style="color:inherit">monojilab fun</a> · 다른 재밌는 콘텐츠 보기</p>`;
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
