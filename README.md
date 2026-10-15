# monojilab.com

이 폴더 전체가 monojilab.com 사이트입니다. (README.md는 올라가도 상관없어요)

- `index.html` 첫 화면: 테스트 목록
- `fun/` 재밌는 콘텐츠 모음 → https://monojilab.com/fun/
- `fun/office-mbti/` MBTI 직장인 유형 테스트 → https://monojilab.com/fun/office-mbti/
- 메추 시리즈: `fun/lunch/` 점메추, `fun/dinner/` 저메추, `fun/dessert/` 디메추, `fun/drink/` 술메추, `fun/night/` 야메추, `fun/stretch/` 오늘의 스트레칭 (같은 엔진, THEME.noMap으로 지도 버튼 숨김, 항목의 steps로 따라 하기 순서 표시)
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

카톡 공유 이미지(800x400)는 `tools/make-share-images.js`로 만들어요. 메추는 `fun/<메추>/share/<메뉴id>.png`, 직장인 MBTI는 `fun/office-mbti/share/<유형>.png`이고 각 페이지 og.png도 같이 다시 만들어져요. 메뉴나 유형을 추가하면 로컬 서버(python3 -m http.server 8765)를 켠 채로 다시 실행하세요.

운세 탭은 `fortune/`에 따로 있어요 (홈페이지 메뉴 '운세').
- `fortune/saju/` 오늘의 사주: 양력 생년월일(+시진)로 네 기둥을 계산하고 일간 풀이, 오행, 오늘의 운세(오늘 일진과의 십신)를 보여줘요. 절기는 평균 날짜를 쓰는 간이 계산이에요. 생년월일은 저장하지 않고 공유 링크에도 일간만 넣어요.
- `fortune/tarot/` 타로: 메이저 아르카나 22장, 주제 4개(오늘, 연애, 일, 돈), 한 장 또는 세 장.
- 공통 코드 `fortune/assets/common.js`, 스타일은 `/fun/assets/menu.css` + `fortune/assets/fortune.css`, 그림은 `/fun/assets/emoji/`를 같이 써요.
- 공유 이미지는 `tools/make-fortune-images.js`로 만들어요.
