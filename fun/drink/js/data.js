// ==============================================
//  술메추 데이터: 질문과 메뉴 (술 + 안주 조합)
//  메뉴를 추가하려면 MENUS에 한 줄만 더 넣으면 됩니다.
//  q는 카카오맵에서 찾을 검색어예요.
//  질문 type과 선택지 필드(boost, avoid, why)는 ../assets/menu.js 맨 위 설명을 보세요.
// ==============================================
window.QUESTIONS = [
  { id: 'why', em: '🥂', text: '오늘 마시는 이유는?', type: 'tag', opts: [
    { key: 'party', em: '🎉', label: '축하할 일 있어요', boost: ['party'], why: '🎉 축하하는 날에 어울리는 조합이에요.' },
    { key: 'sad', em: '🥲', label: '위로가 필요해요', boost: ['comfort'], why: '🥲 오늘 같은 날엔 이게 위로가 돼요.' },
    { key: 'fri', em: '🕺', label: '불금이니까요', boost: ['fun'], why: '🕺 불금 분위기 제대로 살려줘요.' },
    { key: 'just', em: '😌', label: '그냥 한잔', boost: ['chill'], why: '😌 가볍게 한잔하기 좋아요.' },
  ] },
  { id: 'kind', em: '🍺', text: '당기는 술은?', type: 'kind', opts: [
    { key: 'soju', em: '🍶', label: '소주·소맥', why: '🍶 오늘은 역시 소주죠.' },
    { key: 'beer', em: '🍺', label: '맥주', why: '🍺 시원한 맥주 한잔이에요.' },
    { key: 'wine', em: '🍷', label: '와인·하이볼', why: '🍷 분위기 있게 한잔해요.' },
    { key: 'trad', em: '🍵', label: '막걸리·전통주', why: '🍵 전통주의 매력을 즐겨봐요.' },
  ] },
  { id: 'abv', em: '📈', text: '오늘 주량은?', type: 'level', field: 'abv', opts: [
    { key: 0, em: '🐣', label: '가볍게 한두 잔', why: '🐣 부담 없이 가볍게 마시기 좋아요.' },
    { key: 1, em: '🙂', label: '적당히' },
    { key: 2, em: '🔥', label: '오늘 달린다', why: '🔥 오늘 제대로 달릴 수 있는 조합이에요.' },
    { key: -1, em: '🤷', label: '분위기 봐서' },
  ] },
  { id: 'food', em: '🍢', text: '안주는 어떤 스타일?', type: 'tag', opts: [
    { key: 'meat', em: '🥩', label: '고기·든든하게', boost: ['meat'], why: '🥩 든든한 고기 안주예요.' },
    { key: 'soup', em: '🍲', label: '뜨끈한 국물', boost: ['soup'], why: '🍲 속 풀어주는 국물 안주예요.' },
    { key: 'fried', em: '🍤', label: '바삭한 튀김', boost: ['fried'], why: '🍤 바삭한 튀김 안주예요.' },
    { key: 'light', em: '🧀', label: '가볍게', boost: ['light'], why: '🧀 가볍게 집어 먹기 좋은 안주예요.' },
  ] },
  { id: 'with', em: '🧑‍🤝‍🧑', text: '누구랑 마셔요?', type: 'tag', opts: [
    { key: 'solo', em: '🙋', label: '혼술', why: '🙋 혼술하기에도 딱이에요.' },
    { key: 'date', em: '💑', label: '연인이랑', why: '💑 둘이 분위기 내기 좋아요.' },
    { key: 'friends', em: '👯', label: '친구들이랑', why: '👯 친구들이랑 왁자지껄 마시기 좋아요.' },
    { key: 'team', em: '👔', label: '회사 사람들', why: '👔 회식 자리에서 실패 없어요.' },
  ] },
  { id: 'budget', em: '💳', text: '1인 예산은?', type: 'budget', opts: [
    { key: 1, em: '🪙', label: '2만 원 이하', why: '🪙 지갑 걱정 없이 마실 수 있어요.' },
    { key: 2, em: '💵', label: '3~4만 원' },
    { key: 3, em: '💎', label: '오늘은 플렉스' },
    { key: 2.5, em: '🤔', label: '적당히' },
  ] },
];

