// data.js — Mock orders, menu, reviews, agent logs
// Global window data used across the app.

const MOCK_ORDERS = [
  {
    id: "SD-2411",
    shortId: "2411",
    channel: "agent", // agent | direct | phone
    agentName: "Claude Desktop",
    customer: { name: "김민정", phone: "010-•••-4821", tier: "단골 · 14회차" },
    items: [
      { name: "트러플 크림 파스타", qty: 1, price: 23000, options: ["면 덜 익혀주세요", "치즈 추가"] },
      { name: "시저 샐러드", qty: 1, price: 14000, options: [] },
      { name: "탄산수", qty: 2, price: 4000, options: [] },
    ],
    total: 45000,
    type: "delivery", // delivery | pickup | dinein
    address: "서울 성동구 성수동2가 12-3, 301호",
    distance: "1.2km",
    etaMin: 24,
    placedAt: "방금 전",
    placedAgo: 0,
    status: "new",
    agentRationale: "고객이 '크림 파스타 + 샐러드 조합 추천' 요청 → 트러플 크림 파스타를 추천(평점 4.8, 리뷰 내 '가성비 우수' 다수 언급). 유당 민감 프로필 없음.",
    agentChat: [
      { role: "customer", time: "19:42", text: "오늘 저녁으로 크림 파스타랑 어울리는 샐러드 추천해줘. 배달 가능하면 좋겠어." },
      { role: "agent", time: "19:42", text: "소담에서 '트러플 크림 파스타'를 추천드려요. 최근 리뷰 48건 중 42건이 4점 이상이고, 시저 샐러드와 페어링이 좋다는 의견이 많아요. 탄산수 포함해서 45,000원이에요." },
      { role: "customer", time: "19:43", text: "좋아. 면은 덜 익혀주시고, 치즈는 더 얹어줘." },
      { role: "agent", time: "19:43", text: "주방에 '면 알덴테', '치즈 추가' 요청 전달 드릴게요. 현재 주문량 기준 예상 24분 후 도착입니다. 주문 확정 도와드릴까요?" },
      { role: "customer", time: "19:44", text: "응, 확정." },
      { role: "agent", time: "19:44", text: "주문이 전달되었습니다. 사장님께서 수락하시면 알림을 드릴게요." },
    ],
  },
  {
    id: "SD-2410",
    shortId: "2410",
    channel: "agent",
    agentName: "ChatGPT",
    customer: { name: "이재훈", phone: "010-•••-7203", tier: "신규" },
    items: [
      { name: "부라타 카프레제", qty: 1, price: 19000, options: [] },
      { name: "라구 탈리아텔레", qty: 1, price: 22000, options: ["덜 맵게"] },
    ],
    total: 41000,
    type: "pickup",
    address: "매장 픽업",
    distance: "—",
    etaMin: 18,
    placedAt: "2분 전",
    placedAgo: 2,
    status: "new",
    agentRationale: "신규 고객. '가벼운 전채 + 메인' 요청으로 부라타 추천(계절 한정 메뉴 · 재고 7/10). 매운 음식 선호도 '중간' 프로필로 라구 덜 맵게 자동 조정.",
    agentChat: [
      { role: "customer", time: "19:38", text: "처음 주문인데 뭐 맛있어?" },
      { role: "agent", time: "19:38", text: "부라타 카프레제(계절 한정)가 첫 방문 고객분들께 좋은 반응을 얻고 있어요. 메인은 라구 탈리아텔레 추천드려요." },
    ],
  },
  {
    id: "SD-2409",
    shortId: "2409",
    channel: "direct",
    customer: { name: "박서연", phone: "010-•••-5502", tier: "VIP · 42회차" },
    items: [
      { name: "셰프 코스 (2인)", qty: 1, price: 168000, options: ["와인 페어링", "알러지: 갑각류"] },
    ],
    total: 168000,
    type: "dinein",
    address: "5번 테이블",
    distance: "매장 홀",
    etaMin: 0,
    placedAt: "6분 전",
    placedAgo: 6,
    status: "accepted",
    agentRationale: null,
    agentChat: [],
  },
  {
    id: "SD-2408",
    shortId: "2408",
    channel: "agent",
    agentName: "Claude Desktop",
    customer: { name: "최유나", phone: "010-•••-9123", tier: "단골 · 7회차" },
    items: [
      { name: "마르게리타 피자", qty: 1, price: 17000, options: [] },
      { name: "글라스 와인 (화이트)", qty: 2, price: 9000, options: [] },
    ],
    total: 35000,
    type: "delivery",
    address: "서울 성동구 서울숲길 37, 502호",
    distance: "2.4km",
    etaMin: 12,
    placedAt: "11분 전",
    placedAgo: 11,
    status: "cooking",
    agentRationale: "과거 주문 패턴: 금요일 저녁 와인 + 피자 2회 반복 → 동일 조합 우선 노출.",
    agentChat: [],
  },
  {
    id: "SD-2407",
    shortId: "2407",
    channel: "agent",
    agentName: "Perplexity",
    customer: { name: "한지원", phone: "010-•••-3340", tier: "단골 · 5회차" },
    items: [
      { name: "봉골레 파스타", qty: 1, price: 21000, options: ["파슬리 빼주세요"] },
      { name: "감자 수프", qty: 1, price: 11000, options: [] },
    ],
    total: 32000,
    type: "delivery",
    address: "서울 성동구 왕십리로 83",
    distance: "0.8km",
    etaMin: 8,
    placedAt: "18분 전",
    placedAgo: 18,
    status: "cooking",
    agentRationale: null,
    agentChat: [],
  },
  {
    id: "SD-2406",
    shortId: "2406",
    channel: "direct",
    customer: { name: "정우성", phone: "010-•••-1188", tier: "단골 · 9회차" },
    items: [
      { name: "뇨끼 고르곤졸라", qty: 2, price: 19000, options: [] },
    ],
    total: 38000,
    type: "pickup",
    address: "매장 픽업",
    distance: "—",
    etaMin: 4,
    placedAt: "22분 전",
    placedAgo: 22,
    status: "ready",
    agentRationale: null,
    agentChat: [],
  },
  {
    id: "SD-2405",
    shortId: "2405",
    channel: "agent",
    agentName: "Claude Desktop",
    customer: { name: "강현우", phone: "010-•••-6679", tier: "신규" },
    items: [
      { name: "라자냐", qty: 1, price: 19000, options: [] },
      { name: "티라미수", qty: 1, price: 8000, options: [] },
    ],
    total: 27000,
    type: "delivery",
    address: "서울 성동구 아차산로 101",
    distance: "3.1km",
    etaMin: 0,
    placedAt: "34분 전",
    placedAgo: 34,
    status: "delivering",
    courier: { name: "최성호", rating: 4.9, phone: "010-•••-2020", etaMin: 6 },
    agentRationale: null,
    agentChat: [],
  },
  {
    id: "SD-2404",
    shortId: "2404",
    channel: "agent",
    agentName: "ChatGPT",
    customer: { name: "윤서진", phone: "010-•••-4412", tier: "단골 · 22회차" },
    items: [
      { name: "까르보나라", qty: 1, price: 19000, options: [] },
      { name: "가든 샐러드", qty: 1, price: 12000, options: [] },
      { name: "에스프레소", qty: 1, price: 5000, options: [] },
    ],
    total: 36000,
    type: "delivery",
    address: "서울 성동구 뚝섬로 15",
    distance: "1.7km",
    etaMin: 0,
    placedAt: "52분 전",
    placedAgo: 52,
    status: "completed",
    agentRationale: null,
    agentChat: [],
  },
];

