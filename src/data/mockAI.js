const PLACES_DB = {
  '东京': [
    { name:'浅草寺', cat:'景点', lat:35.7148, lng:139.7967, time:'09:00', duration:'1.5h', fee:'免费' },
    { name:'晴空塔', cat:'景点', lat:35.7101, lng:139.8107, time:'11:00', duration:'1.5h', fee:'¥2,100' },
    { name:'秋叶原', cat:'购物', lat:35.7023, lng:139.7745, time:'13:00', duration:'3h', fee:'-' },
    { name:'Blue Bottle Coffee', cat:'咖啡', lat:35.7100, lng:139.8100, time:'09:00', duration:'0.5h', fee:'¥550' },
    { name:'银座', cat:'购物', lat:35.6722, lng:139.7718, time:'15:30', duration:'2h', fee:'-' },
    { name:'筑地市场', cat:'美食', lat:35.6654, lng:139.7707, time:'08:00', duration:'1h', fee:'¥2,000' },
    { name:'涩谷', cat:'购物', lat:35.6580, lng:139.7016, time:'14:00', duration:'2h', fee:'-' },
    { name:'新宿御苑', cat:'景点', lat:35.6852, lng:139.7100, time:'10:00', duration:'1.5h', fee:'¥500' },
    { name:'明治神宫', cat:'景点', lat:35.6764, lng:139.6993, time:'09:00', duration:'1h', fee:'免费' },
    { name:'一兰拉面', cat:'美食', lat:35.7100, lng:139.8000, time:'12:00', duration:'0.5h', fee:'¥980' },
  ],
  '成都': [
    { name:'宽窄巷子', cat:'景点', lat:30.6697, lng:104.0596, time:'10:00', duration:'1.5h', fee:'免费' },
    { name:'大熊猫基地', cat:'景点', lat:30.7290, lng:104.1435, time:'08:30', duration:'3h', fee:'¥55' },
    { name:'锦里', cat:'美食', lat:30.6478, lng:104.0539, time:'12:00', duration:'1h', fee:'-' },
    { name:'春熙路', cat:'购物', lat:30.6562, lng:104.0815, time:'14:00', duration:'2h', fee:'-' },
    { name:'鹤鸣茶社', cat:'咖啡', lat:30.6594, lng:104.0589, time:'15:00', duration:'1h', fee:'¥30' },
    { name:'武侯祠', cat:'景点', lat:30.6480, lng:104.0493, time:'09:00', duration:'1h', fee:'¥50' },
  ],
  '重庆': [
    { name:'洪崖洞', cat:'景点', lat:29.5630, lng:106.5755, time:'19:00', duration:'1h', fee:'免费' },
    { name:'解放碑', cat:'景点', lat:29.5603, lng:106.5769, time:'10:00', duration:'0.5h', fee:'免费' },
    { name:'磁器口', cat:'景点', lat:29.5804, lng:106.4490, time:'14:00', duration:'2h', fee:'免费' },
    { name:'南山一棵树', cat:'景点', lat:29.5475, lng:106.6063, time:'18:00', duration:'1h', fee:'¥30' },
    { name:'重庆火锅', cat:'美食', lat:29.5600, lng:106.5700, time:'12:00', duration:'1h', fee:'¥80' },
  ],
  '上海': [
    { name:'外滩', cat:'景点', lat:31.2400, lng:121.4906, time:'18:00', duration:'1h', fee:'免费' },
    { name:'南京路', cat:'购物', lat:31.2363, lng:121.4802, time:'14:00', duration:'2h', fee:'-' },
    { name:'豫园', cat:'景点', lat:31.2297, lng:121.4934, time:'09:00', duration:'1.5h', fee:'¥40' },
    { name:'田子坊', cat:'购物', lat:31.2116, lng:121.4715, time:'11:00', duration:'1.5h', fee:'免费' },
    { name:'新天地', cat:'美食', lat:31.2195, lng:121.4758, time:'12:30', duration:'1h', fee:'¥150' },
  ],
};

const WEATHER = ['☀️ 晴 25°C', '⛅ 多云 22°C', '🌧 小雨 18°C', '☁️ 阴 20°C', '☀️ 晴 28°C'];
const TIPS = [
  '今天预计步行 16km，下午三点可能下雨，建议带折叠伞 ☂️',
  '浅草寺早上去人少，建议 8:30 前到达拍照最佳 📸',
  '今日有大量户外活动，记得涂防晒，多喝水 💧',
  '附近有 hidden gem 咖啡馆，评分 4.8，值得一试 ☕',
  '今晚有花火大会，19:00 开始，最佳观赏点：隅田川 🎆',
];
const SUMMARIES = [
  '今天第一次来到浅草，雷门的夕阳真的很美。虽然走了两万步，但每到一个新的地方都充满惊喜。午餐的拉面是当地人推荐的隐藏小店，绝对是今天的亮点。',
  '今天是充满活力的一天！从早上的神社到晚上的夜市，每一个瞬间都值得被记住。步行数突破了记录，但完全不觉得累。',
];

export function generateTripPlan(destination, days, preferences) {
  const places = PLACES_DB[destination] || PLACES_DB['东京'];
  const tripDays = [];
  let idx = 0;
  for (let d = 0; d < days; d++) {
    const dayPlaces = [];
    const count = Math.min(2 + Math.floor(Math.random() * 3), places.length - idx);
    for (let p = 0; p < count && idx < places.length; p++) {
      dayPlaces.push({ ...places[idx], id: crypto.randomUUID() });
      idx++;
    }
    tripDays.push({
      id: crypto.randomUUID(),
      date: d,
      places: dayPlaces,
      weather: WEATHER[d % WEATHER.length],
      tip: TIPS[d % TIPS.length],
      budget: 200 + Math.floor(Math.random() * 300),
    });
  }
  return tripDays;
}

export function generateDailyTip() {
  return TIPS[Math.floor(Math.random() * TIPS.length)];
}

export function generateDailySummary() {
  return SUMMARIES[Math.floor(Math.random() * SUMMARIES.length)];
}

export function generateJournal(trip) {
  return {
    cover: `${trip.destination}之旅`,
    totalSteps: `${12 + Math.floor(Math.random() * 20)}km`,
    totalExpense: trip.expenses?.reduce((s, e) => s + e.amount, 0) || 0,
    mostDistant: trip.days?.[0]?.places?.[0]?.name || '-',
    highlights: trip.days?.map(d => d.places?.[0]?.name).filter(Boolean).slice(0, 5) || [],
    summary: `这段${trip.destination}之旅，我们走过了${trip.days?.length || 0}天，留下了美好的回忆。`,
  };
}