// kind: soju | beer | wine | trad
// abv: 0(가볍게) ~ 2(독하게), price: 1(저렴) ~ 3(비싼 편)
// tags: party comfort fun chill(이유) meat soup fried light(안주) solo date friends team(누구랑)
window.MENUS = [
  { id: 'somaek-samgyeop', name: '소맥+삼겹살', q: '삼겹살', em: '🥓', kind: 'soju', abv: 1, price: 2, tags: ['team', 'friends', 'meat', 'fun', 'comfort'], desc: '황금 비율 소맥에 지글지글 삼겹살. 회식의 정석.' },
  { id: 'soju-gopchang', name: '소주+곱창', q: '곱창', em: '🔥', kind: 'soju', abv: 2, price: 3, tags: ['friends', 'date', 'meat', 'fun'], desc: '고소한 곱창에 소주 한잔. 볶음밥까지 필수 코스.' },
  { id: 'soju-hoe', name: '소주+모둠회', q: '횟집', em: '🐟', kind: 'soju', abv: 2, price: 3, tags: ['team', 'friends', 'light', 'party'], desc: '싱싱한 회에 소주. 매운탕으로 마무리.' },
  { id: 'soju-dakbal', name: '소주+닭발', q: '닭발', em: '🌶️', kind: 'soju', abv: 2, price: 1, tags: ['friends', 'comfort', 'meat', 'fun'], desc: '불닭발에 주먹밥, 계란찜. 매운맛에 스트레스 날리기.' },
  { id: 'soju-odengtang', name: '소주+오뎅탕', q: '오뎅바', em: '🍢', kind: 'soju', abv: 1, price: 1, tags: ['solo', 'comfort', 'soup', 'chill'], desc: '뜨끈한 오뎅탕 국물에 소주 한 잔. 추운 날 최고.' },
  { id: 'soju-jjigae', name: '소주+김치찌개', q: '김치찌개', em: '🥘', kind: 'soju', abv: 1, price: 1, tags: ['solo', 'comfort', 'soup', 'chill'], desc: '퇴근길 혼술엔 얼큰한 찌개 하나면 충분해요.' },
  { id: 'soju-gamjatang', name: '소주+감자탕', q: '감자탕', em: '🦴', kind: 'soju', abv: 2, price: 1, tags: ['team', 'friends', 'soup', 'meat', 'comfort'], desc: '뼈 발라 먹으며 한잔 두잔. 해장까지 한 번에.' },
  { id: 'soju-pocha', name: '소주+포차 안주', q: '포차', em: '🏮', kind: 'soju', abv: 2, price: 1, tags: ['friends', 'fun', 'fried', 'soup'], desc: '계란말이, 똥집튀김, 우동. 포장마차 감성 그대로.' },
  { id: 'chimaek', name: '치맥', q: '치킨', em: '🍗', kind: 'beer', abv: 0, price: 2, tags: ['friends', 'date', 'fried', 'fun', 'party', 'solo'], desc: '치킨에 맥주, 설명이 필요 없는 조합.' },
  { id: 'pizza-beer', name: '맥주+피자', q: '피자', em: '🍕', kind: 'beer', abv: 0, price: 2, tags: ['friends', 'party', 'fried', 'fun'], desc: '치즈 듬뿍 피자에 시원한 생맥주. 영화 한 편 곁들이면 완벽.' },
  { id: 'meoktae', name: '생맥+먹태', q: '호프', em: '🐟', kind: 'beer', abv: 0, price: 1, tags: ['team', 'friends', 'light', 'chill'], desc: '청양마요에 콕 찍는 먹태. 맥주가 술술 들어가요.' },
  { id: 'craft-beer', name: '수제맥주+감자튀김', q: '수제맥주', em: '🍺', kind: 'beer', abv: 1, price: 2, tags: ['date', 'friends', 'fried', 'chill'], desc: 'IPA부터 스타우트까지 골라 마시는 재미.' },
  { id: 'pyeonmaek', name: '편맥', q: '편의점', em: '🏪', kind: 'beer', abv: 0, price: 1, tags: ['solo', 'friends', 'light', 'chill'], desc: '편의점 앞 파라솔에서 4캔 만 원. 가성비 최고.' },
  { id: 'sangmaek-tangsu', name: '맥주+탕수육', q: '중국집', em: '🥡', kind: 'beer', abv: 0, price: 2, tags: ['friends', 'team', 'fried', 'party'], desc: '바삭한 탕수육에 맥주. 고량주 한 잔 곁들여도 좋아요.' },
  { id: 'wine-cheese', name: '와인+치즈 플래터', q: '와인바', em: '🍷', kind: 'wine', abv: 1, price: 3, tags: ['date', 'party', 'light', 'chill'], desc: '분위기 좋은 와인바에서 치즈 한 조각, 와인 한 모금.' },
  { id: 'wine-pasta', name: '와인+파스타', q: '파스타', em: '🍝', kind: 'wine', abv: 1, price: 3, tags: ['date', 'party', 'meat'], desc: '데이트엔 역시 파스타와 하우스 와인.' },
  { id: 'highball-izakaya', name: '하이볼+꼬치', q: '이자카야', em: '🍢', kind: 'wine', abv: 1, price: 2, tags: ['friends', 'date', 'meat', 'fun'], desc: '시원한 하이볼에 숯불 꼬치. 이자카야 감성.' },
  { id: 'highball-karaage', name: '하이볼+가라아게', q: '이자카야', em: '🍤', kind: 'wine', abv: 0, price: 2, tags: ['solo', 'friends', 'fried', 'chill'], desc: '레몬 하이볼에 바삭한 일본식 닭튀김.' },
  { id: 'sake-sashimi', name: '사케+사시미', q: '이자카야', em: '🍶', kind: 'wine', abv: 2, price: 3, tags: ['date', 'party', 'light'], desc: '따뜻한 사케 한 잔에 두툼한 사시미.' },
  { id: 'cocktail', name: '칵테일', q: '칵테일바', em: '🍸', kind: 'wine', abv: 1, price: 3, tags: ['date', 'party', 'fun', 'light'], desc: '바텐더에게 오늘 기분을 말해보세요. 딱 맞는 한 잔이 나와요.' },
  { id: 'whisky', name: '위스키', q: '위스키바', em: '🥃', kind: 'wine', abv: 2, price: 3, tags: ['solo', 'chill', 'comfort', 'light'], desc: '조용한 바에서 위스키 온더락. 오늘 하루를 정리하는 시간.' },
  { id: 'champagne', name: '샴페인+디저트', q: '와인바', em: '🍾', kind: 'wine', abv: 1, price: 3, tags: ['party', 'date', 'light'], desc: '축하할 땐 샴페인 뻥! 오늘의 주인공은 바로 나.' },
  { id: 'makgeolli-pajeon', name: '막걸리+파전', q: '파전', em: '🥞', kind: 'trad', abv: 0, price: 1, tags: ['friends', 'comfort', 'fried', 'chill'], desc: '비 오는 날엔 지글지글 파전에 막걸리 한 사발.' },
  { id: 'makgeolli-bossam', name: '막걸리+보쌈', q: '보쌈', em: '🥬', kind: 'trad', abv: 0, price: 2, tags: ['team', 'friends', 'meat'], desc: '부드러운 보쌈에 시원한 막걸리. 어른들도 좋아해요.' },
  { id: 'makgeolli-dotori', name: '동동주+도토리묵', q: '전통주점', em: '🍵', kind: 'trad', abv: 0, price: 1, tags: ['chill', 'light', 'friends'], desc: '새콤한 도토리묵 무침에 달큰한 동동주.' },
  { id: 'trad-liquor', name: '전통주+한식 안주', q: '전통주점', em: '🏺', kind: 'trad', abv: 1, price: 3, tags: ['date', 'party', 'light'], desc: '요즘 핫한 전통주 바에서 색다른 한 잔.' },
  { id: 'gaoliang-yang', name: '고량주+양꼬치', q: '양꼬치', em: '🍢', kind: 'trad', abv: 2, price: 2, tags: ['friends', 'team', 'meat', 'fun'], desc: '쯔란 듬뿍 양꼬치에 고량주 한 잔. 칭따오로 시작해도 OK.' },
  { id: 'nonalcohol', name: '무알콜 맥주+안주', q: '호프', em: '🫧', kind: 'beer', abv: 0, price: 1, tags: ['solo', 'chill', 'light'], desc: '분위기는 내고 싶은데 내일이 걱정될 땐 무알콜로.' },
];
