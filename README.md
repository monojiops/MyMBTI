# monojilab.com

이 폴더 전체가 monojilab.com 사이트입니다. (README.md는 올라가도 상관없어요)

- `index.html` 첫 화면: 테스트 목록
- `office-mbti/` MBTI 직장인 유형 테스트 → https://monojilab.com/office-mbti/
  - `js/config.js` 카카오 키, 광고 설정
  - `js/data.js` 질문, 40가지 유형, 궁합표
  - `og.png` 카카오톡 공유 미리보기 이미지

새 테스트를 만들면 `office-mbti/` 옆에 폴더를 하나 더 만들고 첫 화면 목록에 추가합니다.

## Cloudflare에 올리기 (GitHub 없이)
1. dash.cloudflare.com → Compute(Workers & Pages) → 만들기 → Pages → "에셋 업로드(Upload assets)"
2. 프로젝트 이름: monojilab → 이 폴더(monojilab)를 끌어다 놓기 → 배포
3. 배포된 프로젝트 → 사용자 지정 도메인(Custom domains) → monojilab.com 추가 (같은 계정이라 DNS 자동 설정)
4. 수정할 때는 같은 프로젝트에서 "새 배포 만들기"로 폴더를 다시 올리면 됩니다.

## 카카오톡 공유 켜기
1. developers.kakao.com → 내 애플리케이션 → 앱 추가
2. 앱 설정 > 플랫폼 > Web > 사이트 도메인에 `https://monojilab.com` 등록
3. 앱 키 > JavaScript 키를 `office-mbti/js/config.js`의 `KAKAO_JS_KEY`에 넣고 다시 배포

## 광고
카카오 애드핏(adfit.kakao.com)에서 매체 등록(monojilab.com) → 광고단위 160x600, 320x50 생성 → `config.js`에 `AD_PROVIDER: 'adfit'`과 단위 ID 입력