const MENU_CATEGORIES = [
  { id: "anti", name: "안티파스티", count: 6 },
  { id: "pasta", name: "파스타", count: 9, active: true },
  { id: "pizza", name: "피자", count: 5 },
  { id: "main", name: "메인", count: 7 },
  { id: "dessert", name: "디저트", count: 4 },
  { id: "drink", name: "음료", count: 11 },
];

const MENU_ITEMS = [
  { id: 1, name: "트러플 크림 파스타", desc: "검은 송로 오일, 판체타, 파르미지아노 레지아노", price: 23000, stock: "available", rating: 4.8, orders: 142, popular: true, aiFeatured: true, img: "pasta-1" },
  { id: 2, name: "봉골레 파스타", desc: "바지락, 화이트와인, 이탈리안 파슬리", price: 21000, stock: "low", stockCount: 3, rating: 4.6, orders: 98, img: "pasta-2" },
  { id: 3, name: "라구 탈리아텔레", desc: "6시간 숙성 미트 라구, 수제 탈리아텔레", price: 22000, stock: "available", rating: 4.9, orders: 120, popular: true, img: "pasta-3" },
  { id: 4, name: "까르보나라", desc: "관찰레, 페코리노 로마노, 달걀 노른자", price: 19000, stock: "available", rating: 4.7, orders: 167, img: "pasta-4" },
  { id: 5, name: "뇨끼 고르곤졸라", desc: "수제 감자 뇨끼, 고르곤졸라 크림", price: 19000, stock: "sold_out", rating: 4.5, orders: 64, img: "pasta-5" },
  { id: 6, name: "라자냐", desc: "6겹 라자냐, 베샤멜, 토마토 라구", price: 19000, stock: "available", rating: 4.4, orders: 82, img: "pasta-6" },
];

