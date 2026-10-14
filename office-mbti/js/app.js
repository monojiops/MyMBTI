(() => {
  const cfg = window.SITE_CONFIG;
  const Q = window.QUESTIONS;
  const CH = window.CHARACTERS;
  const app = document.getElementById('app');
  const STORE_KEY = 'mbti_me_v1';

  const state = {
    name: '',
    answers: new Array(Q.length).fill(null),
    idx: 0,
    me: loadMe(),
    friend: readFriendFromUrl(),
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
  function loadMe() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || null; } catch (e) { return null; }
  }
  function saveMe(me) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(me)); } catch (e) { /* 저장 불가 환경 */ }
  }
  function render(html) {
    app.innerHTML = `<div class="fade-in">${html}</div>`;
    window.scrollTo({ top: 0 });
  }

  // ---------- 결과 계산 ----------
  // person = { type: 'INFP', at: 'T', hidden: bool, name, pct: {EI,SN,TF,JP} }
  function charId(p) {
    if (p.hidden) {
      const t = p.type;
      const temp = t[1] === 'N' ? 'N' + t[2] : 'S' + t[3];
      return `H-${temp}-${p.at}`;
    }
    return `${p.type}-${p.at}`;
  }
  function charOf(p) { return CH[charId(p)]; }

  function compute() {
    const s = { EI: 0, SN: 0, TF: 0, JP: 0, AT: 0 };
    const n = { EI: 0, SN: 0, TF: 0, JP: 0, AT: 0 };
    Q.forEach((q, i) => { s[q.axis] += q.dir * (state.answers[i] || 0); n[q.axis] += 2; });
    const letter = (axis, a, b) => (s[axis] >= 0 ? a : b);
    const type = letter('EI', 'E', 'I') + letter('SN', 'S', 'N') + letter('TF', 'T', 'F') + letter('JP', 'J', 'P');
    const ties = ['EI', 'SN', 'TF', 'JP'].filter(k => s[k] === 0).length;
    const pct = {};
    ['EI', 'SN', 'TF', 'JP'].forEach(k => { pct[k] = Math.round(50 + (s[k] / n[k]) * 50); });
    return { type, at: s.AT >= 0 ? 'A' : 'T', hidden: ties >= 2, pct, name: state.name };
  }

  // ---------- 궁합 ----------
  function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }
  function compat(a, b) {
    const A = a.type, B = b.type;
    let score;
    if ((window.BEST_MATCH[A] || []).includes(B) || (window.BEST_MATCH[B] || []).includes(A)) {
      score = 96;
    } else if (A === B) {
      score = 80;
    } else {
      score = 62;
      score += A[1] === B[1] ? 12 : -10;  // S/N: 세상을 보는 방식
      score += A[0] !== B[0] ? 8 : 0;     // E/I: 서로 보완
      score += A[2] === B[2] ? 4 : 0;     // T/F: 대화 방식
      score += A[3] !== B[3] ? 6 : 0;     // J/P: 서로 보완
    }
    if (a.at === 'T' && b.at === 'T') score -= 3;
    if (a.at !== b.at) score += 2;
    if (a.hidden || b.hidden) score += 3;  // 균형형은 누구와도 무난
    const ids = [charId(a), charId(b)].sort().join('|');
    score += (hash(ids) % 5) - 2;
    score = Math.max(35, Math.min(99, score));

    const label = score >= 95 ? '드림팀 💼' : score >= 85 ? '환상의 업무 케미 ✨' : score >= 72 ? '믿고 맡기는 동료 😊'
      : score >= 60 ? '맞춰가면 시너지 🤝' : '회의 때마다 불꽃 ⚡';

    const lines = [];
    if (A[1] === B[1]) lines.push(A[1] === 'N' ? '🔮 둘 다 큰 그림을 좋아해서 브레인스토밍이 끝없이 이어져요.' : '📌 둘 다 현실 감각이 좋아서 실행 계획이 착착 맞아요.');
    else lines.push('🌗 한 명은 아이디어, 한 명은 디테일 담당. 보고서 방향이 엇갈릴 땐 예시를 들어 한 번 더 설명해 주세요.');
    if (A[0] !== B[0]) lines.push('🎤 한 명은 발표, 한 명은 자료 준비. 역할 분담이 자연스러운 조합이에요.');
    else lines.push(A[0] === 'E' ? '🎉 둘 다 에너지가 넘쳐서 팀 분위기는 최고! 대신 집중 시간은 따로 정해두세요.' : '🎧 메신저로 대화하는 게 더 편한, 조용하지만 손발 맞는 사이예요.');
    if (A[2] === B[2]) lines.push(A[2] === 'T' ? '🧠 피드백을 돌려 말하지 않아도 서로 상처받지 않는 사이예요.' : '💗 힘든 날엔 말없이 커피 한 잔 건네주는 사이예요.');
    else lines.push('🤲 한 명은 논리로, 한 명은 공감으로 설득해요. 피드백할 땐 말투를 한 번 더 신경 써 주세요.');
    if (A[3] !== B[3]) lines.push('🗓️ 일정 짜는 사람과 위기 대응하는 사람, 서로의 빈틈을 채워줘요.');
    else lines.push(A[3] === 'J' ? '⏰ 마감 일주일 전에 끝내는 두 사람, 프로젝트가 늘 순조로워요.' : '🔥 마감 직전 폭발력은 최강! 단, 중간 점검 일정은 꼭 잡아두세요.');
    return { score, label, lines };
  }

  // ---------- URL 공유 ----------
  function encodePerson(p) {
    const q = new URLSearchParams();
    q.set('f', `${p.type}-${p.at}${p.hidden ? '-h' : ''}`);
    if (p.name) q.set('fn', p.name);
    return q.toString();
  }
  function readFriendFromUrl() {
    const q = new URLSearchParams(location.search);
    // ?f=INFP-T 형식, 또는 #f-INFP-T 형식(이름 없이)도 지원
    const raw = q.get('f') || (location.hash.match(/^#f-(.+)$/) || [])[1] || '';
    const m = /^([EI][SN][TF][JP])-([AT])(-h)?$/.exec(raw);
    if (!m) return null;
    return { type: m[1], at: m[2], hidden: !!m[3], name: (q.get('fn') || '').slice(0, 10) };
  }
  function baseUrl() {
    if (cfg.SITE_URL && !cfg.SITE_URL.includes('YOUR-DOMAIN')) return cfg.SITE_URL.replace(/\/$/, '') + '/';
    return location.href.split(/[?#]/)[0];
  }
  function shareUrl(p) { return `${baseUrl()}?${encodePerson(p)}`; }

  function initKakao() {
    if (cfg.KAKAO_JS_KEY && window.Kakao && !window.Kakao.isInitialized()) {
      try { window.Kakao.init(cfg.KAKAO_JS_KEY); } catch (e) { console.warn('Kakao init 실패', e); }
    }
  }
  function shareKakao(p) {
    initKakao();
    const c = charOf(p);
    const url = shareUrl(p);
    if (!(window.Kakao && window.Kakao.isInitialized())) {
      copyLink(url, '카카오 키가 아직 없어서 링크를 복사했어요. 카톡에 붙여넣어 주세요!');
      return;
    }
    const who = p.name ? `${p.name}님은` : '나는';
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${who} ${c.emoji} ${c.name} (${p.type})`,
        description: `${c.tag}. 우리 같은 팀이면 케미 몇 점일까?`,
        imageUrl: cfg.SHARE_IMAGE,
        link: { mobileWebUrl: url, webUrl: url },
      },
      buttons: [{ title: '나도 하고 케미 보기', link: { mobileWebUrl: url, webUrl: url } }],
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
  async function shareNative(p) {
    const c = charOf(p);
    const url = shareUrl(p);
    if (navigator.share) {
      try { await navigator.share({ title: cfg.SITE_NAME, text: `회사에서 나는 ${c.emoji} ${c.name}! 우리 케미 볼래?`, url }); return; }
      catch (e) { if (e.name === 'AbortError') return; }
    }
    copyLink(url);
  }

  // ---------- 화면: 시작 ----------
  function viewHome() {
    const f = state.friend;
    const fc = f && charOf(f);
    const invite = f ? `
      <div class="invite">
        <span class="em">${fc.emoji}</span>
        <div><b>${f.name ? esc(f.name) + '님' : '동료'}</b>이 업무 케미를 보자고 초대했어요!<br>
        <span class="muted">${fc.name} · ${f.type}</span></div>
      </div>` : '';
    const quick = f && state.me ? `<button class="btn secondary" data-act="quick">저장된 내 결과로 바로 케미 보기</button>` : '';

    render(`
      ${invite}
      <section class="card center">
        <div class="hero-emojis">📊🎤☕💡👔</div>
        <h1>회사에서 나는<br>어떤 직장인일까?</h1>
        <p class="muted">${Q.length}개 질문으로 MBTI 유형을 알아보고<br>40가지 직장인 유형 중 나는 누구인지 알려드려요.</p>
        <input class="input" id="name" maxlength="10" placeholder="닉네임 (선택, 케미 결과에 표시돼요)" value="${esc(state.name)}">
        <button class="btn" data-act="start">테스트 시작하기</button>
        ${quick}
        <button class="btn ghost" data-act="dex">40가지 직장인 유형 전체 보기</button>
      </section>
      <p class="muted center">약 2분 소요 · 결과는 이 기기에만 저장돼요</p>
    `);
    app.querySelector('[data-act="start"]').onclick = () => {
      state.name = document.getElementById('name').value.trim().slice(0, 10);
      state.answers.fill(null);
      state.idx = 0;
      viewQuiz();
    };
    const qb = app.querySelector('[data-act="quick"]');
    if (qb) qb.onclick = () => viewResult(state.me);
    app.querySelector('[data-act="dex"]').onclick = () => viewDex();
  }

  // ---------- 화면: 질문 ----------
  function viewQuiz() {
    const i = state.idx;
    const q = Q[i];
    const cur = state.answers[i];
    const opts = [
      { v: 2, cls: 'agree s2' }, { v: 1, cls: 'agree s1' }, { v: 0, cls: 'neutral s0' },
      { v: -1, cls: 'disagree s1' }, { v: -2, cls: 'disagree s2' },
    ];
    const labels = { 2: '매우 그렇다', 1: '그렇다', 0: '보통', '-1': '아니다', '-2': '전혀 아니다' };
    render(`
      <section class="card">
        <div class="progress"><div style="width:${(i / Q.length) * 100}%"></div></div>
        <div class="q-meta"><span>Q${i + 1}</span><span>${i + 1} / ${Q.length}</span></div>
        <p class="q-text">${esc(q.text)}</p>
        <div class="scale">
          ${opts.map(o => `<button class="${o.cls}${cur === o.v ? ' on' : ''}" data-v="${o.v}" aria-label="${labels[o.v]}"></button>`).join('')}
        </div>
        <div class="scale-labels"><span>그렇다</span><span>아니다</span></div>
        <div class="row" style="margin-top:22px">
          <button class="btn ghost" data-act="back">${i === 0 ? '처음으로' : '← 이전 질문'}</button>
        </div>
      </section>
    `);
    app.querySelectorAll('.scale button').forEach(b => {
      b.onclick = () => {
        state.answers[i] = Number(b.dataset.v);
        b.classList.add('on');
        setTimeout(() => {
          if (i < Q.length - 1) { state.idx++; viewQuiz(); }
          else finish();
        }, 160);
      };
    });
    app.querySelector('[data-act="back"]').onclick = () => {
      if (i === 0) viewHome(); else { state.idx--; viewQuiz(); }
    };
  }

  function finish() {
    const me = compute();
    state.me = me;
    saveMe(me);
    viewResult(me);
  }

  // ---------- 화면: 결과 ----------
  function barHtml(left, right, pct, color) {
    const leftWin = pct >= 50;
    const shown = leftWin ? pct : 100 - pct;
    return `
      <div class="bar">
        <div class="bar-labels">
          <span class="${leftWin ? '' : 'dim'}">${left}${leftWin ? ' ' + shown + '%' : ''}</span>
          <span class="${leftWin ? 'dim' : ''}">${leftWin ? '' : shown + '% '}${right}</span>
        </div>
        <div class="bar-track" style="justify-content:${leftWin ? 'flex-start' : 'flex-end'}">
          <div class="bar-fill" style="width:${shown}%;background:${color}"></div>
        </div>
      </div>`;
  }

  function viewResult(me) {
    const c = charOf(me);
    const f = state.friend;
    let compatHtml = '';
    if (f) {
      const fc = charOf(f);
      const r = compat(me, f);
      compatHtml = `
        <section class="card center">
          <h2>${f.name ? esc(f.name) + '님과' : '친구와'} 같은 팀이라면</h2>
          <div class="compat-head">
            <div class="who"><span class="em">${c.emoji}</span>${me.name ? esc(me.name) : '나'}<br><b>${c.name}</b></div>
            <div class="heart">💗</div>
            <div class="who"><span class="em">${fc.emoji}</span>${f.name ? esc(f.name) : '동료'}<br><b>${fc.name}</b></div>
          </div>
          <div class="score">${r.score}점</div>
          <div class="score-label">${r.label}</div>
          <ul class="compat-list">${r.lines.map(l => `<li>${l}</li>`).join('')}</ul>
          <button class="btn kakao" data-act="kakao-back">💬 ${f.name ? esc(f.name) + '님에게' : '동료에게'} 내 결과 보내기</button>
        </section>`;
    }

    const best = (window.BEST_MATCH[me.type] || []).slice(0, 2);
    const matchHtml = best.map(t => {
      const m = CH[`${t}-A`];
      return `<div class="match"><span class="em">${m.emoji}</span><b>${m.name}</b>${t}</div>`;
    }).join('');

    const pill = me.hidden
      ? `<span class="type-pill hidden-pill">HIDDEN · ${me.type}-${me.at}</span>`
      : `<span class="type-pill" style="background:${c.color}">${me.type}-${me.at}</span>`;

    render(`
      ${compatHtml}
      <section class="card center">
        <p class="muted">회사에서 ${me.name ? esc(me.name) + '님은' : '나는'}</p>
        <div class="char-badge" style="background:${c.color}22">${c.emoji}</div>
        ${pill}
        <div class="char-name">${c.name}</div>
        <p class="char-tag">${c.tag}</p>
        <p class="desc">${c.desc}</p>
        <div class="keys">${c.keys.map(k => `<span>#${k}</span>`).join('')}</div>
        ${me.hidden ? '<p class="muted">✨ 두 가지 이상 성향이 정확히 반반인 사람만 나오는 히든 유형이에요!</p>' : ''}
      </section>

      <section class="card">
        <h3>${me.type} · ${window.TYPES[me.type]}</h3>
        <p class="muted" style="margin:0">${me.at === 'A' ? '확신형(A): 스트레스에 강하고 자신감 있게 밀고 나가요.' : '신중형(T): 섬세하고 완벽을 추구해서 스스로를 계속 발전시켜요.'}</p>
        <div class="bars">
          ${barHtml('외향 E', '내향 I', me.pct.EI, '#ff9f43')}
          ${barHtml('감각 S', '직관 N', me.pct.SN, '#10ac84')}
          ${barHtml('사고 T', '감정 F', me.pct.TF, '#2e86de')}
          ${barHtml('판단 J', '인식 P', me.pct.JP, '#a55eea')}
        </div>
      </section>

      ${matchHtml ? `<section class="card"><h3>💞 나와 손발이 잘 맞는 동료</h3><div class="match-grid">${matchHtml}</div></section>` : ''}

      <section class="card center">
        <h3>동료와 케미 보기</h3>
        <p class="muted">링크를 받은 동료가 테스트를 하면<br>같은 팀일 때 케미 점수가 바로 나와요.</p>
        <button class="btn kakao" data-act="kakao">💬 카카오톡으로 공유하기</button>
        <div class="row">
          <button class="btn secondary" data-act="copy">🔗 링크 복사</button>
          <button class="btn secondary" data-act="native">📤 다른 앱</button>
        </div>
        <button class="btn ghost" data-act="retry">다시 테스트하기</button>
        <button class="btn ghost" data-act="dex">40가지 직장인 유형 전체 보기</button>
      </section>
    `);

    const on = (act, fn) => { const el = app.querySelector(`[data-act="${act}"]`); if (el) el.onclick = fn; };
    on('kakao', () => shareKakao(me));
    on('kakao-back', () => shareKakao(me));
    on('copy', () => copyLink(shareUrl(me)));
    on('native', () => shareNative(me));
    on('retry', () => { state.answers.fill(null); state.idx = 0; viewHome(); });
    on('dex', () => viewDex());
  }

  // ---------- 화면: 도감 ----------
  function viewDex(selected) {
    const myId = state.me ? charId(state.me) : null;
    const ids = Object.keys(CH);
    const sel = selected || myId || ids[0];
    const c = CH[sel];
    const typeLabel = c.hidden ? '히든 유형' : `${sel} · ${window.TYPES[sel.slice(0, 4)]}`;
    render(`
      <section class="card center">
        <div class="char-badge" style="background:${c.color}22;width:110px;height:110px;font-size:60px">${c.emoji}</div>
        <div class="char-name" style="font-size:24px">${c.name}</div>
        <p class="muted" style="margin:2px 0 6px">${typeLabel}</p>
        <p class="char-tag" style="margin-bottom:6px">${c.tag}</p>
        <p class="desc" style="margin:0">${c.desc}</p>
      </section>
      <section class="card">
        <h3>40가지 직장인 유형</h3>
        <div class="dex">
          ${ids.map(id => {
            const x = CH[id];
            const sub = x.hidden ? 'HIDDEN' : id;
            return `<button class="dex-item${id === myId ? ' mine' : ''}" data-id="${id}"><span class="em">${x.emoji}</span>${x.name}<small>${sub}</small></button>`;
          }).join('')}
        </div>
        <button class="btn" data-act="home">${state.me ? '내 결과로 돌아가기' : '테스트 하러 가기'}</button>
      </section>
    `);
    app.querySelectorAll('.dex-item').forEach(b => { b.onclick = () => viewDex(b.dataset.id); });
    app.querySelector('[data-act="home"]').onclick = () => (state.me ? viewResult(state.me) : viewHome());
  }

  // ---------- 광고 ----------
  function renderAds() {
    const side = document.getElementById('ad-side');
    const bottom = document.getElementById('ad-bottom');
    const p = cfg.AD_PROVIDER;
    if (!p || p === 'none') { side.style.display = 'none'; bottom.style.display = 'none'; return; }
    if (p === 'adfit') {
      side.innerHTML = `<ins class="kakao_ad_area" style="display:none;" data-ad-unit="${cfg.ADFIT.SIDE_UNIT}" data-ad-width="160" data-ad-height="600"></ins>`;
      bottom.innerHTML = `<ins class="kakao_ad_area" style="display:none;" data-ad-unit="${cfg.ADFIT.BOTTOM_UNIT}" data-ad-width="320" data-ad-height="50"></ins>`;
      const s = document.createElement('script');
      s.async = true; s.src = 'https://t1.daumcdn.net/kas/static/ba.min.js';
      document.body.appendChild(s);
    } else if (p === 'adsense') {
      if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
        const s = document.createElement('script');
        s.async = true; s.crossOrigin = 'anonymous';
        s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cfg.ADSENSE.CLIENT}`;
        document.head.appendChild(s);
      }
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
