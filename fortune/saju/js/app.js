// ==============================================
//  오늘의 사주
//  - 양력 생년월일(+태어난 시간)로 네 기둥(년주, 월주, 일주, 시주)을 계산해요.
//  - 절기는 해마다 하루 정도 달라질 수 있어 평균 날짜를 써요 (재미용 간이 계산).
//  - 생년월일은 화면에서만 쓰고 저장하거나 공유 링크에 넣지 않아요.
// ==============================================
(() => {
  const { T, esc, ic, render, on, baseUrl, copyLink, shareKakao, renderAds, todayStr } = window.FX;
  const S = window.STEMS, B = window.BRANCHES, EL = window.ELEMENTS, ORDER = window.EL_ORDER;
  const DM = window.DAY_MASTERS, TG = window.TEN_GODS;

  // 각 월(寅월부터)이 시작하는 절기의 평균 날짜 [월, 일]
  const TERM_STARTS = [[2, 4], [3, 6], [4, 5], [5, 6], [6, 6], [7, 7], [8, 8], [9, 8], [10, 8], [11, 7], [12, 7], [1, 6]];
  const mod = (n, m) => ((n % m) + m) % m;

  function yearPillar(y, m, d) {
    const yy = (m < 2 || (m === 2 && d < 4)) ? y - 1 : y; // 입춘 전이면 전년도
    return { s: mod(yy - 4, 10), b: mod(yy - 4, 12) };
  }
  function monthIndex(m, d) { // 寅월=0 ... 丑월=11
    let idx = 11;
    TERM_STARTS.forEach(([tm, td], i) => {
      if (i === 11) return;
      if (m > tm || (m === tm && d >= td)) idx = i;
    });
    if (m === 1 && d < 6) idx = 10; // 1월 소한 전은 子월
    return idx;
  }
  function monthPillar(yStem, m, d) {
    const i = monthIndex(m, d);
    const start = mod((yStem % 5) * 2 + 2, 10); // 甲己년 → 丙寅월
    return { s: mod(start + i, 10), b: mod(2 + i, 12) };
  }
  function dayPillar(y, m, d) {
    // 2000-01-01은 戊午일 (60갑자 54번)
    const days = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2000, 0, 1)) / 86400000);
    const n = mod(54 + days, 60);
    return { s: n % 10, b: n % 12 };
  }
  function hourPillar(dStem, hb) {
    if (hb < 0) return null;
    return { s: mod((dStem % 5) * 2 + hb, 10), b: hb };
  }
  function tenGod(me, other) {
    const ea = ORDER.indexOf(S[me].el), eb = ORDER.indexOf(S[other].el);
    const same = me % 2 === other % 2;
    const rel = mod(eb - ea, 5); // 0 같음, 1 내가 생함, 2 내가 극함, 3 나를 극함, 4 나를 생함
    return [['bigyeon', 'geopjae'], ['siksin', 'sanggwan'], ['pyeonjae', 'jeongjae'], ['pyeongwan', 'jeonggwan'], ['pyeonin', 'jeongin']][rel][same ? 0 : 1];
  }
  function calc(y, m, d, hb) {
    const yp = yearPillar(y, m, d);
    const mp = monthPillar(yp.s, m, d);
    const dp = dayPillar(y, m, d);
    const hp = hourPillar(dp.s, hb);
    const pillars = [hp, dp, mp, yp]; // 표시는 시, 일, 월, 년 순 (전통 순서)
    const count = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    pillars.forEach(p => { if (p) { count[S[p.s].el]++; count[B[p.b].el]++; } });
    return { pillars, count, me: dp.s, zodiac: B[yp.b] };
  }

  const state = { name: '', y: 1995, m: 1, d: 1, hb: -1, shared: readShared() };
  function readShared() {
    const q = new URLSearchParams(location.search);
    const d = Number(q.get('d'));
    return q.has('d') && d >= 0 && d < 10 ? { me: d, name: (q.get('fn') || '').slice(0, 10) } : null;
  }

  // ---------- 화면: 입력 ----------
  function viewHome() {
    const sh = state.shared;
    const invite = sh ? `
      <section class="result">
        <p class="label">${sh.name ? esc(sh.name) + '님은' : '친구는'}</p>
        <div class="plate">${ic(DM[sh.me].em)}</div>
        <div class="menu-name">${S[sh.me].ko}${EL[S[sh.me].el].ko} · ${DM[sh.me].name}</div>
        <p class="menu-desc">${DM[sh.me].desc}</p>
      </section>` : '';
    const now = new Date().getFullYear();
    const years = []; for (let y = now; y >= 1930; y--) years.push(y);
    const opt = (arr, cur, f) => arr.map(v => `<option value="${v}"${v === cur ? ' selected' : ''}>${f ? f(v) : v}</option>`).join('');
    const range = n => Array.from({ length: n }, (_, i) => i + 1);
    render(`
      ${invite}
      <div class="hero">${['☯️', '🌳', '🔥', '💎', '💧'].map((e, k) => ic(e, 'h' + k)).join('')}</div>
      <section style="padding-top:20px">
        <p class="label">사주</p>
        <h1>${sh ? '나는 어떤 사람일까?' : T.title}</h1>
        <p class="muted">생년월일로 내 사주와 타고난 성향, 오늘의 운세를 봐드려요.</p>
        <input class="input" id="name" maxlength="10" placeholder="이름이나 닉네임 (선택)" value="${esc(state.name)}">
        <div class="field">
          <label>생년월일 (양력)</label>
          <div class="date-row">
            <select class="input" id="y">${opt(years, state.y, v => v + '년')}</select>
            <select class="input" id="m">${opt(range(12), state.m, v => v + '월')}</select>
            <select class="input" id="d">${opt(range(31), state.d, v => v + '일')}</select>
          </div>
        </div>
        <div class="field">
          <label>태어난 시간</label>
          <select class="input" id="h">${window.HOURS.map(h => `<option value="${h.key}"${h.key === state.hb ? ' selected' : ''}>${h.label}</option>`).join('')}</select>
        </div>
        <button class="btn" data-act="go" style="margin-top:20px">사주 보기</button>
        <p class="disclaimer">입력한 생년월일은 저장하지 않아요. 재미로만 봐주세요.</p>
      </section>
    `);
    on('go', () => {
      const v = id => Number(document.getElementById(id).value);
      state.name = document.getElementById('name').value.trim().slice(0, 10);
      state.y = v('y'); state.m = v('m'); state.d = v('d'); state.hb = v('h');
      const last = new Date(state.y, state.m, 0).getDate();
      if (state.d > last) state.d = last;
      viewResult();
    });
  }

  // ---------- 화면: 결과 ----------
  const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
  function viewResult() {
    const r = calc(state.y, state.m, state.d, state.hb);
    const me = DM[r.me], meEl = EL[S[r.me].el];
    const now = new Date();
    const today = dayPillar(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const g = TG[tenGod(r.me, today.s)];
    const max = Math.max(...ORDER.map(k => r.count[k]), 1);
    const weak = ORDER.slice().sort((a, b) => r.count[a] - r.count[b])[0];
    const strong = ORDER.slice().sort((a, b) => r.count[b] - r.count[a])[0];
    const labels = ['시주', '일주', '월주', '년주'];
    const who = state.name ? esc(state.name) + '님' : '나';

    render(`
      <section class="result">
        <p class="label">${who}의 사주 · ${state.y}.${state.m}.${state.d}</p>
        <div class="plate">${ic(me.em)}</div>
        <div class="menu-name">${S[r.me].ko}${meEl.ko} · ${me.name}</div>
        <p class="menu-desc">${me.desc}</p>
        <div class="kw">${me.keys.map(k => `<span>#${k}</span>`).join('')}</div>
        <ul class="reasons">
          <li>👍 ${me.good}</li>
          <li>⚠️ ${me.care}</li>
          <li>${r.zodiac.em} ${r.zodiac.animal}띠예요.</li>
        </ul>
      </section>

      <section>
        <h3>오늘의 운세 <small class="muted">${todayStr(now)}</small></h3>
        <div class="center"><span class="tag-line">${g.name} · ${g.label}</span></div>
        <p style="margin-top:12px;word-break:keep-all">${g.total}</p>
        <ul class="fortune-list">
          <li><b>일·공부 <span class="stars">${stars(g.score[1])}</span></b>${g.work}</li>
          <li><b>돈 <span class="stars">${stars(g.score[2])}</span></b>${g.money}</li>
          <li><b>사람·연애 <span class="stars">${stars(g.score[3])}</span></b>${g.love}</li>
        </ul>
        <div class="luck">
          <div>행운의 색<b>${EL[weak].color}</b></div>
          <div>행운의 숫자<b>${EL[weak].nums}</b></div>
          <div>오늘의 한 가지<b style="font-size:14px">${g.tip}</b></div>
        </div>
      </section>

      <section>
        <h3>내 사주 여덟 글자</h3>
        <div class="pillars">
          ${r.pillars.map((p, i) => p ? `
            <div class="pillar${i === 1 ? ' me' : ''}">
              <div class="pl">${labels[i]}</div>
              <div class="hj el-${S[p.s].el}">${S[p.s].hj}</div>
              <div class="hj el-${B[p.b].el}">${B[p.b].hj}</div>
              <div class="hg">${S[p.s].ko}${B[p.b].ko}</div>
            </div>` : `
            <div class="pillar empty"><div class="pl">${labels[i]}</div><div class="hj">?</div><div class="hj">?</div><div class="hg">시간 모름</div></div>`).join('')}
        </div>
        <p class="muted" style="margin-top:10px;font-size:13px">테두리가 있는 일주의 윗글자(${S[r.me].hj})가 '나'를 나타내요.</p>
        <div class="el-bars">
          ${ORDER.map(k => `
            <div class="el-bar">
              <span class="lab">${ic(EL[k].em)}${EL[k].ko}(${EL[k].hj})</span>
              <div class="track"><div class="fill bg-${k}" style="width:${(r.count[k] / max) * 100}%"></div></div>
              <span class="n">${r.count[k]}</span>
            </div>`).join('')}
        </div>
        <p style="margin-top:8px;word-break:keep-all">${EL[strong].name}(${EL[strong].ko}) 기운이 가장 강하고, ${EL[weak].name}(${EL[weak].ko}) 기운이 ${r.count[weak] ? '약해요' : '없어요'}. ${EL[weak].color} 소품이나 ${EL[weak].dir} 방향이 부족한 기운을 채워줘요.</p>
      </section>

      <section>
        <h3>친구한테 보내기</h3>
        <p class="muted" style="margin:-8px 0 12px">생년월일은 빼고 "${who}는 ${me.name} 타입"만 보내져요.</p>
        <button class="btn kakao" data-act="kakao">카카오톡으로 보내기</button>
        <button class="btn secondary" data-act="copy">링크 복사</button>
        <button class="btn ghost" data-act="retry">다른 생일로 보기</button>
        <p class="disclaimer">절기는 평균 날짜로 계산해서 절기 당일 전후로 태어났다면 실제와 다를 수 있어요. 재미로만 봐주세요.</p>
      </section>
    `);
    const url = (() => { const q = new URLSearchParams({ d: r.me }); if (state.name) q.set('fn', state.name); return `${baseUrl()}?${q}`; })();
    on('kakao', () => shareKakao({
      title: `${state.name ? state.name + '님은' : '나는'} ${S[r.me].ko}${meEl.ko}, ${me.name} 타입`,
      description: `${me.keys.map(k => '#' + k).join(' ')} · 내 사주는 어떤 타입일까?`,
      image: `${baseUrl()}share/${me.id}.png`, url, button: '내 사주 보기',
    }));
    on('copy', () => copyLink(url));
    on('retry', () => { state.shared = null; viewHome(); });
  }

  viewHome();
  renderAds();
  window.__saju = { calc, dayPillar, tenGod }; // 확인용
})();
