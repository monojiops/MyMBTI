// ==============================================
//  운세 공통 도구 (사주, 타로)
//  페이지마다 window.SITE_CONFIG(config.js)를 두고, 이 파일 다음에 페이지 앱을 불러요.
//  그림은 /fun/assets/emoji/ 의 Noto Emoji SVG를 같이 써요.
// ==============================================
window.FX = (() => {
  const cfg = window.SITE_CONFIG;
  const T = cfg.THEME;
  document.documentElement.style.setProperty('--primary', T.colors.b);
  document.documentElement.style.setProperty('--tint', T.colors.soft);

  // 운세 탭의 다른 페이지
  const FAMILY = [
    { path: 'saju', em: '☯️', title: '오늘의 사주', sub: '내 사주와 오늘의 운세' },
    { path: 'tarot', em: '🔮', title: '타로 한 장', sub: '카드가 알려주는 오늘' },
  ];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function ic(em, cls) {
    const cp = Array.from(em).map(c => c.codePointAt(0)).filter(c => c !== 0xfe0f).map(c => c.toString(16)).join('_');
    return `<img class="ic ${cls || ''}" src="/fun/assets/emoji/${cp}.svg" alt="${esc(em)}" draggable="false" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:this.className,textContent:this.alt}))">`;
  }
  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('show'), 1800);
  }
  function moreHtml() {
    const here = location.pathname.split('/').filter(Boolean).pop();
    const items = FAMILY.filter(f => f.path !== here).map(f => `
        <a class="more-wide" href="../${f.path}/">${ic(f.em, 'em')}<div><b>${f.title}</b><small>${f.sub}</small></div></a>`).join('');
    return `
      <section>
        <h3>이것도 해보세요</h3>
        ${items}
        <a class="more-wide" href="/fun/">${ic('🍱', 'em')}<div><b>오늘 뭐 먹지?</b><small>점메추, 저메추, 직장인 MBTI 등 재밌는 콘텐츠</small></div></a>
      </section>
      <p class="foot"><a href="../">monojilab 운세</a> · 재미로만 봐주세요</p>`;
  }
  function render(html, opts) {
    const app = document.getElementById('app');
    const top = `<div class="topbar"><a href="../">← monojilab 운세</a><span>${T.short}</span></div>`;
    app.innerHTML = `<div class="fade-in">${top}${html}${opts && opts.noMore ? '' : moreHtml()}</div>`;
    window.scrollTo({ top: 0 });
    return app;
  }
  function on(act, fn) {
    const el = document.querySelector(`[data-act="${act}"]`);
    if (el) el.onclick = fn;
  }

  // ---------- 공유 ----------
  function baseUrl() {
    if (cfg.SITE_URL) return cfg.SITE_URL.replace(/\/$/, '') + '/';
    return location.href.split(/[?#]/)[0];
  }
  function initKakao() {
    if (cfg.KAKAO_JS_KEY && window.Kakao && !window.Kakao.isInitialized()) {
      try { window.Kakao.init(cfg.KAKAO_JS_KEY); } catch (e) { console.warn('Kakao init 실패', e); }
    }
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
  // { title, description, image, url, button }
  function shareKakao(o) {
    initKakao();
    if (!window.Kakao || !window.Kakao.isInitialized()) { copyLink(o.url, '카카오톡을 열 수 없어 링크를 복사했어요!'); return; }
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: o.title,
        description: o.description,
        imageUrl: o.image,
        imageWidth: 800,
        imageHeight: 400,
        link: { mobileWebUrl: o.url, webUrl: o.url },
      },
      buttons: [{ title: o.button, link: { mobileWebUrl: o.url, webUrl: o.url } }],
    });
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
      const visible = window.matchMedia('(min-width: 900px)').matches ? side : bottom;
      visible.querySelectorAll('.adsbygoogle').forEach(() => (window.adsbygoogle = window.adsbygoogle || []).push({}));
    } else if (p === 'preview') {
      side.innerHTML = '<div class="ad-placeholder" style="width:160px;height:600px">광고 영역<br>160 × 600</div>';
      bottom.innerHTML = '<div class="ad-placeholder" style="width:320px;height:50px">광고 영역 320 × 50</div>';
    }
  }

  // 날짜로 정해지는 의사 난수 (같은 날 같은 사람은 같은 결과)
  function seeded(seed) {
    let h = 2166136261;
    for (const ch of String(seed)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    return () => { h += 0x6d2b79f5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function todayStr(d) {
    d = d || new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  initKakao();
  return { cfg, T, esc, ic, toast, render, on, baseUrl, copyLink, shareKakao, renderAds, seeded, todayStr };
})();