const REVIEWS = [
  { id: 1, author: "박서연", time: "3시간 전", rating: 5, text: "코스 메뉴 훌륭합니다. 와인 페어링 설명도 자세했어요. 알러지 미리 체크해주신 부분도 좋았어요.", via: "direct", tag: "홀", reply: null },
  { id: 2, author: "김민정", time: "어제", rating: 5, text: "에이전트 추천대로 주문했는데 대만족. 트러플 파스타 진하고 양도 충분.", via: "agent", tag: "Claude", reply: "늘 방문해주셔서 감사합니다. 다음에도 좋은 추천 이어갈게요 🙇" },
  { id: 3, author: "이재훈", time: "어제", rating: 4, text: "부라타는 최고였는데 라구가 조금 짰어요. 전체적으론 만족.", via: "agent", tag: "ChatGPT", reply: null },
  { id: 4, author: "한지원", time: "2일 전", rating: 5, text: "봉골레 국물이 정말 깊음. 파슬리 빼달라는 요청 반영 감사합니다.", via: "agent", tag: "Perplexity", reply: "요청사항 꼭 확인하고 있어요 🌿" },
  { id: 5, author: "최유나", time: "3일 전", rating: 5, text: "금요일 저녁 와인 한 잔 생각날 때마다 주문해요.", via: "agent", tag: "Claude", reply: null },
];

const AGENT_TRAFFIC = [
  { day: "월", direct: 18, agent: 42 },
  { day: "화", direct: 22, agent: 51 },
  { day: "수", direct: 19, agent: 58 },
  { day: "목", direct: 24, agent: 61 },
  { day: "금", direct: 31, agent: 78 },
  { day: "토", direct: 36, agent: 92 },
  { day: "일", direct: 29, agent: 74 },
];

const HOURLY_SALES = [
  { h: "11", v: 120 }, { h: "12", v: 310 }, { h: "13", v: 280 }, { h: "14", v: 140 },
  { h: "15", v: 80 }, { h: "16", v: 110 }, { h: "17", v: 190 }, { h: "18", v: 420 },
  { h: "19", v: 580 }, { h: "20", v: 640 }, { h: "21", v: 490 }, { h: "22", v: 220 },
];

const MCP_CONNECTIONS = [
  { name: "Claude Desktop", vendor: "Anthropic", status: "connected", latency: 42, ordersToday: 18, lastCall: "방금 전" },
  { name: "ChatGPT", vendor: "OpenAI", status: "connected", latency: 68, ordersToday: 11, lastCall: "1분 전" },
  { name: "Perplexity", vendor: "Perplexity AI", status: "connected", latency: 54, ordersToday: 6, lastCall: "4분 전" },
  { name: "Cursor", vendor: "Anysphere", status: "idle", latency: 0, ordersToday: 0, lastCall: "2시간 전" },
  { name: "Goose", vendor: "Block", status: "error", latency: 0, ordersToday: 0, lastCall: "설정 필요" },
];

const AGENT_TOOLS = [
  { name: "menu.list", desc: "전체 메뉴와 품절 상태 조회", calls: 342, enabled: true },
  { name: "menu.recommend", desc: "고객 프로필 기반 추천 (과거 주문·알러지 반영)", calls: 218, enabled: true },
  { name: "order.create", desc: "신규 주문 생성 및 전달", calls: 148, enabled: true },
  { name: "order.status", desc: "진행 중인 주문 상태 조회", calls: 96, enabled: true },
  { name: "store.hours", desc: "매장 영업시간·브레이크 타임 안내", calls: 54, enabled: true },
  { name: "reservation.book", desc: "테이블 예약 (홀 전용)", calls: 22, enabled: false },
];

const COURIERS = [
  { name: "최성호", rating: 4.9, orderId: "SD-2405", status: "delivering", etaMin: 6, distance: "0.8km", progress: 0.78 },
  { name: "장미래", rating: 4.8, orderId: "SD-2403", status: "picking_up", etaMin: 2, distance: "0.1km", progress: 0.12 },
  { name: "임도현", rating: 4.7, orderId: null, status: "idle", etaMin: 0, distance: "—", progress: 0 },
];

Object.assign(window, {
  MOCK_ORDERS, MENU_CATEGORIES, MENU_ITEMS, REVIEWS,
  AGENT_TRAFFIC, HOURLY_SALES, MCP_CONNECTIONS, AGENT_TOOLS, COURIERS,
});
