// ==============================================
//  수능 응원 부적: 수험생 이름을 넣고, 접힌 부적 중 하나를 골라요.
//  카톡으로 보내면 받은 사람은 같은 부적을 먼저 보고, 자기도 보낼 수 있어요.
// ==============================================
(() => {
  const { cfg, esc, ic, render, on, baseUrl, copyLink, shareKakao, renderAds } = window.FX;
  const CH = window.CHARMS;
  const PICK_N = 6;

  const state = { to: '', from: '', deck: [], shared: readShared() };
  function readShared() {
    const q = new URLSearchParams(location.search);
    const c = CH.find(x => x.id === q.get('c'));
    return c ? { c, to: (q.get('to') || '').slice(0, 10), from: (q.get('fr') || '').slice(0, 10) } : null;
  }

  // 수능까지 남은 날 (기기 날짜 기준)
  function dday() {
    const [y, m, d] = cfg.EXAM_DATE.split('-').map(Number);
    const now = new Date();
    const diff = Math.round((new Date(y, m - 1, d) - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
    if (diff > 0) return { tag: `수능 D-${diff}`, after: false };
    if (diff === 0) return { tag: '오늘 수능 D-DAY', after: false };
    return { tag: '수능 끝! 고생 많았어요', after: true };
  }
  const nim = s => (s ? esc(s) + '님' : '');

  function charmHtml(c, cls) {
    return `<div class="charm ${cls || ''}"><span class="ct">수능 부적</span>${ic(c.em)}<b class="cn">${c.name}</b><span class="seal">합격</span></div>`;
  }
  function detailHtml(c) {
    return `
      <p class="charm-power">${c.power}</p>
      <div class="charm-msg">“${c.msg}”</div>
      <ul class="fortune-list">
        <li><b>행운 아이템</b>${c.item}</li>
        <li><b>시험날 한 가지</b>${c.tip}</li>
      </ul>`;
  }

  // ---------- 화면: 시작 ----------
  function viewHome() {
    const sh = state.shared, dd = dday();
    const invite = sh ? `
      <section class="result">
        <p class="label">${sh.from ? nim(sh.from) + '이' : '누군가'}${sh.to ? ' ' + nim(sh.to) + '에게' : ''} 보낸 부적이 도착했어요</p>
        <div style="margin-top:14px">${charmHtml(sh.c, 'big flip')}</div>
        ${detailHtml(sh.c)}
      </section>` : '';
    render(`
      ${invite}
      <div class="hero">${['📜', '🍀', '⭐', '✏️', '🎯'].map((e, k) => ic(e, 'h' + k)).join('')}</div>
      <section style="padding-top:20px">
        <p class="label"><span class="tag-line">${dd.tag}</span></p>
        <h1>${sh ? '나도 부적 보내기' : '수능 응원 부적'}</h1>
        <p class="muted">수험생 이름을 넣고 부적을 하나 골라 카톡으로 보내주세요. 나를 위한 부적으로 뽑아도 돼요.</p>
        <div class="field"><label for="to">받는 수험생</label><input class="input" id="to" maxlength="10" placeholder="이름이나 별명 (선택)" value="${esc(state.to)}"></div>
        <div class="field"><label for="from">보내는 사람</label><input class="input" id="from" maxlength="10" placeholder="내 이름 (선택)" value="${esc(state.from)}"></div>
        <button class="btn" data-act="go" style="margin-top:20px">부적 고르러 가기</button>
        <p class="disclaimer">부적은 재미로, 실력은 진짜로. 수험생 모두 응원해요.</p>
      </section>
    `);
    on('go', () => {
      state.to = document.getElementById('to').value.trim().slice(0, 10);
      state.from = document.getElementById('from').value.trim().slice(0, 10);
      state.deck = CH.slice().sort(() => Math.random() - 0.5).slice(0, PICK_N);
      viewPick();
    });
  }

  // ---------- 화면: 부적 고르기 ----------
  function viewPick() {
    render(`
      <section class="center" style="border:0">
        <p class="label">${state.to ? nim(state.to) + '을 위한' : '나를 위한'} 부적</p>
        <h1 style="font-size:24px">마음이 가는 부적을 하나 골라요</h1>
        <p class="muted">접힌 부적을 누르면 펼쳐져요.</p>
        <div class="charm-deck">${state.deck.map((_, i) => `<button class="charm-back" data-i="${i}" aria-label="부적 ${i + 1}"><span>符</span></button>`).join('')}</div>
        <button class="btn ghost" data-act="back" style="margin-top:16px">처음으로</button>
      </section>
    `, { noMore: true });
    document.querySelectorAll('.charm-back').forEach(b => b.onclick = () => {
      document.querySelectorAll('.charm-back').forEach(x => { x.disabled = true; if (x !== b) x.classList.add('dim'); });
      b.classList.add('chosen');
      setTimeout(() => viewResult(state.deck[Number(b.dataset.i)]), 450);
    });
    on('back', viewHome);
  }

  // ---------- 화면: 결과 ----------
  function viewResult(c) {
    const forOther = !!state.to;
    render(`
      <section class="result">
        <p class="label">${forOther ? nim(state.to) + '을 위한' : '나를 위한'} 수능 부적</p>
        <div style="margin-top:14px">${charmHtml(c, 'big flip')}</div>
        ${detailHtml(c)}
      </section>
      <section>
        <h3>${forOther ? nim(state.to) + '에게 보내기' : '친구한테도 보내기'}</h3>
        <p class="muted" style="margin:-8px 0 12px">받은 사람은 이 부적을 보고, 다른 친구에게 또 보낼 수 있어요.</p>
        <button class="btn kakao" data-act="kakao">카카오톡으로 부적 보내기</button>
        <button class="btn secondary" data-act="copy">링크 복사</button>
        <button class="btn ghost" data-act="retry">다른 부적 고르기</button>
        <p class="disclaimer">부적은 재미로만 봐주세요.</p>
      </section>
    `);
    const q = new URLSearchParams({ c: c.id });
    if (state.to) q.set('to', state.to);
    if (state.from) q.set('fr', state.from);
    const url = `${baseUrl()}?${q}`;
    const title = state.from && state.to ? `${state.from}님이 ${state.to}님에게 수능 부적을 보냈어요`
      : state.to ? `${state.to}님에게 수능 부적이 도착했어요` : `수능 부적: ${c.name}`;
    on('kakao', () => shareKakao({
      title, description: `${c.name} · ${c.power}`,
      image: `${baseUrl()}share/${c.id}.png`, url, button: '부적 열어보기',
    }));
    on('copy', () => copyLink(url));
    on('retry', () => { state.shared = null; viewHome(); });
  }

  viewHome();
  renderAds();
})();
