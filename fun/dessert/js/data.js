// ==============================================
//  디메추 데이터: 질문과 메뉴
//  메뉴를 추가하려면 MENUS에 한 줄만 더 넣으면 됩니다.
//  질문 type과 선택지 필드(boost, avoid, why)는 ../assets/menu.js 맨 위 설명을 보세요.
// ==============================================
window.QUESTIONS = [
  { id: 'mood', em: '🙂', text: '지금 기분은요?', type: 'tag', opts: [
    { key: 'happy', em: '😊', label: '좋아요', boost: ['happy'], why: '기분 좋은 날 더 달달하게.' },
    { key: 'sad', em: '🥺', label: '위로가 필요해요', boost: ['comfort'], why: '지친 마음을 달달하게 위로해줘요.' },
    { key: 'sleepy', em: '😪', label: '당 떨어졌어요', boost: ['sugar'], why: '당 충전 확실하게 해줘요.' },
    { key: 'meh', em: '😐', label: '그냥 입이 심심해요', boost: ['snack'], why: '심심한 입을 달래기 딱 좋아요.' },
  ] },
  { id: 'kind', em: '🍰', text: '어떤 맛이 당겨요?', type: 'kind', opts: [
    { key: 'sweet', em: '🍫', label: '진한 달달함', why: '당기던 진한 단맛이에요.' },
    { key: 'fresh', em: '🍓', label: '상큼 과일', why: '상큼한 과일 맛이에요.' },
    { key: 'nutty', em: '🥜', label: '고소한 맛', why: '고소한 맛이 일품이에요.' },
    { key: 'cold', em: '🍧', label: '시원한 거', why: '시원하게 즐기는 디저트예요.' },
  ] },
  { id: 'texture', em: '🤏', text: '좋아하는 식감은?', type: 'tag', opts: [
    { key: 'soft', em: '☁️', label: '부드러운', why: '입에서 사르르 녹는 식감이에요.' },
    { key: 'chewy', em: '🍡', label: '쫀득한', why: '쫀득쫀득한 식감이 매력이에요.' },
    { key: 'crispy', em: '🥐', label: '바삭한', why: '바삭한 식감이 살아있어요.' },
    { key: 'moist', em: '🍰', label: '촉촉한', why: '촉촉한 식감이 좋아요.' },
  ] },
  { id: 'when', em: '⏰', text: '언제 먹을 거예요?', type: 'tag', opts: [
    { key: 'cafe', em: '☕', label: '카페에서 커피랑', boost: ['coffee'], why: '커피랑 찰떡궁합이에요.' },
    { key: 'walk', em: '🚶', label: '걸으면서 간식으로', boost: ['street'], why: '들고 다니며 먹기 편해요.' },
    { key: 'after', em: '🍽️', label: '밥 먹고 후식으로', boost: ['after'], why: '식후 디저트로 딱이에요.' },
    { key: 'home', em: '🏠', label: '집에서 배달로', boost: ['delivery'], why: '집에서 배달로 즐기기 좋아요.' },
  ] },
  { id: 'budget', em: '💳', text: '예산은요?', type: 'budget', opts: [
    { key: 1, em: '🪙', label: '5천 원 이하', why: '가볍게 사 먹기 좋은 가격이에요.' },
    { key: 2, em: '💵', label: '만 원 안쪽' },
    { key: 3, em: '💎', label: '오늘은 플렉스' },
    { key: 2.5, em: '🤔', label: '적당히' },
  ] },
  { id: 'trend', em: '✨', text: '요즘 유행하는 거?', type: 'tag', opts: [
    { key: 'hot', em: '🔥', label: '요즘 핫한 걸로', boost: ['trend'], w: 4, why: '요즘 SNS에서 핫한 디저트예요.' },
    { key: 'classic', em: '👵', label: '아는 맛이 최고', boost: ['classic'], w: 4, why: '검증된 아는 맛이에요.' },
    { key: 'any', em: '🤷', label: '상관없어요', boost: [] },
    { key: 'kr', em: '🇰🇷', label: '한국 디저트', boost: ['korean'], w: 5, why: '한국 디저트의 매력을 느껴보세요.' },
  ] },
];

