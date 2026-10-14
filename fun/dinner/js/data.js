// ==============================================
//  저메추 데이터: 질문과 메뉴
//  메뉴를 추가하려면 MENUS에 한 줄만 더 넣으면 됩니다.
//  질문 type과 선택지 필드(boost, avoid, why)는 ../assets/menu.js 맨 위 설명을 보세요.
// ==============================================
window.QUESTIONS = [
  { id: 'day', em: '🗓️', text: '오늘 하루 어땠어요?', type: 'tag', opts: [
    { key: 'hard', em: '😵', label: '야근각, 힘들었어요', boost: ['hard'], why: '😵 고생한 오늘, 이 정도는 먹어야죠.' },
    { key: 'happy', em: '🥳', label: '좋은 일 있었어요', boost: ['party'], why: '🥳 기분 좋은 날엔 역시 이 메뉴예요.' },
    { key: 'lazy', em: '🛋️', label: '그냥 집에서 쉬고 싶어요', boost: ['delivery'], why: '🛋️ 집에서 배달로 편하게 먹기 좋아요.' },
    { key: 'normal', em: '😐', label: '평범했어요', boost: [] },
  ] },
  { id: 'kind', em: '🍽️', text: '오늘 저녁 당기는 건?', type: 'kind', opts: [
    { key: 'meat', em: '🥩', label: '고기!', why: '🥩 당기던 고기 메뉴예요.' },
    { key: 'stew', em: '🍲', label: '국물·찜', why: '🍲 뜨끈한 국물·찜 메뉴예요.' },
    { key: 'flour', em: '🍕', label: '면·밀가루', why: '🍕 밀가루는 진리죠.' },
    { key: 'light', em: '🥗', label: '가볍게', soft: true, why: '🥗 부담 없이 가볍게 먹을 수 있어요.' },
  ] },
  { id: 'spicy', em: '🌶️', text: '매운 건 어때요?', type: 'level', field: 'spicy', opts: [
    { key: 2, em: '🔥', label: '화끈하게', why: '🔥 원하던 화끈한 매운맛이에요.' },
    { key: 1, em: '🌶️', label: '살짝만' },
    { key: 0, em: '🙅', label: '안 매운 거' },
    { key: -1, em: '🤷', label: '상관없어요' },
  ] },
  { id: 'with', em: '🧑‍🤝‍🧑', text: '누구랑 먹어요?', type: 'tag', opts: [
    { key: 'solo', em: '🙋', label: '혼자', why: '🙋 혼자 먹기에도 부담 없어요.' },
    { key: 'date', em: '💑', label: '연인·친구랑', why: '💑 둘이 먹기 딱 좋은 메뉴예요.' },
    { key: 'family', em: '👨‍👩‍👧', label: '가족이랑', why: '👨‍👩‍👧 온 가족이 좋아하는 메뉴예요.' },
    { key: 'team', em: '🍻', label: '회식', why: '🍻 회식 메뉴로 실패 없어요.' },
  ] },
  { id: 'budget', em: '💳', text: '1인 예산은?', type: 'budget', opts: [
    { key: 1, em: '🪙', label: '1.5만 원 이하', why: '🪙 지갑 걱정 없이 먹을 수 있어요.' },
    { key: 2, em: '💵', label: '2~3만 원' },
    { key: 3, em: '💎', label: '오늘은 플렉스' },
    { key: 2.5, em: '🤔', label: '적당히' },
  ] },
  { id: 'diet', em: '⚖️', text: '오늘 칼로리는...', type: 'tag', opts: [
    { key: 'cheat', em: '😈', label: '내일의 내가 하겠지', boost: ['heavy'], why: '😈 오늘만큼은 칼로리 생각 금지!' },
    { key: 'care', em: '🥦', label: '조금은 신경 쓸래요', boost: ['healthy'], avoid: ['heavy'], why: '🥦 맛있는데 부담도 덜해요.' },
    { key: 'any', em: '🤷', label: '상관없어요', boost: [] },
    { key: 'full', em: '🍚', label: '배만 부르면 돼요', boost: ['filling'], why: '🍚 배부르게 먹을 수 있어요.' },
  ] },
];

