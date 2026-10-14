# monojilab.com

이 폴더 전체가 monojilab.com 사이트입니다. (README.md는 올라가도 상관없어요)

- `index.html` 첫 화면: 테스트 목록
- `fun/` 재밌는 콘텐츠 모음 → https://monojilab.com/fun/
- `fun/office-mbti/` MBTI 직장인 유형 테스트 → https://monojilab.com/fun/office-mbti/
- 메추 시리즈: `fun/lunch/` 점메추, `fun/dinner/` 저메추, `fun/dessert/` 디메추, `fun/drink/` 술메추, `fun/night/` 야메추
  - 공통 화면과 추천 로직은 `fun/assets/menu.js`, `fun/assets/menu.css`
  - 각 폴더의 `js/config.js`(제목, 색, 문구)와 `js/data.js`(질문, 메뉴)만 다르게 둬요. 새 메추는 폴더를 복사해서 이 두 파일만 바꾸면 돼요
- `office-mbti/`, `lab/` 예전 주소. 새 주소로 넘겨주는 페이지만 남아 있어요
  - `js/config.js` 카카오 키, 광고 설정
  - `js/data.js` 질문, 40가지 유형, 궁합표
  - `og.png` 카카오톡 공유 미리보기 이미지

새 테스트를 만들면 `fun/` 안에 폴더를 하나 더 만들고 첫 화면 목록에 추가합니다.

## Cloudflare에 올리기 (GitHub 없이)
1. dash.cloudflare.com → Compute(Workers & Pages) → 만들기 → Pages → "에셋 업로드(Upload assets)"
2. 프로젝트 이름: monojilab → 이 폴더(monojilab)를 끌어다 놓기 → 배포
3. 배포된 프로젝트 → 사용자 지정 도메인(Custom domains) → monojilab.com 추가 (같은 계정이라 DNS 자동 설정)
4. 수정할 때는 같은 프로젝트에서 "새 배포 만들기"로 폴더를 다시 올리면 됩니다.

## 카카오톡 공유 켜기
1. developers.kakao.com → 내 애플리케이션 → 앱 추가
2. 앱 설정 > 플랫폼 > Web > 사이트 도메인에 `https://monojilab.com` 등록
3. 앱 키 > JavaScript 키를 `fun/office-mbti/js/config.js`의 `KAKAO_JS_KEY`에 넣고 다시 배포

## 광고
카카오 애드핏(adfit.kakao.com)에서 매체 등록(monojilab.com) → 광고단위 160x600, 320x50 생성 → `config.js`에 `AD_PROVIDER: 'adfit'`과 단위 ID 입력

메추 화면의 그림은 Google Noto Emoji(Apache License 2.0) SVG를 `fun/assets/emoji/`에 넣어 쓴 거예요. 파일 이름은 이모지 코드포인트(예: 1f355.svg)이고, 새 이모지를 쓰면 `https://fonts.gstatic.com/s/e/notoemoji/latest/<코드>/emoji.svg`에서 받아 넣으면 돼요. 파일이 없으면 글자 이모지로 보여요.