// kind: sweet | fresh | nutty | cold
// price: 1(5천 원 이하) ~ 3(비싼 편)
// tags: happy comfort sugar snack(기분) soft chewy crispy moist(식감) coffee street after delivery(언제) trend classic korean
window.MENUS = [
  { id: 'macaron', name: '마카롱', em: '🍬', kind: 'sweet', price: 1, tags: ['happy', 'chewy', 'coffee', 'classic'], desc: '쫀득한 꼬끄에 꾸덕한 필링. 하나만 먹긴 아쉬워요.' },
  { id: 'croffle', name: '크로플', em: '🧇', kind: 'sweet', price: 2, tags: ['crispy', 'coffee', 'snack', 'trend'], desc: '겉은 바삭 속은 쫀득. 아이스크림 올리면 반칙.' },
  { id: 'strawberry-cake', name: '딸기 생크림 케이크', em: '🍰', kind: 'fresh', price: 2, tags: ['happy', 'soft', 'moist', 'coffee', 'classic'], desc: '폭신한 시트에 생크림, 딸기 듬뿍. 기념일이 아니어도 괜찮아요.' },
  { id: 'tiramisu', name: '티라미수', em: '☕', kind: 'sweet', price: 2, tags: ['comfort', 'soft', 'coffee', 'after', 'classic'], desc: '쌉싸름한 커피와 마스카포네의 조화. 어른의 디저트.' },
  { id: 'bingsu', name: '빙수', em: '🍧', kind: 'cold', price: 3, tags: ['happy', 'soft', 'after', 'korean', 'classic'], desc: '눈꽃 얼음에 토핑 가득. 둘이 하나 시켜 나눠 먹기 좋아요.' },
  { id: 'patbingsu', name: '옛날 팥빙수', em: '🫘', kind: 'cold', price: 2, tags: ['comfort', 'chewy', 'korean', 'classic', 'after'], desc: '팥, 떡, 연유의 정석 조합. 아는 맛이 무서워요.' },
  { id: 'gelato', name: '젤라또', em: '🍨', kind: 'cold', price: 2, tags: ['happy', 'soft', 'street', 'after'], desc: '쫀득하고 진한 젤라또. 두 가지 맛으로 골라 보세요.' },
  { id: 'yoajeong', name: '요거트 아이스크림', em: '🍦', kind: 'cold', price: 3, tags: ['happy', 'soft', 'delivery', 'trend'], desc: '꾸덕한 요거트에 벌집꿀, 과일 토핑 무한 조합.' },
  { id: 'tanghulu', name: '탕후루', em: '🍡', kind: 'fresh', price: 1, tags: ['snack', 'crispy', 'street', 'trend'], desc: '와작 깨지는 설탕 코팅 속 상큼한 과일.' },
  { id: 'yakgwa', name: '약과', em: '🍪', kind: 'nutty', price: 1, tags: ['comfort', 'chewy', 'coffee', 'korean', 'trend'], desc: '꿀 머금은 쫀득한 약과. 할매니얼 감성 디저트.' },
  { id: 'bungeoppang', name: '붕어빵', em: '🐟', kind: 'nutty', price: 1, tags: ['snack', 'crispy', 'street', 'korean', 'classic', 'comfort'], desc: '팥이냐 슈크림이냐. 겨울 길거리의 행복.' },
  { id: 'hotteok', name: '호떡', em: '🥞', kind: 'sweet', price: 1, tags: ['comfort', 'chewy', 'street', 'korean', 'classic'], desc: '쫀득한 반죽 속 뜨거운 흑설탕 꿀. 입천장 조심!' },
  { id: 'waffle', name: '벨기에 와플', em: '🧇', kind: 'sweet', price: 1, tags: ['snack', 'crispy', 'street', 'classic'], desc: '바삭한 와플에 생크림, 시럽 듬뿍.' },
  { id: 'donut', name: '도넛', em: '🍩', kind: 'sweet', price: 1, tags: ['sugar', 'soft', 'coffee', 'classic'], desc: '커피 한 잔에 도넛 하나. 당 충전 완료.' },
  { id: 'churros', name: '츄러스', em: '🥖', kind: 'sweet', price: 1, tags: ['snack', 'crispy', 'street'], desc: '바삭한 츄러스를 초코 소스에 푹.' },
  { id: 'crepe', name: '크레페', em: '🌯', kind: 'fresh', price: 2, tags: ['happy', 'soft', 'street'], desc: '얇은 크레페에 과일과 생크림 돌돌.' },
  { id: 'pudding', name: '푸딩', em: '🍮', kind: 'sweet', price: 1, tags: ['comfort', 'soft', 'after', 'delivery'], desc: '탱글탱글 부드러운 커스터드 푸딩. 캐러멜 소스까지.' },
  { id: 'cookie', name: '르뱅 쿠키', em: '🍪', kind: 'sweet', price: 1, tags: ['sugar', 'chewy', 'coffee', 'delivery'], desc: '두툼하고 꾸덕한 쿠키. 반 잘라서 초코 폭포 감상.' },
  { id: 'dubai-cookie', name: '두바이 쫀득쿠키', em: '🟢', kind: 'nutty', price: 2, tags: ['chewy', 'trend', 'coffee', 'happy'], desc: '피스타치오 크림과 카다이프의 바삭 쫀득. 요즘 제일 핫해요.' },
  { id: 'financier', name: '휘낭시에', em: '🧈', kind: 'nutty', price: 1, tags: ['moist', 'coffee', 'snack'], desc: '버터 향 가득한 작은 구움과자. 커피랑 찰떡.' },
  { id: 'egg-tart', name: '에그타르트', em: '🥧', kind: 'sweet', price: 1, tags: ['crispy', 'soft', 'coffee', 'snack'], desc: '바삭한 페이스트리에 부드러운 커스터드.' },
  { id: 'brownie', name: '브라우니', em: '🟫', kind: 'sweet', price: 1, tags: ['sugar', 'moist', 'chewy', 'coffee', 'comfort'], desc: '꾸덕한 초콜릿 덩어리. 우울할 땐 초코가 약이에요.' },
  { id: 'basque', name: '바스크 치즈케이크', em: '🧀', kind: 'sweet', price: 2, tags: ['moist', 'soft', 'coffee', 'trend'], desc: '겉은 탄 듯 진하고 속은 꾸덕 촉촉.' },
  { id: 'saltbread', name: '소금빵', em: '🥐', kind: 'nutty', price: 1, tags: ['crispy', 'snack', 'coffee', 'trend'], desc: '버터가 녹아든 쫄깃한 빵에 소금 톡톡.' },
  { id: 'bagel', name: '베이글+크림치즈', em: '🥯', kind: 'nutty', price: 1, tags: ['chewy', 'coffee', 'snack', 'trend'], desc: '쫄깃한 베이글에 크림치즈 듬뿍. 줄 서서 먹는 맛.' },
  { id: 'injeolmi', name: '인절미', em: '🍡', kind: 'nutty', price: 1, tags: ['chewy', 'korean', 'classic', 'after'], desc: '콩고물 묻힌 쫀득한 떡. 고소함의 끝판왕.' },
  { id: 'bubbletea', name: '버블티', em: '🧋', kind: 'cold', price: 1, tags: ['sugar', 'chewy', 'street', 'delivery', 'classic'], desc: '쫀득한 타피오카 펄. 당도는 50%로 타협해요.' },
  { id: 'fruit-tart', name: '과일 타르트', em: '🍓', kind: 'fresh', price: 2, tags: ['happy', 'crispy', 'coffee'], desc: '알록달록 생과일이 올라간 타르트. 보기만 해도 기분 좋아요.' },
  { id: 'hwachae', name: '수박 화채', em: '🍉', kind: 'fresh', price: 1, tags: ['happy', 'after', 'korean', 'classic'], desc: '수박에 사이다 콸콸. 여름엔 역시 화채.' },
  { id: 'madeleine', name: '마들렌', em: '🐚', kind: 'nutty', price: 1, tags: ['moist', 'soft', 'coffee', 'classic'], desc: '레몬 향 살짝 나는 촉촉한 조개 모양 구움과자.' },
  { id: 'scone', name: '스콘', em: '🍞', kind: 'nutty', price: 1, tags: ['crispy', 'coffee', 'classic'], desc: '겉바속촉 스콘에 클로티드 크림과 잼.' },
  { id: 'shaved-ice-cream', name: '소프트 아이스크림', em: '🍦', kind: 'cold', price: 1, tags: ['snack', 'soft', 'street', 'classic', 'after'], desc: '부드럽게 말아 올린 소프트콘. 가성비 최고 디저트.' },
];