// kind: meat | stew | flour | light
// spicy: 0~2, price: 1(1.5만 원 이하) ~ 3(비싼 편)
// tags: hard party delivery(오늘 하루) solo date family team(누구랑) heavy healthy filling(칼로리)
window.MENUS = [
  { id: 'samgyeopsal', name: '삼겹살', em: '🥓', kind: 'meat', spicy: 0, price: 2, tags: ['team', 'family', 'hard', 'heavy', 'filling'], desc: '지글지글 삼겹살에 소주 한잔. 한국인의 저녁 국룰.' },
  { id: 'chicken', name: '치킨', em: '🍗', kind: 'meat', spicy: 0, price: 2, tags: ['delivery', 'party', 'date', 'family', 'heavy'], desc: '반반 무 많이. 오늘 하루 고생했으니 1인 1닭도 OK.' },
  { id: 'jokbal', name: '족발', em: '🐷', kind: 'meat', spicy: 0, price: 3, tags: ['delivery', 'family', 'team', 'filling'], desc: '쫀득한 족발에 막국수 추가. 야식으로도 최고.' },
  { id: 'bossam', name: '보쌈', em: '🥬', kind: 'meat', spicy: 0, price: 3, tags: ['family', 'delivery', 'healthy', 'filling'], desc: '부드러운 수육에 김치 한 점. 기름기 쏙 빠져서 담백해요.' },
  { id: 'gopchang', name: '곱창', em: '🔥', kind: 'meat', spicy: 1, price: 3, tags: ['team', 'date', 'hard', 'heavy'], desc: '고소한 곱이 톡 터지는 맛. 마지막은 볶음밥으로.' },
  { id: 'galbi', name: '소갈비', em: '🍖', kind: 'meat', spicy: 0, price: 3, tags: ['family', 'party', 'filling'], desc: '좋은 날엔 갈비지. 달짝지근한 양념에 밥 한 공기 뚝딱.' },
  { id: 'steak', name: '스테이크', em: '🥩', kind: 'meat', spicy: 0, price: 3, tags: ['date', 'party'], desc: '분위기 내고 싶은 날. 미디엄 레어로 부탁해요.' },
  { id: 'yangkkochi', name: '양꼬치', em: '🍢', kind: 'meat', spicy: 1, price: 2, tags: ['team', 'date', 'party'], desc: '쯔란 콕 찍어 먹는 양꼬치에 칭따오 한 병.' },
  { id: 'dakgalbi', name: '닭갈비', em: '🍳', kind: 'meat', spicy: 2, price: 2, tags: ['date', 'team', 'filling'], desc: '매콤한 닭갈비 먹고 볶음밥까지 야무지게.' },
  { id: 'jjimdak', name: '찜닭', em: '🍗', kind: 'stew', spicy: 1, price: 2, tags: ['delivery', 'date', 'family', 'filling'], desc: '달콤짭짤한 간장 양념에 당면이 듬뿍.' },
  { id: 'dakbokkeumtang', name: '닭볶음탕', em: '🥘', kind: 'stew', spicy: 2, price: 2, tags: ['family', 'hard', 'filling'], desc: '칼칼한 국물에 감자 으깨서 밥 비비면 끝.' },
  { id: 'agujjim', name: '아구찜', em: '🐟', kind: 'stew', spicy: 2, price: 3, tags: ['family', 'team', 'healthy'], desc: '매콤한 콩나물에 쫄깃한 아구살. 어른들도 좋아해요.' },
  { id: 'haemultang', name: '해물탕', em: '🦀', kind: 'stew', spicy: 1, price: 3, tags: ['family', 'party', 'healthy'], desc: '해물이 산더미처럼. 시원한 국물이 끝내줘요.' },
  { id: 'shabu', name: '샤브샤브', em: '🍲', kind: 'stew', spicy: 0, price: 2, tags: ['date', 'family', 'healthy'], desc: '야채랑 고기 살짝 데쳐서. 마지막 칼국수까지 완벽.' },
  { id: 'hotpot', name: '훠궈', em: '🌶️', kind: 'stew', spicy: 2, price: 3, tags: ['date', 'party', 'team'], desc: '백탕 홍탕 반반으로. 얼얼한 맛에 스트레스 아웃.' },
  { id: 'gamjatang', name: '감자탕', em: '🦴', kind: 'stew', spicy: 1, price: 1, tags: ['team', 'hard', 'filling'], desc: '뼈 발라 먹다 보면 하루 피로가 싹.' },
  { id: 'budae', name: '부대찌개', em: '🍳', kind: 'stew', spicy: 1, price: 1, tags: ['date', 'solo', 'filling'], desc: '햄, 소시지, 라면사리. 밥도둑 그 자체.' },
  { id: 'kimchi-jjigae', name: '김치찌개', em: '🥘', kind: 'stew', spicy: 2, price: 1, tags: ['solo', 'hard', 'filling'], desc: '집밥이 그리울 땐 김치찌개 한 그릇.' },
  { id: 'maratang', name: '마라샹궈', em: '🥵', kind: 'stew', spicy: 2, price: 2, tags: ['date', 'hard', 'heavy'], desc: '내 맘대로 골라 볶는 마라샹궈. 꿔바로우 추가 필수.' },
  { id: 'pizza', name: '피자', em: '🍕', kind: 'flour', spicy: 0, price: 2, tags: ['delivery', 'party', 'family', 'heavy'], desc: '치즈 쭉 늘어나는 피자 한 판. 콜라는 필수.' },
  { id: 'pasta', name: '파스타', em: '🍝', kind: 'flour', spicy: 0, price: 2, tags: ['date', 'party'], desc: '분위기 좋은 곳에서 파스타 한 접시. 와인도 한잔?' },
  { id: 'jjajang-tangsuyuk', name: '짜장+탕수육', em: '🥡', kind: 'flour', spicy: 0, price: 1, tags: ['delivery', 'family', 'filling'], desc: '부먹 찍먹 논쟁은 잠시 접어두고. 배달 국룰 세트.' },
  { id: 'tteokbokki', name: '떡볶이', em: '🍢', kind: 'flour', spicy: 2, price: 1, tags: ['delivery', 'solo', 'hard', 'date'], desc: '엽떡에 주먹밥, 튀김까지. 스트레스엔 매운 떡볶이.' },
  { id: 'ramen', name: '라멘', em: '🍜', kind: 'flour', spicy: 0, price: 1, tags: ['solo', 'date'], desc: '진한 국물에 차슈 한 장. 혼밥하기에도 딱.' },
  { id: 'burger', name: '수제버거', em: '🍔', kind: 'flour', spicy: 0, price: 2, tags: ['solo', 'date', 'heavy'], desc: '육즙 가득 패티에 감자튀김. 오늘은 미국 스타일.' },
  { id: 'kalguksu', name: '칼국수+보쌈', em: '🍜', kind: 'flour', spicy: 0, price: 1, tags: ['family', 'filling'], desc: '칼국수에 보쌈 한 접시 곁들이면 든든하게 끝.' },
  { id: 'sushi', name: '초밥', em: '🍣', kind: 'light', spicy: 0, price: 3, tags: ['date', 'party', 'healthy'], desc: '오늘 고생한 나에게 주는 선물. 연어부터 먹을까요?' },
  { id: 'hoe', name: '모둠회', em: '🐟', kind: 'light', spicy: 0, price: 3, tags: ['team', 'family', 'party', 'healthy'], desc: '싱싱한 회 한 접시에 매운탕까지. 깔끔하게 즐기기.' },
  { id: 'pho', name: '쌀국수', em: '🍲', kind: 'light', spicy: 0, price: 1, tags: ['solo', 'date', 'healthy'], desc: '깔끔한 국물로 속 편하게. 월남쌈도 같이?' },
  { id: 'salad', name: '포케·샐러드', em: '🥗', kind: 'light', spicy: 0, price: 1, tags: ['solo', 'healthy'], desc: '내일을 위해 가볍게. 그래도 단백질은 듬뿍.' },
  { id: 'gimbap', name: '김밥+라면', em: '🍙', kind: 'light', spicy: 1, price: 1, tags: ['solo', 'delivery', 'filling'], desc: '빠르고 저렴하게 한 끼 해결. 분식은 언제나 옳다.' },
  { id: 'convenience', name: '편의점 털기', em: '🏪', kind: 'light', spicy: 0, price: 1, tags: ['solo', 'delivery'], desc: '삼각김밥, 컵라면, 디저트까지. 나만의 조합 만들기.' },
  { id: 'naengmyeon', name: '냉면+고기', em: '🧊', kind: 'light', spicy: 0, price: 2, tags: ['family', 'date'], desc: '시원한 냉면에 숯불 고기 몇 점. 여름 저녁 최고 조합.' },
];
