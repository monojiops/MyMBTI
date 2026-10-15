// ==============================================
//  타로: 주제와 장수를 고르고, 섞인 22장 중에서 직접 뽑아요.
//  역방향은 30% 확률로 나와요.
// ==============================================
(() => {
  const { esc, ic, render, on, baseUrl, copyLink, shareKakao, renderAds } = window.FX;
  const C = window.CARDS, TOPICS = window.TOPICS;
  const POS3 = { today: ['아침', '낮', '밤'], love: ['나의 마음', '상대의 마음', '앞으로'], work: ['지금 상황', '방해 요소', '조언'], money: ['지금 상황', '조심할 것', '앞으로'] };

  const state = { topic: 'today', n: 1, deck: [], picks: [], name: '', shared: readShared() };
  function byId(id) { return C.find(c => c.id === id); }
  function readShared() {
    const q = new URLSearchParams(location.search);
    const picks = (q.get('c') || '').split(',').map(x => { const [id, o] = x.split('-'); const c = byId(id); return c ? { c, rev: o === 'r' } : null; }).filter(Boolean).slice(0, 3);
    const t = TOPICS.find(x => x.key === q.get('t'));
    return picks.length ? { picks, topic: t ? t.key : 'today', name: (q.get('fn') || '').slice(0, 10) } : null;
  }
  function cardHtml(p, cls) {
    return `<div class="tcard ${cls || ''}${p.rev ? ' rev' : ''}"><span class="num">${p.c.no}</span>${ic(p.c.em)}<span class="nm">${p.c.name}</span></div>`;
  }
  const orient = p => (p.rev ? '역방향' : '정방향');
  const side = p => (p.rev ? p.c.rev : p.c.up);
  const topicOf = k => TOPICS.find(t => t.key === k);

  // ---------- 화면: 시작 ----------
  function viewHome() {
    const sh = state.shared;
    const invite = sh ? `
      <section class="result">
        <p class="label">${sh.name ? esc(sh.name) + '님이' : '친구가'} 뽑은 ${topicOf(sh.topic).label} 카드</p>
        <div class="${sh.picks.length > 1 ? 'spread' : ''}" style="margin-top:12px">${sh.picks.map(p => cardHtml(p, sh.picks.length > 1 ? '' : 'big')).join('')}</div>
        <p class="menu-desc" style="margin-top:12px">${sh.picks.map(p => `${p.c.name}(${orient(p)})`).join(', ')}</p>
      </section>` : '';
    render(`
      ${invite}
      <div class="hero">${['🔮', '⭐', '🌙', '☀️', '🃏'].map((e, k) => ic(e, 'h' + k)).join('')}</div>
      <section style="padding-top:20px">
        <p class="label">타로</p>
        <h1>${sh ? '나도 한 장 뽑아볼까?' : '카드가 알려주는 오늘'}</h1>
        <p class="muted">궁금한 걸 떠올리고, 마음이 가는 카드를 직접 골라보세요.</p>
        <input class="input" id="name" maxlength="10" placeholder="이름이나 닉네임 (선택)" value="${esc(state.name)}">
        <h3 style="margin-top:22px">무엇이 궁금해요?</h3>
        <div class="seg3" id="topics">${TOPICS.map(t => `<button class="choice${state.topic === t.key ? ' on' : ''}" data-t="${t.key}">${ic(t.em, 'em')}${t.label}</button>`).join('')}</div>
        <h3 style="margin-top:22px">몇 장 뽑을까요?</h3>
        <div class="seg3" id="ns">
          <button class="choice${state.n === 1 ? ' on' : ''}" data-n="1">한 장 (간단하게)</button>
          <button class="choice${state.n === 3 ? ' on' : ''}" data-n="3">세 장 (자세하게)</button>
        </div>
        <button class="btn" data-act="go" style="margin-top:20px">카드 섞기</button>
        <p class="disclaimer">재미로만 봐주세요.</p>
      </section>
    `);
    document.querySelectorAll('#topics .choice').forEach(b => b.onclick = () => {
      state.topic = b.dataset.t;
      document.querySelectorAll('#topics .choice').forEach(x => x.classList.toggle('on', x === b));
    });
    document.querySelectorAll('#ns .choice').forEach(b => b.onclick = () => {
      state.n = Number(b.dataset.n);
      document.querySelectorAll('#ns .choice').forEach(x => x.classList.toggle('on', x === b));
    });
    on('go', () => {
      state.name = document.getElementById('name').value.trim().slice(0, 10);
      state.deck = C.map(c => ({ c, rev: Math.random() < 0.3 })).sort(() => Math.random() - 0.5);
      state.picks = [];
      viewDeck();
    });
  }

  // ---------- 화면: 카드 고르기 ----------
  function viewDeck() {
    const left = () => state.n - state.picks.length;
    render(`
      <section class="center" style="border:0">
        <p class="label">${topicOf(state.topic).label}</p>
        <h1 style="font-size:24px">마음이 가는 카드를 ${state.n === 1 ? '한 장' : '세 장'} 골라요</h1>
        <p class="muted" id="left">${left()}장 남았어요</p>
        <div class="deck">${state.deck.map((_, i) => `<button class="tback" data-i="${i}" aria-label="카드 ${i + 1}"></button>`).join('')}</div>
        <button class="btn ghost" data-act="back" style="margin-top:16px">처음으로</button>
      </section>
    `, { noMore: true });
    document.querySelectorAll('.tback').forEach(b => b.onclick = () => {
      if (left() <= 0) return;
      b.classList.add('picked');
      state.picks.push(state.deck[Number(b.dataset.i)]);
      document.getElementById('left').textContent = left() ? `${left()}장 남았어요` : '카드를 펼치는 중...';
      if (!left()) setTimeout(viewResult, 500);
    });
    on('back', viewHome);
  }

  // ---------- 화면: 결과 ----------
  function viewResult() {
    const t = state.topic, picks = state.picks;
    const main = picks.length > 1 ? picks[1] : picks[0];
    const pos = picks.length > 1 ? POS3[t] : null;
    const who = state.name ? esc(state.name) + '님' : '오늘';
    const cards = picks.length > 1
      ? `<div class="spread">${picks.map((p, i) => `<div><p class="pos">${pos[i]}</p>${cardHtml(p, 'flip')}</div>`).join('')}</div>`
      : cardHtml(main, 'big flip');
    const reading = picks.map((p, i) => `
      <h4>${pos ? pos[i] + ' · ' : ''}${p.c.name} <small>${p.c.en} · ${orient(p)}</small></h4>
      <p>${side(p)[t]}</p>`).join('');

    render(`
      <section class="result">
        <p class="label">${who}의 ${topicOf(t).label} 카드</p>
        <div style="margin-top:12px">${cards}</div>
        <div class="kw">${side(main).kw.map(k => `<span>#${k}</span>`).join('')}</div>
        <div class="reading">${reading}
          ${picks.length === 1 && t !== 'today' ? `<h4>오늘 하루는</h4><p>${side(main).today}</p>` : ''}
        </div>
      </section>
      <section>
        <h3>친구한테 보내기</h3>
        <p class="muted" style="margin:-8px 0 12px">내가 뽑은 카드를 보내고 친구도 뽑아보게 해요.</p>
        <button class="btn kakao" data-act="kakao">카카오톡으로 보내기</button>
        <button class="btn secondary" data-act="copy">링크 복사</button>
        <button class="btn ghost" data-act="retry">다시 뽑기</button>
        <p class="disclaimer">타로는 재미로만 봐주세요.</p>
      </section>
    `);
    const q = new URLSearchParams({ c: picks.map(p => `${p.c.id}-${p.rev ? 'r' : 'u'}`).join(','), t });
    if (state.name) q.set('fn', state.name);
    const url = `${baseUrl()}?${q}`;
    on('kakao', () => shareKakao({
      title: `${state.name ? state.name + '님의' : '오늘의'} ${topicOf(t).label} 카드: ${main.c.name}${main.rev ? ' (역방향)' : ''}`,
      description: side(main)[t],
      image: `${baseUrl()}share/${main.c.id}.png`, url, button: '나도 카드 뽑기',
    }));
    on('copy', () => copyLink(url));
    on('retry', () => { state.shared = null; viewHome(); });
  }

  viewHome();
  renderAds();
})();
