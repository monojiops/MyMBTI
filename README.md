# MBTI 직장인 유형 테스트

서버 없이 동작하는 정적 사이트입니다 (HTML/CSS/JS). 폴더째로 GitHub Pages, Netlify, Vercel 등에 올리면 됩니다.

## 파일
- `index.html` 페이지 뼈대 (og:image 주소 수정 필요)
- `style.css` 디자인
- `js/config.js` **배포 전에 채울 설정** (사이트 주소, 카카오 키, 광고)
- `js/data.js` 질문 19개, 16유형 별명, 40 직장인 유형, 궁합표
- `js/app.js` 동작 로직

## 40 직장인 유형 구성
- 16유형 x 확신형(A)/신중형(T) = 32종
- 히든 유형 8종: E/I, S/N, T/F, J/P 중 두 축 이상이 정확히 반반인 경우, 기질(NF/NT/SJ/SP) x A/T

## 궁합 동작
결과를 공유하면 링크에 내 유형이 담깁니다 (`?f=ENFJ-A&fn=닉네임`).
친구가 그 링크로 테스트하면 결과 화면 위에 궁합 점수가 나옵니다.
친구가 "내 결과 보내기"로 답장하면, 원래 사람은 이 기기에 저장된 결과로 다시 테스트 없이 바로 궁합을 봅니다.

## 배포 전 체크리스트
1. `config.js`의 `SITE_URL`, `SHARE_IMAGE`, `index.html`의 `og:image`를 실제 주소로 변경
2. 카카오 개발자(developers.kakao.com)에서 앱 생성 → JavaScript 키를 `KAKAO_JS_KEY`에 입력 → 플랫폼 > Web에 사이트 도메인 등록
3. 공유 미리보기 이미지(800x400 png)를 `og.png`로 업로드
4. 광고: 카카오 애드핏(160x600, 320x50 광고단위) 또는 애드센스 승인 후 `AD_PROVIDER`와 단위 ID 입력
