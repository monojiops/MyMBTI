// ==============================================
//  점메추 데이터: 질문과 메뉴
//  메뉴를 추가하려면 MENUS에 한 줄만 더 넣으면 됩니다.
// ==============================================

// 각 질문의 선택지는 key로 구분하고, app.js의 score()가 메뉴 태그와 비교해 점수를 매겨요.
window.QUESTIONS = [
  { id: 'mood', em: '🙂', text: '오늘 기분은 어때요?', opts: [
    { key: 'good', em: '😊', label: '좋아요' },
    { key: 'tired', em: '😩', label: '지쳤어요' },
    { key: 'stress', em: '😤', label: '스트레스 만땅' },
    { key: 'meh', em: '😐', label: '그냥 그래요' },
  ] },
  { id: 'weather', em: '🌦️', text: '오늘 날씨는요?', opts: [
    { key: 'cold', em: '🥶', label: '추워요' },
    { key: 'hot', em: '🥵', label: '더워요' },
    { key: 'rain', em: '☔', label: '비 와요' },
    { key: 'ok', em: '🌤️', label: '딱 좋아요' },
  ] },
  { id: 'kind', em: '🍽️', text: '오늘 당기는 건?', opts: [
    { key: 'soup', em: '🍲', label: '뜨끈한 국물' },
    { key: 'rice', em: '🍚', label: '든든한 밥' },
    { key: 'noodle', em: '🍜', label: '후루룩 면' },
    { key: 'quick', em: '🥪', label: '가볍고 빠르게' },
  ] },
  { id: 'spicy', em: '🌶️', text: '매운 건 어때요?', opts: [
    { key: 2, em: '🔥', label: '화끈하게' },
    { key: 1, em: '🌶️', label: '살짝만' },
    { key: 0, em: '🙅', label: '안 매운 거' },
    { key: -1, em: '🤷', label: '상관없어요' },
  ] },
  { id: 'budget', em: '💳', text: '오늘 점심 예산은?', opts: [
    { key: 1, em: '🪙', label: '만 원 이하' },
    { key: 2, em: '💵', label: '1~1.5만 원' },
    { key: 3, em: '💎', label: '오늘은 플렉스' },
    { key: 2.5, em: '🤔', label: '적당히' },
  ] },
  { id: 'with', em: '🧑‍🤝‍🧑', text: '누구랑 먹어요?', opts: [
    { key: 'solo', em: '🙋', label: '혼밥' },
    { key: 'two', em: '👫', label: '한두 명이랑' },
    { key: 'group', em: '👥', label: '팀 다 같이' },
    { key: 'boss', em: '👔', label: '상사랑' },
  ] },
];

