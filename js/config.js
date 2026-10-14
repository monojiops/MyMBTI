// ==============================================
//  사이트 설정: 배포 전에 이 파일만 채우면 됩니다.
// ==============================================
window.SITE_CONFIG = {
  // 사이트 이름과 배포 주소 (끝에 / 없이). 카카오 공유 링크에 쓰입니다.
  SITE_NAME: '나의 MBTI 캐릭터',
  SITE_URL: 'https://YOUR-DOMAIN.com',

  // 카카오 개발자 콘솔 > 내 애플리케이션 > 앱 키 > JavaScript 키
  // 비워두면 카카오톡 버튼 대신 "링크 복사"가 동작합니다.
  KAKAO_JS_KEY: '',

  // 카카오 공유 미리보기 이미지 (절대 주소, 800x400 권장)
  SHARE_IMAGE: 'https://YOUR-DOMAIN.com/og.png',

  // 광고 설정: 'none' | 'adfit' | 'adsense'
  AD_PROVIDER: 'none',

  // 카카오 애드핏 (adfit.kakao.com 에서 광고단위 생성)
  ADFIT: {
    SIDE_UNIT: 'DAN-XXXXXXXXXXXXXXX',   // 160x600 (PC 우측)
    BOTTOM_UNIT: 'DAN-XXXXXXXXXXXXXXX', // 320x50  (모바일 하단)
  },

  // 구글 애드센스
  ADSENSE: {
    CLIENT: 'ca-pub-XXXXXXXXXXXXXXXX',
    SIDE_SLOT: '0000000000',
    BOTTOM_SLOT: '0000000000',
  },
};