// kind: soup | rice | noodle | quick
// spicy: 0~2, price: 1(만 원 이하) ~ 3(비싼 편)
// tags: warm(추운 날) cool(더운 날) rain(비 오는 날) good tired stress(기분) solo group boss(누구랑)
window.MENUS = [
  { id: 'kimchi-jjigae', name: '김치찌개', em: '🥘', kind: 'soup', spicy: 2, price: 1, tags: ['warm', 'rain', 'stress', 'solo', 'group'], desc: '실패 없는 직장인 소울푸드. 공깃밥 추가는 기본이죠.' },
  { id: 'doenjang', name: '된장찌개', em: '🍲', kind: 'soup', spicy: 0, price: 1, tags: ['warm', 'tired', 'solo', 'boss'], desc: '엄마 밥 생각날 때, 속이 편안해지는 한 그릇.' },
  { id: 'sundubu', name: '순두부찌개', em: '🫕', kind: 'soup', spicy: 2, price: 1, tags: ['warm', 'rain', 'solo'], desc: '보글보글 끓는 뚝배기에 날계란 톡. 몸이 사르르 풀려요.' },
  { id: 'budae', name: '부대찌개', em: '🍳', kind: 'soup', spicy: 1, price: 2, tags: ['warm', 'rain', 'group', 'stress'], desc: '햄, 소시지, 라면사리까지. 여럿이 먹을수록 맛있어요.' },
  { id: 'gukbap', name: '국밥', em: '🍚', kind: 'soup', spicy: 0, price: 1, tags: ['warm', 'tired', 'solo', 'rain'], desc: '든든함의 끝판왕. 오후 업무 버틸 힘이 생겨요.' },
  { id: 'seolleongtang', name: '설렁탕', em: '🥣', kind: 'soup', spicy: 0, price: 2, tags: ['warm', 'tired', 'boss', 'solo'], desc: '깍두기 국물 살짝 넣어서. 지친 몸에 보약 같은 맛.' },
  { id: 'yukgaejang', name: '육개장', em: '🌶️', kind: 'soup', spicy: 2, price: 2, tags: ['warm', 'rain', 'stress'], desc: '얼큰하게 땀 한번 쫙 빼면 스트레스도 같이 빠져요.' },
  { id: 'galbitang', name: '갈비탕', em: '🍖', kind: 'soup', spicy: 0, price: 3, tags: ['warm', 'tired', 'boss', 'good'], desc: '오늘은 나를 위한 보양식. 고기 뜯는 재미까지.' },
  { id: 'malatang', name: '마라탕', em: '🥵', kind: 'soup', spicy: 2, price: 2, tags: ['stress', 'two', 'warm'], desc: '얼얼한 마라 맛으로 회의 스트레스 날려버리기.' },
  { id: 'gamjatang', name: '감자탕', em: '🦴', kind: 'soup', spicy: 1, price: 2, tags: ['warm', 'group', 'rain'], desc: '뼈 발라 먹는 재미에 대화가 끊이질 않아요.' },
  { id: 'kalguksu', name: '칼국수', em: '🍜', kind: 'noodle', spicy: 0, price: 1, tags: ['rain', 'warm', 'tired', 'two'], desc: '비 오는 날엔 역시 칼국수. 겉절이랑 같이!' },
  { id: 'jjamppong', name: '짬뽕', em: '🦐', kind: 'noodle', spicy: 2, price: 1, tags: ['rain', 'stress', 'warm', 'group'], desc: '불맛 가득 얼큰한 국물에 해물이 듬뿍.' },
  { id: 'jjajang', name: '짜장면', em: '🖤', kind: 'noodle', spicy: 0, price: 1, tags: ['good', 'group', 'solo'], desc: '탕수육 하나 시켜서 다 같이 나눠 먹으면 완벽.' },
  { id: 'ramen', name: '일본 라멘', em: '🍥', kind: 'noodle', spicy: 0, price: 2, tags: ['warm', 'solo', 'good'], desc: '진한 돈코츠 국물에 차슈 한 장. 혼밥하기 딱 좋아요.' },
  { id: 'pho', name: '쌀국수', em: '🍲', kind: 'noodle', spicy: 0, price: 2, tags: ['tired', 'two', 'warm'], desc: '깔끔한 국물에 고수 듬뿍(또는 빼고). 속이 편해요.' },
  { id: 'naengmyeon', name: '물냉면', em: '🧊', kind: 'noodle', spicy: 0, price: 2, tags: ['cool', 'boss', 'good'], desc: '살얼음 동동 시원한 육수 한 모금이면 더위 끝.' },
  { id: 'bibim-naengmyeon', name: '비빔냉면', em: '🍝', kind: 'noodle', spicy: 2, price: 2, tags: ['cool', 'stress', 'two'], desc: '새콤달콤 매콤하게. 땀은 나도 시원해요.' },
  { id: 'kongguksu', name: '콩국수', em: '🥛', kind: 'noodle', spicy: 0, price: 2, tags: ['cool', 'tired', 'solo'], desc: '고소하고 시원한 여름 별미. 설탕파? 소금파?' },
  { id: 'soba', name: '메밀소바', em: '🥢', kind: 'noodle', spicy: 0, price: 2, tags: ['cool', 'solo', 'good'], desc: '쯔유에 콕 찍어 후루룩. 가볍고 깔끔하게.' },
  { id: 'pasta', name: '파스타', em: '🍝', kind: 'noodle', spicy: 0, price: 3, tags: ['good', 'two', 'boss'], desc: '오늘은 분위기 좀 내볼까요? 크림이냐 토마토냐.' },
  { id: 'jeyuk', name: '제육볶음', em: '🐷', kind: 'rice', spicy: 1, price: 1, tags: ['stress', 'group', 'solo'], desc: '직장인 점심 1순위. 쌈 싸 먹으면 기분이 좋아져요.' },
  { id: 'donkatsu', name: '돈까스', em: '🥩', kind: 'rice', spicy: 0, price: 2, tags: ['good', 'solo', 'two'], desc: '바삭바삭 겉바속촉. 기분 좋은 날엔 튀김이죠.' },
  { id: 'bibimbap', name: '비빔밥', em: '🥗', kind: 'rice', spicy: 1, price: 1, tags: ['cool', 'good', 'boss', 'solo'], desc: '나물 듬뿍, 고추장 한 숟갈. 건강하게 든든하게.' },
  { id: 'omurice', name: '오므라이스', em: '🍳', kind: 'rice', spicy: 0, price: 2, tags: ['good', 'tired', 'two'], desc: '폭신한 계란 이불 덮은 밥. 기분까지 몽글몽글.' },
  { id: 'curry', name: '카레', em: '🍛', kind: 'rice', spicy: 1, price: 1, tags: ['solo', 'tired', 'rain'], desc: '향긋한 카레 한 접시면 오후가 든든해요.' },
  { id: 'gyudon', name: '규동·덮밥', em: '🍱', kind: 'rice', spicy: 0, price: 2, tags: ['solo', 'tired', 'good'], desc: '빨리 먹고 쉬고 싶을 때 딱. 반숙 계란 추가!' },
  { id: 'sushi', name: '초밥', em: '🍣', kind: 'rice', spicy: 0, price: 3, tags: ['good', 'boss', 'cool', 'two'], desc: '오늘 고생한 나에게 주는 선물. 연어부터 먹을까요?' },
  { id: 'dakgalbi', name: '닭갈비', em: '🍗', kind: 'rice', spicy: 2, price: 2, tags: ['group', 'stress'], desc: '철판에 볶다가 마지막엔 볶음밥까지. 팀 점심 강추.' },
  { id: 'jjukkumi', name: '쭈꾸미볶음', em: '🐙', kind: 'rice', spicy: 2, price: 2, tags: ['stress', 'group', 'two'], desc: '매콤한 불맛에 쫄깃한 쭈꾸미. 스트레스 날리기 최고.' },
  { id: 'hoedeopbap', name: '회덮밥', em: '🐟', kind: 'rice', spicy: 1, price: 2, tags: ['cool', 'good', 'solo'], desc: '신선한 회에 초장 쓱쓱. 더운 날 입맛 살려줘요.' },
  { id: 'bossam', name: '보쌈 정식', em: '🥬', kind: 'rice', spicy: 0, price: 3, tags: ['group', 'boss', 'tired'], desc: '부드러운 수육에 김치 한 점. 상사님도 만족할 메뉴.' },
  { id: 'kimbap-ramyeon', name: '김밥+라면', em: '🍙', kind: 'quick', spicy: 1, price: 1, tags: ['solo', 'rain', 'tired'], desc: '분식집 국룰 조합. 빠르고 맛있고 저렴하고.' },
  { id: 'tteokbokki', name: '떡볶이', em: '🍢', kind: 'quick', spicy: 2, price: 1, tags: ['stress', 'two', 'group'], desc: '매콤달콤 떡볶이에 튀김 찍어 먹으면 스트레스 아웃.' },
  { id: 'sandwich', name: '샌드위치', em: '🥪', kind: 'quick', spicy: 0, price: 1, tags: ['solo', 'cool', 'good'], desc: '가볍게 먹고 산책까지. 점심시간을 알차게.' },
  { id: 'burger', name: '햄버거', em: '🍔', kind: 'quick', spicy: 0, price: 2, tags: ['stress', 'solo', 'two'], desc: '오늘은 칼로리 생각 안 하기. 감자튀김 라지로.' },
  { id: 'poke', name: '포케·샐러드', em: '🥙', kind: 'quick', spicy: 0, price: 2, tags: ['cool', 'good', 'solo'], desc: '가볍고 상큼하게. 오후에 졸리지 않아요.' },
  { id: 'dosirak', name: '편의점 도시락', em: '🏪', kind: 'quick', spicy: 0, price: 1, tags: ['solo', 'tired', 'rain'], desc: '바쁜 날의 구원투수. 남는 시간엔 낮잠 한숨.' },
];
